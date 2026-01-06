import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

interface User {
  name: string;
  mobile: string;
  address?: string;
  city?: string;
  state?: string;
}

interface Booking {
  _id: string;
  date: string;
  timeSlot: string;
  status: string;
  eventType: string;
  totalAmount: number;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const userRes = await axios.get('/api/users/profile', config);
        const bookingRes = await axios.get('/api/bookings/my', config);

        setUser(userRes.data);
        setBookings(bookingRes.data);
      } catch (error) {
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel? Cancellation fee applies.')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/bookings/${id}/cancel`, {}, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Booking Cancelled');
      // Refresh list
      setBookings(bookings.map(b => b._id === id ? { ...b, status: 'cancelled' } : b));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Cancellation failed');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      {/* User Info */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">My Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium">{user?.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Mobile</p>
            <p className="font-medium">{user?.mobile}</p>
          </div>
           <div>
            <p className="text-sm text-gray-500">Address</p>
            <p className="font-medium">{user?.address || 'N/A'}</p>
          </div>
           <div>
            <p className="text-sm text-gray-500">City</p>
            <p className="font-medium">{user?.city || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Booking History */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Booking History</h2>
        {bookings.length === 0 ? (
          <p className="text-gray-500">No bookings found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{format(new Date(booking.date), 'dd MMM yyyy')}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{booking.timeSlot}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{booking.eventType}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {booking.status === 'confirmed' && (
                        <button onClick={() => handleCancel(booking._id)} className="text-red-600 hover:text-red-900">Cancel</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
