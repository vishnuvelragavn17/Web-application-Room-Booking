import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CheckCircle, Shield, Clock } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative bg-indigo-700 rounded-2xl overflow-hidden shadow-xl text-white py-20 px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">Book Your Perfect Venue</h1>
        <p className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-2xl mx-auto">
          Experience seamless booking for events, meetings, and celebrations at Venus Venue.
        </p>
        <Link to="/booking">
          <button className="bg-white text-indigo-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-full shadow-lg transition transform hover:scale-105">
            Book Now
          </button>
        </Link>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
          <div className="flex justify-center mb-4"><CheckCircle className="h-10 w-10 text-green-500" /></div>
          <h3 className="text-xl font-semibold mb-2">Instant Confirmation</h3>
          <p className="text-gray-600">Real-time availability check and instant booking confirmation.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
          <div className="flex justify-center mb-4"><Shield className="h-10 w-10 text-blue-500" /></div>
          <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
          <p className="text-gray-600">Your advance payments are processed securely. Refund guarantee.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
          <div className="flex justify-center mb-4"><Clock className="h-10 w-10 text-purple-500" /></div>
          <h3 className="text-xl font-semibold mb-2">Smart Reminders</h3>
          <p className="text-gray-600">Get notified before your event. Never miss a schedule.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
