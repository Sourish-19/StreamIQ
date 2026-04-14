const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const Title = require('../models/Title');

// Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for Seeding');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

const parseArrayField = (field) => {
  if (!field) return [];
  return field.split(',').map((item) => item.trim());
};

const seedDatabase = async () => {
  const csvFilePath = path.join(__dirname, '../../Netflix_Movies_and_TV_Shows/netflix_titles.csv');
  
  if (!fs.existsSync(csvFilePath)) {
    console.warn(`WARNING: CSV file not found at ${csvFilePath}. Creating a small sample dataset...`);
    // Sample fallback dataset
    const sampleData = [
      {
        show_id: 's1',
        type: 'Movie',
        title: 'Dick Johnson Is Dead',
        director: 'Kirsten Johnson',
        cast: '',
        country: 'United States',
        date_added: 'September 25, 2021',
        release_year: 2020,
        rating: 'PG-13',
        duration: '90 min',
        listed_in: 'Documentaries',
        description: 'As her father nears the end of his life, filmmaker Kirsten Johnson stages his death in inventive and comical ways to help them both face the inevitable.'
      },
      {
        show_id: 's2',
        type: 'TV Show',
        title: 'Blood & Water',
        director: '',
        cast: 'Ama Qamata, Khosi Ngema, Gail Mabalane, Thabang Molaba',
        country: 'South Africa',
        date_added: 'September 24, 2021',
        release_year: 2021,
        rating: 'TV-MA',
        duration: '2 Seasons',
        listed_in: 'International TV Shows, TV Dramas, TV Mysteries',
        description: 'After crossing paths at a party, a Cape Town teen sets out to prove whether a private-school swimming star is her sister who was abducted at birth.'
      }
    ];
    
    await importData(sampleData);
    return;
  }

  const results = [];
  console.log('Reading CSV file. This might take a moment...');
  
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      console.log(`Parsed ${results.length} rows from CSV...`);
      await importData(results);
    });
};

const importData = async (dataArray) => {
  try {
    // Clear existing data
    await Title.deleteMany({});
    console.log('Cleared existing titles from database');

    const formattedTitles = dataArray.map(item => ({
      show_id: item.show_id,
      type: item.type,
      title: item.title,
      description: item.description,
      release_year: parseInt(item.release_year),
      date_added: item.date_added ? new Date(item.date_added) : null,
      rating: item.rating,
      duration: item.duration,
      genres: parseArrayField(item.listed_in), // kaggle uses listed_in
      countries: parseArrayField(item.country),
      cast: parseArrayField(item.cast),
      directors: parseArrayField(item.director)
    }));

    await Title.insertMany(formattedTitles);
    console.log(`Successfully seeded ${formattedTitles.length} titles!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

const run = async () => {
  await connectDB();
  await seedDatabase();
};

run();
