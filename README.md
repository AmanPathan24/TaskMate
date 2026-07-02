# TaskMate

This is a full-stack student task management web application. It allows users to register, log in, create tasks, and manage them with priority, due date, status tracking, search, and filter options. It features a premium, responsive glassmorphic design supporting light/dark theme shifts.

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
