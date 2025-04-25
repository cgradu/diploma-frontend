// src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { getProfile, updateProfile, updateProfileDetails, changePassword } from '../redux/slices/authSlice';
import { getManagerCharity, updateCharityDetails, resetCharityState } from '../redux/slices/charitySlice';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, isLoading } = useSelector((state) => state.auth);
  const { managerCharity, isLoading: charityLoading } = useSelector((state) => state.charities);
  const dispatch = useDispatch();
  const [profileFetchAttempted, setProfileFetchAttempted] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  
  // Create separate states for different form sections
  const [generalInfo, setGeneralInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  
  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  // Charity information state (for charity managers)
  const [charityInfo, setCharityInfo] = useState({
    id: '',
    name: '',
    description: '',
    mission: '',
    email: '',
    phone: '',
    registrationId: '',
    category: '',
    address: '',
    foundedYear: '',
  });
  
  // Donor preferences state (for donors)
  const [donorInfo, setDonorInfo] = useState({
    preferredCauses: [],
    donationPreferences: '',
  });
  
  // Loading states for different form submissions
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // Only fetch profile once and only if the user is logged in
    if (user && !profileFetchAttempted) {
      dispatch(getProfile())
        .unwrap()
        .then(() => {
          setProfileFetchAttempted(true);
        })
        .catch(error => {
          console.error("Error fetching profile:", error);
        });
      
      // If user is a charity manager, fetch their managed charity
      if (user.role === 'charity') {
        dispatch(getManagerCharity())
          .unwrap()
          .catch(error => {
            console.error("Error fetching managed charity:", error);
          });
      }
    }
    
    // Populate form with user data when available
    if (user) {
      setGeneralInfo({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
      
      // Set donor info if user is a donor
      if (user.role === 'donor') {
        setDonorInfo({
          preferredCauses: user.preferredCauses || [],
          donationPreferences: user.donationPreferences || '',
        });
      }
    }
  }, [dispatch, user, profileFetchAttempted]);
  
  // Update charity form when charity data is loaded
  useEffect(() => {
    if (managerCharity) {
      setCharityInfo({
        id: managerCharity.id || '',
        name: managerCharity.name || '',
        description: managerCharity.description || '',
        mission: managerCharity.mission || '',
        email: managerCharity.email || '',
        phone: managerCharity.phone || '',
        registrationId: managerCharity.registrationId || '',
        category: managerCharity.category || '',
        address: managerCharity.address || '',
        foundedYear: managerCharity.foundedYear || '',
      });
    }
  }, [managerCharity]);
  
  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      dispatch(resetCharityState());
    };
  }, [dispatch]);
  
  const handleGeneralInfoChange = (e) => {
    setGeneralInfo({
      ...generalInfo,
      [e.target.name]: e.target.value,
    });
  };
  
  const handlePasswordChange = (e) => {
    setPasswordInfo({
      ...passwordInfo,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleCharityInfoChange = (e) => {
    setCharityInfo({
      ...charityInfo,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleDonorInfoChange = (e) => {
    const { name, value, type, selectedOptions } = e.target;
    
    if (type === 'select-multiple') {
      const selectedValues = Array.from(selectedOptions, option => option.value);
      setDonorInfo({
        ...donorInfo,
        [name]: selectedValues,
      });
    } else {
      setDonorInfo({
        ...donorInfo,
        [name]: value,
      });
    }
  };
  
  const handleGeneralSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Add a minimum delay of 800ms to show the loading state
      const updatePromise = dispatch(updateProfile(generalInfo)).unwrap();
      const delayPromise = new Promise(resolve => setTimeout(resolve, 800));
      
      // Wait for both promises to complete (API call and minimum delay)
      await Promise.all([updatePromise, delayPromise]);
      
      // Display success toast
      toast.success('Profile information updated successfully');
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'An error occurred';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
// Updated password change handler with delay
const handlePasswordSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  
  // Validate password inputs
  if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
    toast.error('New passwords do not match');
    setIsSubmitting(false);
    return;
  }
  
  try {
    // Add a minimum delay of 800ms to show the loading state
    const updatePromise = dispatch(changePassword(passwordInfo)).unwrap();
    const delayPromise = new Promise(resolve => setTimeout(resolve, 800));
    
    // Wait for both promises to complete (API call and minimum delay)
    await Promise.all([updatePromise, delayPromise]);
    
    // Display success toast
    toast.success('Password changed successfully');
    
    // Reset password fields
    setPasswordInfo({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    toast.error(message);
  } finally {
    setIsSubmitting(false);
  }
};
  
  const handleCharitySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await dispatch(updateCharityDetails(charityInfo)).unwrap();
      toast.success('Charity information updated successfully');
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'An error occurred';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDonorSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await dispatch(updateProfileDetails(donorInfo)).unwrap();
      toast.success('Donor preferences updated successfully');
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'An error occurred';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && !profileFetchAttempted) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-white text-xl font-bold">My Profile</h1>
            {user && (
              <p className="text-white text-sm mt-1">
                Account Type: {user.role === 'donor' ? 'Donor' : 'Charity Organization'}
              </p>
            )}
          </div>
          
          {/* Profile tabs */}
          <div className="flex border-b">
            <button
              className={`px-6 py-3 focus:outline-none ${
                activeTab === 'general' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('general')}
            >
              General Information
            </button>
            <button
              className={`px-6 py-3 focus:outline-none ${
                activeTab === 'password' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('password')}
            >
              Change Password
            </button>
            <button
              className={`px-6 py-3 focus:outline-none ${
                activeTab === 'specific' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('specific')}
            >
              {user && user.role === 'charity' ? 'Charity Details' : 'Donor Preferences'}
            </button>
          </div>
          
          {/* General Information Form */}
          {activeTab === 'general' && (
            <form onSubmit={handleGeneralSubmit} className="p-6">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Full Name
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  value={generalInfo.name}
                  onChange={handleGeneralInfoChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={generalInfo.email}
                  onChange={handleGeneralInfoChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                  Phone Number
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Phone Number"
                  value={generalInfo.phone}
                  onChange={handleGeneralInfoChange}
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                  Address
                </label>
                <textarea
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="address"
                  name="address"
                  placeholder="Address"
                  value={generalInfo.address}
                  onChange={handleGeneralInfoChange}
                  rows="3"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {isSubmitting && <span className="flex items-center"><span className="animate-pulse mr-2">●</span> Updating your profile...</span>}
                </div>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-all duration-200 ease-in-out"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update Information'}
                </button>
              </div>
            </form>
          )}
          
          {/* Password Change Form */}
          {activeTab === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="p-6">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="currentPassword">
                Current Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="currentPassword"
                name="currentPassword"
                type="password"
                placeholder="Current Password"
                value={passwordInfo.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
                New Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="newPassword"
                name="newPassword"
                type="password"
                placeholder="New Password"
                value={passwordInfo.newPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                Confirm New Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm New Password"
                value={passwordInfo.confirmPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {isSubmitting && (
                  <span className="flex items-center">
                    <span className="animate-pulse mr-2">●</span> Updating password...
                  </span>
                )}
              </div>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-all duration-200 ease-in-out"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Updating...' : 'Change Password'}
              </button>
            </div>
            
            <div className="mt-4 text-xs text-gray-500">
              <p>Password requirements:</p>
              <ul className="list-disc ml-5 mt-1">
                <li>At least 8 characters long</li>
                <li>Include uppercase and lowercase letters</li>
                <li>Include at least one number</li>
                <li>Include at least one special character</li>
              </ul>
            </div>
          </form>
        )}
          
          {/* User Type Specific Form */}
          {activeTab === 'specific' && user && (
            <>
              {user.role === 'charity' && (
                // Charity specific form
                <form onSubmit={handleCharitySubmit} className="p-6">
                  {charityLoading ? (
                    <div className="text-center py-4">Loading charity information...</div>
                  ) : !managerCharity ? (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
                      <p>No charity organization found. Please contact an administrator if you believe this is an error.</p>
                    </div>
                  ) : (
                    <>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                          Organization Name
                        </label>
                        <input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Organization Name"
                          value={charityInfo.name}
                          onChange={handleCharityInfoChange}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="registrationId">
                          Registration Number
                        </label>
                        <input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="registrationId"
                          name="registrationId"
                          type="text"
                          placeholder="Official Registration Number"
                          value={charityInfo.registrationId}
                          onChange={handleCharityInfoChange}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                          Organization Type
                        </label>
                        <select
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="category"
                          name="category"
                          value={charityInfo.category}
                          onChange={handleCharityInfoChange}
                          required
                        >
                          <option value="">Select Organization Type</option>
                          <option value="EDUCATION">Education</option>
                          <option value="HEALTHCARE">Healthcare</option>
                          <option value="ENVIRONMENT">Environment</option>
                          <option value="HUMANITARIAN">Humanitarian</option>
                          <option value="ANIMAL_WELFARE">Animal Welfare</option>
                          <option value="ARTS_CULTURE">Arts & Culture</option>
                          <option value="DISASTER_RELIEF">Disaster Relief</option>
                          <option value="HUMAN_RIGHTS">Human Rights</option>
                          <option value="COMMUNITY_DEVELOPMENT">Community Development</option>
                          <option value="RELIGIOUS">Religious</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                          Organization Email
                        </label>
                        <input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="email"
                          name="email"
                          type="email"
                          placeholder="contact@yourcharity.org"
                          value={charityInfo.email}
                          onChange={handleCharityInfoChange}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                          Organization Phone
                        </label>
                        <input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="Phone Number"
                          value={charityInfo.phone || ''}
                          onChange={handleCharityInfoChange}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                          Address
                        </label>
                        <input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="address"
                          name="address"
                          type="text"
                          placeholder="Organization Address"
                          value={charityInfo.address || ''}
                          onChange={handleCharityInfoChange}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="foundedYear">
                          Founded Year
                        </label>
                        <input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="foundedYear"
                          name="foundedYear"
                          type="number"
                          placeholder="Year Founded"
                          min="1800"
                          max={new Date().getFullYear()}
                          value={charityInfo.foundedYear || ''}
                          onChange={handleCharityInfoChange}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                          Description
                        </label>
                        <textarea
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="description"
                          name="description"
                          placeholder="Brief description of your organization..."
                          value={charityInfo.description}
                          onChange={handleCharityInfoChange}
                          rows="3"
                          required
                        />
                      </div>
                      <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mission">
                          Mission Statement
                        </label>
                        <textarea
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="mission"
                          name="mission"
                          placeholder="Your organization's mission..."
                          value={charityInfo.mission}
                          onChange={handleCharityInfoChange}
                          rows="4"
                          required
                        />
                      </div>
                      <div className="flex items-center justify-end">
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                          type="submit"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Updating...' : 'Update Charity Information'}
                        </button>
                      </div>
                    </>
                  )}
                </form>
              )}
              
              {user.role === 'donor' && (
                // Donor specific form
                <form onSubmit={handleDonorSubmit} className="p-6">
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="preferredCauses">
                      Preferred Causes
                    </label>
                    <select
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="preferredCauses"
                      name="preferredCauses"
                      value={donorInfo.preferredCauses}
                      onChange={handleDonorInfoChange}
                      multiple
                    >
                      <option value="education">Education</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="environment">Environment</option>
                      <option value="animalWelfare">Animal Welfare</option>
                      <option value="humanRights">Human Rights</option>
                      <option value="disasterRelief">Disaster Relief</option>
                      <option value="povertyReduction">Poverty Reduction</option>
                      <option value="other">Other</option>
                    </select>
                    <p className="text-sm text-gray-500 mt-1">Hold Ctrl (or Cmd) to select multiple options</p>
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="donationPreferences">
                      Donation Preferences
                    </label>
                    <textarea
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="donationPreferences"
                      name="donationPreferences"
                      placeholder="Any specific preferences for your donations..."
                      value={donorInfo.donationPreferences}
                      onChange={handleDonorInfoChange}
                      rows="4"
                    />
                  </div>
                  <div className="flex items-center justify-end">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Updating...' : 'Update Preferences'}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;