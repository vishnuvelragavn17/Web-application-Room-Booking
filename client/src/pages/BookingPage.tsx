import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [slots, setSlots] = useState<{ slot: string; isAvailable: boolean }[]>([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  // Form Data
  const [eventType, setEventType] = useState('');
  const [attendees, setAttendees] = useState('');
  const [needHelper, setNeedHelper] = useState(false);

  // Fetch slots when date changes
  useEffect(() => {
    if (date) {
      fetchSlots();
    }
  }, [date]);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/bookings/availability?date=${date}`);
      setSlots(res.data);
    } catch (error) {
      toast.error('Could not fetch slots');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    if (!selectedSlot) return toast.error('Please select a time slot');
    setStep(2);
  };

  const handlePaymentAndConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to book');
        navigate('/login');
        return;
      }

      // Mock Payment Logic
      const amount = 5000; // Fixed price example
      const advancePaid = 1000;

      const payload = {
        date,
        timeSlot: selectedSlot,
        eventType,
        attendees: Number(attendees),
        needHelper,
        amount,
        advancePaid
      };

      await axios.post('/api/bookings', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Booking Confirmed!');
      navigate('/profile');

    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Booking failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-8 text-center">Book a Room</h2>

      {step === 1 && (
        <div className="space-y-6">
          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
            <input
              type="date"
              className="w-full p-2 border rounded-md"
              value={date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Slot Selection */}
          {date && (
            <div>
              <h3 className="font-semibold mb-3">Select Time Slot</h3>
              {loading ? <p>Loading slots...</p> : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {slots.map((s) => (
                    <button
                      key={s.slot}
                      disabled={!s.isAvailable}
                      onClick={() => setSelectedSlot(s.slot)}
                      className={`p-3 rounded-md text-sm font-medium border
                        ${!s.isAvailable ? 'bg-gray-200 text-gray-400 cursor-not-allowed' :
                          selectedSlot === s.slot ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 hover:border-indigo-500'}
                      `}
                    >
                      {s.slot}
                      {!s.isAvailable && <span className="block text-xs text-red-500">Booked</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Event Details */}
          {selectedSlot && (
            <div className="space-y-4 border-t pt-4">
               <h3 className="font-semibold">Event Details</h3>
               <Input label="Event Type" value={eventType} onChange={(e) => setEventType(e.target.value)} placeholder="e.g. Birthday, Meeting" />
               <Input label="Number of Attendees" type="number" value={attendees} onChange={(e) => setAttendees(e.target.value)} />
               <div className="flex items-center">
                  <input type="checkbox" checked={needHelper} onChange={(e) => setNeedHelper(e.target.checked)} className="mr-2" />
                  <label>Need Helper Staff?</label>
               </div>
            </div>
          )}

          <Button disabled={!selectedSlot || !eventType || !attendees} onClick={handleBook}>
            Proceed to Payment
          </Button>
        </div>
      )}

      {/* Payment Step (Mock) */}
      {step === 2 && (
        <div className="text-center space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
             <h3 className="text-xl font-bold mb-4">Payment Summary</h3>
             <p>Date: {format(new Date(date), 'dd MMM yyyy')}</p>
             <p>Time: {selectedSlot}</p>
             <p>Event: {eventType}</p>
             <div className="mt-4 border-t pt-4">
               <p className="text-lg">Total Amount: $5000</p>
               <p className="text-lg font-bold text-indigo-600">Advance Payable: $1000</p>
             </div>
          </div>

          <div className="flex gap-4">
             <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
             <Button onClick={handlePaymentAndConfirm}>Pay & Confirm</Button>
          </div>
          <p className="text-xs text-gray-500">Note: This is a mock payment integration.</p>
        </div>
      )}

    </div>
  );
};

export default BookingPage;
