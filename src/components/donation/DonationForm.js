// src/components/donation/DonationForm.js
import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProjectsByCharityId } from '../../redux/slices/projectSlice';
import { 
  selectCharities, 
  selectCharitiesLoading, 
  selectProjectsLoading
} from '../../redux/selectors';

const DonationForm = ({ initialData, onComplete }) => {
  const dispatch = useDispatch();
  
  // MOVE useState BEFORE using formData
  const [formData, setFormData] = useState({
    amount: initialData.amount || 25,
    charityId: initialData.charityId || '',
    projectId: initialData.projectId || '',
    message: initialData.message || '',
    anonymous: initialData.anonymous || false,
    currency: initialData.currency || 'RON'
  });

  // Use memoized selectors
  const charities = useSelector(selectCharities);
  const charitiesLoading = useSelector(selectCharitiesLoading);
  const projectsLoading = useSelector(selectProjectsLoading);
  
  // Make sure to safely access the projects
  const projectsForCharity = useSelector(state => {
    // First check if state.projects exists and has a projects array
    if (!state.projects || !Array.isArray(state.projects.projects)) {
      return [];
    }
    
    // Return all projects (they should be filtered by charity on the backend)
    return state.projects.projects;
  });
  
  const [customAmount, setCustomAmount] = useState(false);
  const [errors, setErrors] = useState({});
  
  // src/components/donation/DonationForm.js

  // Update the useEffect hook to validate charityId before dispatching
  useEffect(() => {
    if (formData.charityId && formData.charityId !== 'undefined') {
      console.log('Fetching projects for charity ID:', formData.charityId);
      // Convert charityId to a number if it's a string
      const charityIdValue = parseInt(formData.charityId, 10);
      
      // Only dispatch if we have a valid ID
      if (!isNaN(charityIdValue)) {
        dispatch(getProjectsByCharityId(charityIdValue));
      } else {
        console.warn('Invalid charityId format:', formData.charityId);
      }
    }
  }, [formData.charityId, dispatch]);
  
  // Update charity and project selections from URL params
  useEffect(() => {
    if (initialData.charityId && formData.charityId !== initialData.charityId) {
      setFormData(prev => ({
        ...prev,
        charityId: initialData.charityId
      }));
    }
    
    if (initialData.projectId && formData.projectId !== initialData.projectId) {
      setFormData(prev => ({
        ...prev,
        projectId: initialData.projectId
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData.charityId, initialData.projectId]);

  useEffect(() => {
    console.log('Initial data:', initialData);
    console.log('Form data:', formData);
  }, [initialData, formData]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    
    // Clear any errors when a field is updated
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
    
    // If charity selection changes, reset project selection
    if (name === 'charityId' && value !== formData.charityId) {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        projectId: ''
      }));
    }
  };
  
  const handleAmountSelect = (amount) => {
    setFormData({
      ...formData,
      amount,
    });
    setCustomAmount(false);
    
    // Clear amount error if exists
    if (errors.amount) {
      setErrors({
        ...errors,
        amount: null
      });
    }
  };
  
  const handleCustomAmountChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setFormData({
      ...formData,
      amount: value,
    });
    
    // Clear amount error if value is valid
    if (value > 0 && errors.amount) {
      setErrors({
        ...errors,
        amount: null
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    if (!formData.charityId) {
      newErrors.charityId = 'Please select a charity';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onComplete(formData);
    }
  };
  
  // Memoize the loading state
  const isLoading = useMemo(() => 
    charitiesLoading || projectsLoading, 
    [charitiesLoading, projectsLoading]
  );
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Charity Selection */}
      <div>
        <label htmlFor="charityId" className="block text-sm font-medium text-gray-700 mb-1">
          Select Charity
        </label>
        <select
          id="charityId"
          name="charityId"
          value={formData.charityId}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md ${errors.charityId ? 'border-red-500' : 'border-gray-300'}`}
          required
          disabled={isLoading}
        >
          <option value="">Select a charity</option>
          {charities.map(charity => (
            <option key={charity.id} value={charity.id}>
              {charity.name}
            </option>
          ))}
        </select>
        {errors.charityId && <p className="mt-1 text-sm text-red-500">{errors.charityId}</p>}
      </div>
      
      {/* Project Selection (if charity is selected) */}
      {formData.charityId && projectsForCharity.length > 0 && (
        <div>
          <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-1">
            Select Project (Optional)
          </label>
          <select
            id="projectId"
            name="projectId"
            value={formData.projectId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            disabled={isLoading}
          >
            <option value="">General donation</option>
            {projectsForCharity.map(project => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>
        </div>
      )}
      
      {/* Donation Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Donation Amount
        </label>
        <div className="grid grid-cols-4 gap-2 mb-2">
          {[10, 25, 50, 100].map(amount => (
            <button
              key={amount}
              type="button"
              className={`py-2 px-4 rounded-md ${
                formData.amount === amount && !customAmount
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => handleAmountSelect(amount)}
            >
              {amount} {formData.currency}
            </button>
          ))}
        </div>
        <div className="flex items-center mt-2">
          <input
            type="checkbox"
            id="customAmount"
            checked={customAmount}
            onChange={() => setCustomAmount(!customAmount)}
            className="mr-2"
          />
          <label htmlFor="customAmount" className="text-sm text-gray-700">
            Custom Amount
          </label>
        </div>
        {customAmount && (
          <div className="mt-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">{formData.currency}</span>
              </div>
              <input
                type="number"
                min="1"
                step="1"
                value={formData.amount}
                onChange={handleCustomAmountChange}
                className={`w-full pl-16 pr-3 py-2 border rounded-md ${
                  errors.amount ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter amount"
              />
            </div>
            {errors.amount && <p className="mt-1 text-sm text-red-500">{errors.amount}</p>}
          </div>
        )}
      </div>
      
      {/* Currency Selection */}
      <div>
        <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
          Currency
        </label>
        <select
          id="currency"
          name="currency"
          value={formData.currency}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="RON">Romanian Leu (RON)</option>
          <option value="EUR">Euro (EUR)</option>
          <option value="USD">US Dollar (USD)</option>
        </select>
      </div>
      
      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Message (Optional)
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Add a personal message with your donation..."
        ></textarea>
      </div>
      
      {/* Anonymous Donation */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="anonymous"
          name="anonymous"
          checked={formData.anonymous}
          onChange={handleChange}
          className="mr-2"
        />
        <label htmlFor="anonymous" className="text-sm text-gray-700">
          Make donation anonymous
        </label>
      </div>
      
      {/* Submit Button */}
      <div className="mt-6">
        <button
          type="submit"
          className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md shadow-sm transition duration-200"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </span>
          ) : (
            'Continue to Payment'
          )}
        </button>
      </div>
    </form>
  );
};

export default DonationForm;