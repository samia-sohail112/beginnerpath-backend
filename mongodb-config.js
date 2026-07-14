const mongoose = require('mongoose');
require('dotenv').config();

// ════════════════════════════════════════════════════════════════════════════
// MONGODB CONNECTION
// ════════════════════════════════════════════════════════════════════════════

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/beginnerpath';

const connectMongoDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    return false;
  }
};

// ════════════════════════════════════════════════════════════════════════════
// USER SCHEMA
// ════════════════════════════════════════════════════════════════════════════

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  stream: {
    type: String,
    enum: ['medical', 'engineering', 'ics', 'commerce', 'arts', 'general'],
    default: 'general'
  },
  educationLevel: {
    type: String,
    enum: ['matric', 'inter', 'bachelor', 'other', 'General Science'],
    default: 'General Science'
  },
  interests: {
    type: [String],
    default: []
  },
  careerGoal: {
    type: String,
    enum: ['job', 'freelance', 'abroad', 'startup'],
    default: 'job'
  },
  timeline: {
    type: String,
    enum: ['3months', '6months', '1year', 'flexible'],
    default: '6months'
  },
  learningStyle: {
    type: String,
    default: ''
  },
  experienceLevel: {
    type: String,
    default: ''
  },
  hoursPerWeek: {
    type: Number,
    default: 5
  },
  onboardingComplete: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  completedCourses: {
    type: Number,
    default: 0
  },
  totalCourses: {
    type: Number,
    default: 10
  },
  progressPercentage: {
    type: Number,
    default: 0
  },
  achievements: {
    type: [String],
    default: []
  },
  recentActivity: {
    type: [{
      action: String,
      courseId: String,
      timestamp: Date
    }],
    default: []
  },
  courseProgress: {
    type: Map,
    of: {
      completed: { type: Boolean, default: false },
      completionDate: { type: Date },
      progress: { type: Number, default: 0 }
    },
    default: new Map()
  },
  roadmap: {
    type: Object,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// ✅ FIXED: Modern pre-save hook without next callback
userSchema.pre('save', function() {
  this.updatedAt = Date.now();
});

const User = mongoose.model('User', userSchema);

// ════════════════════════════════════════════════════════════════════════════
// ONBOARDING SCHEMA
// ════════════════════════════════════════════════════════════════════════════

const onboardingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  educationLevel: {
    type: String,
    required: true
  },
  stream: {
    type: String,
    required: true
  },
  interests: {
    type: [String],
    required: true
  },
  careerGoal: {
    type: String,
    required: true
  },
  timeline: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// ✅ FIXED: Modern pre-save hook without next callback
onboardingSchema.pre('save', function() {
  this.updatedAt = Date.now();
});

const Onboarding = mongoose.model('Onboarding', onboardingSchema);

// ════════════════════════════════════════════════════════════════════════════
// COURSE SCHEMA
// ════════════════════════════════════════════════════════════════════════════

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    // ✅ FIXED: Expanded enum to include exact categories from your Roadmap
    enum: ['Web Development', 'Data Science', 'Design', 'Business', 'Medical AI', 'Other', 
           'Web Developer', 'Mobile Developer', 'Data Scientist', 
           'Mechanical Engineer', 'Electrical Engineer', 'Civil Engineer', 
           'General Medicine', 'Dentistry', 'Pharmacy', 
           'Accounting', 'Finance', 'Marketing', 
           'Fine Arts', 'Applied Arts & Design', 'Digital Arts & Media'],
    default: 'Other'
  },
  stream: {
    type: String,
    enum: ['medical', 'engineering', 'ics', 'commerce', 'arts', 'general'],
    default: 'general'
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  duration: {
    type: Number,
    default: 10
  },
  instructor: {
    type: String,
    default: ''
  },
  platform: {
    type: String,
    default: ''
  },
  resourceUrl: {
    type: String,
    required: false
  },
  link: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  students: {
    type: Number,
    default: 0
  },
  enrolledCount: {
    type: Number,
    default: 0
  },
  completedCount: {
    type: Number,
    default: 0
  },
  lessons: {
    type: [String],
    default: []
  },
  videoLinks: {
    type: [{
      title: String,
      url: String
    }],
    default: []
  },
  resources: {
    type: [{
      name: String,
      url: String
    }],
    default: []
  },
  platforms: {
    type: [{
      name: String,
      url: String
    }],
    default: []
  },
  price: {
    type: String,
    default: 'Free'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Course = mongoose.model('Course', courseSchema);

// ════════════════════════════════════════════════════════════════════════════
// CAREER PATH SCHEMA
// ════════════════════════════════════════════════════════════════════════════

const careerPathSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  stream: {
    type: String,
    required: true,
    enum: ['medical', 'engineering', 'ics', 'commerce', 'arts', 'general']
  },
  salary: {
    type: String,
    default: 'Not specified'
  },
  demand: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Very High'],
    default: 'Medium'
  },
  skills: {
    type: [String],
    default: []
  },
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  phases: [{
    phaseNumber: Number,
    name: String,
    duration: String,
    courses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    }],
    projects: [String],
    skills: [String]
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const CareerPath = mongoose.model('CareerPath', careerPathSchema);

// ════════════════════════════════════════════════════════════════════════════
// USER PROGRESS SCHEMA
// ════════════════════════════════════════════════════════════════════════════

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  completionPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed'],
    default: 'Not Started'
  },
  completed: {
    type: Boolean,
    default: false
  },
  progress: {
    type: Number,
    default: 0
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date,
  lastAccessedAt: {
    type: Date,
    default: Date.now
  }
});

