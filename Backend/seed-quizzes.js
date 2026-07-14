// seed-quizzes.js – Run ONCE to add all quizzes to database
// Command: node seed-quizzes.js

require('dotenv').config();
const mongoose = require('mongoose');
const { connectMongoDB, Quiz } = require('./mongodb-config');

// ──────────────────────────────────────────────────────────────────────────────
// ALL COURSES – INCLUDING ARTS (401-415)
// ──────────────────────────────────────────────────────────────────────────────

const ALL_QUIZZES = {

  // ═══════════════════════════════════════════════════════════════════════════
  // ICS STREAM – Web Developer (1-9)
  // ═══════════════════════════════════════════════════════════════════════════
  1: {
    courseName: "HTML, CSS & JavaScript",
    description: "Test your web development fundamentals",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "What does HTML stand for?", type: "multiple-choice", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "CSS is used for:", type: "multiple-choice", options: ["Structure", "Styling", "Logic", "Database"], correctAnswerIndex: 1, points: 10 },
      { question: "Which tag is used for JavaScript?", type: "multiple-choice", options: ["<js>", "<script>", "<javascript>", "<code>"], correctAnswerIndex: 1, points: 10 },
      { question: "What is the correct file extension for HTML?", type: "multiple-choice", options: [".html", ".htm", "Both", "None"], correctAnswerIndex: 2, points: 10 }
    ]
  },
  2: {
    courseName: "Python Fundamentals",
    description: "Test your Python programming knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "Which keyword defines a function in Python?", type: "multiple-choice", options: ["function", "def", "define", "func"], correctAnswerIndex: 1, points: 10 },
      { question: "Which data type is immutable?", type: "multiple-choice", options: ["List", "Tuple", "Dictionary", "Set"], correctAnswerIndex: 1, points: 10 },
      { question: "What is output of print(2**3)?", type: "multiple-choice", options: ["6", "8", "9", "4"], correctAnswerIndex: 1, points: 10 }
    ]
  },
  3: {
    courseName: "Data Structures & Algorithms",
    description: "Test your DSA knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "Which uses LIFO?", type: "multiple-choice", options: ["Queue", "Stack", "Array", "Tree"], correctAnswerIndex: 1, points: 10 },
      { question: "Which sort has O(n log n)?", type: "multiple-choice", options: ["Bubble", "Merge", "Insertion", "Selection"], correctAnswerIndex: 1, points: 10 },
      { question: "Binary search complexity?", type: "multiple-choice", options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], correctAnswerIndex: 1, points: 10 }
    ]
  },
  4: {
    courseName: "SQL & Database Design",
    description: "Test your SQL skills",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "Which SQL statement retrieves data?", type: "multiple-choice", options: ["INSERT", "SELECT", "UPDATE", "DELETE"], correctAnswerIndex: 1, points: 10 },
      { question: "Which clause filters results?", type: "multiple-choice", options: ["GROUP BY", "ORDER BY", "WHERE", "HAVING"], correctAnswerIndex: 2, points: 10 },
      { question: "What is a primary key?", type: "multiple-choice", options: ["Unique identifier", "Foreign key", "Index", "Constraint"], correctAnswerIndex: 0, points: 10 }
    ]
  },
  5: {
    courseName: "React Frontend",
    description: "Test your React knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "Which hook is used for state?", type: "multiple-choice", options: ["useEffect", "useState", "useReducer", "useContext"], correctAnswerIndex: 1, points: 10 },
      { question: "Which function renders JSX?", type: "multiple-choice", options: ["render()", "ReactDOM.render()", "React.render()", "DOM.render()"], correctAnswerIndex: 1, points: 10 },
      { question: "What is a component?", type: "multiple-choice", options: ["Function", "Class", "Both", "None"], correctAnswerIndex: 2, points: 10 }
    ]
  },
  6: {
    courseName: "Node.js Backend",
    description: "Test your Node.js knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "Which framework is used with Node.js?", type: "multiple-choice", options: ["Django", "Express", "Ruby on Rails", "Flask"], correctAnswerIndex: 1, points: 10 },
      { question: "What is npm?", type: "multiple-choice", options: ["Node Package Manager", "Node Process Manager", "Network Package Manager", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "Which module handles HTTP?", type: "multiple-choice", options: ["fs", "http", "path", "os"], correctAnswerIndex: 1, points: 10 }
    ]
  },
  7: {
    courseName: "REST API Design",
    description: "Test your REST API knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "Which method is for reading data?", type: "multiple-choice", options: ["POST", "GET", "PUT", "DELETE"], correctAnswerIndex: 1, points: 10 },
      { question: "What does REST stand for?", type: "multiple-choice", options: ["Representational State Transfer", "Remote Service Transfer", "Response State Transfer", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "Which status code means success?", type: "multiple-choice", options: ["200", "400", "404", "500"], correctAnswerIndex: 0, points: 10 }
    ]
  },
  8: {
    courseName: "Testing & Code Quality",
    description: "Test your testing knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "Which framework is used for JS testing?", type: "multiple-choice", options: ["Jest", "Mocha", "Both", "None"], correctAnswerIndex: 2, points: 10 },
      { question: "What is TDD?", type: "multiple-choice", options: ["Test Driven Development", "Technical Design Document", "Test Data Driven", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "Which testing checks individual units?", type: "multiple-choice", options: ["Integration", "Unit", "System", "Acceptance"], correctAnswerIndex: 1, points: 10 }
    ]
  },
  9: {
    courseName: "Full-Stack Project",
    description: "Test your full-stack knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "Which stack is used for MERN?", type: "multiple-choice", options: ["MongoDB, Express, React, Node", "MySQL, Express, React, Node", "MongoDB, Ember, Redux, Node", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "What is a REST API?", type: "multiple-choice", options: ["Architecture style", "Database", "Frontend library", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "Which tool is used for deployment?", type: "multiple-choice", options: ["Git", "Docker", "Vercel", "All"], correctAnswerIndex: 3, points: 10 }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // COMMERCE STREAM – All 10 Courses (301-310)
  // ═══════════════════════════════════════════════════════════════════════════
  301: {
    courseName: "Financial Accounting",
    description: "Test your accounting knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "What is the accounting equation?", type: "multiple-choice", options: ["Assets = Liabilities + Equity", "Assets = Liabilities - Equity", "Revenue - Expenses = Profit", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "Which statement shows profitability?", type: "multiple-choice", options: ["Balance Sheet", "Income Statement", "Cash Flow", "Equity Statement"], correctAnswerIndex: 1, points: 10 },
      { question: "What is a liability?", type: "multiple-choice", options: ["What you own", "What you owe", "Revenue", "Expense"], correctAnswerIndex: 1, points: 10 }
    ]
  },
  302: {
    courseName: "Managerial Accounting",
    description: "Test your managerial accounting knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "What is break-even analysis?", type: "multiple-choice", options: ["Revenue = Cost", "Profit = 0", "Both", "Neither"], correctAnswerIndex: 2, points: 10 },
      { question: "Which costs vary with production?", type: "multiple-choice", options: ["Fixed", "Variable", "Sunk", "Opportunity"], correctAnswerIndex: 1, points: 10 },
      { question: "What is budgeting?", type: "multiple-choice", options: ["Financial planning", "Cost control", "Both", "Neither"], correctAnswerIndex: 2, points: 10 }
    ]
  },
  303: {
    courseName: "Auditing Principles",
    description: "Test your auditing knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "What is an audit?", type: "multiple-choice", options: ["Financial inspection", "Tax filing", "Investment analysis", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "Who performs internal audits?", type: "multiple-choice", options: ["Internal auditors", "External auditors", "Government", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "What is risk assessment?", type: "multiple-choice", options: ["Identifying risks", "Managing risks", "Both", "Neither"], correctAnswerIndex: 2, points: 10 }
    ]
  },
  304: {
    courseName: "Taxation",
    description: "Test your taxation knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "What is income tax?", type: "multiple-choice", options: ["Tax on earnings", "Tax on sales", "Tax on property", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "What is VAT?", type: "multiple-choice", options: ["Value Added Tax", "Variable Assessment Tax", "Value Assessment Tax", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "Who pays corporate tax?", type: "multiple-choice", options: ["Businesses", "Individuals", "Both", "Neither"], correctAnswerIndex: 0, points: 10 }
    ]
  },
  305: {
    courseName: "Corporate Finance",
    description: "Test your corporate finance knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "What is capital budgeting?", type: "multiple-choice", options: ["Investment decisions", "Financing decisions", "Dividend decisions", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "What is valuation?", type: "multiple-choice", options: ["Company worth", "Stock price", "Book value", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "What is cost of capital?", type: "multiple-choice", options: ["Cost of debt", "Cost of equity", "Both", "Neither"], correctAnswerIndex: 2, points: 10 }
    ]
  },
  306: {
    courseName: "Investment Analysis",
    description: "Test your investment analysis knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "What is a stock?", type: "multiple-choice", options: ["Equity share", "Debt instrument", "Derivative", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "What is a bond?", type: "multiple-choice", options: ["Debt instrument", "Equity share", "Derivative", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "What is portfolio management?", type: "multiple-choice", options: ["Managing assets", "Managing liabilities", "Managing cash", "None"], correctAnswerIndex: 0, points: 10 }
    ]
  },
  307: {
    courseName: "Financial Markets",
    description: "Test your financial markets knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "What is a stock exchange?", type: "multiple-choice", options: ["Trading platform", "Banking system", "Insurance company", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "What is the banking system?", type: "multiple-choice", options: ["Financial intermediary", "Regulatory body", "Trading platform", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "What are financial instruments?", type: "multiple-choice", options: ["Stocks, bonds", "Derivatives", "Both", "Neither"], correctAnswerIndex: 2, points: 10 }
    ]
  },
  308: {
    courseName: "Principles of Marketing",
    description: "Test your marketing principles knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "What are the 4Ps?", type: "multiple-choice", options: ["Product, Price, Place, Promotion", "Product, Price, People, Process", "Product, Price, Place, People", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "What is branding?", type: "multiple-choice", options: ["Creating a brand image", "Creating a product", "Creating a price", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "What is market research?", type: "multiple-choice", options: ["Understanding customers", "Understanding competitors", "Both", "Neither"], correctAnswerIndex: 2, points: 10 }
    ]
  },
  309: {
    courseName: "Digital Marketing",
    description: "Test your digital marketing knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "What is SEO?", type: "multiple-choice", options: ["Search Engine Optimization", "Search Engine Organization", "Social Engagement Optimization", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "What is social media marketing?", type: "multiple-choice", options: ["Marketing on social platforms", "Marketing on TV", "Marketing on radio", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "What is content marketing?", type: "multiple-choice", options: ["Creating valuable content", "Creating ads", "Creating emails", "None"], correctAnswerIndex: 0, points: 10 }
    ]
  },
  310: {
    courseName: "Consumer Behavior",
    description: "Test your consumer behavior knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "What is consumer psychology?", type: "multiple-choice", options: ["Study of consumer decisions", "Study of consumer finances", "Study of consumer health", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "What is decision making?", type: "multiple-choice", options: ["Choosing among alternatives", "Following instructions", "Random selection", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "What is buying behavior?", type: "multiple-choice", options: ["How consumers buy", "Where consumers buy", "Why consumers buy", "All"], correctAnswerIndex: 3, points: 10 }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ENGINEERING STREAM – All 12 Courses (101-112)
  // ═══════════════════════════════════════════════════════════════════════════
  101: {
    courseName: "Engineering Mathematics",
    description: "Test your engineering mathematics knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "What is calculus?", type: "multiple-choice", options: ["Study of change", "Study of shapes", "Study of numbers", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "What is linear algebra?", type: "multiple-choice", options: ["Study of vectors", "Study of matrices", "Both", "Neither"], correctAnswerIndex: 2, points: 10 },
      { question: "What is a differential equation?", type: "multiple-choice", options: ["Equation with derivatives", "Equation with integrals", "Equation with matrices", "None"], correctAnswerIndex: 0, points: 10 }
    ]
  },
  102: {
    courseName: "Engineering Physics",
    description: "Test your engineering physics knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "What is mechanics?", type: "multiple-choice", options: ["Study of motion", "Study of heat", "Study of light", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "What is thermodynamics?", type: "multiple-choice", options: ["Study of heat", "Study of motion", "Study of electricity", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "What are waves?", type: "multiple-choice", options: ["Energy transfer", "Mass transfer", "Charge transfer", "None"], correctAnswerIndex: 0, points: 10 }
    ]
  },
  103: {
    courseName: "Thermodynamics",
    description: "Test your thermodynamics knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "What is the first law?", type: "multiple-choice", options: ["Energy conservation", "Entropy", "Heat transfer", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "What is entropy?", type: "multiple-choice", options: ["Disorder", "Energy", "Heat", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "What is enthalpy?", type: "multiple-choice", options: ["Total heat", "Specific heat", "Latent heat", "None"], correctAnswerIndex: 0, points: 10 }
    ]
  },
  104: {
    courseName: "CAD & SolidWorks",
    description: "Test your CAD knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "What is CAD?", type: "multiple-choice", options: ["Computer-Aided Design", "Computer-Aided Drafting", "Both", "Neither"], correctAnswerIndex: 2, points: 10 },
      { question: "What is SolidWorks?", type: "multiple-choice", options: ["3D modeling software", "2D drafting software", "Simulation software", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "What is sketching?", type: "multiple-choice", options: ["Creating 2D geometry", "Creating 3D models", "Creating animations", "None"], correctAnswerIndex: 0, points: 10 }
    ]
  },
  105: {
    courseName: "Circuit Analysis",
    description: "Test your circuit analysis knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "What is Ohm's law?", type: "multiple-choice", options: ["V = IR", "V = I/R", "I = VR", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "What is KVL?", type: "multiple-choice", options: ["Kirchhoff's Voltage Law", "Kirchhoff's Current Law", "Kirchhoff's Power Law", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "What is KCL?", type: "multiple-choice", options: ["Kirchhoff's Current Law", "Kirchhoff's Voltage Law", "Kirchhoff's Power Law", "None"], correctAnswerIndex: 0, points: 10 }
    ]
  },
  106: {
    courseName: "Digital Logic Design",
    description: "Test your digital logic knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "What is Boolean algebra?", type: "multiple-choice", options: ["Logic with true/false", "Math with numbers", "Set theory", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "What is a logic gate?", type: "multiple-choice", options: ["Digital circuit", "Analog circuit", "Power circuit", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "What is a flip-flop?", type: "multiple-choice", options: ["Memory element", "Logic gate", "Amplifier", "None"], correctAnswerIndex: 0, points: 10 }
    ]
  },
  107: {
    courseName: "Power Systems",
    description: "Test your power systems knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "What is power generation?", type: "multiple-choice", options: ["Producing electricity", "Storing electricity", "Distributing electricity", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "What is transmission?", type: "multiple-choice", options: ["Carrying electricity", "Generating electricity", "Using electricity", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "What is distribution?", type: "multiple-choice", options: ["Delivering electricity", "Generating electricity", "Storing electricity", "None"], correctAnswerIndex: 0, points: 10 }
    ]
  },
  108: {
    courseName: "Microcontrollers (Arduino)",
    description: "Test your microcontroller knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "What is Arduino?", type: "multiple-choice", options: ["Microcontroller board", "Programming language", "Operating system", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "What is a sensor?", type: "multiple-choice", options: ["Input device", "Output device", "Memory device", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "What is an actuator?", type: "multiple-choice", options: ["Output device", "Input device", "Storage device", "None"], correctAnswerIndex: 0, points: 10 }
    ]
  },
  109: {
    courseName: "Engineering Mechanics",
    description: "Test your engineering mechanics knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "What is statics?", type: "multiple-choice", options: ["Study of forces at rest", "Study of forces in motion", "Study of heat", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "What is dynamics?", type: "multiple-choice", options: ["Study of forces in motion", "Study of forces at rest", "Study of heat", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "What is equilibrium?", type: "multiple-choice", options: ["Balance of forces", "Imbalance of forces", "Motion of forces", "None"], correctAnswerIndex: 0, points: 10 }
    ]
  },
  110: {
    courseName: "Structural Analysis",
    description: "Test your structural analysis knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "What is a beam?", type: "multiple-choice", options: ["Horizontal structural element", "Vertical structural element", "Diagonal structural element", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "What is a column?", type: "multiple-choice", options: ["Vertical structural element", "Horizontal structural element", "Diagonal structural element", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "What is load calculation?", type: "multiple-choice", options: ["Determining forces on structure", "Determining material properties", "Determining cost", "None"], correctAnswerIndex: 0, points: 10 }
    ]
  },
  111: {
    courseName: "Construction Materials",
    description: "Test your construction materials knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "What is concrete?", type: "multiple-choice", options: ["Building material", "Metal alloy", "Wood product", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "What is steel?", type: "multiple-choice", options: ["Metal alloy", "Concrete", "Wood", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "What is masonry?", type: "multiple-choice", options: ["Brick/stone construction", "Steel construction", "Wood construction", "None"], correctAnswerIndex: 0, points: 10 }
    ]
  },
  112: {
    courseName: "Surveying & AutoCAD",
    description: "Test your surveying knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "What is surveying?", type: "multiple-choice", options: ["Measuring land", "Designing buildings", "Building structures", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "What is AutoCAD?", type: "multiple-choice", options: ["Drafting software", "Surveying tool", "Construction tool", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "What is drafting?", type: "multiple-choice", options: ["Technical drawing", "Surveying land", "Building structure", "None"], correctAnswerIndex: 0, points: 10 }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MEDICAL STREAM – All 10 Courses (201-210)
  // ═══════════════════════════════════════════════════════════════════════════
  201: {
    courseName: "Human Anatomy",
    description: "Test your anatomy knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "What is the largest organ?", type: "multiple-choice", options: ["Liver", "Skin", "Heart", "Brain"], correctAnswerIndex: 1, points: 10 },
      { question: "How many bones in an adult?", type: "multiple-choice", options: ["106", "206", "306", "406"], correctAnswerIndex: 1, points: 10 },
      { question: "Where is the heart located?", type: "multiple-choice", options: ["Cranial", "Thoracic", "Abdominal", "Pelvic"], correctAnswerIndex: 1, points: 10 },
      { question: "Which system protects the body?", type: "multiple-choice", options: ["Nervous", "Immune", "Digestive", "Respiratory"], correctAnswerIndex: 1, points: 10 }
    ]
  },
  202: {
    courseName: "Physiology",
    description: "Test your physiology knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "What regulates body temperature?", type: "multiple-choice", options: ["Hypothalamus", "Thalamus", "Cerebellum", "Medulla"], correctAnswerIndex: 0, points: 10 },
      { question: "Which hormone regulates blood sugar?", type: "multiple-choice", options: ["Insulin", "Glucagon", "Both", "Neither"], correctAnswerIndex: 2, points: 10 },
      { question: "What do kidneys do?", type: "multiple-choice", options: ["Filter blood", "Produce urine", "Both", "Neither"], correctAnswerIndex: 2, points: 10 }
    ]
  },
  203: {
    courseName: "Biochemistry",
    description: "Test your biochemistry knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "Which molecule stores genetic info?", type: "multiple-choice", options: ["DNA", "RNA", "Protein", "Lipid"], correctAnswerIndex: 0, points: 10 },
      { question: "Building block of proteins?", type: "multiple-choice", options: ["Nucleotide", "Amino acid", "Monosaccharide", "Fatty acid"], correctAnswerIndex: 1, points: 10 },
      { question: "Which process produces energy?", type: "multiple-choice", options: ["Photosynthesis", "Respiration", "Fermentation", "All"], correctAnswerIndex: 1, points: 10 }
    ]
  },
  204: {
    courseName: "Pharmacology",
    description: "Test your pharmacology knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "What is the study of drugs?", type: "multiple-choice", options: ["Pharmacology", "Pharmacognosy", "Pharmacy", "Chemistry"], correctAnswerIndex: 0, points: 10 },
      { question: "Fastest drug absorption route?", type: "multiple-choice", options: ["Oral", "IV", "Subcutaneous", "Intramuscular"], correctAnswerIndex: 1, points: 10 },
      { question: "What is bioavailability?", type: "multiple-choice", options: ["Amount absorbed", "Rate of metabolism", "Excretion", "Distribution"], correctAnswerIndex: 0, points: 10 }
    ]
  },
  205: {
    courseName: "Oral Anatomy",
    description: "Test your oral anatomy knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "What is the tooth structure?", type: "multiple-choice", options: ["Crown, root", "Enamel, dentin", "Pulp, cementum", "All"], correctAnswerIndex: 3, points: 10 },
      { question: "What is the oral cavity?", type: "multiple-choice", options: ["Inside the mouth", "Outside the mouth", "Inside the nose", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "What is the dental arch?", type: "multiple-choice", options: ["Curve of teeth", "Straight line of teeth", "Single tooth", "None"], correctAnswerIndex: 0, points: 10 }
    ]
  },
  206: {
    courseName: "Dental Materials",
    description: "Test your dental materials knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "What are composite fillings?", type: "multiple-choice", options: ["Tooth-colored material", "Metal material", "Ceramic material", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "What are crowns?", type: "multiple-choice", options: ["Tooth coverings", "Tooth fillings", "Tooth extractions", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "What are bridges?", type: "multiple-choice", options: ["Replacing missing teeth", "Filling cavities", "Cleaning teeth", "None"], correctAnswerIndex: 0, points: 10 }
    ]
  },
  207: {
    courseName: "Oral Surgery Basics",
    description: "Test your oral surgery knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "What is extraction?", type: "multiple-choice", options: ["Removing teeth", "Filling teeth", "Cleaning teeth", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "What is suture?", type: "multiple-choice", options: ["Stitching wounds", "Removing teeth", "Cleaning teeth", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "What is post-op care?", type: "multiple-choice", options: ["After surgery care", "Before surgery care", "During surgery care", "None"], correctAnswerIndex: 0, points: 10 }
    ]
  },
  208: {
    courseName: "Pharmaceutical Chemistry",
    description: "Test your pharmaceutical chemistry knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "What is organic chemistry?", type: "multiple-choice", options: ["Study of carbon compounds", "Study of metals", "Study of gases", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "What is drug synthesis?", type: "multiple-choice", options: ["Creating drugs", "Analyzing drugs", "Dispensing drugs", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "What is quality control?", type: "multiple-choice", options: ["Ensuring drug quality", "Ensuring drug quantity", "Ensuring drug price", "None"], correctAnswerIndex: 0, points: 10 }
    ]
  },
  209: {
    courseName: "Pharmacognosy",
    description: "Test your pharmacognosy knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "What is herbal medicine?", type: "multiple-choice", options: ["Plant-based medicine", "Synthetic medicine", "Mineral-based medicine", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "What are natural products?", type: "multiple-choice", options: ["Plant-derived drugs", "Synthetic drugs", "Animal-derived drugs", "All"], correctAnswerIndex: 3, points: 10 },
      { question: "What is extraction?", type: "multiple-choice", options: ["Isolating compounds", "Synthesizing compounds", "Analyzing compounds", "None"], correctAnswerIndex: 0, points: 10 }
    ]
  },
  210: {
    courseName: "Clinical Pharmacy",
    description: "Test your clinical pharmacy knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "What is patient assessment?", type: "multiple-choice", options: ["Evaluating patient health", "Prescribing drugs", "Dispensing drugs", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "What is drug therapy?", type: "multiple-choice", options: ["Using drugs to treat", "Studying drugs", "Manufacturing drugs", "None"], correctAnswerIndex: 0, points: 10 },
      { question: "What is therapeutic monitoring?", type: "multiple-choice", options: ["Tracking drug effectiveness", "Tracking drug cost", "Tracking drug availability", "None"], correctAnswerIndex: 0, points: 10 }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ARTS STREAM – All 15 Courses (401-415)
  // ═══════════════════════════════════════════════════════════════════════════

  // ─── Fine Arts (401-405) ───
  401: {
    courseName: "Foundation Drawing & Painting",
    description: "Test your drawing and painting knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "Which principle of art refers to the arrangement of elements to create stability?", type: "multiple-choice", options: ["Balance", "Contrast", "Rhythm", "Emphasis"], correctAnswerIndex: 0, points: 10 },
      { question: "What is the primary colour model used for painting?", type: "multiple-choice", options: ["RGB", "CMYK", "RYB", "HEX"], correctAnswerIndex: 2, points: 10 },
      { question: "What does perspective in drawing create?", type: "multiple-choice", options: ["Depth and space", "Brightness", "Texture", "Movement"], correctAnswerIndex: 0, points: 10 },
      { question: "Which medium is water-based and transparent?", type: "multiple-choice", options: ["Oil", "Watercolour", "Acrylic", "Pastel"], correctAnswerIndex: 1, points: 10 }
    ]
  },
  402: {
    courseName: "Introduction to Sculpture",
    description: "Test your sculpture knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "What is the subtractive method in sculpture?", type: "multiple-choice", options: ["Adding material", "Carving away material", "Moulding clay", "Welding metal"], correctAnswerIndex: 1, points: 10 },
      { question: "Which material is commonly used for casting?", type: "multiple-choice", options: ["Wood", "Plaster", "Marble", "Bronze"], correctAnswerIndex: 3, points: 10 },
      { question: "What is a relief sculpture?", type: "multiple-choice", options: ["A freestanding figure", "A sculpture attached to a surface", "A kinetic sculpture", "A miniature sculpture"], correctAnswerIndex: 1, points: 10 },
      { question: "What is the armature used for in sculpture?", type: "multiple-choice", options: ["Colouring", "Support structure", "Finishing", "Polishing"], correctAnswerIndex: 1, points: 10 }
    ]
  },
  403: {
    courseName: "Printmaking",
    description: "Test your printmaking knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "What is a linocut?", type: "multiple-choice", options: ["A digital print", "A relief print from linoleum", "An etching technique", "A screen print"], correctAnswerIndex: 1, points: 10 },
      { question: "Which printmaking technique uses a stencil?", type: "multiple-choice", options: ["Etching", "Screen printing", "Woodcut", "Lithography"], correctAnswerIndex: 1, points: 10 },
      { question: "What is an edition in printmaking?", type: "multiple-choice", options: ["A single print", "A set of identical prints", "A limited colour palette", "A printing press"], correctAnswerIndex: 1, points: 10 },
      { question: "Which technique involves biting metal with acid?", type: "multiple-choice", options: ["Woodcut", "Linocut", "Etching", "Monotype"], correctAnswerIndex: 2, points: 10 }
    ]
  },
  404: {
    courseName: "Art History & Aesthetics",
    description: "Test your art history knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "Which period is known as the Renaissance?", type: "multiple-choice", options: ["5th-10th century", "14th-17th century", "18th-19th century", "20th century"], correctAnswerIndex: 1, points: 10 },
      { question: "What is aesthetic theory concerned with?", type: "multiple-choice", options: ["Colour mixing", "Beauty and art", "Market value", "Production techniques"], correctAnswerIndex: 1, points: 10 },
      { question: "Which artist painted the Sistine Chapel ceiling?", type: "multiple-choice", options: ["Da Vinci", "Michelangelo", "Raphael", "Donatello"], correctAnswerIndex: 1, points: 10 },
      { question: "What defines Modernism in art?", type: "multiple-choice", options: ["Realism", "Experimentation", "Religious themes", "Portraiture"], correctAnswerIndex: 1, points: 10 }
    ]
  },
  405: {
    courseName: "Studio Practice & Portfolio Development",
    description: "Test your portfolio development knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "What should a fine art portfolio typically include?", type: "multiple-choice", options: ["A single artwork", "A cohesive body of work", "Only sketches", "Commercial work"], correctAnswerIndex: 1, points: 10 },
      { question: "What is an artist statement?", type: "multiple-choice", options: ["A gallery review", "A written description of intent", "A price list", "A biography"], correctAnswerIndex: 1, points: 10 },
      { question: "How should you photograph 3D artworks?", type: "multiple-choice", options: ["With a phone", "With even lighting and neutral background", "In natural light", "Under coloured lights"], correctAnswerIndex: 1, points: 10 },
      { question: "What is a digital portfolio?", type: "multiple-choice", options: ["A physical portfolio", "A website or PDF version", "A social media page", "A printed magazine"], correctAnswerIndex: 1, points: 10 }
    ]
  },

  // ─── Applied Arts & Design (406-410) ───
  406: {
    courseName: "Graphic Design Fundamentals",
    description: "Test your graphic design knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "What is typography?", type: "multiple-choice", options: ["Logo design", "The art of arranging type", "Printing method", "Colour theory"], correctAnswerIndex: 1, points: 10 },
      { question: "What is a brand identity?", type: "multiple-choice", options: ["A logo", "The visual elements of a brand", "A tagline", "A product"], correctAnswerIndex: 1, points: 10 },
      { question: "What is a grid system used for in design?", type: "multiple-choice", options: ["Colour palettes", "Layout and alignment", "Typography", "File format"], correctAnswerIndex: 1, points: 10 },
      { question: "Which colour scheme uses opposite colours on the wheel?", type: "multiple-choice", options: ["Analogous", "Complementary", "Triadic", "Monochromatic"], correctAnswerIndex: 1, points: 10 }
    ]
  },
  407: {
    courseName: "Digital Illustration & Image Editing",
    description: "Test your digital illustration knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "Which software is used for vector art?", type: "multiple-choice", options: ["Photoshop", "Illustrator", "Lightroom", "Premiere"], correctAnswerIndex: 1, points: 10 },
      { question: "What does a layer mask do?", type: "multiple-choice", options: ["Adds colour", "Hides or reveals parts of a layer", "Creates text", "Adjusts brightness"], correctAnswerIndex: 1, points: 10 },
      { question: "What is the advantage of vector graphics?", type: "multiple-choice", options: ["Smaller file size", "Scalability without quality loss", "Better colour range", "Faster rendering"], correctAnswerIndex: 1, points: 10 },
      { question: "Which tool is used for digital painting?", type: "multiple-choice", options: ["Pen tool", "Brush tool", "Type tool", "Shape tool"], correctAnswerIndex: 1, points: 10 }
    ]
  },
  408: {
    courseName: "Advertising & Visual Communication",
    description: "Test your advertising knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "What is the AIDA model?", type: "multiple-choice", options: ["Attention, Interest, Desire, Action", "Art, Illustration, Design, Advertising", "Analysis, Implementation, Development, Assessment", "Appeal, Identity, Direction, Application"], correctAnswerIndex: 0, points: 10 },
      { question: "What is the target audience?", type: "multiple-choice", options: ["All consumers", "A specific group of people", "The art director", "The advertising agency"], correctAnswerIndex: 1, points: 10 },
      { question: "What is a call to action?", type: "multiple-choice", options: ["A headline", "An instruction for the audience to respond", "A logo", "A colour scheme"], correctAnswerIndex: 1, points: 10 },
      { question: "What is visual storytelling?", type: "multiple-choice", options: ["Text-only narrative", "Using visuals to tell a story", "Video production", "Storyboarding"], correctAnswerIndex: 1, points: 10 }
    ]
  },
  409: {
    courseName: "Photography Basics",
    description: "Test your photography knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "What does ISO control?", type: "multiple-choice", options: ["Aperture", "Shutter speed", "Camera sensitivity", "White balance"], correctAnswerIndex: 2, points: 10 },
      { question: "What is the rule of thirds?", type: "multiple-choice", options: ["A colour theory", "A composition guideline", "An exposure setting", "A lens type"], correctAnswerIndex: 1, points: 10 },
      { question: "Which setting controls depth of field?", type: "multiple-choice", options: ["ISO", "Shutter speed", "Aperture", "White balance"], correctAnswerIndex: 2, points: 10 },
      { question: "What is a shutter speed?", type: "multiple-choice", options: ["Length of time the sensor is exposed", "Opening size of the lens", "Number of megapixels", "ISO setting"], correctAnswerIndex: 0, points: 10 }
    ]
  },
  410: {
    courseName: "Commercial Art Project",
    description: "Test your commercial art knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "What is the first step in a design brief?", type: "multiple-choice", options: ["Sketching", "Research and client consultation", "Colour palette", "Final output"], correctAnswerIndex: 1, points: 10 },
      { question: "What is a prototype?", type: "multiple-choice", options: ["The final product", "An early sample or mock-up", "A colour swatch", "A logo"], correctAnswerIndex: 1, points: 10 },
      { question: "Why is client feedback important?", type: "multiple-choice", options: ["To increase budget", "To ensure the project meets client goals", "To delay the project", "To add more features"], correctAnswerIndex: 1, points: 10 },
      { question: "What should a design portfolio showcase?", type: "multiple-choice", options: ["Only personal work", "Best work and skills", "All projects", "Only paid work"], correctAnswerIndex: 1, points: 10 }
    ]
  },

  // ─── Digital Arts & Media (411-415) ───
  411: {
    courseName: "Digital Media Fundamentals",
    description: "Test your digital media knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "What is a digital asset?", type: "multiple-choice", options: ["A physical painting", "Any digital file", "A camera", "A print"], correctAnswerIndex: 1, points: 10 },
      { question: "Which file format is commonly used for web images?", type: "multiple-choice", options: ["TIFF", "PSD", "JPEG", "EPS"], correctAnswerIndex: 2, points: 10 },
      { question: "What is a creative suite?", type: "multiple-choice", options: ["A single application", "A collection of software", "A hardware device", "A file format"], correctAnswerIndex: 1, points: 10 },
      { question: "What is digital copyright?", type: "multiple-choice", options: ["Free use of content", "Legal protection of digital works", "File sharing", "Creative commons"], correctAnswerIndex: 1, points: 10 }
    ]
  },
  412: {
    courseName: "2D & 3D Animation",
    description: "Test your animation knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "What is frame-by-frame animation?", type: "multiple-choice", options: ["A single image", "Animation created by drawing each frame", "3D modelling", "Motion graphics"], correctAnswerIndex: 1, points: 10 },
      { question: "What does a rig do in 3D animation?", type: "multiple-choice", options: ["Creates textures", "Controls the movement of a model", "Renders the scene", "Adds sound"], correctAnswerIndex: 1, points: 10 },
      { question: "What are the 12 principles of animation?", type: "multiple-choice", options: ["Camera angles", "Animation guidelines", "Colour rules", "Sound effects"], correctAnswerIndex: 1, points: 10 },
      { question: "Which software is open-source for 3D animation?", type: "multiple-choice", options: ["Maya", "Blender", "3ds Max", "Cinema 4D"], correctAnswerIndex: 1, points: 10 }
    ]
  },
  413: {
    courseName: "Interaction Design & UX",
    description: "Test your UX knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "What is a persona in UX design?", type: "multiple-choice", options: ["A real user", "A fictional user profile", "A designer", "A developer"], correctAnswerIndex: 1, points: 10 },
      { question: "What is a wireframe?", type: "multiple-choice", options: ["A colour palette", "A low-fidelity layout", "A prototype", "A final design"], correctAnswerIndex: 1, points: 10 },
      { question: "What is usability testing?", type: "multiple-choice", options: ["Code testing", "Testing with real users", "Colour testing", "Typography testing"], correctAnswerIndex: 1, points: 10 },
      { question: "What is Figma used for?", type: "multiple-choice", options: ["Video editing", "UI/UX design", "3D modelling", "Photo editing"], correctAnswerIndex: 1, points: 10 }
    ]
  },
  414: {
    courseName: "Digital Video & Filmmaking",
    description: "Test your filmmaking knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "What is a storyboard?", type: "multiple-choice", options: ["A script", "A visual plan of the film", "A colour palette", "A sound design"], correctAnswerIndex: 1, points: 10 },
      { question: "Which software is used for video editing?", type: "multiple-choice", options: ["Photoshop", "Premiere Pro", "Illustrator", "InDesign"], correctAnswerIndex: 1, points: 10 },
      { question: "What is colour grading?", type: "multiple-choice", options: ["Colour painting", "Enhancing video colours", "Colour palette", "Colour theory"], correctAnswerIndex: 1, points: 10 },
      { question: "What is sound design?", type: "multiple-choice", options: ["Adding music", "Creating audio elements", "Recording dialogue", "Noise reduction"], correctAnswerIndex: 1, points: 10 }
    ]
  },
  415: {
    courseName: "Creative Coding & New Media",
    description: "Test your creative coding knowledge",
    timeLimit: 15, passingScore: 60,
    questions: [
      { question: "What is p5.js used for?", type: "multiple-choice", options: ["Web design", "Creative coding and art", "Mobile apps", "Backend development"], correctAnswerIndex: 1, points: 10 },
      { question: "What is generative art?", type: "multiple-choice", options: ["Art created by hand", "Art created with algorithms", "Art created by AI", "Art created by a team"], correctAnswerIndex: 1, points: 10 },
      { question: "What is an interactive installation?", type: "multiple-choice", options: ["A static artwork", "An artwork that responds to audience", "A mobile app", "A website"], correctAnswerIndex: 1, points: 10 },
      { question: "What is data visualisation?", type: "multiple-choice", options: ["Data entry", "Visual representation of data", "Data analysis", "Data storage"], correctAnswerIndex: 1, points: 10 }
    ]
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// SEED FUNCTION
// ──────────────────────────────────────────────────────────────────────────────

async function seedQuizzes() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    const connected = await connectMongoDB();
    if (!connected) {
      console.error('❌ MongoDB connection failed');
      process.exit(1);
    }
    console.log('✅ Connected to MongoDB');

    const existingCount = await Quiz.countDocuments();
    if (existingCount > 0) {
      console.log(`⚠️ ${existingCount} quizzes already exist. Clearing...`);
      await Quiz.deleteMany({});
      console.log('✅ Cleared existing quizzes');
    }

    let inserted = 0;
    const totalCourses = Object.keys(ALL_QUIZZES).length;

    for (const [courseId, quizData] of Object.entries(ALL_QUIZZES)) {
      await Quiz.create({
        courseId: parseInt(courseId),
        ...quizData
      });
      inserted++;
      console.log(`✅ Inserted quiz for Course ID: ${courseId} - ${quizData.courseName}`);
    }

    console.log(`🎉 Seeding complete! ${inserted}/${totalCourses} quizzes inserted.`);
    console.log('✅ All courses including Arts now have quizzes!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
}

seedQuizzes();