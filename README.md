# Announcements & Quizzes Dashboard Backend

A full-stack educational platform for managing announcements and quizzes, built with Node.js, Express, and MongoDB.

## Features

- **User Authentication**

  - JWT-based authentication
  - Secure password hashing with bcrypt
  - Token blacklisting for enhanced security

- **Announcements & Quizzes Module**

  - CRUD operations for announcements & quizzes
  - Soft delete functionality
  - track announcement & quiz creators and timestamps

- **API Features**
  - RESTful API endpoints
  - Request validation (joi)
  - Rate limiting (express-rate-limit)
  - Error handling middleware
  - Environment variables (dotenv)
  - security headers (helmet)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud instance)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Abdelrahman678/Announcements-Quizzes-Backend.git
   cd Announcements-Quizzes-Dashboard-Backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=90d
   JWT_COOKIE_EXPIRES_IN=90
   NODE_ENV=development
   ```

## Running the Application

### Development Mode

```bash
npm run start:dev
```

### Production Mode

```bash
npm start
```

## API Endpoints

### Authentication

- `POST /auth/sign-up` - Register a new user
- `POST /auth/sign-in` - Login user
- `POST /auth/sign-out` - Logout user

### Announcements

- `GET /announcement/get-all-announcements` - Get all announcements
- `GET /announcement/get-announcement/:id` - Get announcement by ID
- `POST /announcement/create-announcement` - Create a new announcement
- `PUT /announcement/update-announcement/:id` - Update an announcement
- `DELETE /announcement/delete-announcement/:id` - Delete an announcement

### Quizzes

- `GET /quiz/get-all-quizzes` - Get all quizzes
- `GET /quiz/get-quiz/:id` - Get quiz by ID
- `POST /quiz/create-quiz` - Create a new quiz
- `PUT /quiz/update-quiz/:id` - Update a quiz
- `DELETE /quiz/delete-quiz/:id` - Delete a quiz

## Environment Variables

- `PORT` - Server port (default: 3000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT token generation
- `JWT_EXPIRES_IN` - JWT expiration time
- `JWT_COOKIE_EXPIRES_IN` - Cookie expiration time in days
- `NODE_ENV` - Application environment (development/production)

## Technologies Used

- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Validation**: Joi
- **Security**: Helmet, Express Rate Limit
- **Environment**: dotenv

## Project Structure

```
src/
├── Constants/          # Constants
├── DB/                 # Database
│   ├── models/         # Database models
│   └── connection.js   # Database connection
├── Middlewares/        # Middlewares
├── Modules/            # Modules
│   ├── Auth/           # Authentication module
│   ├── Announcement/   # Announcement module
│   └── Quiz/           # Quiz module
├── Utils/              # Utility functions
├── Validators/         # Request validation schemas
└── main.js             # Application entry point
```