const UserProgress = mongoose.model('UserProgress', userProgressSchema);

// ════════════════════════════════════════════════════════════════════════════
// COUNSELOR SESSION SCHEMA
// ════════════════════════════════════════════════════════════════════════════

const counselorSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant']
    },
    content: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const CounselorSession = mongoose.model('CounselorSession', counselorSessionSchema);

// ════════════════════════════════════════════════════════════════════════════
// ANALYTICS SCHEMA
// ════════════════════════════════════════════════════════════════════════════

const analyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  event: {
    type: String,
    required: true
  },
  data: mongoose.Schema.Types.Mixed,
  timestamp: {
    type: Date,
    default: Date.now
  },
  ipAddress: String,
  userAgent: String
});

const Analytics = mongoose.model('Analytics', analyticsSchema);

// ════════════════════════════════════════════════════════════════════════════
// FEEDBACK SCHEMA
// ════════════════════════════════════════════════════════════════════════════

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  feedback: String,
  page: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

// ════════════════════════════════════════════════════════════════════════════
// QUIZ SCHEMA (NEW)
// ════════════════════════════════════════════════════════════════════════════

const quizSchema = new mongoose.Schema({
  courseId: {
    type: Number,
    required: true,
    unique: true
  },
  courseName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  timeLimit: {
    type: Number,
    default: 30
  },
  passingScore: {
    type: Number,
    default: 60
  },
  questions: [{
    question: String,
    type: {
      type: String,
      enum: ['multiple-choice', 'true-false', 'short-answer'],
      required: true
    },
    options: [String],
    correctAnswerIndex: Number,
    correctAnswer: String,
    points: {
      type: Number,
      default: 10
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Quiz = mongoose.model('Quiz', quizSchema);

// ════════════════════════════════════════════════════════════════════════════
// QUIZ ATTEMPT SCHEMA (NEW)
// ════════════════════════════════════════════════════════════════════════════

const quizAttemptSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: Number,
    required: true
  },
  answers: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: new Map()
  },
  score: {
    type: Number,
    default: 0
  },
  percentage: {
    type: Number,
    default: 0
  },
  passed: {
    type: Boolean,
    default: false
  },
  attemptDate: {
    type: Date,
    default: Date.now
  }
});

const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);

// ════════════════════════════════════════════════════════════════════════════
// CERTIFICATE SCHEMA (NEW)
// ════════════════════════════════════════════════════════════════════════════

const certificateSchema = new mongoose.Schema({
  certificateId: {
    type: String,
    required: true,
    unique: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  courseId: {
    type: Number,
    required: true
  },
  courseName: {
    type: String,
    required: true
  },
  completionDate: {
    type: Date,
    default: Date.now
  },
  verificationCode: {
    type: String,
    required: true
  },
  isValid: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Certificate = mongoose.model('Certificate', certificateSchema);

// ════════════════════════════════════════════════════════════════════════════
// EXPORT
// ════════════════════════════════════════════════════════════════════════════

module.exports = {
  connectMongoDB,
  User,
  Course,
  CareerPath,
  UserProgress,
  CounselorSession,
  Analytics,
  Feedback,
  Onboarding,
  Quiz,
  QuizAttempt,
  Certificate
};