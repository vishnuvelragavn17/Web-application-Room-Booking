import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, User, LogOut } from 'lucide-react';

const Header: React.FC = () => {
  const navigate = useNavigate();
  // Mock Auth check (Replace with Context later)
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <Calendar className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">VenusBooking</span>
          </div>
          <nav className="flex space-x-4">
            {token ? (
              <>
                <Link to="/booking" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Book Now</Link>
                <Link to="/profile" className="flex items-center text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  <User className="h-4 w-4 mr-1" /> Profile
                </Link>
                <button onClick={handleLogout} className="flex items-center text-red-600 hover:text-red-800 px-3 py-2 rounded-md text-sm font-medium">
                  <LogOut className="h-4 w-4 mr-1" /> Logout
                </button>
              </>
            ) : (
              <>
                 <Link to="/login" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Login</Link>
                 <Link to="/signup" className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium">Sign Up</Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
