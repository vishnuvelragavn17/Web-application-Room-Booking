import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { isValidMobile, isNotEmpty } from '../../utils/validation';

const Signup: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    otp: '',
    dob: '',
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const navigate = useNavigate();

  const validateStep1 = () => {
      const newErrors: {[key: string]: string} = {};
      if (!isNotEmpty(formData.name)) newErrors.name = 'Name is required';
      if (!isValidMobile(formData.mobile)) newErrors.mobile = 'Enter a valid 10-digit mobile number';
      if (!isNotEmpty(formData.dob)) newErrors.dob = 'Date of birth is required';

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  };

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1()) return;

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
    if (!isNotEmpty(formData.otp)) {
        setErrors({ otp: 'OTP is required' });
        return;
    }

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
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold text-center mb-6 text-primaryDark">Sign Up</h2>

      {step === 1 ? (
        <form onSubmit={handleRequestOTP}>
           <Input
            label="Full Name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            error={errors.name}
          />
          <Input
            label="Mobile Number"
            type="text"
            value={formData.mobile}
            onChange={(e) => setFormData({...formData, mobile: e.target.value})}
            placeholder="Enter 10 digit mobile"
            error={errors.mobile}
          />
           <Input
            label="Date of Birth"
            type="date"
            value={formData.dob}
            onChange={(e) => setFormData({...formData, dob: e.target.value})}
            error={errors.dob}
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
            error={errors.otp}
          />
          <Button type="submit" className="mt-4">Register</Button>
          <button type="button" onClick={() => setStep(1)} className="mt-2 text-sm text-primary w-full text-center hover:underline">Back</button>
        </form>
      )}
    </div>
  );
};

export default Signup;
