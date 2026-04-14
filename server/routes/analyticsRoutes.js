const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// In a real app we would protect these routes with a JWT middleware: 
// const { protect } = require('../middleware/authMiddleware');
// router.route('/genres').get(protect, analyticsController.getGenreStats);

router.get('/overview', analyticsController.getOverviewStats);
router.get('/genres', analyticsController.getGenreStats);
router.get('/regions', analyticsController.getRegionalStats);
router.get('/growth', analyticsController.getGrowthStats);
router.get('/ratings', analyticsController.getRatingStats);
router.get('/talent', analyticsController.getTalentStats);
router.get('/release-patterns', analyticsController.getReleaseStats);
router.get('/languages', analyticsController.getLanguageStats);

module.exports = router;
