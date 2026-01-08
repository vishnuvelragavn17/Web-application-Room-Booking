import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { Button } from '../../components/ui/Button';

interface Booking {
  _id: string;
  user: {
    name: string;
    mobile: string;
  };
  date: string;
  timeSlot: string;
  eventType: string;
  status: string;
  amount: number;
}

const AdminDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [blockDate, setBlockDate] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/admin/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data);
    } catch (error: any) {
      toast.error('Failed to load bookings. Are you Admin?');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Admin Action: Cancel this booking?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/admin/bookings/${id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Booking Cancelled');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to cancel');
    }
  };

  const handleBlockDate = async () => {
    if (!blockDate) return toast.error('Select a date');
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/admin/block-date', { date: blockDate, reason: 'Admin Blocked' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Date Blocked Successfully');
      setBlockDate('');
      fetchBookings();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to block date');
    }
  };

  if (loading) return <div className="p-8">Loading Admin Dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-primaryDark">Admin Dashboard</h1>

      {/* Block Date Section */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8 border-l-4 border-red-500">
        <h2 className="text-xl font-semibold mb-4">Block Unavailable Date</h2>
        <div className="flex gap-4">
          <input
            type="date"
            className="border p-2 rounded-md"
            value={blockDate}
            onChange={(e) => setBlockDate(e.target.value)}
          />
          <Button onClick={handleBlockDate} className="w-auto bg-red-600 hover:bg-red-700">
            Block Date
          </Button>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">All Bookings</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date/Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{b.user?.name || 'Admin/System'}</div>
                    <div className="text-sm text-gray-500">{b.user?.mobile}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{format(new Date(b.date), 'dd MMM yyyy')}</div>
                    <div className="text-sm text-gray-500">{b.timeSlot}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{b.eventType}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${b.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {b.status}
                      </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {b.status === 'confirmed' && (
                      <button onClick={() => handleCancel(b._id)} className="text-red-600 hover:text-red-900">Cancel</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
