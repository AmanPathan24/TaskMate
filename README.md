# TaskMate

This is a full-stack student task management web application. It allows users to register, log in, create tasks, and manage them with priority, due date, status tracking, search, and filter options. It features a premium, responsive glassmorphic design supporting light/dark theme shifts.

### 🌐 Live Demo: [https://task-mate-self-rho.vercel.app](https://task-mate-self-rho.vercel.app)

---

## Tech Stack

- **Frontend**: React (Vite), React Router, Context API, Vanilla CSS.
- **Backend**: Node.js, Express.js, JWT, bcryptjs, Multer.
- **Database & Cloud**: MongoDB Atlas (Mongoose), Cloudinary (Profile Photo uploads).

---

## Project Structure

- `backend/`: Express.js API server handling database operations and uploads.
- `frontend/`: React single-page application styled using custom CSS and assets.

---

## Environment Variables Configuration

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
JWT_SECRET=your_jwt_secret_here
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/taskmate?retryWrites=true&w=majority
CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_KEY_SECRET=your_cloudinary_api_secret
```

### 1. MongoDB Atlas Setup (How to get MONGO_URI)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign in.
2. Build a free shared cluster.
3. Go to **Database Access** in the left sidebar: Create a database user (e.g. name `amanap`) with a secure password (e.g. `FSgvh4WkZ6TBeqgg`).
4. Go to **Network Access** in the left sidebar: Click **Add IP Address** and select **Allow Access From Anywhere** (IP `0.0.0.0/0`) so Render and local hosts can connect.
5. Go to **Database** (clusters page): Click **Connect** next to your cluster.
6. Select **Drivers** and copy the connection string.
7. Append `/taskmate` before the `?` query parameter to name your database (e.g. `mongodb+srv://amanap:FSgvh4WkZ6TBeqgg@cluster0.niaxfsm.mongodb.net/taskmate?appName=Cluster0`).

### 2. Cloudinary Setup (How to get Cloudinary Variables)
1. Go to [Cloudinary](https://cloudinary.com/) and register a free account.
2. Open your **Cloudinary Dashboard**.
3. Under the **Product Environment Settings** section, copy the following values:
   - **Cloud Name** -> set as `CLOUD_NAME`
   - **API Key** -> set as `CLOUDINARY_API_KEY`
   - **API Secret** -> set as `CLOUDINARY_API_KEY_SECRET`

---

## Getting Started

### 1. Run the Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server using Nodemon:
   ```bash
   npm run dev
   ```

The backend server runs on `http://localhost:5000`.

### 2. Run the Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```

The frontend application runs on `http://localhost:5173`.

---

## About the Project & Evaluation Justification

**TaskMate** is designed specifically to meet the high standards of a production-level Full-Stack Developer Machine Test. Below is an exhaustive summary of the technical specifications, project requirements, and their justifications.

### 📋 Checklist & Implementation Justification

| Category | Requirement / Feature | Status | Implementation Justification |
| :--- | :--- | :---: | :--- |
| **Frontend** | Student Registration & Log In | `Done` | Built using interactive forms in React with complete validation rules. Password requires a minimum of 6 characters. |
| | Responsive Layout | `Done` | Beautiful glassmorphic UI utilizing translucent layers (`rgba`) and `backdrop-filter: blur(20px)` so custom light/dark backgrounds glow through. Fully responsive across mobiles, tablets, and desktops. |
| | Task CRUD Operations | `Done` | Form modals allow student users to create, view, update status (Pending / In Progress / Completed), modify priorities, edit titles/descriptions, and delete study tasks. |
| | Fully-Integrated Search Pill | `Done` | Migrated dashboard search & filters into an active top navigation search pill. Synced search, priority, status, and sort filters with the URL query parameters using `useSearchParams`. |
| **Backend** | JWT Student Authentication | `Done` | Validates credentials during login and register events, cryptographically signing JSON Web Tokens with a 24-hour expiration. |
| | Task API Endpoints | `Done` | Fully protected routes (`/api/tasks`) implementing GET, POST, PUT, and DELETE operations, secured by custom token-verification middleware. |
| | Multi-criteria Filtering & Sorting | `[x]` | Backend parses regex queries for search terms, strictly matches status/priority categories, and dynamically builds Mongoose sort options. |
| **Database** | MongoDB Atlas Integration | `[x]` | Configured a Mongoose schema structure. Establishes clean relational references connecting individual tasks to user collections using `userId`. |
| **Bonus** | Dark/Light Mode Shift | `[x]` | Implemented CSS custom variables and theme context. Integrates smooth visual transitions and toggles between user background assets (`Light_bg.png` and `Dark_bg.png`). |
| | Serverless Vercel Deployment | `[x]` | Configured `backend/vercel.json` and server exports so both services deploy seamlessly on Vercel's cloud infrastructure. |
| | Cloudinary Photo Uploads | `[x]` | Wire profile picture uploads through Multer directly into a custom Cloudinary folder (`TaskMate_Profile_Pics`), storing remote secure URLs on Atlas. |
| | Task Pagination | `[x]` | Limits task grids to 6 items per page. The backend runs count calculations and `skip`/`limit` offsets, rendering interactive circle pagination buttons on the frontend. |
| **Git** | Structured Commits | `[x]` | Initialized repository, managed `.gitignore` parameters (filtering environment variables and documents), and executed clean, descriptive commit cycles. |
