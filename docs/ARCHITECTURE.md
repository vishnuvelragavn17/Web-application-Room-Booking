# Architecture Document: Room-Booking Web Application

## 1. High-Level Architecture

The application follows a standard **MERN Stack** (MongoDB, Express.js, React, Node.js) architecture.

```mermaid
graph TD
    Client[React Client (Mobile First)] <-->|REST API| Server[Express Server]
    Server <-->|Mongoose| DB[(MongoDB)]
    Server -->|Mock| PaymentGateway[Payment Gateway]
    Server -->|Mock| NotificationService[SMS/Email Service]
```

### Components:
- **Client**: Single Page Application (SPA) built with React + Vite + TypeScript. Handles UI, State, and API calls.
- **Server**: RESTful API built with Node.js and Express. Handles business logic, authentication, and DB interactions.
- **Database**: MongoDB. Stores Users, Bookings, Logs.

## 2. Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State/Data**: React Hooks + Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database ODM**: Mongoose
- **Authentication**: JWT (JSON Web Token) + bcryptjs
- **Validation**: Joi or manual validation

## 3. Directory Structure

```
/
├── client/                 # Frontend Application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page views (Home, Booking, Login)
│   │   ├── context/        # React Context (Auth, etc.)
│   │   ├── api/            # Axios setup & API calls
│   │   └── App.tsx         # Root component
│
├── server/                 # Backend Application
│   ├── models/             # Mongoose Schemas
│   ├── routes/             # API Routes
│   ├── controllers/        # Request Handlers
│   ├── middleware/         # Auth & Error Middleware
│   └── app.js              # Express App Setup
│
└── docs/                   # Documentation
```

## 4. Database Schema Design

### Users Collection
Stores user profile and authentication data.
- `_id`: ObjectId
- `name`: String
- `mobile`: String (Unique, Indexed)
- `dob`: String (Hashed - used as password)
- `address`: String
- `city`: String
- `state`: String
- `pinCode`: String
- `altMobile`: String
- `createdAt`: Date

### Bookings Collection
Stores booking details.
- `_id`: ObjectId
- `user`: ObjectId (Ref: User)
- `date`: Date (ISO format, time normalized to 00:00:00 for query)
- `timeSlot`: String (e.g., "10:00-11:00")
- `eventType`: String
- `attendees`: Number
- `status`: String (Enum: "confirmed", "cancelled", "completed")
- `paymentStatus`: String (Enum: "pending", "paid", "refunded")
- `amount`: Number
- `advancePaid`: Number
- `createdAt`: Date

### Payments Collection
Stores transaction logs.
- `_id`: ObjectId
- `booking`: ObjectId (Ref: Booking)
- `user`: ObjectId (Ref: User)
- `amount`: Number
- `type`: String (Enum: "advance", "refund", "settlement")
- `transactionId`: String (Mock)
- `status`: String
- `timestamp`: Date
