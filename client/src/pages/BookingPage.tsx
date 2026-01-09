import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { isValidMobile, isNotEmpty } from '../utils/validation';
import { getAvailability, createBooking } from '../services/bookingService';

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
  const [foodNeeded, setFoodNeeded] = useState('No');
  const [extraItems, setExtraItems] = useState('');

  // Contact Fields
  const [address, setAddress] = useState('');
  const [secondaryPhone, setSecondaryPhone] = useState('');

  // Errors
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Fetch slots when date changes
  useEffect(() => {
    if (date) {
      fetchSlots();
    }
  }, [date]);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const data = await getAvailability(date);
      setSlots(data);
    } catch (error) {
      toast.error('Could not fetch slots');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    if (!isNotEmpty(eventType)) newErrors.eventType = 'Event type is required';
    if (!isNotEmpty(attendees)) newErrors.attendees = 'Attendees count is required';
    if (!isNotEmpty(address)) newErrors.address = 'Address is required';
    if (isNotEmpty(secondaryPhone) && !isValidMobile(secondaryPhone)) newErrors.secondaryPhone = 'Invalid mobile number (10 digits)';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBook = async () => {
    if (!selectedSlot) return toast.error('Please select a time slot');
    if (!validateForm()) return toast.error('Please fix form errors');
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
        extraItems,
        address,
        secondaryPhone
      };

      const data = await createBooking(payload, token);

      toast.success('Booking Confirmed!');
      // Navigate to Receipt Page with data
      navigate('/receipt', { state: { booking: data } });

    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Booking failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-lg border-t-4 border-primary my-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-primaryDark">Book Your Event</h2>

      {step === 1 && (
        <div className="space-y-8">
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
            <div className="space-y-6 pt-4 border-t">
               <h3 className="text-xl font-semibold text-gray-800">Event & Contact Details</h3>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Input
                    label="Event Type"
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    placeholder="e.g. Wedding, Naming Ceremony"
                    error={errors.eventType}
                 />
                 <Input
                    label="Attendees"
                    type="number"
                    value={attendees}
                    onChange={(e) => setAttendees(e.target.value)}
                    placeholder="Approx. guests"
                    error={errors.attendees}
                 />
                 <Input
                    label="Full Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Booking party address"
                    error={errors.address}
                 />
                 <Input
                    label="Secondary Contact Number"
                    value={secondaryPhone}
                    onChange={(e) => setSecondaryPhone(e.target.value)}
                    placeholder="Optional backup number"
                    error={errors.secondaryPhone}
                 />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Food Arrangement</label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary h-[42px]"
                            value={foodNeeded}
                            onChange={(e) => setFoodNeeded(e.target.value)}
                        >
                        <option value="No">Self Arrangement (Veg)</option>
                        <option value="Yes">Venue Catering Required</option>
                        </select>
                    </div>

                     <div className="flex items-center bg-gray-50 p-3 rounded-md h-[42px] mt-6 md:mt-0">
                        <input type="checkbox" checked={needHelper} onChange={(e) => setNeedHelper(e.target.checked)} className="mr-3 h-5 w-5 text-primary" />
                        <label className="text-sm text-gray-700">Need helper staff?</label>
                    </div>
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Ritual Items (Samagri)</label>
                 <textarea
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    rows={3}
                    placeholder="List specific items needed..."
                    value={extraItems}
                    onChange={(e) => setExtraItems(e.target.value)}
                 />
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
