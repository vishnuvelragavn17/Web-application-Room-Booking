import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

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
  totalAmount: number;
}

const AdminDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [blockDate, setBlockDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Stats
  const [stats, setStats] = useState({ total: 0, revenue: 0, upcoming: 0 });

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
        setFilteredBookings(bookings);
    } else {
        const lower = searchTerm.toLowerCase();
        setFilteredBookings(bookings.filter(b =>
            b.user?.name?.toLowerCase().includes(lower) ||
            b.user?.mobile?.includes(searchTerm) ||
            b.eventType?.toLowerCase().includes(lower)
        ));
    }
  }, [searchTerm, bookings]);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/admin/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data);
      setFilteredBookings(res.data);
      calculateStats(res.data);
    } catch (error: any) {
      toast.error('Failed to load bookings. Are you Admin?');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: Booking[]) => {
      const total = data.length;
      const revenue = data.reduce((acc, curr) => curr.status === 'confirmed' ? acc + (curr.totalAmount || 0) : acc, 0);
      const upcoming = data.filter(b => new Date(b.date) > new Date()).length;
      setStats({ total, revenue, upcoming });
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

  const handleMarkCompleted = async (id: string) => {
    try {
        const token = localStorage.getItem('token');
        await axios.put(`/api/admin/bookings/${id}/complete`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Marked as Completed');
        fetchBookings();
    } catch (error) {
        toast.error('Failed to update status');
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
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primaryDark">Admin Dashboard</h1>
        <div className="text-sm text-gray-500">Super Admin Mode</div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-primary">
              <h3 className="text-gray-500 text-sm font-medium">Total Revenue (Est.)</h3>
              <p className="text-3xl font-bold text-gray-900">${stats.revenue.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
              <h3 className="text-gray-500 text-sm font-medium">Upcoming Events</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.upcoming}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
              <h3 className="text-gray-500 text-sm font-medium">Total Bookings</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
      </div>

      {/* Actions & Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Block Date */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-4 text-red-600">Block Unavailable Date</h2>
            <div className="flex gap-4">
            <input
                type="date"
                className="border p-2 rounded-md w-full"
                value={blockDate}
                onChange={(e) => setBlockDate(e.target.value)}
            />
            <Button onClick={handleBlockDate} className="w-auto bg-red-600 hover:bg-red-700">
                Block
            </Button>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white p-6 rounded-xl shadow-md">
             <h2 className="text-lg font-semibold mb-4 text-gray-800">Search Bookings</h2>
             <Input
                label=""
                placeholder="Search by Name, Mobile or Event..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-0"
             />
          </div>
      </div>

      {/* Bookings List (Mobile & Desktop) */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
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
              {filteredBookings.map((b) => (
                <tr key={b._id} className="hover:bg-gray-50">
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
                        ${b.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          b.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                        {b.status}
                      </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {b.status === 'confirmed' && (
                        <>
                         <button onClick={() => handleMarkCompleted(b._id)} className="text-blue-600 hover:text-blue-900">Complete</button>
                         <button onClick={() => handleCancel(b._id)} className="text-red-600 hover:text-red-900">Cancel</button>
                        </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
            {filteredBookings.map((b) => (
                <div key={b._id} className="border rounded-lg p-4 shadow-sm bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="font-bold text-gray-900">{b.eventType}</h3>
                            <p className="text-xs text-gray-500">{format(new Date(b.date), 'dd MMM yyyy')} | {b.timeSlot}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full
                            ${b.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              b.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                            {b.status}
                        </span>
                    </div>
                    <div className="mb-3 text-sm">
                        <p><span className="font-semibold">User:</span> {b.user?.name || 'N/A'}</p>
                        <p><span className="font-semibold">Mobile:</span> {b.user?.mobile}</p>
                    </div>
                    {b.status === 'confirmed' && (
                        <div className="flex gap-2 mt-2">
                            <Button variant="secondary" onClick={() => handleMarkCompleted(b._id)} className="py-1 px-3 text-xs w-auto">Complete</Button>
                            <Button variant="danger" onClick={() => handleCancel(b._id)} className="py-1 px-3 text-xs w-auto">Cancel</Button>
                        </div>
                    )}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
