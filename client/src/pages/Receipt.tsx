import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Download, Home } from 'lucide-react';
import { format } from 'date-fns';

const Receipt: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  if (!booking) {
    return <div className="text-center py-20">No receipt found. <button onClick={() => navigate('/')} className="text-primary underline">Go Home</button></div>;
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl border-t-8 border-primary print:shadow-none print:border-none">

        {/* Header */}
        <div className="text-center mb-8 border-b pb-6">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Booking Confirmed</h1>
          <p className="text-gray-500 mt-2">Thank you for choosing VenusBooking</p>
          <p className="text-sm text-gray-400 mt-1">Transaction ID: {booking._id}</p>
        </div>

        {/* Details */}
        <div className="space-y-4 mb-8">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Event Type</span>
            <span className="font-semibold text-gray-900">{booking.eventType}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Date</span>
            <span className="font-semibold text-gray-900">{format(new Date(booking.date), 'dd MMMM yyyy')}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Time Slot</span>
            <span className="font-semibold text-gray-900">{booking.timeSlot}</span>
          </div>
           <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Food Arrangement</span>
            <span className="font-semibold text-gray-900">{booking.foodNeeded}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Attendees</span>
            <span className="font-semibold text-gray-900">{booking.attendees}</span>
          </div>

          <div className="mt-6 bg-orange-50 p-4 rounded-lg">
             <div className="flex justify-between mb-2">
                <span className="text-gray-700">Total Amount</span>
                <span className="font-bold">${booking.totalAmount}</span>
             </div>
             <div className="flex justify-between">
                <span className="text-primary font-bold">Advance Paid</span>
                <span className="text-primary font-bold">${booking.advancePaid}</span>
             </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition"
          >
            <Download className="h-5 w-5 mr-2" /> Print E-Receipt
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 flex items-center justify-center border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition"
          >
            <Home className="h-5 w-5 mr-2" /> Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
