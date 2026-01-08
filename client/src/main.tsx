import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Profile from './pages/Profile';
import BookingPage from './pages/BookingPage';
import Receipt from './pages/Receipt';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Legal from './pages/Legal';
import BookingHistory from './pages/BookingHistory';
import AdminDashboard from './pages/admin/AdminDashboard';
import './index.css';

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/legal" element={<Legal />} />

          {/* Protected Routes */}
          <Route path="/receipt" element={
            <ProtectedRoute>
              <Receipt />
            </ProtectedRoute>
          } />
          <Route path="/history" element={
            <ProtectedRoute>
              <BookingHistory />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/booking" element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          } />
        </Routes>
      </Layout>
    </BrowserRouter>
  </React.StrictMode>,
)
