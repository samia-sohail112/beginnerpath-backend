require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// ════════════════════════════════════════════════════════════════════════════
// ✅ FIXED: Clean import from mongodb-config
// ════════════════════════════════════════════════════════════════════════════
const { connectMongoDB, User, Course, CareerPath, Analytics, Feedback, Onboarding, Quiz, QuizAttempt, Certificate, CounselorSession } = require('./mongodb-config');

// ════════════════════════════════════════════════════════════════════════════
// ✅ ADDED: Import admin routes
// ════════════════════════════════════════════════════════════════════════════
const adminRoutes = require('./routes/admin-routes');

const app = express();
const PORT = process.env.PORT || 5000;

// ════════════════════════════════════════════════════════════════════════════
// MIDDLEWARE
// ════════════════════════════════════════════════════════════════════════════
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5000', 'http://127.0.0.1:5000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('public'));

// ════════════════════════════════════════════════════════════════════════════
// LOGGING HELPER
// ════════════════════════════════════════════════════════════════════════════
const log = (emoji, message) => console.log(`${emoji} ${message}`);

// ════════════════════════════════════════════════════════════════════════════
// JWT AUTHENTICATION MIDDLEWARE
// ════════════════════════════════════════════════════════════════════════════
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-change-this');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

// ════════════════════════════════════════════════════════════════════════════
// HEALTH CHECK
// ════════════════════════════════════════════════════════════════════════════
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: '✅ BeginnerPath Backend is running',
    timestamp: new Date().toISOString(),
    apiKey: process.env.GROQ_API_KEY ? '✅ Configured' : '❌ Missing',
    mongodb: mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Not connected'
  });
});

// ════════════════════════════════════════════════════════════════════════════
// MAKE ME ADMIN
// ════════════════════════════════════════════════════════════════════════════
app.get('/api/make-me-admin', async (req, res) => {
  try {
    const email = req.query.email;
    
    if (!email) {
      return res.send(`
        <h2>❌ Email Required</h2>
        <p>Use: /api/make-me-admin?email=your-email@example.com</p>
        <p>Example: <a href="/api/make-me-admin?email=admin@example.com">/api/make-me-admin?email=admin@example.com</a></p>
      `);
    }
    
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.send(`
        <h2>❌ User Not Found</h2>
        <p>Email "${email}" not found in database.</p>
        <p>Please sign up first at <a href="/signup.html">/signup.html</a></p>
      `);
    }
    
    user.role = 'admin';
    await user.save();
    
    res.send(`
      <h2>✅ SUCCESS! You are now an ADMIN! 👑</h2>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Name:</strong> ${user.name}</p>
      <p><strong>Role:</strong> ${user.role} ⭐</p>
      <hr>
      <p>You can now access the admin panel at:</p>
      <a href="/admin-panel.html" style="padding:10px 20px;background:#3B82F6;color:white;text-decoration:none;border-radius:5px;">
        Go to Admin Dashboard
      </a>
      <br><br>
      <p style="color:#666;font-size:0.9rem;">⚠️ For security, remove this endpoint after use.</p>
    `);
  } catch (error) {
    res.send(`<h2>❌ Error: ${error.message}</h2>`);
  }
});

