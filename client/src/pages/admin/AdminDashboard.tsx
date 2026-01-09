import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { Button } from '../../components/ui/Button';
import { getAllBookings, cancelBookingAdmin, blockDate as blockDateApi } from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';

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
  const { token } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Controls
  const [blockDateVal, setBlockDateVal] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterTime, setFilterTime] = useState('');
  const [sortOption, setSortOption] = useState<'week' | 'month' | 'all'>('all');

  // Stats
  const [stats, setStats] = useState({ total: 0, revenue: 0, upcoming: 0, completed: 0 });

  useEffect(() => {
    fetchBookings();
  }, [token]);

  useEffect(() => {
    applyFilters();
  }, [bookings, filterDate, filterTime, sortOption]);

  const fetchBookings = async () => {
    if (!token) return;
    try {
      const data = await getAllBookings(token);
      setBookings(data);
      calculateStats(data);
    } catch (error: any) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: Booking[]) => {
      // Correct Stats Calculation
      const now = new Date();
      const confirmed = data.filter(b => b.status === 'confirmed');
      const upcoming = confirmed.filter(b => new Date(b.date) >= now).length;
      const completed = data.filter(b => b.status === 'completed' || (b.status === 'confirmed' && new Date(b.date) < now)).length;
      const revenue = confirmed.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

      setStats({ total: data.length, revenue, upcoming, completed });
  };

  const applyFilters = () => {
      let result = [...bookings];
      const now = new Date();

      // Filter Date
      if (filterDate) {
          result = result.filter(b => format(new Date(b.date), 'yyyy-MM-dd') === filterDate);
      }

      // Filter Time
      if (filterTime) {
          result = result.filter(b => b.timeSlot === filterTime);
      }

      // Sorting / Quick Filters
      if (sortOption === 'week') {
          const nextWeek = new Date(now);
          nextWeek.setDate(now.getDate() + 7);
          result = result.filter(b => new Date(b.date) >= now && new Date(b.date) <= nextWeek);
      } else if (sortOption === 'month') {
          const nextMonth = new Date(now);
          nextMonth.setMonth(now.getMonth() + 1);
          result = result.filter(b => new Date(b.date) >= now && new Date(b.date) <= nextMonth);
      }

      setFilteredBookings(result);
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Admin Action: Cancel this booking?')) return;
    if (!token) return;
    try {
      await cancelBookingAdmin(id, token);
      toast.success('Booking Cancelled');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to cancel');
    }
  };

  const handleBlockDate = async () => {
    if (!blockDateVal) return toast.error('Select a date');
    if (!token) return;
    try {
      await blockDateApi(blockDateVal, 'Admin Blocked', token);
      toast.success('Date Blocked Successfully');
      setBlockDateVal('');
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-primary">
              <h3 className="text-gray-500 text-sm font-medium">Total Revenue (Est.)</h3>
              <p className="text-3xl font-bold text-gray-900">${stats.revenue.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
              <h3 className="text-gray-500 text-sm font-medium">Upcoming Events</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.upcoming}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
              <h3 className="text-gray-500 text-sm font-medium">Completed Events</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
              <h3 className="text-gray-500 text-sm font-medium">Total Bookings</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
      </div>

      {/* Actions & Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Block Date */}
          <div className="bg-white p-6 rounded-xl shadow-md lg:col-span-1">
            <h2 className="text-lg font-semibold mb-4 text-red-600">Block Unavailable Date</h2>
            <div className="flex gap-2">
            <input
                type="date"
                className="border p-2 rounded-md w-full text-sm"
                value={blockDateVal}
                onChange={(e) => setBlockDateVal(e.target.value)}
            />
            <Button onClick={handleBlockDate} className="w-auto bg-red-600 hover:bg-red-700 text-sm px-3">
                Block
            </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-6 rounded-xl shadow-md lg:col-span-2">
             <h2 className="text-lg font-semibold mb-4 text-gray-800">Filter & Sort</h2>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input
                    type="date"
                    className="border p-2 rounded-md w-full text-sm"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                />
                <select
                    className="border p-2 rounded-md w-full text-sm bg-white"
                    value={filterTime}
                    onChange={(e) => setFilterTime(e.target.value)}
                >
                    <option value="">All Times</option>
                    <option value="09:00-10:00">09:00-10:00</option>
                    <option value="10:00-11:00">10:00-11:00</option>
                    <option value="11:00-12:00">11:00-12:00</option>
                    <option value="12:00-13:00">12:00-13:00</option>
                    <option value="13:00-14:00">13:00-14:00</option>
                    <option value="14:00-15:00">14:00-15:00</option>
                    <option value="15:00-16:00">15:00-16:00</option>
                    <option value="16:00-17:00">16:00-17:00</option>
                    <option value="17:00-18:00">17:00-18:00</option>
                </select>
                <select
                    className="border p-2 rounded-md w-full text-sm bg-white"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value as any)}
                >
                    <option value="all">All Upcoming</option>
                    <option value="week">Coming Week</option>
                    <option value="month">Coming Month</option>
                </select>
             </div>
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
                         <button onClick={() => handleCancel(b._id)} className="text-red-600 hover:text-red-900 font-semibold border border-red-200 px-3 py-1 rounded hover:bg-red-50">Cancel Booking</button>
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
                            <Button variant="danger" onClick={() => handleCancel(b._id)} className="py-1 px-3 text-xs w-full">Cancel Booking</Button>
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
