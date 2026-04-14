const mongoose = require('mongoose');
const Title = require('./models/Title');
require('dotenv').config();

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const total = await Title.countDocuments();
  const movies = await Title.countDocuments({ type: 'Movie' });
  const shows = await Title.countDocuments({ type: 'TV Show' });
  console.log(`Total: ${total}, Movies: ${movies}, Shows: ${shows}`);
  
  const sample = await Title.findOne();
  console.log('Sample:', sample);
  process.exit();
}

check();
