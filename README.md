# Production-Ready User Management System (MERN Stack)

A secure and responsive User Management System featuring JWT authentication, role-based authorization, CRUD capabilities, a visualization statistics dashboard, sorting, paginated search tables, and customizable light/dark styling.

## Technologies Used

* **Frontend**: React.js, React Router v6, Axios, Context API, Vanilla CSS (Variables and Themes)
* **Backend**: Node.js, Express.js, JWT, bcryptjs, express-rate-limit, validator
* **Database**: MongoDB & Mongoose ORM

---

## Folder Structure

```
usermanagment/
 ├── client/               # Vite React App
 │    ├── src/
 │    │    ├── components/ # ProtectedRoute, Sidebar, Navbar, Modal
 │    │    ├── context/    # Auth, Theme, Toast Context Providers
 │    │    ├── pages/      # Login, Register, Dashboard, Users, Profile, etc.
 │    │    └── services/   # Axios configuration
 └── server/               # Express API App
      ├── config/          # DB connections
      ├── controllers/     # Auth, User operations & stats
      ├── middleware/      # Auth, authorization, validations, errors
      ├── models/          # User Schema
      ├── routes/          # Express Routers
      └── seed.js          # Mock data populator
```

---

## Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (version 18+) and [MongoDB](https://www.mongodb.com/) running locally on your system.

### Step 1: Database Seeding
To populate your local MongoDB instance with test accounts for each role and department:

1. Open a terminal and navigate to the `server` folder:
   ```bash
   cd server
   ```
2. Install server dependencies:
   ```bash
   npm install
   ```
3. Run the database seed script:
   ```bash
   npm run seed
   ```
   *This clears existing users and inserts 10 sample user records (including admins, managers, and engineers) with Dicebear avatars.*

### Step 2: Start the Backend Server
From the `server` directory, run:
```bash
npm run dev
```
The backend server starts on [http://localhost:5000](http://localhost:5000).

### Step 3: Start the Frontend React App
1. Open a new terminal window and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install client dependencies:
   ```bash
   npm install
   ```
3. Run the React development server:
   ```bash
   npm run dev
   ```
The client dashboard opens on [http://localhost:5173](http://localhost:5173).

---

## Default Accounts for Testing

Use the credentials below to log in and inspect the access scopes:

| Name | Email Address | Password | Role | Department | Access Privilege |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **System Admin** | `admin@admin.com` | `admin123` | **Admin** | Management | Full control (view, edit, delete, create anyone) |
| **Sarah Connor** | `manager.eng@admin.com` | `manager123` | **Manager** | Engineering | Can view all, edit **only** users in Engineering. Cannot delete users or create users. |
| **Alice Smith** | `alice@admin.com` | `user123` | **User** | Engineering | View/edit **only** own profile page. Cannot access user list or dashboard. |
| **George Costanza** | `george@admin.com` | `user123` | **User** | Finance | *Inactive status* (Blocked from logging in) |

---

## Main Features & Details

### 1. Role-Based Access Control (RBAC)
* **Admins**: Have full management permissions across the platform.
* **Managers**: Granted department-level read and update permissions. A manager can view the list of users, but can edit users only if they are in the same department (e.g. `Engineering`).
* **Users**: Can review and edit their own username, email, phone number, and password, but have no permission to view the global user directory or access dashboard metrics.

### 2. Password Recovery (Forgot/Reset Password)
* When you submit a request at `/forgot-password`, a password reset token is generated.
* For easy testing on developer environments, the reset link is **printed to the Node console** and **displayed directly as a clickable link** on the success webpage.
* If you configure the SMTP details in `server/.env`, it will send a real email using Nodemailer.

### 3. Appearance Modes (Light / Dark)
The application includes a global theme toggle in the header navbar and settings pane, persisting settings to `localStorage` and applying colors dynamically via standard CSS variables.

### 4. Input Validations & Security
* Hashed passwords utilizing `bcryptjs` encryption.
* Restrictive route controllers utilizing JWT token validators.
* Session timeouts for deactivated or deleted accounts.
* API rate limiter preventing database flooding.
