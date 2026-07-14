// reset.js – Run this ONCE to reset your progress
require('dotenv').config();
const { connectMongoDB, User } = require('./mongodb-config');

async function resetProgress() {
  // ⚠️ CHANGE THIS EMAIL TO YOURS
  const email = "ammara12@gmail.com";

  await connectMongoDB();

  const user = await User.findOne({ email });
  if (!user) {
    console.log(`❌ User with email "${email}" not found.`);
    process.exit(1);
  }

  // Reset progress fields
  user.courseProgress = new Map();
  user.completedCourses = 0;
  user.progressPercentage = 0;
  await user.save();

  console.log(`✅ Progress reset for ${email}`);
  console.log(`✅ completedCourses: ${user.completedCourses}`);
  console.log(`✅ courseProgress: ${user.courseProgress.size} entries`);
  process.exit(0);
}

resetProgress();