import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const Signup: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    otp: '',
    dob: '',
  });
  const navigate = useNavigate();

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/request-otp', { mobile: formData.mobile });
      toast.info('OTP sent! (Check backend console)');
      setStep(2);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      toast.success('Registration Successful');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>

      {step === 1 ? (
        <form onSubmit={handleRequestOTP}>
           <Input
            label="Full Name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <Input
            label="Mobile Number"
            type="text"
            value={formData.mobile}
            onChange={(e) => setFormData({...formData, mobile: e.target.value})}
            placeholder="Enter 10 digit mobile"
            required
          />
           <Input
            label="Date of Birth"
            type="date"
            value={formData.dob}
            onChange={(e) => setFormData({...formData, dob: e.target.value})}
            required
          />
          <Button type="submit" className="mt-4">Next: Verify Mobile</Button>
        </form>
      ) : (
        <form onSubmit={handleRegister}>
          <p className="mb-4 text-sm text-gray-600">OTP sent to {formData.mobile}</p>
          <Input
            label="Enter OTP"
            type="text"
            value={formData.otp}
            onChange={(e) => setFormData({...formData, otp: e.target.value})}
            placeholder="4 digit OTP"
            required
          />
          <Button type="submit" className="mt-4">Register</Button>
          <button type="button" onClick={() => setStep(1)} className="mt-2 text-sm text-indigo-600 w-full text-center">Back</button>
        </form>
      )}
    </div>
  );
};

export default Signup;
