import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-xl font-bold mb-4 text-primary">VenusBooking</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Experience the divine atmosphere for your sacred events.
              We provide the perfect setting for your spiritual journey.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/" className="hover:text-primary transition">Home</a></li>
              <li><a href="/services" className="hover:text-primary transition">Services</a></li>
              <li><a href="/booking" className="hover:text-primary transition">Book Now</a></li>
            </ul>
          </div>

          <div>
             <h3 className="text-lg font-semibold mb-4 text-white">Support</h3>
             <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/contact" className="hover:text-primary transition">Contact Us</a></li>
              <li><a href="/legal" className="hover:text-primary transition">Terms & Privacy</a></li>
              <li><a href="/legal" className="hover:text-primary transition">Cancellation Policy</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Reach Us</h3>
            <p className="text-gray-400 text-sm mb-2">108 Spiritual Path, Temple City</p>
            <p className="text-gray-400 text-sm mb-2">+91 98765 43210</p>
            <p className="text-gray-400 text-sm">contact@venusbooking.com</p>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} VenusBooking. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
