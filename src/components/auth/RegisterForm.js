import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register, reset } from '../../redux/slices/authSlice';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'DONOR',
  });
  
  const [formErrors, setFormErrors] = useState({});
  
  const { name, email, password, confirmPassword, role } = formData;
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );
  
  useEffect(() => {
    if (isError) {
      // Display error message
    }
    
    // Redirect when registered
    if (isSuccess || user) {
      navigate('/dashboard');
    }
    
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);
  
  const validateForm = () => {
    const errors = {};
    
    if (!name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const userData = {
        name,
        email,
        password,
        role,
      };
      
      dispatch(register(userData));
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        
        {isError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{message}</div>}
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Full Name
          </label>
          <input
            className={`shadow appearance-none border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="name"
            type="text"
            name="name"
            value={name}
            onChange={handleChange}
            placeholder="Enter your full name"
          />
          {formErrors.name && <p className="text-red-500 text-xs italic">{formErrors.name}</p>}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className={`shadow appearance-none border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="email"
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          {formErrors.email && <p className="text-red-500 text-xs italic">{formErrors.email}</p>}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className={`shadow appearance-none border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="password"
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
          {formErrors.password && <p className="text-red-500 text-xs italic">{formErrors.password}</p>}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            className={`shadow appearance-none border ${formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
          />
          {formErrors.confirmPassword && <p className="text-red-500 text-xs italic">{formErrors.confirmPassword}</p>}
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
            Account Type
          </label>
          <select
            className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="role"
            name="role"
            value={role}
            onChange={handleChange}
          >
            <option value="DONOR">Donor</option>
            <option value="CHARITY">Charity</option>
          </select>
        </div>
        
        <div className="flex items-center justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <a href="/login" className="text-blue-500 hover:text-blue-700">
              Login
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;