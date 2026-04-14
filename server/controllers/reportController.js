const Report = require('../models/Report');
const Title = require('../models/Title');
const PDFDocument = require('pdfkit');

// Get all reports for user
const getReports = async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new report
const createReport = async (req, res) => {
  try {
    const { name, sourceModule, format } = req.body;
    
    // Create an instantaneously "ready" report since we have no background worker
    const report = await Report.create({
      user: req.user._id,
      name: name || 'Generated Report',
      sourceModule: sourceModule || 'Custom',
      format: format || 'pdf',
      status: 'ready',
      fileSizeBytes: Math.floor(Math.random() * 5000000) + 500000, // random size between 500KB and 5.5MB
      completedAt: new Date()
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete report
const deleteReport = async (req, res) => {
  try {
    const report = await Report.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    res.json({ message: 'Report removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Download report file
const downloadReportFile = async (req, res) => {
  try {
    const report = await Report.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const { name, sourceModule, format } = report;
    const safeName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();

    // Fetch real data
    let reportData = [];
    if (sourceModule === 'Top 100 Action Movies') {
      reportData = await Title.find({ genres: 'Action', type: 'Movie' })
        .sort({ release_year: -1 })
        .limit(100)
        .lean();
    } else if (sourceModule === 'Genre Distribution') {
      reportData = await Title.aggregate([
        { $unwind: '$genres' },
        { $group: { _id: '$genres', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);
    } else if (sourceModule === 'Global Growth') {
      reportData = await Title.aggregate([
        { $group: { _id: '$release_year', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]);
    } else {
      // Custom Query fallback
      reportData = await Title.find().limit(50).lean();
    }

    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${safeName}.csv"`);
      
      if (reportData.length === 0) {
        return res.send('No data found\n');
      }
      
      let csvStr = '';
      if (sourceModule === 'Top 100 Action Movies' || sourceModule === 'Custom Query') {
        csvStr = 'Title,Type,Release Year,Rating\n';
        reportData.forEach(row => {
          const t = String(row.title || '').replace(/,/g, '');
          csvStr += `${t},${row.type || ''},${row.release_year || ''},${row.rating || ''}\n`;
        });
      } else {
        // Aggregations have _id and count
        csvStr = 'Category,Count\n';
        reportData.forEach(row => {
          csvStr += `${row._id || 'Unknown'},${row.count}\n`;
        });
      }
      return res.send(csvStr);
      
    } else if (format === 'pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${safeName}.pdf"`);
      
      const doc = new PDFDocument({ margin: 50 });
      doc.pipe(res);
      
      doc.fontSize(20).text('STREAMIQ DIRECTORIAL SUITE', { align: 'center' });
      doc.moveDown();
      doc.fontSize(14).text(`Report: ${name}`, { align: 'center' });
      doc.fontSize(10).text(`Module: ${sourceModule}`, { align: 'center' });
      doc.fontSize(10).text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
      doc.moveDown(2);
      
      if (reportData.length === 0) {
        doc.fontSize(12).text('No data available for this report.');
      } else {
        if (sourceModule === 'Top 100 Action Movies' || sourceModule === 'Custom Query') {
          reportData.slice(0, 40).forEach((row, i) => { // limit to 40 for PDF demo to prevent too many pages
            const text = `${i + 1}. ${row.title} (${row.release_year}) - ${row.type}`;
            doc.fontSize(10).text(text);
            doc.moveDown(0.2);
          });
          if (reportData.length > 40) doc.text('... (limited rows for PDF preview)');
        } else {
           reportData.forEach((row) => {
            const text = `${row._id || 'Unknown'}: ${row.count} items`;
            doc.fontSize(12).text(text);
            doc.moveDown(0.5);
          });
        }
      }
      
      doc.end();
    } else {
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', `attachment; filename="${safeName}.txt"`);
      return res.send(`Report metadata:\nName: ${name}`);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getReports, createReport, deleteReport, downloadReportFile };
