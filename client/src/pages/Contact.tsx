import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-center text-primaryDark mb-12">Contact Us</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
          <div className="space-y-6">
            <div className="flex items-start">
              <MapPin className="h-6 w-6 text-primary mt-1" />
              <div className="ml-4">
                <h3 className="font-medium text-gray-900">Address</h3>
                <p className="text-gray-600">108 Spiritual Path, Temple City,<br />Divine State, 500001</p>
              </div>
            </div>
            <div className="flex items-center">
              <Phone className="h-6 w-6 text-primary" />
              <div className="ml-4">
                <h3 className="font-medium text-gray-900">Phone</h3>
                <p className="text-gray-600">+91 98765 43210</p>
              </div>
            </div>
            <div className="flex items-center">
              <Mail className="h-6 w-6 text-primary" />
              <div className="ml-4">
                <h3 className="font-medium text-gray-900">Email</h3>
                <p className="text-gray-600">contact@venusbooking.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="bg-gray-200 rounded-xl overflow-hidden h-96 lg:h-auto shadow-md">
           <iframe
             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.2233913121413!2d77.4051603706222!3d23.25057129852277!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c42e4392978d3%3A0xdb6104d57e84180e!2sBhopal%20Junction%20railway%20station!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
             width="100%"
             height="100%"
             style={{ border: 0 }}
             allowFullScreen
             loading="lazy"
             referrerPolicy="no-referrer-when-downgrade"
             title="Venue Location"
           ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
