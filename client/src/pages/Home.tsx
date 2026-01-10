import React from 'react';
import { Link } from 'react-router-dom';
// import { Calendar, CheckCircle, Shield, Clock } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section - Full Screen */}
      <section
        className="relative h-screen w-full flex items-center justify-center text-center bg-cover bg-center -mt-8 -mx-4 sm:-mx-6 lg:-mx-8 mb-12"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://images.unsplash.com/photo-1604085608027-e816a67a0a63?q=80&w=1920&auto=format&fit=crop")'
        }}
      >
        <div className="max-w-4xl px-4 text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Divine Moments, <br/> Perfect Venue
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light text-gray-200">
            Host your spiritual events, weddings, and ceremonies in an ambiance of peace and devotion.
          </p>
          <Link to="/booking">
            <button className="bg-primary hover:bg-primaryDark text-white text-lg font-bold py-4 px-10 rounded-full shadow-2xl transition transform hover:scale-105">
              Book Your Slot
            </button>
          </Link>
        </div>
      </section>

      {/* Venue Gallery Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-primaryDark mb-8">The Divine Venue</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative h-64 rounded-xl overflow-hidden shadow-lg group">
             <img src="https://images.unsplash.com/photo-1544211155-738b555894b9?q=80&w=800" alt="Main Hall" className="w-full h-full object-cover transition transform group-hover:scale-110" />
             <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end p-4">
                <span className="text-white font-semibold text-lg">Main Prayer Hall</span>
             </div>
          </div>
          <div className="relative h-64 rounded-xl overflow-hidden shadow-lg group">
             <img src="https://images.unsplash.com/photo-1519225427186-1db338fa892d?q=80&w=800" alt="Dining Area" className="w-full h-full object-cover transition transform group-hover:scale-110" />
             <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end p-4">
                <span className="text-white font-semibold text-lg">Community Dining</span>
             </div>
          </div>
          <div className="relative h-64 rounded-xl overflow-hidden shadow-lg group">
             <img src="https://images.unsplash.com/photo-1561582294-825539d042f9?q=80&w=800" alt="Garden" className="w-full h-full object-cover transition transform group-hover:scale-110" />
             <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end p-4">
                <span className="text-white font-semibold text-lg">Serene Gardens</span>
             </div>
          </div>
        </div>
      </section>

      {/* Features */}
      {/* <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-md border-t-4 border-primary text-center">
            <div className="flex justify-center mb-4"><CheckCircle className="h-10 w-10 text-secondary" /></div>
            <h3 className="text-xl font-semibold mb-2">Instant Confirmation</h3>
            <p className="text-gray-600">Check real-time availability for auspicious dates and book instantly.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md border-t-4 border-primary text-center">
            <div className="flex justify-center mb-4"><Shield className="h-10 w-10 text-secondary" /></div>
            <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
            <p className="text-gray-600">Transparent pricing with secure advance payment processing.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md border-t-4 border-primary text-center">
            <div className="flex justify-center mb-4"><Clock className="h-10 w-10 text-secondary" /></div>
            <h3 className="text-xl font-semibold mb-2">Ritual Reminders</h3>
            <p className="text-gray-600">Receive timely notifications so you never miss a preparation step.</p>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default Home;
