import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
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

  // New Fields
  const [foodNeeded, setFoodNeeded] = useState('No'); // Yes/No
  const [extraItems, setExtraItems] = useState(''); // Text

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

      const payload = {
        date,
        timeSlot: selectedSlot,
        eventType,
        attendees: Number(attendees),
        needHelper,
        foodNeeded,
        extraItems
      };

      const res = await axios.post('/api/bookings', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Booking Confirmed!');
      // Navigate to Receipt Page with data
      navigate('/receipt', { state: { booking: res.data } });

    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Booking failed');
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-lg border-t-4 border-primary">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-primaryDark">Book Your Event</h2>

      {step === 1 && (
        <div className="space-y-6">
          {/* Date Selection */}
          <div className="bg-orange-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Auspicious Date</label>
            <input
              type="date"
              className="w-full p-3 border border-orange-200 rounded-md focus:ring-primary focus:border-primary"
              value={date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Slot Selection */}
          {date && (
            <div>
              <h3 className="font-semibold mb-3 text-gray-800">Select Time Slot</h3>
              {loading ? <p className="text-gray-500">Checking availability...</p> : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {slots.map((s) => (
                    <button
                      key={s.slot}
                      disabled={!s.isAvailable}
                      onClick={() => setSelectedSlot(s.slot)}
                      className={`p-3 rounded-md text-sm font-medium border transition duration-200
                        ${!s.isAvailable ? 'bg-gray-100 text-gray-400 cursor-not-allowed' :
                          selectedSlot === s.slot ? 'bg-primary text-white border-primary shadow-md' : 'bg-white text-gray-700 hover:border-primary hover:text-primary'}
                      `}
                    >
                      {s.slot}
                      {!s.isAvailable && <span className="block text-xs text-red-400">Booked</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Event Details Form */}
          {selectedSlot && (
            <div className="space-y-4 pt-4 animate-fade-in">
               <h3 className="font-semibold text-gray-800 border-b pb-2">Event Requirements</h3>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Input label="Event Type (e.g., Puja, Wedding)" value={eventType} onChange={(e) => setEventType(e.target.value)} placeholder="Name of the ritual" />
                 <Input label="Number of Attendees" type="number" value={attendees} onChange={(e) => setAttendees(e.target.value)} placeholder="Approx. guests" />
               </div>

               {/* New Fields */}
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Food Arrangement Needed?</label>
                 <select
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    value={foodNeeded}
                    onChange={(e) => setFoodNeeded(e.target.value)}
                 >
                   <option value="No">No, we will arrange our own (Veg only)</option>
                   <option value="Yes">Yes, venue catering required</option>
                 </select>
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Items Needed for Ritual (Samagri)</label>
                 <textarea
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    rows={3}
                    placeholder="List specific items needed (Flowers, Ghee, etc.)"
                    value={extraItems}
                    onChange={(e) => setExtraItems(e.target.value)}
                 />
               </div>

               <div className="flex items-center bg-gray-50 p-3 rounded-md">
                  <input type="checkbox" checked={needHelper} onChange={(e) => setNeedHelper(e.target.checked)} className="mr-3 h-5 w-5 text-primary" />
                  <label className="text-sm text-gray-700">Need helper staff for assistance?</label>
               </div>
            </div>
          )}

          <Button disabled={!selectedSlot || !eventType || !attendees} onClick={handleBook} className="w-full py-3 text-lg shadow-lg">
            Proceed to Payment
          </Button>
        </div>
      )}

      {/* Payment Step (Mock) */}
      {step === 2 && (
        <div className="text-center space-y-6">
          <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
             <h3 className="text-xl font-bold mb-4 text-primaryDark">Booking Summary</h3>
             <div className="text-left space-y-2 text-gray-700">
               <p><span className="font-semibold">Date:</span> {format(new Date(date), 'dd MMM yyyy')}</p>
               <p><span className="font-semibold">Time:</span> {selectedSlot}</p>
               <p><span className="font-semibold">Event:</span> {eventType} ({attendees} guests)</p>
               <p><span className="font-semibold">Food:</span> {foodNeeded}</p>
             </div>

             <div className="mt-6 border-t border-orange-200 pt-4">
               <div className="flex justify-between text-lg">
                 <span>Total Amount:</span>
                 <span>$5000</span>
               </div>
               <div className="flex justify-between text-xl font-bold text-primary mt-2">
                 <span>Advance Payable (20%):</span>
                 <span>$1000</span>
               </div>
             </div>
          </div>

          <div className="flex gap-4">
             <Button variant="secondary" onClick={() => setStep(1)} className="w-1/3">Back</Button>
             <Button onClick={handlePaymentAndConfirm} className="w-2/3 shadow-xl">Pay & Confirm Booking</Button>
          </div>
          <p className="text-xs text-gray-500">Secure Payment Gateway (Mock)</p>
        </div>
      )}

    </div>
  );
};

export default BookingPage;
