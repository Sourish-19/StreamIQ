const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Simple memory cache
const posterCache: Record<string, string | null> = {};

export const fetchTMDBPoster = async (title: string, type: string, year?: number): Promise<string | null> => {
  const cacheKey = `${title}_${type}_${year || ''}`;
  
  if (posterCache[cacheKey] !== undefined) {
    return posterCache[cacheKey]; // returns cached url or explicit null
  }

  // Determine endpoint
  const searchType = type === 'TV Show' ? 'tv' : 'movie';
  let url = `${TMDB_BASE_URL}/search/${searchType}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`;
  
  if (year) {
    url += type === 'TV Show' ? `&first_air_date_year=${year}` : `&primary_release_year=${year}`;
  }

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('TMDB API error');
    
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      // Pick the most relevant result's poster
      const posterPath = data.results[0].poster_path;
      if (posterPath) {
        const fullUrl = `https://image.tmdb.org/t/p/w500${posterPath}`;
        posterCache[cacheKey] = fullUrl;
        return fullUrl;
      }
    }
    
    // Cache the failure so we don't spam TMDB for titles that have no poster
    posterCache[cacheKey] = null;
    return null;
  } catch (error) {
    console.error('Failed to fetch from TMDB:', error);
    return null;
  }
};

export const fetchTMDBTrailer = async (title: string, type: string, year?: number, titleId?: string): Promise<string | null> => {
  try {
    let tmdbId = titleId && titleId.startsWith('tmdb_') ? titleId.replace('tmdb_', '') : null;
    const searchType = type === 'TV Show' ? 'tv' : 'movie';
    
    // If not given a TMDB ID, search for it first
    if (!tmdbId) {
      let searchUrl = `${TMDB_BASE_URL}/search/${searchType}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`;
      if (year) {
        searchUrl += type === 'TV Show' ? `&first_air_date_year=${year}` : `&primary_release_year=${year}`;
      }
      const searchRes = await fetch(searchUrl);
      const searchData = await searchRes.json();
      if (searchData.results && searchData.results.length > 0) {
        tmdbId = searchData.results[0].id.toString();
      }
    }

    if (!tmdbId) return null;

    // Fetch Videos mapping
    const videoUrl = `${TMDB_BASE_URL}/${searchType}/${tmdbId}/videos?api_key=${TMDB_API_KEY}`;
    const res = await fetch(videoUrl);
    const data = await res.json();
    
    if (data.results && data.results.length > 0) {
      // Find official Trailer
      const trailer = data.results.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
      if (trailer) {
        return `https://www.youtube.com/watch?v=${trailer.key}`;
      }
      // Fallback to any youtube video (Teaser, Featurette)
      const anyYt = data.results.find((v: any) => v.site === 'YouTube');
      if (anyYt) {
        return `https://www.youtube.com/watch?v=${anyYt.key}`;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Failed to fetch trailer:', error);
    return null;
  }
};

export const discoverFromTMDB = async (
  showMovies: boolean,
  showTV: boolean,
  minYear: string,
  maxYear: string,
  genre: string,
  sort: string,
  searchQuery?: string
) => {
  let sortBy = 'popularity.desc';
  if (sort === 'Title (A-Z)') sortBy = 'original_title.asc';
  else if (sort === 'Year (Newest)') sortBy = 'primary_release_date.desc';
  
  const fetchType = async (type: 'movie' | 'tv') => {
    let url = '';
    if (searchQuery && searchQuery.trim().length > 0) {
      // Use Search Endpoint
      url = `${TMDB_BASE_URL}/search/${type}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(searchQuery)}`;
    } else {
      // Use Discover Endpoint
      url = `${TMDB_BASE_URL}/discover/${type}?api_key=${TMDB_API_KEY}&sort_by=${type === 'tv' && sortBy === 'primary_release_date.desc' ? 'first_air_date.desc' : sortBy}`;
      
      if (minYear) {
        url += type === 'movie' ? `&primary_release_date.gte=${minYear}-01-01` : `&first_air_date.gte=${minYear}-01-01`;
      }
      if (maxYear) {
        url += type === 'movie' ? `&primary_release_date.lte=${maxYear}-12-31` : `&first_air_date.lte=${maxYear}-12-31`;
      }
    }
    
    // Genre mapping
    if (genre !== 'All Genres') {
      let genreId = '';
      if (genre === 'Action & Adventure') genreId = type === 'movie' ? '28,12' : '10759';
      else if (genre === 'Comedies') genreId = '35';
      else if (genre === 'Dramas') genreId = '18';
      else if (genre === 'Sci-Fi & Fantasy') genreId = type === 'movie' ? '878,14' : '10765';
      else if (genre === 'Thrillers') genreId = type === 'movie' ? '53' : '9648'; 
      
      if (genreId) url += `&with_genres=${genreId}`;
    }

    try {
      const res = await fetch(url);
      if (!res.ok) return [];
      const data = await res.json();
      return (data.results || []).map((item: any) => ({
        _id: `tmdb_${item.id}`,
        title: item.title || item.name,
        type: type === 'movie' ? 'Movie' : 'TV Show',
        release_year: parseInt((item.release_date || item.first_air_date || '0').split('-')[0]) || parseInt(minYear) || 2022,
        genres: [genre !== 'All Genres' ? genre : 'Various'],
        rating: item.vote_average ? `${item.vote_average.toFixed(1)}/10` : 'N/A',
        duration: 'N/A',
        poster_path: item.poster_path
      }));
    } catch {
      return [];
    }
  };

  let results: any[] = [];
  if (showMovies) {
    const movies = await fetchType('movie');
    results = [...results, ...movies];
  }
  if (showTV) {
    const tvs = await fetchType('tv');
    results = [...results, ...tvs];
  }

  // Pre-cache posters so UI doesn't need to re-fetch
  results.forEach(item => {
    if (item.poster_path) {
      posterCache[`${item.title}_${item.type}_${item.release_year}`] = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
    }
  });

  if (showMovies && showTV) {
    if (sort === 'Title (A-Z)') {
      results.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === 'Year (Newest)') {
      results.sort((a, b) => b.release_year - a.release_year);
    }
  }

  results = results.slice(0, 24);

  return {
    titles: results,
    total: results.length > 0 ? 1000 : 0 
  };
};
