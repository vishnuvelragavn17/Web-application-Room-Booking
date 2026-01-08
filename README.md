# Room Booking Web Application

## Overview
A production-ready Room-Booking Web Application built with the MERN stack (MongoDB, Express, React, Node.js).
This application allows users to register, login using their mobile and DOB, view venue availability, and book slots.

## Prerequisites
- Node.js (v14+)
- MongoDB (Running locally or Atlas URI)

## Installation

1. **Clone the repository**

2. **Backend Setup**
   ```bash
   cd server
   npm install
   # Create a .env file if needed (defaults provided in code)
   # PORT=5000
   # MONGO_URI=mongodb://localhost:27017/room_booking
   # JWT_SECRET=your_secret
   npm run dev
   ```

   > **Note:** This application uses MongoDB Transactions. Ensure your MongoDB instance is running as a **Replica Set** (even a single-node replica set) for booking features to work correctly.

3. **Frontend Setup**
   ```bash
   cd client
   npm install
   npm run dev
   ```

4. **Access the App**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

## Features
- **Authentication**: Mobile + OTP (Mock) & Mobile + DOB Login.
- **Booking**: Real-time availability check, Double booking prevention.
- **Profile**: View booking history, Cancel bookings.
- **Payment**: Mock payment integration for advance payments.

## Architecture
See `docs/ARCHITECTURE.md` for detailed diagrams and schema explanations.
See `docs/USE_CASES.md` for user flows.
