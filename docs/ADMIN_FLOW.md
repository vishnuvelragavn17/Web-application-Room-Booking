# Admin Flow & Access Guide

## 1. Overview
The Admin features in VenusBooking are secured by role-based access control (RBAC). A user must have the `role` set to `'admin'` in the database to access these features.

## 2. Accessing the Admin Dashboard

### Pre-requisites
- You must have an Admin account.
- **Default Admin Credentials** (if seeded):
  - **Mobile:** `9999999999`
  - **Password (DOB):** `2000-01-01`

### Steps
1.  **Login:** Go to `/login` and enter the Admin credentials.
2.  **Navigation:**
    - Upon successful login, the system detects the `admin` role.
    - A new link **"Admin Dashboard"** appears in the top navigation bar.
    - Click it to navigate to `/admin`.
3.  **Direct Access:** You can also type `/admin` in the URL bar. If you are logged in as an admin, you will be granted access. Non-admins are redirected to Home.

## 3. Creating a New Admin
Since there is no public "Sign Up as Admin" page for security reasons, new admins must be created via the backend or database.

### Method A: Seeder Script
Run the following command in the `server/` directory:
```bash
node utils/seeder.js
```
This creates the default super admin user.

### Method B: Manual Database Update
1.  Register a new user via the standard Signup page.
2.  Access your MongoDB database (e.g., via Compass or Shell).
3.  Find the user in the `users` collection.
4.  Update the `role` field from `'user'` to `'admin'`.

## 4. Admin Features
- **Stats Overview:** View total revenue, bookings, and upcoming events.
- **Manage Bookings:**
    - View all bookings from all users.
    - **Mark Complete:** Set status to completed.
    - **Cancel:** Force cancel a booking (refunds are logged).
- **Block Dates:** Select a date to block it from public availability (useful for maintenance).
