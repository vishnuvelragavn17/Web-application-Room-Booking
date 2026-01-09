import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ];

  if (user?.role === 'admin') {
    navLinks.push({ name: 'Admin Dashboard', path: '/admin' });
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <Calendar className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-bold text-gray-900">VenusBooking</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-4 items-center">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                {link.name}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                {user?.role !== 'admin' && (
                  <Link to="/booking" className="bg-primary text-white hover:bg-primaryDark px-4 py-2 rounded-full text-sm font-medium shadow-md transition">Book Now</Link>
                )}
                <Link to="/profile" className="flex items-center text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                  <User className="h-4 w-4 mr-1" /> Profile
                </Link>
                <button onClick={handleLogout} className="flex items-center text-red-600 hover:text-red-800 px-3 py-2 rounded-md text-sm font-medium">
                  <LogOut className="h-4 w-4 mr-1" />
                </button>
              </>
            ) : (
              <>
                 <Link to="/login" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Login</Link>
                 <Link to="/signup" className="bg-primary text-white hover:bg-primaryDark px-4 py-2 rounded-full text-sm font-medium shadow-md transition">Sign Up</Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 hover:text-primary p-2">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             {navLinks.map((link) => (
              <Link key={link.name} to={link.path} onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-orange-50">
                {link.name}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                {user?.role !== 'admin' && (
                  <Link to="/booking" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-orange-50">Book Now</Link>
                )}
                <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-orange-50">My Profile</Link>
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-orange-50">Login</Link>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-orange-50">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
