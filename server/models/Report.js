const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    sourceModule: { type: String, required: true }, // 'genres', 'regions', 'growth', 'custom'
    format: { type: String, enum: ['pdf', 'csv', 'png'], required: true },
    fileUrl: { type: String }, // Path or signed URL
    fileSizeBytes: { type: Number },
    parametersJson: { type: mongoose.Schema.Types.Mixed }, // Flexible JSON filter state
    status: { type: String, enum: ['generating', 'ready', 'failed'], default: 'generating' },
    isScheduled: { type: Boolean, default: false },
    completedAt: { type: Date }
  },
  { timestamps: true }
);

reportSchema.index({ user: 1, status: 1 });

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;