// ════════════════════════════════════════════════════════════════════════════
// AI COUNSELOR
// ════════════════════════════════════════════════════════════════════════════
app.post('/api/counselor', async (req, res) => {
  try {
    const { userMessage, conversationHistory, systemPrompt } = req.body;
    log('🤖', `AI Counselor: "${userMessage}"`);
    
    if (!process.env.GROQ_API_KEY) {
      log('❌', 'Groq API Key not configured');
      return res.status(401).json({
        error: 'API Key missing',
        message: 'Please add GROQ_API_KEY to .env file'
      });
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      }))
    ];

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        messages: messages,
        max_tokens: 1024
      })
    });

    if (!groqResponse.ok) {
      const error = await groqResponse.json();
      log('❌', `Groq error: ${groqResponse.status} - ${JSON.stringify(error)}`);
      return res.status(groqResponse.status).json({ error });
    }

    const data = await groqResponse.json();
    const counselorResponse = data.choices[0].message.content;
    log('✅', 'AI Counselor responded');
    res.json({ counselorResponse, usage: data.usage });
  } catch (error) {
    log('💥', `Error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// COUNSELOR SAVE MESSAGE
// ════════════════════════════════════════════════════════════════════════════
app.post('/api/counselor/save-message', authenticateToken, async (req, res) => {
  try {
    const { sessionId, userMessage, aiResponse } = req.body;
    log('💬', `Saving message to session: ${sessionId}`);

    let session = await CounselorSession.findById(sessionId);
    
    if (!session) {
      session = await CounselorSession.create({
        userId: req.user.userId,
        messages: [],
        isActive: true
      });
      log('✅', `New counselor session created: ${session._id}`);
    }

    if (userMessage) {
      session.messages.push({
        role: 'user',
        content: userMessage,
        timestamp: new Date()
      });
    }

    if (aiResponse) {
      session.messages.push({
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      });
    }

    session.updatedAt = new Date();
    await session.save();

    log('✅', `Message saved to database`);

    res.json({
      success: true,
      sessionId: session._id,
      messageCount: session.messages.length
    });

  } catch (error) {
    log('❌', `Save message error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// COUNSELOR HISTORY
// ════════════════════════════════════════════════════════════════════════════
app.get('/api/counselor/history', authenticateToken, async (req, res) => {
  try {
    log('📚', `Fetching chat history for user: ${req.user.userId}`);

    const sessions = await CounselorSession.find({ userId: req.user.userId })
      .sort({ updatedAt: -1 })
      .limit(20)
      .select('_id messages updatedAt createdAt');

    const history = sessions.map(session => ({
      sessionId: session._id,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      messageCount: session.messages.length,
      preview: session.messages.length > 0 
        ? session.messages[0].content.substring(0, 50) + '...'
        : 'Empty conversation'
    }));

    log('✅', `Found ${history.length} chat sessions`);

    res.json({ success: true, sessions: history });

  } catch (error) {
    log('❌', `Get history error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// COUNSELOR SESSION
// ════════════════════════════════════════════════════════════════════════════
app.get('/api/counselor/session/:sessionId', authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.params;
    log('📖', `Loading session: ${sessionId}`);

    const session = await CounselorSession.findOne({
      _id: sessionId,
      userId: req.user.userId
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({
      success: true,
      sessionId: session._id,
      messages: session.messages,
      createdAt: session.createdAt
    });

  } catch (error) {
    log('❌', `Load session error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// SIGNUP (Fixed: Returns token)
// ════════════════════════════════════════════════════════════════════════════
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    log('👤', `Sign up: ${email}`);
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'A user with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      stream: 'general',
      role: 'user',
      onboardingComplete: false,
      educationLevel: 'General Science',
      interests: [],
      careerGoal: 'job',
      timeline: '6months',
      completedCourses: 0,
      totalCourses: 10,
      progressPercentage: 0,
      achievements: [],
      recentActivity: [],
      courseProgress: new Map()
    });

    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        stream: user.stream || 'general',
        role: user.role || 'user'
      },
      process.env.JWT_SECRET || 'fallback-secret-change-this',
      { expiresIn: '7d' }
    );

    log('✅', `User created in database: ${email}`);

    res.json({
      success: true,
      message: 'User created successfully',
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        stream: user.stream || 'general',
        role: user.role || 'user',
        onboardingComplete: user.onboardingComplete || false,
        educationLevel: user.educationLevel || 'General Science',
        interests: user.interests || [],
        careerGoal: user.careerGoal || 'job',
        timeline: user.timeline || '6months'
      }
    });
  } catch (error) {
    log('❌', `Sign up error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// LOGIN
// ════════════════════════════════════════════════════════════════════════════
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    log('🔐', `Login: ${email}`);
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        stream: user.stream || 'general',
        role: user.role || 'user'
      },
      process.env.JWT_SECRET || 'fallback-secret-change-this',
      { expiresIn: '7d' }
    );

    log('✅', `Login successful: ${email}`);
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        stream: user.stream || 'general',
        role: user.role || 'user',
        onboardingComplete: user.onboardingComplete || false,
        educationLevel: user.educationLevel || 'General Science',
        interests: user.interests || [],
        careerGoal: user.careerGoal || 'job',
        timeline: user.timeline || '6months'
      }
    });
  } catch (error) {
    log('❌', `Login error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// ONBOARDING (Fixed: returnDocument instead of new:true)
// ════════════════════════════════════════════════════════════════════════════
app.post('/api/onboarding', authenticateToken, async (req, res) => {
  try {
    const { 
      educationLevel, 
      stream, 
      interests, 
      careerGoal, 
      timeline,
      learningStyle,
      experienceLevel,
      hoursPerWeek
    } = req.body;
    
    log('📝', `Onboarding for user: ${req.user.userId}`);
    
    if (!educationLevel || !stream || !interests || !careerGoal || !timeline) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // ✅ FIX: returnDocument: 'after' instead of new: true
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        educationLevel: educationLevel,
        stream: stream,
        interests: interests,
        careerGoal: careerGoal,
        timeline: timeline,
        learningStyle: learningStyle || 'mixed',
        experienceLevel: experienceLevel || 'basic',
        hoursPerWeek: hoursPerWeek || 10,
        onboardingComplete: true
      },
      { returnDocument: 'after' }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // ✅ FIX: returnDocument: 'after' instead of new: true
    if (Onboarding) {
      try {
        await Onboarding.findOneAndUpdate(
          { userId: req.user.userId },
          {
            userId: req.user.userId,
            educationLevel: educationLevel,
            stream: stream,
            interests: interests,
            careerGoal: careerGoal,
            timeline: timeline,
            learningStyle: learningStyle || 'mixed',
            experienceLevel: experienceLevel || 'basic',
            hoursPerWeek: hoursPerWeek || 10
          },
          { upsert: true, returnDocument: 'after' }
        );
      } catch (err) {
        log('⚠️', 'Onboarding collection save skipped:', err.message);
      }
    }

    log('✅', `Onboarding saved to database for ${user.email}`);
    res.json({
      success: true,
      message: 'Onboarding completed successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        stream: user.stream,
        onboardingComplete: user.onboardingComplete,
        educationLevel: user.educationLevel,
        interests: user.interests,
        careerGoal: user.careerGoal,
        timeline: user.timeline,
        learningStyle: user.learningStyle,
        experienceLevel: user.experienceLevel,
        hoursPerWeek: user.hoursPerWeek
      }
    });
  } catch (error) {
    log('❌', `Onboarding error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// GET ONBOARDING DATA
// ════════════════════════════════════════════════════════════════════════════
app.get('/api/onboarding', authenticateToken, async (req, res) => {
  try {
    let onboardingData = null;
    
    if (Onboarding) {
      onboardingData = await Onboarding.findOne({ userId: req.user.userId });
    }
    
    const user = await User.findById(req.user.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      onboarding: {
        educationLevel: onboardingData?.educationLevel || user.educationLevel,
        stream: onboardingData?.stream || user.stream,
        interests: onboardingData?.interests || user.interests,
        careerGoal: onboardingData?.careerGoal || user.careerGoal,
        timeline: onboardingData?.timeline || user.timeline,
        learningStyle: onboardingData?.learningStyle || user.learningStyle,
        experienceLevel: onboardingData?.experienceLevel || user.experienceLevel,
        hoursPerWeek: onboardingData?.hoursPerWeek || user.hoursPerWeek
      }
    });
  } catch (error) {
    log('❌', `Get onboarding error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// ⭐ NEW ENDPOINT: GET USER PROFILE ⭐
// ════════════════════════════════════════════════════════════════════════════
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    log('👤', `Fetching profile for user: ${req.user.userId}`);
    
    const user = await User.findById(req.user.userId).select('-password');
    const totalCourses = await Course.countDocuments(); // ✅ Dynamic total courses
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const courseProgress = {};
    if (user.courseProgress) {
      for (let [key, value] of user.courseProgress) {
        courseProgress[key] = value;
      }
    }

    log('✅', `Profile fetched for: ${user.email}`);
    res.json({
      success: true,
      profile: {
        id: user._id,
        name: user.name,
        email: user.email,
        stream: user.stream || 'general',
        role: user.role || 'user',
        onboardingComplete: user.onboardingComplete || false,
        educationLevel: user.educationLevel || 'General Science',
        interests: user.interests || [],
        careerGoal: user.careerGoal || 'job',
        timeline: user.timeline || '6months',
        learningStyle: user.learningStyle || 'mixed',
        experienceLevel: user.experienceLevel || 'basic',
        hoursPerWeek: user.hoursPerWeek || 10,
        createdAt: user.createdAt,
        completedCourses: user.completedCourses || 0,
        totalCourses: totalCourses || user.totalCourses || 10, // ✅ Dynamic total
        progressPercentage: user.progressPercentage || 0,
        courseProgress: courseProgress,
        achievements: user.achievements || [],
        recentActivity: user.recentActivity || []
      }
    });
  } catch (error) {
    log('❌', `Get profile error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// DASHBOARD (UPDATED: Filter courses by specialization)
// ════════════════════════════════════════════════════════════════════════════
app.get('/api/dashboard', authenticateToken, async (req, res) => {
  try {
    log('📊', `Dashboard request for user: ${req.user.userId}`);
    
    const user = await User.findById(req.user.userId).select('-password');
    const { specialization } = req.query;

    // 🔴 CRITICAL FIX: Add console logs so you can see what the backend is receiving in your terminal!
    console.log(`🔍 Backend received specialization query: "${specialization}"`);

    let totalCourses;
    // 🔴 CRITICAL FIX: If no specialization is selected, total MUST be 0, NOT 21!
    if (specialization) {
      totalCourses = await Course.countDocuments({ category: specialization });
      console.log(`✅ Found ${totalCourses} courses in specialization "${specialization}"`);
    } else {
      totalCourses = 0; // <--- THIS is the fix that prevents "21" from showing
      console.log(`ℹ️ No specialization selected. Setting totalCourses to 0.`);
    }
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const courseProgress = {};
    if (user.courseProgress) {
      for (let [key, value] of user.courseProgress) {
        courseProgress[key] = value;
      }
    }

    const dashboardData = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        stream: user.stream || 'general',
        role: user.role || 'user',
        onboardingComplete: user.onboardingComplete || false,
        educationLevel: user.educationLevel || 'General Science',
        interests: user.interests || ['technology'],
        careerGoal: user.careerGoal || 'job',
        timeline: user.timeline || '6months',
        learningStyle: user.learningStyle || 'mixed',
        experienceLevel: user.experienceLevel || 'basic',
        hoursPerWeek: user.hoursPerWeek || 10,
        createdAt: user.createdAt
      },
      progress: {
        completedCourses: user.completedCourses || 0,
        totalCourses: totalCourses || 0, // ✅ Dynamic total based on spec
        percentage: user.progressPercentage || 0
      },
      courseProgress: courseProgress,
      achievements: user.achievements || [],
      recentActivity: user.recentActivity || []
    };

    log('✅', `Dashboard data from database for: ${user.email}`);
    res.json(dashboardData);
  } catch (error) {
    log('❌', `Dashboard error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// UPDATE COURSE PROGRESS - ✅ FIXED: String conversion for Mongoose Map
// ════════════════════════════════════════════════════════════════════════════
app.post('/api/user/progress', authenticateToken, async (req, res) => {
  try {
    const { courseId, completed, progress = 100 } = req.body;
    log('📈', `Progress update for course: ${courseId}`);
    
    const user = await User.findById(req.user.userId);
    const totalCourses = await Course.countDocuments(); // ✅ Dynamic total courses
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.courseProgress) {
      user.courseProgress = new Map();
    }

    const courseIdStr = String(courseId);

    // 🔴 CRITICAL FIX: Get existing progress BEFORE setting it
    const existingProgress = user.courseProgress.get(courseIdStr);

    if (completed) {
      if (!existingProgress || !existingProgress.completed) {
        user.completedCourses = (user.completedCourses || 0) + 1;
        
        user.recentActivity.unshift({
          action: 'Course Completed',
          courseId: courseIdStr,
          timestamp: new Date()
        });
        
        if (user.recentActivity.length > 10) {
          user.recentActivity = user.recentActivity.slice(0, 10);
        }
      }
    }

    const courseProgress = {
      completed: completed || false,
      completionDate: completed ? new Date() : null,
      progress: progress || 0
    };
    
    // Set the progress now
    user.courseProgress.set(courseIdStr, courseProgress);
    user.markModified('courseProgress');

    // ✅ Use the actual total courses count from the DB to calculate correct percentage
    const actualTotal = totalCourses || user.totalCourses || 10;
    user.totalCourses = actualTotal;
    user.progressPercentage = Math.min(
      Math.round((user.completedCourses / user.totalCourses) * 100),
      100
    );

    user.markModified('completedCourses');
    user.markModified('totalCourses');

    await user.save();

    log('✅', `Progress saved to database for ${user.email}`);
    res.json({
      success: true,
      message: 'Progress saved to database',
      progress: {
        completedCourses: user.completedCourses,
        totalCourses: user.totalCourses,
        percentage: user.progressPercentage,
        courseProgress: Object.fromEntries(user.courseProgress)
      }
    });
  } catch (error) {
    log('❌', `Progress update error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// GET USER PROGRESS
// ════════════════════════════════════════════════════════════════════════════
app.get('/api/user/progress', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const totalCourses = await Course.countDocuments(); // ✅ Dynamic total courses
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const courseProgress = {};
    if (user.courseProgress) {
      for (let [key, value] of user.courseProgress) {
        courseProgress[key] = value;
      }
    }

    res.json({
      success: true,
      progress: {
        completedCourses: user.completedCourses,
        totalCourses: totalCourses || user.totalCourses || 10, // ✅ Dynamic total
        percentage: user.progressPercentage,
        courseProgress: courseProgress
      }
    });
  } catch (error) {
    log('❌', `Get progress error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// GET COURSES
// ════════════════════════════════════════════════════════════════════════════
app.get('/api/courses', async (req, res) => {
  try {
    log('📚', 'Fetching courses from database');
    let courses = await Course.find();
    
    if (!courses || courses.length === 0) {
      courses = [
        {
          title: 'Web Development Basics',
          category: 'Web Development',
          stream: 'ics',
          level: 'Beginner',
          duration: 40,
          instructor: 'Ali Khan',
          platform: 'Udemy',
          link: 'https://www.udemy.com/course/web-dev/',
          rating: 4.9,
          students: 345
        },
        {
          title: 'Python for Data Science',
          category: 'Data Science',
          stream: 'engineering',
          level: 'Intermediate',
          duration: 60,
          instructor: 'Sara Ahmed',
          platform: 'Coursera',
          link: 'https://www.coursera.org/learn/python-data-science',
          rating: 4.7,
          students: 289
        }
      ];
    }
    
    res.json({ courses, count: courses.length });
  } catch (error) {
    log('❌', `Courses error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// GET CAREERS
// ════════════════════════════════════════════════════════════════════════════
app.get('/api/careers', async (req, res) => {
  try {
    log('💼', 'Fetching careers from database');
    let careers = await CareerPath.find();
    
    if (!careers || careers.length === 0) {
      careers = [
        {
          title: 'Bioinformatician',
          stream: 'medical',
          salary: '50,000 - 150,000 PKR',
          demand: 'Very High'
        },
        {
          title: 'Full Stack Developer',
          stream: 'ics',
          salary: '40,000 - 200,000 PKR',
          demand: 'Very High'
        }
      ];
    }
    
    res.json({ careers, count: careers.length });
  } catch (error) {
    log('❌', `Careers error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// ANALYTICS
// ════════════════════════════════════════════════════════════════════════════
app.post('/api/analytics', async (req, res) => {
  try {
    const { event, userId, data } = req.body;
    log('📈', `Event: ${event}`);
    await Analytics.create({ event, userId, data, timestamp: new Date() });
    res.json({ status: 'logged' });
  } catch (error) {
    log('❌', `Analytics error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// FEEDBACK
// ════════════════════════════════════════════════════════════════════════════
app.post('/api/feedback', async (req, res) => {
  try {
    const { rating, feedback, page, userId } = req.body;
    log('⭐', `Feedback: ${rating}/5 on ${page}`);
    await Feedback.create({ rating, feedback, page, userId, timestamp: new Date() });
    res.json({ success: true });
  } catch (error) {
    log('❌', `Feedback error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// CONTACT FORM
// ════════════════════════════════════════════════════════════════════════════
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    log('📧', `Contact from ${name}`);
    res.json({ success: true, message: 'Message received' });
  } catch (error) {
    log('❌', `Contact error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// QUIZ ROUTES
// ════════════════════════════════════════════════════════════════════════════

// Get quiz for a course
app.get('/api/courses/:courseId/quiz', authenticateToken, async (req, res) => {
  try {
    const courseId = parseInt(req.params.courseId);
    const quiz = await Quiz.findOne({ courseId: courseId });
    
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found for this course' });
    }

    res.json({
      courseId: quiz.courseId,
      courseName: quiz.courseName,
      description: quiz.description,
      timeLimit: quiz.timeLimit,
      passingScore: quiz.passingScore || 60,
      questions: quiz.questions.map(q => ({
        question: q.question,
        type: q.type,
        options: q.options || [],
        points: q.points || 10
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// ✅ FIXED: Submit quiz - No per-course certificate
// ════════════════════════════════════════════════════════════════════════════
app.post('/api/quizzes/submit', authenticateToken, async (req, res) => {
  try {
    const { courseId, answers } = req.body;

    if (!courseId || !answers) {
      return res.status(400).json({ error: 'courseId and answers required' });
    }

    const quiz = await Quiz.findOne({ courseId: parseInt(courseId) });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const score = gradeQuiz(quiz.questions, answers);
    const percentage = Math.round((score / getTotalPoints(quiz.questions)) * 100);
    const passed = percentage >= (quiz.passingScore || 60);

    const attempt = new QuizAttempt({
      studentId: req.user.userId,
      courseId: parseInt(courseId),
      answers: answers,
      score: score,
      percentage: percentage,
      passed: passed,
      attemptDate: new Date()
    });

    const savedAttempt = await attempt.save();

    let certificateId = null;
    if (passed) {
      const user = await User.findById(req.user.userId);
      if (user) {
        if (!user.courseProgress) user.courseProgress = new Map();
        const progress = {
          completed: true,
          completionDate: new Date(),
          progress: 100
        };
        // ✅ FIX: String conversion for Map
        const courseIdStr = String(courseId);
        const existingProgress = user.courseProgress.get(courseIdStr);

        if (!existingProgress || !existingProgress.completed) {
          user.completedCourses = (user.completedCourses || 0) + 1;
          user.recentActivity.unshift({
            action: 'Course Completed via Quiz',
            courseId: courseIdStr,
            timestamp: new Date()
          });
          if (user.recentActivity.length > 10) user.recentActivity = user.recentActivity.slice(0, 10);
        }

        user.courseProgress.set(courseIdStr, progress);
        user.markModified('courseProgress');
        user.markModified('completedCourses');
        user.markModified('totalCourses');

        user.progressPercentage = Math.min(Math.round((user.completedCourses / user.totalCourses) * 100), 100);
        await user.save();
        log('✅', `Quiz passed - progress saved for user ${user.email}, course ${courseId}`);
      }
    }

    res.json({
      score: score,
      percentage: percentage,
      passed: passed,
      message: passed ? 'Congratulations! You passed!' : 'Try again next time',
      certificateId: null, // No per-course certificate
      attemptId: savedAttempt._id.toString()
    });
  } catch (error) {
    log('❌', `Quiz submit error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// ✅ FIXED: Get certificates - Only specialization
// ════════════════════════════════════════════════════════════════════════════
app.get('/api/student/certificates', authenticateToken, async (req, res) => {
  try {
    const certificates = await Certificate.find({ 
      studentId: req.user.userId,
      $or: [
        { courseId: -1 },
        { courseId: null }
      ]
    }).sort({ completionDate: -1 });

    res.json(certificates.map(cert => ({
      certificateId: cert.certificateId,
      courseName: cert.courseName,
      completionDate: cert.completionDate,
      verificationCode: cert.verificationCode,
      isValid: cert.isValid
    })));
  } catch (error) {
    log('❌', `Get certificates error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// ✅ NEW: Specialization Certificate Endpoint
// ════════════════════════════════════════════════════════════════════════════
app.post('/api/certificates/specialization', authenticateToken, async (req, res) => {
  try {
    const { specializationId, specializationName, courseIds } = req.body;
    
    if (!specializationId || !specializationName || !courseIds) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if all courses completed
    let allCompleted = true;
    for (const courseId of courseIds) {
      const progress = user.courseProgress?.get(String(courseId));
      if (!progress || !progress.completed) {
        allCompleted = false;
        break;
      }
    }

    if (!allCompleted) {
      return res.status(400).json({ 
        error: 'Not all courses completed for this specialization',
        completed: false 
      });
    }

    // Check for existing certificate
    const existingCert = await Certificate.findOne({
      studentId: userId,
      courseId: -1,
      courseName: { $regex: `${specializationName}.*Specialization` }
    });

    if (existingCert) {
      return res.json({
        success: true,
        message: 'Specialization certificate already exists',
        certificateId: existingCert.certificateId,
        existing: true
      });
    }

    // Generate specialization certificate
    const certificateId = `SPEC_${userId}_${specializationId}_${Date.now()}`;
    const verificationCode = `SCV-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 14).toUpperCase()}`;

    const cert = new Certificate({
      certificateId: certificateId,
      studentId: userId,
      studentName: user.name,
      courseId: -1, // Special marker for specialization
      courseName: `${specializationName} Specialization`,
      completionDate: new Date(),
      verificationCode: verificationCode,
      isValid: true
    });

    await cert.save();

    log('🎓', `Specialization certificate generated: ${certificateId} for ${user.email}`);

    res.json({
      success: true,
      message: 'Specialization certificate generated successfully!',
      certificateId: certificateId,
      verificationCode: verificationCode,
      courseName: cert.courseName
    });

  } catch (error) {
    log('❌', `Specialization certificate error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Verify certificate (public)
app.post('/api/certificates/:certificateId/verify', async (req, res) => {
  try {
    const cert = await Certificate.findOne({
      certificateId: req.params.certificateId
    });

    if (!cert) {
      return res.status(404).json({ valid: false, message: 'Certificate not found' });
    }

    res.json({
      valid: cert.isValid,
      certificateId: cert.certificateId,
      studentName: cert.studentName,
      courseName: cert.courseName,
      completionDate: cert.completionDate,
      verificationCode: cert.verificationCode
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// ADMIN ROUTES
// ════════════════════════════════════════════════════════════════════════════
app.use('/api/admin', adminRoutes);

// ════════════════════════════════════════════════════════════════════════════
// 404 HANDLER
// ════════════════════════════════════════════════════════════════════════════
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.path });
});

// ════════════════════════════════════════════════════════════════════════════
// ERROR HANDLER
// ════════════════════════════════════════════════════════════════════════════
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// ════════════════════════════════════════════════════════════════════════════
// QUIZ HELPER FUNCTIONS
// ════════════════════════════════════════════════════════════════════════════

function gradeQuiz(questions, answers) {
  let totalScore = 0;

  questions.forEach((question, index) => {
    const studentAnswer = answers[index];
    
    if (question.type === 'multiple-choice') {
      if (parseInt(studentAnswer) === question.correctAnswerIndex) {
        totalScore += (question.points || 10);
      }
    } else if (question.type === 'true-false') {
      if (studentAnswer === question.correctAnswer.toString()) {
        totalScore += (question.points || 10);
      }
    } else if (question.type === 'short-answer') {
      if (studentAnswer && 
          studentAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()) {
        totalScore += (question.points || 10);
      }
    }
  });

  return totalScore;
}

function getTotalPoints(questions) {
  return questions.reduce((sum, q) => sum + (q.points || 10), 0);
}

// ════════════════════════════════════════════════════════════════════════════
// ✅ AUTO-SEED REAL COURSES ON STARTUP (Fixes "0 Courses" issue)
// ════════════════════════════════════════════════════════════════════════════
const SEED_COURSES = [
  { title: "HTML, CSS & JavaScript Fundamentals", category: "Web Developer", stream: "ics", level: "Beginner", duration: 25, resourceUrl: "https://www.youtube.com/watch?v=pQN-pnXPaVg" },
  { title: "Python Programming Fundamentals", category: "Web Developer", stream: "ics", level: "Beginner", duration: 20, resourceUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw" },
  { title: "Data Structures & Algorithms", category: "Web Developer", stream: "ics", level: "Intermediate", duration: 22, resourceUrl: "https://www.youtube.com/watch?v=8hly31xrwes" },
  { title: "SQL & Database Design", category: "Web Developer", stream: "ics", level: "Intermediate", duration: 15, resourceUrl: "https://www.youtube.com/watch?v=HXV3zeQKqGY" },
  { title: "React - Advanced Frontend", category: "Web Developer", stream: "ics", level: "Intermediate", duration: 22, resourceUrl: "https://www.youtube.com/watch?v=w7ejDZ8SWv8" },
  { title: "Node.js & Express - Backend", category: "Web Developer", stream: "ics", level: "Intermediate", duration: 20, resourceUrl: "https://www.youtube.com/watch?v=f2EqECiTBL8" },
  { title: "Full-Stack Web Application Project", category: "Web Developer", stream: "ics", level: "Advanced", duration: 30, resourceUrl: "https://www.youtube.com/watch?v=oUZjO00NkhY" },
  { title: "React Native - Cross-Platform Apps", category: "Mobile Developer", stream: "ics", level: "Intermediate", duration: 20, resourceUrl: "https://www.youtube.com/watch?v=0kL6yhx5jVs" },
  { title: "Flutter Development", category: "Mobile Developer", stream: "ics", level: "Intermediate", duration: 18, resourceUrl: "https://www.youtube.com/watch?v=CD0yNGxP2Y4" },
  { title: "Machine Learning Fundamentals", category: "Data Scientist", stream: "ics", level: "Intermediate", duration: 22, resourceUrl: "https://www.youtube.com/watch?v=Gv9_4yMHFhI" },
  { title: "Deep Learning & TensorFlow", category: "Data Scientist", stream: "ics", level: "Advanced", duration: 20, resourceUrl: "https://www.youtube.com/watch?v=tPYj3fFJGjk" },
  { title: "Engineering Mathematics", category: "Mechanical Engineer", stream: "engineering", level: "Beginner", duration: 30, resourceUrl: "https://www.youtube.com/watch?v=HfACrKJ_Y2w" },
  { title: "Thermodynamics", category: "Mechanical Engineer", stream: "engineering", level: "Intermediate", duration: 22, resourceUrl: "https://www.youtube.com/watch?v=3ERu1HGE5vI" },
  { title: "Circuit Analysis", category: "Electrical Engineer", stream: "engineering", level: "Beginner", duration: 25, resourceUrl: "https://www.youtube.com/watch?v=2q8Fh27vWp4" },
  { title: "Human Anatomy", category: "General Medicine", stream: "medical", level: "Beginner", duration: 35, resourceUrl: "https://www.youtube.com/watch?v=5xqyK-5M2a0" },
  { title: "Physiology", category: "General Medicine", stream: "medical", level: "Intermediate", duration: 30, resourceUrl: "https://www.youtube.com/watch?v=0r_8x2B5VlU" },
  { title: "Pharmacology", category: "General Medicine", stream: "medical", level: "Advanced", duration: 22, resourceUrl: "https://www.youtube.com/watch?v=4AilLZ7Wmnw" },
  { title: "Financial Accounting", category: "Accounting", stream: "commerce", level: "Beginner", duration: 25, resourceUrl: "https://www.youtube.com/watch?v=7r4xVDtWXD8" },
  { title: "Corporate Finance", category: "Finance", stream: "commerce", level: "Beginner", duration: 22, resourceUrl: "https://www.youtube.com/watch?v=5xqyK-5M2a0" },
  { title: "Digital Marketing", category: "Marketing", stream: "commerce", level: "Intermediate", duration: 22, resourceUrl: "https://www.youtube.com/watch?v=5xqyK-5M2a0" },
  { title: "Graphic Design Fundamentals", category: "Applied Arts & Design", stream: "arts", level: "Beginner", duration: 25, resourceUrl: "https://www.youtube.com/watch?v=WONZVnlam6U" }
];

// ════════════════════════════════════════════════════════════════════════════
// ✅ START SERVER (Supports both local & Vercel)
// ════════════════════════════════════════════════════════════════════════════

// ✅ Export for Vercel (Serverless deployment)
module.exports = app;

// ✅ Start server (for local development only)
if (require.main === module) {
  const startServer = async () => {
    const connected = await connectMongoDB();
    
    if (connected) {
      // ✅ AUTO-SEED CHECK: Populate courses if the collection is empty
      try {
        const count = await Course.countDocuments();
        if (count === 0) {
          log('🌱', 'Seeding courses database with real roadmap data...');
          await Course.insertMany(SEED_COURSES);
          log('✅', `Seeded ${SEED_COURSES.length} courses into MongoDB!`);
        } else {
          log('📚', `Courses database already has ${count} courses.`);
        }
      } catch (seedErr) {
        log('⚠️', `Auto-seeding skipped/errored: ${seedErr.message}`);
      }

      log('✅', 'Database ready');
    } else {
      log('⚠️', 'Starting server WITHOUT a database connection - check your .env MONGODB_URI');
    }
    
    app.listen(PORT, () => {
      log('🌟', 'BEGINNERPATH SERVER STARTED');
      log('📍', `URL: http://localhost:${PORT}`);
      log('🔑', `API Key: ${process.env.GROQ_API_KEY ? '✅ YES' : '❌ NO'}`);
      log('🗄️', `Database: ${connected ? '✅ Connected' : '❌ Not connected'}`);
      log('🤖', 'AI Counselor: Ready at /api/counselor');
      log('💬', 'Chat History: Ready at /api/counselor/history (protected)');
      log('📚', 'Courses: Ready at /api/courses');
      log('💼', 'Careers: Ready at /api/careers');
      log('📊', 'Dashboard: Ready at /api/dashboard (protected)');
      log('👤', '⭐ USER PROFILE: Ready at /api/user/profile (protected)');
      log('📝', 'Onboarding: Ready at /api/onboarding (protected)');
      log('📈', 'Progress: Ready at /api/user/progress (protected)');
      log('👑', 'Admin: Ready at /api/make-me-admin?email=your-email');
      log('🛡️', 'Admin API: Ready at /api/admin');
      log('🎓', 'Specialization Certificate: Ready at /api/certificates/specialization (protected)');
    });
  };

  startServer();

  process.on('SIGTERM', () => {
    log('⚠️', 'SIGTERM - shutting down...');
    process.exit(0);
  });

  process.on('SIGINT', () => {
    log('⚠️', 'SIGINT - shutting down...');
    process.exit(0);
  });
}