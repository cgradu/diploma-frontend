import React, { useState, useEffect } from 'react';

const DonationForm = ({ initialData, onComplete }) => {
  const [formData, setFormData] = useState({
    amount: initialData.amount || 25,
    charityId: initialData.charityId || '',
    projectId: initialData.projectId || '',
    message: initialData.message || '',
    anonymous: initialData.anonymous || false,
  });
  
  const [charities, setCharities] = useState([]);
  const [projects, setProjects] = useState([]);
  const [customAmount, setCustomAmount] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Fetch charities and projects
  useEffect(() => {
    // In a real implementation, you would fetch charities from the API
    // For now, let's use dummy data
    setCharities([
      { id: 1, name: 'Children Education Foundation' },
      { id: 2, name: 'Clean Water Initiative' },
      { id: 3, name: 'Homeless Shelter Support' },
    ]);
    
    // If a charity is selected, fetch its projects
    if (formData.charityId) {
      // In a real implementation, you would fetch projects from the API
      setProjects([
        { id: 1, title: 'School Supplies Program', charityId: 1 },
        { id: 2, title: 'Teacher Training Initiative', charityId: 1 },
        { id: 3, title: 'Well Construction Project', charityId: 2 },
        { id: 4, title: 'Water Purification Systems', charityId: 2 },
        { id: 5, title: 'Winter Housing Program', charityId: 3 },
      ].filter(project => project.charityId === parseInt(formData.charityId)));
    } else {
      setProjects([]);
    }
  }, [formData.charityId]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  
  const handleAmountSelect = (amount) => {
    setFormData({
      ...formData,
      amount,
    });
    setCustomAmount(false);
  };
  
  const handleCustomAmountChange = (e) => {
    setFormData({
      ...formData,
      amount: parseFloat(e.target.value) || 0,
    });
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
        >
          <option value="">Select a charity</option>
          {charities.map(charity => (
            <option key={charity.id} value={charity.id}>{charity.name}</option>
          ))}
        </select>
        {errors.charityId && <p className="mt-1 text-sm text-red-500">{errors.charityId}</p>}
      </div>
      
      {/* Project Selection (if charity is selected) */}
      {formData.charityId && projects.length > 0 && (
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
          >
            <option value="">General donation</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.title}</option>
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
              ${amount}
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
                <span className="text-gray-500">$</span>
              </div>
              <input
                type="number"
                min="1"
                step="0.01"
                value={formData.amount}
                onChange={handleCustomAmountChange}
                className={`w-full pl-7 pr-3 py-2 border rounded-md ${
                  errors.amount ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter amount"
              />
            </div>
            {errors.amount && <p className="mt-1 text-sm text-red-500">{errors.amount}</p>}
          </div>
        )}
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
          placeholder="Add a personal message..."
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
          className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md shadow-sm"
        >
          Continue to Payment
        </button>
      </div>
    </form>
  );
};

export default DonationForm;