const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userPreferencesSchema = new mongoose.Schema(
  {
    theme: { type: String, enum: ['system', 'light', 'dark'], default: 'system' },
    defaultChartType: { type: String, enum: ['bar', 'line', 'pie', 'treemap'], default: 'bar' },
    defaultAnalyticsModule: { type: String, default: 'genres' },
    dashboardLayout: { type: String, enum: ['compact', 'expanded'], default: 'expanded' },
    itemsPerPage: { type: Number, default: 20 },
    notifyExportReady: { type: Boolean, default: true },
    notifySystemUpdates: { type: Boolean, default: true },
    notifyNewData: { type: Boolean, default: true }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true, select: false },
    fullName: { type: String, required: true },
    avatarUrl: { type: String, default: null },
    bio: { type: String, default: null, maxlength: 200 },
    role: { type: String, enum: ['analyst', 'researcher', 'pm', 'developer', 'admin'], default: 'analyst' },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    plan: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
    onboardingDone: { type: Boolean, default: false },
    lastLoginAt: { type: Date },
    preferences: { type: userPreferencesSchema, default: () => ({}) }
  },
  { timestamps: true }
);

// Method to verify password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

// Index for unique email is handled by unique:true above

const User = mongoose.model('User', userSchema);
module.exports = User;
