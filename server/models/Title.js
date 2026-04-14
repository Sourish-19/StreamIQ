const mongoose = require('mongoose');

const titleSchema = new mongoose.Schema(
  {
    show_id: { type: String, required: true, unique: true },
    type: { type: String, enum: ['Movie', 'TV Show'], required: true },
    title: { type: String, required: true },
    description: String,
    release_year: Number,
    date_added: Date,
    rating: String,
    duration: String,
    genres: [{ type: String }],
    countries: [{ type: String }],
    cast: [{ type: String }],
    directors: [{ type: String }]
  },
  { timestamps: true }
);

// Indexes for faster querying
titleSchema.index({ type: 1, genres: 1, release_year: -1 });
titleSchema.index({ countries: 1 });
titleSchema.index({ title: 'text', description: 'text' }); // Full-text search

const Title = mongoose.model('Title', titleSchema);
module.exports = Title;
