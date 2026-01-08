import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { Button } from '../components/ui/Button';

interface Booking {
  _id: string;
  date: string;
  timeSlot: string;
  status: string;
  eventType: string;
}

const BookingHistory: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Postpone Modal State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newSlot, setNewSlot] = useState('');
  const [availSlots, setAvailSlots] = useState<{slot: string, isAvailable: boolean}[]>([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/bookings/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data);
    } catch (error) {
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure? Cancellation fee applies.')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/bookings/${id}/cancel`, {}, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Booking Cancelled');
      fetchBookings();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed');
    }
  };

  // Postpone Logic
  const openPostpone = (id: string) => {
    setEditingId(id);
    setNewDate('');
    setNewSlot('');
    setAvailSlots([]);
  };

  const checkAvailability = async () => {
    if (!newDate) return;
    try {
      const res = await axios.get(`/api/bookings/availability?date=${newDate}`);
      setAvailSlots(res.data);
    } catch (error) {
      toast.error('Could not check slots');
    }
  };

  const submitPostpone = async () => {
    if (!editingId || !newDate || !newSlot) return;
    try {
        const token = localStorage.getItem('token');
        await axios.put(`/api/bookings/${editingId}/postpone`, { date: newDate, timeSlot: newSlot }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Booking Rescheduled!');
        setEditingId(null);
        fetchBookings();
    } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to reschedule');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-primaryDark">My Booking History</h1>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
           <thead className="bg-orange-50">
             <tr>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
             </tr>
           </thead>
           <tbody className="bg-white divide-y divide-gray-200">
             {bookings.map((b) => (
               <tr key={b._id}>
                 <td className="px-6 py-4 whitespace-nowrap">{format(new Date(b.date), 'dd MMM yyyy')}</td>
                 <td className="px-6 py-4 whitespace-nowrap">{b.timeSlot}</td>
                 <td className="px-6 py-4 whitespace-nowrap">{b.eventType}</td>
                 <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${b.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {b.status}
                    </span>
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                   {b.status === 'confirmed' && (
                     <>
                        <button onClick={() => openPostpone(b._id)} className="text-primary hover:text-primaryDark">Postpone</button>
                        <button onClick={() => handleCancel(b._id)} className="text-red-600 hover:text-red-900">Cancel</button>
                     </>
                   )}
                 </td>
               </tr>
             ))}
           </tbody>
        </table>
      </div>

      {/* Postpone Modal */}
      {editingId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                  <h3 className="text-lg font-bold mb-4">Reschedule Booking</h3>
                  <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Select New Date</label>
                      <input
                        type="date"
                        className="w-full border p-2 rounded"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        onBlur={checkAvailability}
                        min={new Date().toISOString().split('T')[0]}
                      />
                  </div>
                  {newDate && (
                      <div className="mb-4">
                          <label className="block text-sm font-medium mb-1">Select New Slot</label>
                          <div className="grid grid-cols-2 gap-2">
                              {availSlots.map(s => (
                                  <button
                                    key={s.slot}
                                    disabled={!s.isAvailable}
                                    onClick={() => setNewSlot(s.slot)}
                                    className={`p-2 text-xs border rounded ${selectedSlotStyle(newSlot, s.slot, s.isAvailable)}`}
                                  >
                                      {s.slot}
                                  </button>
                              ))}
                          </div>
                      </div>
                  )}
                  <div className="flex justify-end gap-2">
                      <Button variant="secondary" onClick={() => setEditingId(null)}>Cancel</Button>
                      <Button onClick={submitPostpone} disabled={!newSlot}>Confirm Reschedule</Button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

const selectedSlotStyle = (current: string, slot: string, avail: boolean) => {
    if (!avail) return 'bg-gray-100 text-gray-400';
    if (current === slot) return 'bg-primary text-white border-primary';
    return 'bg-white text-gray-700 hover:border-primary';
}

export default BookingHistory;
