import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

interface User {
  name: string;
  mobile: string;
  address?: string;
  city?: string;
  state?: string;
  gender?: string;
  altMobile?: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Edit State
  const [formData, setFormData] = useState<User>({ name: '', mobile: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
      setFormData(res.data);
    } catch (error) {
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('/api/users/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
      toast.success('Profile Updated');
      setIsEditing(false);
    } catch (error) {
        toast.error('Update failed');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* User Info */}
      <div className="bg-white p-8 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-primaryDark">My Profile</h2>
            {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="text-primary hover:underline font-medium">Edit Profile</button>
            )}
        </div>

        {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} disabled />
                <Input label="Mobile" value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} disabled />
                <Input label="Gender" value={formData.gender || ''} onChange={(e) => setFormData({...formData, gender: e.target.value})} placeholder="Male/Female" />
                <Input label="Secondary Mobile" value={formData.altMobile || ''} onChange={(e) => setFormData({...formData, altMobile: e.target.value})} />
                <Input label="Address" value={formData.address || ''} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                <Input label="City" value={formData.city || ''} onChange={(e) => setFormData({...formData, city: e.target.value})} />

                <div className="md:col-span-2 flex justify-end gap-2 mt-4">
                    <Button variant="secondary" onClick={() => setIsEditing(false)} className="w-auto">Cancel</Button>
                    <Button onClick={handleUpdate} className="w-auto">Save Changes</Button>
                </div>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium text-lg">{user?.name}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Mobile</p>
                    <p className="font-medium text-lg">{user?.mobile}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium text-lg">{user?.gender || 'Not set'}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Secondary Mobile</p>
                    <p className="font-medium text-lg">{user?.altMobile || 'Not set'}</p>
                </div>
                <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium text-lg">{user?.address}, {user?.city}</p>
                </div>
            </div>
        )}
      </div>

      {/* Booking History Link */}
      <div className="bg-orange-50 p-8 rounded-xl shadow-md flex justify-between items-center">
        <div>
            <h3 className="text-xl font-bold text-gray-900">Your Bookings</h3>
            <p className="text-gray-600">View past events, manage upcoming bookings, or reschedule.</p>
        </div>
        <Link to="/history">
            <Button className="w-auto px-6">View Booking History</Button>
        </Link>
      </div>
    </div>
  );
};

export default Profile;
