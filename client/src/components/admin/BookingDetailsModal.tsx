import React from 'react';
import { format } from 'date-fns';
import { X, Calendar, Clock, User, Phone, MapPin, Utensils, Box } from 'lucide-react';

interface BookingDetailsModalProps {
  booking: any;
  onClose: () => void;
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({ booking, onClose }) => {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Booking Details</h2>
            <p className="text-sm text-gray-500">ID: {booking._id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition">
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

          {/* Status Badge */}
          <div className="flex justify-between items-center">
             <span className={`px-3 py-1 rounded-full text-sm font-semibold
                ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                {booking.status.toUpperCase()}
             </span>
             <span className="text-lg font-bold text-primary">${booking.totalAmount}</span>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* User Info */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 border-b pb-1">User Information</h3>
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-2" /> {booking.user?.name || 'N/A'}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2" /> {booking.user?.mobile}
              </div>
              {booking.secondaryPhone && (
                 <div className="flex items-center text-sm text-gray-600 ml-6">
                   Alt: {booking.secondaryPhone}
                 </div>
              )}
              {booking.address && (
                <div className="flex items-start text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 mt-1" /> {booking.address}
                </div>
              )}
            </div>

            {/* Event Info */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 border-b pb-1">Event Details</h3>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" /> {format(new Date(booking.date), 'dd MMMM yyyy')}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-2" /> {booking.timeSlot}
              </div>
              <div className="text-sm text-gray-600 ml-6">
                Type: <span className="font-medium">{booking.eventType}</span>
              </div>
              <div className="text-sm text-gray-600 ml-6">
                Attendees: {booking.attendees}
              </div>
            </div>

            {/* Requirements */}
            <div className="space-y-3 md:col-span-2">
              <h3 className="font-semibold text-gray-900 border-b pb-1">Special Requirements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                   <div className="flex items-center mb-1 text-gray-700 font-medium">
                     <Utensils className="h-4 w-4 mr-2" /> Food Arrangement
                   </div>
                   <p className="text-sm text-gray-600 ml-6">{booking.foodNeeded === 'Yes' ? 'Venue Catering Required' : 'Self Arrangement'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                   <div className="flex items-center mb-1 text-gray-700 font-medium">
                     <Box className="h-4 w-4 mr-2" /> Extra Items
                   </div>
                   <p className="text-sm text-gray-600 ml-6">{booking.extraItems || 'None'}</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default BookingDetailsModal;
