# Student Task Management System

This is a full-stack task management web application designed for students. It allows users to register, log in, create tasks, and manage them with priority, due date, status tracking, search, and filter options.

## Project Structure

The project is split into two main folders:
- `backend/`: Express.js API server handling authentication and task data.
- `frontend/`: React single-page application built using Vite and Styled with Vanilla CSS (Airbnb styling inspired).

## Tech Stack

- **Frontend**: React (Vite), React Router, Context API, Vanilla CSS.
- **Backend**: Node.js, Express.js, JWT, bcryptjs.
- **Database**: MongoDB (Mongoose) - *Swapped dynamically during execution*.

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Running the Backend

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` (or use default development secrets).
4. Start the development server:
   ```bash
   npm run dev
   ```

The backend server runs on `http://localhost:5000`.

### Running the Frontend

*(Instructions will be added when frontend is scaffolded)*
