const Title = require('../models/Title');

// @desc    Get all titles with filtering and pagination
// @route   GET /api/content
const getTitles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Filters
    const query = {};

    if (req.query.type) {
      // E.g., 'Movie' or 'TV Show' or 'Movie,TV Show'
      const types = req.query.type.split(',');
      query.type = { $in: types };
    }

    if (req.query.genre && req.query.genre !== 'All Genres') {
      let searchGenre = req.query.genre;
      
      // Standardize generic frontend types to match Netflix's specific sub-genres using regex
      if (searchGenre === 'Sci-Fi & Fantasy') {
        searchGenre = 'Sci-Fi|Fantasy';
      } else if (searchGenre === 'Action & Adventure') {
        searchGenre = 'Action|Adventure';
      } else if (searchGenre === 'Comedies') {
        searchGenre = 'Comed|Comedy';
      } else if (searchGenre === 'Dramas') {
        searchGenre = 'Drama';
      } else if (searchGenre === 'Thrillers') {
        searchGenre = 'Thriller';
      }

      query.genres = { $regex: searchGenre, $options: 'i' };
    }

    if (req.query.minYear) {
      query.release_year = { ...query.release_year, $gte: parseInt(req.query.minYear) };
    }
    
    if (req.query.maxYear) {
      query.release_year = { ...query.release_year, $lte: parseInt(req.query.maxYear) };
    }

    if (req.query.search) {
      query.title = { $regex: req.query.search, $options: 'i' };
    }

    // Sorting
    let sortQuery = { release_year: -1 }; // default: Year (Newest)
    if (req.query.sort === 'Title (A-Z)') {
      sortQuery = { title: 1 };
    } else if (req.query.sort === 'Relevance' && req.query.search) {
      sortQuery = { release_year: -1 }; // Fallback since textScore isn't used
    }

    const titles = await Title.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit);

    const total = await Title.countDocuments(query);

    res.json({
      titles,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTitles
};
