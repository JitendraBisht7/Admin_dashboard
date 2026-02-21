# Teacher Insights Dashboard

A MERN stack dashboard for principals to monitor teacher performance, showing lessons, quizzes, and assessments created by teachers with weekly activity trends.

## Features

- **View total lessons, quizzes, and assessments** created per teacher
- **Weekly activity trends** using interactive line charts
- **Filter and view per-teacher analysis** using a teacher selector dropdown
- **Per-teacher comparison** using stacked bar charts
- **Attractive dark-themed admin UI** designed for principals

## Tech Stack

- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Frontend**: React, Vite, Recharts
- **Database**: MongoDB

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or connection string)
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd client
npm install
```

### 2. Configure MongoDB

The app uses MongoDB with the database name `teacher_insights`. 

**Option A: MongoDB Atlas (Recommended)**

1. Create a MongoDB Atlas account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create a database user and get your connection string
4. Add your IP address to the IP Access List (or use `0.0.0.0/0` for all IPs)
5. Create a `.env` file in the `server` directory:
```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/teacher_insights?retryWrites=true&w=majority
```
6. Replace `<username>`, `<password>`, and `<cluster>` with your actual values

**Option B: Local MongoDB**
- Make sure MongoDB is running locally on `mongodb://127.0.0.1:27017`
- Create a `.env` file in the `server` directory:
```env
MONGO_URI=mongodb://127.0.0.1:27017/teacher_insights
```

### 3. Seed the Database

After configuring MongoDB, seed the database with sample data:

```bash
cd server
npm run seed
```

This will insert 40 sample activities into your `activities` collection. The script will skip seeding if data already exists.

**Note:** See `server/.env.example` for connection string examples.

### 4. Run the Application

**Start the backend server:**
```bash
cd server
npm run dev
```
The server will start on `http://localhost:5000`

**Start the frontend (in a new terminal):**
```bash
cd client
npm run dev
```
The frontend will start on `http://localhost:5173` (or similar)

### 5. Access the Dashboard

Open your browser and navigate to `http://localhost:5173`

## Data Structure

The application uses an `activities` collection with the following schema:
- `Teacher_id`: Unique teacher identifier (e.g., "T001")
- `Teacher_name`: Full name of the teacher
- `Grade`: Grade level (6-10)
- `Subject`: Subject taught (Mathematics, Science, English, Social Studies)
- `Activity_type`: Type of activity ("Lesson Plan", "Quiz", "Question Paper")
- `Created_at`: Timestamp when the activity was created

**Activity Type Mapping:**
- "Lesson Plan" → Lessons
- "Quiz" → Quizzes  
- "Question Paper" → Assessments

## API Endpoints

See [server/API.md](server/API.md) for complete API documentation.

**Main Endpoints:**
- `GET /` - Health check
- `GET /api/teachers` - List all teachers with aggregated statistics
- `GET /api/teachers/:id` - Get specific teacher details by Teacher_id
- `GET /api/analytics/weekly-summary` - Get weekly activity summary across all teachers
- `GET /api/analytics/daily-activity` - Get daily activity for current week
- `GET /api/analytics/insights?period=week|month|year` - Get insights summary
- `GET /api/analytics/ai-pulse` - Get AI-generated insights

## Project Structure

```
Admin Dashboard/
├── server/
│   ├── index.js              # Express server entry point
│   ├── seed.js               # Database seeding script
│   ├── seed-data.json        # Sample data for seeding
│   ├── API.md                # Complete API documentation
│   ├── .env.example          # Environment variables example
│   ├── models/               # Database models (MVC - Model)
│   │   └── Activity.js       # Activity model schema
│   ├── controllers/          # Request handlers (MVC - Controller)
│   │   ├── teacherController.js
│   │   └── analyticsController.js
│   ├── services/             # Business logic layer
│   │   ├── teacherService.js
│   │   └── analyticsService.js
│   ├── routes/               # Route definitions (MVC - Routes)
│   │   ├── index.js          # Main routes file
│   │   ├── teacherRoutes.js
│   │   └── analyticsRoutes.js
│   ├── utils/                # Utility functions
│   │   └── dateHelpers.js    # Date manipulation helpers
│   └── package.json
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   └── Dashboard.jsx  # Main dashboard component
│   │   ├── main.jsx            # React entry point
│   │   └── styles.css          # Dashboard styles
│   ├── index.html
│   ├── vite.config.mjs
│   └── package.json
└── README.md
```

## Architecture

This project follows the **MVC (Model-View-Controller)** architecture pattern:

- **Models** (`server/models/`): Define database schemas and data structures
- **Controllers** (`server/controllers/`): Handle HTTP requests and responses
- **Services** (`server/services/`): Contain business logic and data processing
- **Routes** (`server/routes/`): Define API endpoints and map them to controllers
- **Utils** (`server/utils/`): Reusable utility functions

## Notes

- **Data seeding:** Run `npm run seed` in the `server` directory to populate sample data
- Weekly activity is calculated by grouping activities by week start (Monday)
- Daily activity shows the current week (Sunday to Saturday)
- The dashboard supports filtering by individual teachers or viewing all teachers combined
- All data is aggregated dynamically from the `activities` collection in MongoDB
- The seed script (`server/seed.js`) can be run multiple times safely (skips if data exists)
