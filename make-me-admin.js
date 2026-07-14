// make-me-admin.js
// ════════════════════════════════════════════════════════════════════════════
// JUST CHANGE YOUR EMAIL BELOW AND RUN: node make-me-admin.js
// ════════════════════════════════════════════════════════════════════════════

const mongoose = require('mongoose');
require('dotenv').config();

// 🔴 CHANGE THIS TO YOUR EMAIL ADDRESS
const YOUR_EMAIL = 'samiasohail650@gmail.com';  // <-- CHANGE THIS!

// ════════════════════════════════════════════════════════════════════════════

async function makeMeAdmin() {
  console.log('🚀 Connecting to MongoDB...');
  
  // Connect to MongoDB
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/beginnerpath');
  console.log('✅ Connected to database!');
  
  // Get the User model
  const User = mongoose.model('User', new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: { type: String, default: 'user' }
  }));
  
  // Find and update your user
  const user = await User.findOne({ email: YOUR_EMAIL.toLowerCase() });
  
  if (!user) {
    console.log(`❌ User "${YOUR_EMAIL}" not found!`);
    console.log('💡 Make sure you have signed up first.');
    await mongoose.disconnect();
    return;
  }
  
  // Update to admin
  user.role = 'admin';
  await user.save();
  
  console.log(`✅ SUCCESS! ${YOUR_EMAIL} is now an ADMIN! 👑`);
  console.log(`📊 User: ${user.name} (${user.email})`);
  console.log(`🔑 Role: ${user.role}`);
  
  await mongoose.disconnect();
  console.log('🔌 Disconnected from database.');
}

// Run the function
makeMeAdmin().catch(error => {
  console.error('❌ Error:', error.message);
  mongoose.disconnect();
});