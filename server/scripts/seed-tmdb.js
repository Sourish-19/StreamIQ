require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Title = require('../models/Title');

const TMDB_API_KEY = '18df1e11f8f1a90cddb3c9b5be53add7';
const YEARS = [2022, 2023, 2024, 2025, 2026];
const PAGES_PER_YEAR = 5;

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function fetchGenres() {
  const [movieRes, tvRes] = await Promise.all([
    fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}`),
    fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${TMDB_API_KEY}`)
  ]);
  
  const movieGenres = await movieRes.json();
  const tvGenres = await tvRes.json();
  
  const map = {};
  if (movieGenres.genres) {
    movieGenres.genres.forEach(g => map[g.id] = g.name);
  }
  if (tvGenres.genres) {
    tvGenres.genres.forEach(g => map[g.id] = g.name);
  }
  return map;
}

async function fetchTitles(type, year, page) {
  const url = type === 'Movie' 
    ? `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&primary_release_year=${year}&sort_by=popularity.desc&page=${page}`
    : `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&first_air_date_year=${year}&sort_by=popularity.desc&page=${page}`;
    
  const res = await fetch(url);
  const data = await res.json();
  return data.results || [];
}

async function runSeed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB.');

  const genreMap = await fetchGenres();
  console.log('Fetched genres from TMDB.');

  let allTitles = [];

  for (const year of YEARS) {
    console.log(`Fetching top Movies and TV Shows for ${year}...`);
    for (const type of ['Movie', 'TV Show']) {
      for (let page = 1; page <= PAGES_PER_YEAR; page++) {
        const results = await fetchTitles(type, year, page);
        if (!results || results.length === 0) continue;
        
        for (const item of results) {
          const showId = `tmdb-${type === 'Movie' ? 'movie' : 'tv'}-${item.id}`;
          const titleName = item.title || item.name;
          const genres = (item.genre_ids || []).map(id => genreMap[id]).filter(Boolean);
          
          allTitles.push({
            show_id: showId,
            type: type,
            title: titleName,
            description: item.overview,
            release_year: year,
            date_added: new Date(),
            rating: item.vote_average ? item.vote_average.toString() : '',
            duration: '',
            genres: genres,
            countries: item.origin_country || [],
            cast: [],
            directors: []
          });
        }
        await sleep(50);
      }
    }
  }

  console.log(`Fetched ${allTitles.length.toLocaleString()} items from TMDB. Formatting for database insertion...`);

  const ops = allTitles.map(record => ({
    updateOne: {
      filter: { show_id: record.show_id },
      update: { $set: record },
      upsert: true
    }
  }));

  const chunkSize = 500;
  for (let i = 0; i < ops.length; i += chunkSize) {
    const chunk = ops.slice(i, i + chunkSize);
    await Title.bulkWrite(chunk);
  }

  console.log(`Successfully seeded ${allTitles.length.toLocaleString()} TMDB titles!`);
  await mongoose.disconnect();
}

runSeed().catch(err => {
  console.error("Error seeding TMDB:", err);
  mongoose.disconnect();
});
