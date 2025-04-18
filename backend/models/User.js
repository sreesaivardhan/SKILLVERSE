const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // Basic info
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  role: {
    type: String,
    enum: ['learner', 'instructor', 'moderator', 'admin'],
    default: 'learner'
  },
  
  // Skills
  skills: [{
    name: {
      type: String,
      required: true
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'beginner'
    },
    verified: {
      type: Boolean,
      default: false
    }
  }],
  
  // Credits
  credits: {
    type: Number,
    default: 5
  },
  
  // Availability (for instructors)
  availability: {
    monday: [Number],    // Hours (0-23)
    tuesday: [Number],
    wednesday: [Number],
    thursday: [Number],
    friday: [Number],
    saturday: [Number],
    sunday: [Number]
  },
  
  // Rating
  rating: {
    type: Number,
    default: 0
  },
  ratingCount: {
    type: Number,
    default: 0
  },
  
  // Calendar integration
  calendar: {
    accessToken: String,
    refreshToken: String,
    tokenExpiry: Date
  },
  
  // Notification preferences
  notifications: {
    email: {
      type: Boolean,
      default: true
    },
    sms: {
      type: Boolean,
      default: false
    }
  },
  
  // Account creation date
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
