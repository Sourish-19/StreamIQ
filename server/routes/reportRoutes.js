const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, reportController.getReports)
  .post(protect, reportController.createReport);

router.route('/:id')
  .delete(protect, reportController.deleteReport);

router.route('/:id/download')
  .get(protect, reportController.downloadReportFile);

module.exports = router;
