const Title = require('../models/Title');

// @desc    Get dashboard overview KPI stats
// @route   GET /api/analytics/overview
const getOverviewStats = async (req, res) => {
  try {
    const movies = await Title.countDocuments({ type: 'Movie' });
    const shows = await Title.countDocuments({ type: 'TV Show' });
    
    // Distinct countries
    const countries = await Title.distinct('countries');
    const totalCountries = countries.filter(c => c).length;
    
    // Distinct genres
    const genres = await Title.distinct('genres');
    const totalGenres = genres.filter(g => g).length;

    res.json({
      movies,
      shows,
      countries: totalCountries,
      genres: totalGenres
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get genre distribution stats
// @route   GET /api/analytics/genres
const getGenreStats = async (req, res) => {
  try {
    const genreStats = await Title.aggregate([
      // Unwind the genres array so each genre gets its own document
      { $unwind: '$genres' },
      // Group by genre and count occurrences
      { 
        $group: { 
          _id: '$genres', 
          title_count: { $sum: 1 } 
        } 
      },
      // Rename _id to genre_name and sort descending
      { 
        $project: { 
          _id: 0, 
          genre_name: '$_id', 
          title_count: 1 
        } 
      },
      { $sort: { title_count: -1 } },
      // Limit to top 20 to avoid massive lists
      { $limit: 20 }
    ]);

    // Calculate percentages
    const totalTitles = await Title.countDocuments();
    const statsWithPercentage = genreStats.map(stat => ({
      ...stat,
      percentage: ((stat.title_count / totalTitles) * 100).toFixed(2)
    }));

    res.json(statsWithPercentage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get regional distribution stats
// @route   GET /api/analytics/regions
const getRegionalStats = async (req, res) => {
  try {
    const regionalStats = await Title.aggregate([
      { $unwind: '$countries' },
      { $match: { countries: { $ne: '' } } }, // Filter out empty countries
      { 
        $group: { 
          _id: '$countries', 
          title_count: { $sum: 1 } 
        } 
      },
      { 
        $project: { 
          _id: 0, 
          country_name: '$_id', 
          title_count: 1 
        } 
      },
      { $sort: { title_count: -1 } }
    ]);

    res.json(regionalStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get content growth over time
// @route   GET /api/analytics/growth
const getGrowthStats = async (req, res) => {
  try {
    const growthStats = await Title.aggregate([
      { $match: { date_added: { $ne: null } } },
      { 
        $group: {
          _id: {
            year: { $year: '$date_added' },
            month: { $month: '$date_added' },
            type: '$type'
          },
          titles_added: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          content_type: '$_id.type',
          titles_added: 1
        }
      },
      { $sort: { year: 1, month: 1 } }
    ]);

    res.json(growthStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get rating distribution stats
// @route   GET /api/analytics/ratings
const getRatingStats = async (req, res) => {
  try {
    const stats = await Title.aggregate([
      { $match: { rating: { $ne: null, $ne: '' } } },
      { 
        $group: {
          _id: { rating: '$rating', type: '$type' },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.rating',
          counts: { $push: { k: '$_id.type', v: '$count' } }
        }
      },
      {
        $project: {
          _id: 0,
          rating: '$_id',
          data: { $arrayToObject: '$counts' }
        }
      }
    ]);
    
    // Format to matches the frontend expectations: [{rating: 'TV-MA', movies: 2062, shows: 1145}]
    const formatted = stats.map(s => ({
      rating: s.rating,
      movies: s.data['Movie'] || 0,
      shows: s.data['TV Show'] || 0
    })).sort((a, b) => (b.movies + b.shows) - (a.movies + a.shows));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get talent insights (directors and cast)
// @route   GET /api/analytics/talent
const getTalentStats = async (req, res) => {
  try {
    const getTopPeople = async (field) => {
      // Step 1: Extremely lightweight group and sort to find Top 10 without exceeding memory
      const topPeople = await Title.aggregate([
        { $unwind: `$${field}` },
        { $match: { [field]: { $ne: '' }, type: 'Movie' } }, // Optional: constrain to movies for relevance if needed, but we keep generic
        {
          $group: {
            _id: `$${field}`,
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);

      // Step 2: Use lightweight JS mapping to fetch those top 10's genres individually
      // Avoids massive `$push` arrays in MongoDB memory limits on free tiers
      const formattedPeople = await Promise.all(topPeople.map(async (person) => {
        // Fetch only titles containing this specific person
        const titles = await Title.find({ [field]: person._id }, { genres: 1 });
        
        // Count genre frequency
        const genreFreq = {};
        titles.forEach(t => {
          if (t.genres && Array.isArray(t.genres)) {
            t.genres.forEach(g => {
              if (g) genreFreq[g] = (genreFreq[g] || 0) + 1;
            });
          }
        });

        // Sort genres by frequency and take top 2
        const topGenres = Object.entries(genreFreq)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 2)
          .map(([genre]) => genre);

        return {
          name: person._id,
          count: person.count,
          topGenres
        };
      }));

      return formattedPeople;
    };

    const cast = await getTopPeople('cast');
    const directors = await getTopPeople('directors');

    res.json({ cast, directors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get release patterns (by month)
// @route   GET /api/analytics/release-patterns
const getReleaseStats = async (req, res) => {
  try {
    const stats = await Title.aggregate([
      { $match: { date_added: { $ne: null } } },
      {
        $group: {
          _id: { $month: '$date_added' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Fill missing months
    const formatted = months.map((month, index) => {
      const match = stats.find(s => s._id === index + 1);
      return {
        month,
        count: match ? match.count : 0
      };
    });

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get language stats (mock fallback)
// @route   GET /api/analytics/languages
const getLanguageStats = async (req, res) => {
  try {
    // Current database dataset doesn't have languages. Using fallback.
    const languageData = [
      { name: 'English', value: 5023 },
      { name: 'Hindi', value: 852 },
      { name: 'Spanish', value: 684 },
      { name: 'French', value: 393 },
      { name: 'Japanese', value: 318 },
      { name: 'Korean', value: 231 },
      { name: 'Other', value: 1300 }
    ];
    // compute total
    const total = languageData.reduce((acc, curr) => acc + curr.value, 0);
    res.json({ languageData, total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getGenreStats,
  getRegionalStats,
  getGrowthStats,
  getOverviewStats,
  getRatingStats,
  getTalentStats,
  getReleaseStats,
  getLanguageStats
};
