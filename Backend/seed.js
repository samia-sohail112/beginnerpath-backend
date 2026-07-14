const mongoose = require('mongoose');
const { connectMongoDB, Course } = require('./mongodb-config');
require('dotenv').config();

const ALL_COURSES = [
  // ─── ICS STREAM (25 COURSES) ───
  { title: "HTML, CSS & JavaScript Fundamentals", category: "Web Developer", stream: "ics", level: "Beginner", duration: 25, resourceUrl: "https://www.youtube.com/watch?v=pQN-pnXPaVg" },
  { title: "Python Programming Fundamentals", category: "Web Developer", stream: "ics", level: "Beginner", duration: 20, resourceUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw" },
  { title: "Data Structures & Algorithms", category: "Web Developer", stream: "ics", level: "Intermediate", duration: 22, resourceUrl: "https://www.youtube.com/watch?v=8hly31xrwes" },
  { title: "SQL & Database Design", category: "Web Developer", stream: "ics", level: "Intermediate", duration: 15, resourceUrl: "https://www.youtube.com/watch?v=HXV3zeQKqGY" },
  { title: "React - Advanced Frontend", category: "Web Developer", stream: "ics", level: "Intermediate", duration: 22, resourceUrl: "https://www.youtube.com/watch?v=w7ejDZ8SWv8" },
  { title: "Node.js & Express - Backend", category: "Web Developer", stream: "ics", level: "Intermediate", duration: 20, resourceUrl: "https://www.youtube.com/watch?v=f2EqECiTBL8" },
  { title: "REST API Design & Performance", category: "Web Developer", stream: "ics", level: "Intermediate", duration: 14, resourceUrl: "https://www.youtube.com/watch?v=SLwpqD8n3d0" },
  { title: "Testing & Code Quality", category: "Web Developer", stream: "ics", level: "Intermediate", duration: 12, resourceUrl: "https://www.youtube.com/watch?v=r9HdJ8P6GQI" },
  { title: "Full-Stack Web Application Project", category: "Web Developer", stream: "ics", level: "Advanced", duration: 30, resourceUrl: "https://www.youtube.com/watch?v=oUZjO00NkhY" },
  { title: "React Native - Cross-Platform Apps", category: "Mobile Developer", stream: "ics", level: "Intermediate", duration: 20, resourceUrl: "https://www.youtube.com/watch?v=0kL6yhx5jVs" },
  { title: "Flutter Development", category: "Mobile Developer", stream: "ics", level: "Intermediate", duration: 18, resourceUrl: "https://www.youtube.com/watch?v=CD0yNGxP2Y4" },
  { title: "Mobile Backend & Firebase", category: "Mobile Developer", stream: "ics", level: "Intermediate", duration: 16, resourceUrl: "https://www.youtube.com/watch?v=9kRgVxULbag" },
  { title: "Data Structures & Algorithms", category: "Mobile Developer", stream: "ics", level: "Intermediate", duration: 22, resourceUrl: "https://www.youtube.com/watch?v=8hly31xrwes" },
  { title: "Mobile App Project", category: "Mobile Developer", stream: "ics", level: "Advanced", duration: 25, resourceUrl: "https://www.youtube.com/watch?v=ZBrSZFAy-Ow" },
  { title: "App Store & Play Store Deployment", category: "Mobile Developer", stream: "ics", level: "Intermediate", duration: 8, resourceUrl: "https://www.youtube.com/watch?v=0kL6yhx5jVs" },
  { title: "Mobile Performance & Optimization", category: "Mobile Developer", stream: "ics", level: "Intermediate", duration: 12, resourceUrl: "https://www.youtube.com/watch?v=1xipg02wu8s" },
  { title: "Python Programming", category: "Data Scientist", stream: "ics", level: "Beginner", duration: 20, resourceUrl: "https://www.youtube.com/watch?v=LHBE6Q9XlzI" },
  { title: "Data Structures & Algorithms", category: "Data Scientist", stream: "ics", level: "Intermediate", duration: 22, resourceUrl: "https://www.youtube.com/watch?v=8hly31xrwes" },
  { title: "SQL & Databases", category: "Data Scientist", stream: "ics", level: "Intermediate", duration: 15, resourceUrl: "https://www.youtube.com/watch?v=HXV3zeQKqGY" },
  { title: "Python Data Science Libraries", category: "Data Scientist", stream: "ics", level: "Intermediate", duration: 18, resourceUrl: "https://www.youtube.com/watch?v=vmEHCJofslg" },
  { title: "Machine Learning Fundamentals", category: "Data Scientist", stream: "ics", level: "Intermediate", duration: 22, resourceUrl: "https://www.youtube.com/watch?v=Gv9_4yMHFhI" },
  { title: "Deep Learning & TensorFlow", category: "Data Scientist", stream: "ics", level: "Advanced", duration: 20, resourceUrl: "https://www.youtube.com/watch?v=tPYj3fFJGjk" },
  { title: "Data Visualization & Storytelling", category: "Data Scientist", stream: "ics", level: "Intermediate", duration: 12, resourceUrl: "https://www.youtube.com/watch?v=fPxIyXjmxEU" },
  { title: "NLP & Computer Vision", category: "Data Scientist", stream: "ics", level: "Advanced", duration: 16, resourceUrl: "https://www.youtube.com/watch?v=xvqsFTUsOmc" },
  { title: "ML Project & Model Deployment", category: "Data Scientist", stream: "ics", level: "Advanced", duration: 18, resourceUrl: "https://www.youtube.com/watch?v=5nOqLqMsj5k" },

  // ─── ENGINEERING STREAM (12 COURSES) ───
  { title: "Engineering Mathematics", category: "Mechanical Engineer", stream: "engineering", level: "Beginner", duration: 30, resourceUrl: "https://www.youtube.com/watch?v=HfACrKJ_Y2w" },
  { title: "Engineering Physics", category: "Mechanical Engineer", stream: "engineering", level: "Beginner", duration: 25, resourceUrl: "https://www.youtube.com/watch?v=8uVrqINc9Nw" },
  { title: "Thermodynamics", category: "Mechanical Engineer", stream: "engineering", level: "Intermediate", duration: 22, resourceUrl: "https://www.youtube.com/watch?v=3ERu1HGE5vI" },
  { title: "CAD & SolidWorks", category: "Mechanical Engineer", stream: "engineering", level: "Intermediate", duration: 20, resourceUrl: "https://www.youtube.com/watch?v=3wR0ZgVfLvc" },
  { title: "Circuit Analysis", category: "Electrical Engineer", stream: "engineering", level: "Beginner", duration: 25, resourceUrl: "https://www.youtube.com/watch?v=2q8Fh27vWp4" },
  { title: "Digital Logic Design", category: "Electrical Engineer", stream: "engineering", level: "Intermediate", duration: 20, resourceUrl: "https://www.youtube.com/watch?v=5RizfB3Ef3E" },
  { title: "Power Systems", category: "Electrical Engineer", stream: "engineering", level: "Intermediate", duration: 22, resourceUrl: "https://www.youtube.com/watch?v=3ERu1HGE5vI" },
  { title: "Microcontrollers (Arduino)", category: "Electrical Engineer", stream: "engineering", level: "Intermediate", duration: 18, resourceUrl: "https://www.youtube.com/watch?v=5LbPkK6VbR4" },
  { title: "Engineering Mechanics", category: "Civil Engineer", stream: "engineering", level: "Beginner", duration: 25, resourceUrl: "https://www.youtube.com/watch?v=1CExhpxbX-g" },
  { title: "Structural Analysis", category: "Civil Engineer", stream: "engineering", level: "Intermediate", duration: 22, resourceUrl: "https://www.youtube.com/watch?v=2g5SOt4C_S4" },
  { title: "Construction Materials", category: "Civil Engineer", stream: "engineering", level: "Beginner", duration: 18, resourceUrl: "https://www.youtube.com/watch?v=7r4xVDtWXD8" },
  { title: "Surveying & AutoCAD", category: "Civil Engineer", stream: "engineering", level: "Intermediate", duration: 20, resourceUrl: "https://www.youtube.com/watch?v=3wR0ZgVfLvc" },

  // ─── MEDICAL STREAM (10 COURSES) ───
  { title: "Human Anatomy", category: "General Medicine", stream: "medical", level: "Beginner", duration: 35, resourceUrl: "https://www.youtube.com/watch?v=5xqyK-5M2a0" },
  { title: "Physiology", category: "General Medicine", stream: "medical", level: "Intermediate", duration: 30, resourceUrl: "https://www.youtube.com/watch?v=0r_8x2B5VlU" },
  { title: "Biochemistry", category: "General Medicine", stream: "medical", level: "Intermediate", duration: 25, resourceUrl: "https://www.youtube.com/watch?v=3ERu1HGE5vI" },
  { title: "Pharmacology", category: "General Medicine", stream: "medical", level: "Advanced", duration: 22, resourceUrl: "https://www.youtube.com/watch?v=4AilLZ7Wmnw" },
  { title: "Oral Anatomy", category: "Dentistry", stream: "medical", level: "Beginner", duration: 25, resourceUrl: "https://www.youtube.com/watch?v=5xqyK-5M2a0" },
  { title: "Dental Materials", category: "Dentistry", stream: "medical", level: "Intermediate", duration: 20, resourceUrl: "https://www.youtube.com/watch?v=3ERu1HGE5vI" },
  { title: "Oral Surgery Basics", category: "Dentistry", stream: "medical", level: "Advanced", duration: 22, resourceUrl: "https://www.youtube.com/watch?v=1CExhpxbX-g" },
  { title: "Pharmaceutical Chemistry", category: "Pharmacy", stream: "medical", level: "Beginner", duration: 25, resourceUrl: "https://www.youtube.com/watch?v=4AilLZ7Wmnw" },
  { title: "Pharmacognosy", category: "Pharmacy", stream: "medical", level: "Intermediate", duration: 20, resourceUrl: "https://www.youtube.com/watch?v=0r_8x2B5VlU" },
  { title: "Clinical Pharmacy", category: "Pharmacy", stream: "medical", level: "Advanced", duration: 22, resourceUrl: "https://www.youtube.com/watch?v=6aFnSvvD8rY" },

  // ─── COMMERCE STREAM (10 COURSES) ───
  { title: "Financial Accounting", category: "Accounting", stream: "commerce", level: "Beginner", duration: 25, resourceUrl: "https://www.youtube.com/watch?v=7r4xVDtWXD8" },
  { title: "Managerial Accounting", category: "Accounting", stream: "commerce", level: "Intermediate", duration: 20, resourceUrl: "https://www.youtube.com/watch?v=3ERu1HGE5vI" },
  { title: "Auditing Principles", category: "Accounting", stream: "commerce", level: "Intermediate", duration: 18, resourceUrl: "https://www.youtube.com/watch?v=0r_8x2B5VlU" },
  { title: "Taxation", category: "Accounting", stream: "commerce", level: "Advanced", duration: 20, resourceUrl: "https://www.youtube.com/watch?v=4AilLZ7Wmnw" },
  { title: "Corporate Finance", category: "Finance", stream: "commerce", level: "Beginner", duration: 22, resourceUrl: "https://www.youtube.com/watch?v=5xqyK-5M2a0" },
  { title: "Investment Analysis", category: "Finance", stream: "commerce", level: "Intermediate", duration: 20, resourceUrl: "https://www.youtube.com/watch?v=3ERu1HGE5vI" },
  { title: "Financial Markets", category: "Finance", stream: "commerce", level: "Intermediate", duration: 18, resourceUrl: "https://www.youtube.com/watch?v=1CExhpxbX-g" },
  { title: "Principles of Marketing", category: "Marketing", stream: "commerce", level: "Beginner", duration: 20, resourceUrl: "https://www.youtube.com/watch?v=7r4xVDtWXD8" },
  { title: "Digital Marketing", category: "Marketing", stream: "commerce", level: "Intermediate", duration: 22, resourceUrl: "https://www.youtube.com/watch?v=5xqyK-5M2a0" },
  { title: "Consumer Behavior", category: "Marketing", stream: "commerce", level: "Intermediate", duration: 18, resourceUrl: "https://www.youtube.com/watch?v=6aFnSvvD8rY" },

  // ─── ARTS STREAM (15 COURSES) ───
  { title: "Foundation Drawing & Painting", category: "Fine Arts", stream: "arts", level: "Beginner", duration: 25, resourceUrl: "https://www.youtube.com/watch?v=ewMksAbgdBI" },
  { title: "Introduction to Sculpture", category: "Fine Arts", stream: "arts", level: "Intermediate", duration: 20, resourceUrl: "https://www.youtube.com/watch?v=4uLz0q1p5fA" },
  { title: "Printmaking", category: "Fine Arts", stream: "arts", level: "Intermediate", duration: 18, resourceUrl: "https://www.youtube.com/watch?v=7Z9QNQkqG2Q" },
  { title: "Art History & Aesthetics", category: "Fine Arts", stream: "arts", level: "Intermediate", duration: 22, resourceUrl: "https://www.youtube.com/watch?v=W6P6F9k0dU0" },
  { title: "Studio Practice & Portfolio Development", category: "Fine Arts", stream: "arts", level: "Advanced", duration: 30, resourceUrl: "https://www.youtube.com/watch?v=H0m2r2C6qM4" },
  { title: "Graphic Design Fundamentals", category: "Applied Arts & Design", stream: "arts", level: "Beginner", duration: 25, resourceUrl: "https://www.youtube.com/watch?v=WONZVnlam6U" },
  { title: "Digital Illustration & Image Editing", category: "Applied Arts & Design", stream: "arts", level: "Intermediate", duration: 22, resourceUrl: "https://www.youtube.com/watch?v=1pjyGp1P5Vc" },
  { title: "Advertising & Visual Communication", category: "Applied Arts & Design", stream: "arts", level: "Intermediate", duration: 20, resourceUrl: "https://www.youtube.com/watch?v=3Zv4a5kUZhA" },
  { title: "Photography Basics", category: "Applied Arts & Design", stream: "arts", level: "Beginner", duration: 18, resourceUrl: "https://www.youtube.com/watch?v=wFpD2FjLc_8" },
  { title: "Commercial Art Project", category: "Applied Arts & Design", stream: "arts", level: "Advanced", duration: 28, resourceUrl: "https://www.youtube.com/watch?v=9JY7LnHv1BE" },
  { title: "Digital Media Fundamentals", category: "Digital Arts & Media", stream: "arts", level: "Beginner", duration: 20, resourceUrl: "https://www.youtube.com/watch?v=1B0qJz8I5qE" },
  { title: "2D & 3D Animation", category: "Digital Arts & Media", stream: "arts", level: "Intermediate", duration: 24, resourceUrl: "https://www.youtube.com/watch?v=uDqjIdI4bF4" },
  { title: "Interaction Design & UX", category: "Digital Arts & Media", stream: "arts", level: "Intermediate", duration: 22, resourceUrl: "https://www.youtube.com/watch?v=KdOhYwN6s6Y" },
  { title: "Digital Video & Filmmaking", category: "Digital Arts & Media", stream: "arts", level: "Intermediate", duration: 22, resourceUrl: "https://www.youtube.com/watch?v=H5T8rUq6PkQ" },
  { title: "Creative Coding & New Media", category: "Digital Arts & Media", stream: "arts", level: "Advanced", duration: 20, resourceUrl: "https://www.youtube.com/watch?v=herQxN1O53Q" }
];

async function seedFullCourses() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    const connected = await connectMongoDB();
    if (!connected) {
      console.error('❌ MongoDB connection failed');
      process.exit(1);
    }
    console.log('✅ Connected to MongoDB');

    const existingCount = await Course.countDocuments();
    if (existingCount > 0) {
      console.log(`⚠️ ${existingCount} courses already exist. Clearing...`);
      await Course.deleteMany({});
      console.log('✅ Cleared existing courses');
    }

    const result = await Course.insertMany(ALL_COURSES);
    console.log(`✅ SUCCESS! Seeded ${result.length} courses into the database!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
}

seedFullCourses();