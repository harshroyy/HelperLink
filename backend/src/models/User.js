const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['receiver', 'helper', 'admin'], default: 'receiver' },
  
  // --- Common Profile Info ---
  city: { type: String, required: true },
  bio: { type: String, maxlength: 500, default: '' },
  profileImage: { type: String, default: '' }, 
  
  // NEW: Added for the Profile UI Header
  headline: { type: String, maxlength: 60, default: '' }, 
  socials: {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' }
  },

  // --- Role Specific Data ---
  helperProfile: {
    skills: [{ type: String }],    
    resources: [{ type: String }], 
    isAvailable: { type: Boolean, default: true }
  },

  receiverProfile: {
    needs: [{ type: String }] 
  },

  isVerified: { type: Boolean, default: false },
}, { 
  timestamps: true 
});

// Match Password Method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);