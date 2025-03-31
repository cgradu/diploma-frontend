// src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { getProfile, updateProfile, updateProfileDetails, changePassword } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [profileFetchAttempted, setProfileFetchAttempted] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  
  // Create separate states for different form sections
  const [generalInfo, setGeneralInfo] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
  });
  
  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  // Additional fields based on user type (donor or charity)
  const [specificInfo, setSpecificInfo] = useState({
    // Donor fields
    preferredCauses: '',
    donationPreferences: '',
    
    // Charity fields
    charityName: '',
    registrationNumber: '',
    missionStatement: '',
    organizationType: '',
    websiteUrl: '',
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
    }
    
    // Populate form with user data when available
    if (user) {
      setGeneralInfo({
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
      });
      
      // Set specific info based on user role
      if (user.role === 'charity') {
        setSpecificInfo({
          charityName: user.charityName || '',
          registrationNumber: user.registrationNumber || '',
          missionStatement: user.missionStatement || '',
          organizationType: user.organizationType || '',
          websiteUrl: user.websiteUrl || '',
          preferredCauses: '',
          donationPreferences: '',
        });
      } else if (user.role === 'donor') {
        setSpecificInfo({
          preferredCauses: user.preferredCauses || '',
          donationPreferences: user.donationPreferences || '',
          charityName: '',
          registrationNumber: '',
          missionStatement: '',
          organizationType: '',
          websiteUrl: '',
        });
      }
    }
  }, [dispatch, user, profileFetchAttempted]);
  
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
  
  const handleSpecificInfoChange = (e) => {
    setSpecificInfo({
      ...specificInfo,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleGeneralSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await dispatch(updateProfile(generalInfo)).unwrap();
      toast.success('Profile information updated successfully');
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'An error occurred';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validate password inputs
    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await dispatch(changePassword(passwordInfo)).unwrap();
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
  
  const handleSpecificSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Filter out empty fields from the other user type
      const filteredSpecificInfo = Object.fromEntries(
        Object.entries(specificInfo).filter(([key, value]) => value !== '')
      );
      
      await dispatch(updateProfileDetails(filteredSpecificInfo)).unwrap();
      toast.success('Profile details updated successfully');
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
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneNumber">
                  Phone Number
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="Phone Number"
                  value={generalInfo.phoneNumber}
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
              <div className="flex items-center justify-end">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
                  minLength="6"
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
                  minLength="6"
                />
              </div>
              <div className="flex items-center justify-end">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          )}
          
          {/* User Type Specific Form */}
          {activeTab === 'specific' && user && (
            <form onSubmit={handleSpecificSubmit} className="p-6">
              {user.role === 'charity' ? (
                // Charity specific fields
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="charityName">
                      Organization Name
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="charityName"
                      name="charityName"
                      type="text"
                      placeholder="Organization Name"
                      value={specificInfo.charityName}
                      onChange={handleSpecificInfoChange}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="registrationNumber">
                      Registration Number
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="registrationNumber"
                      name="registrationNumber"
                      type="text"
                      placeholder="Official Registration Number"
                      value={specificInfo.registrationNumber}
                      onChange={handleSpecificInfoChange}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="organizationType">
                      Organization Type
                    </label>
                    <select
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="organizationType"
                      name="organizationType"
                      value={specificInfo.organizationType}
                      onChange={handleSpecificInfoChange}
                      required
                    >
                      <option value="">Select Organization Type</option>
                      <option value="nonprofit">Non-Profit</option>
                      <option value="ngo">NGO</option>
                      <option value="foundation">Foundation</option>
                      <option value="trust">Charitable Trust</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="websiteUrl">
                      Website URL
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="websiteUrl"
                      name="websiteUrl"
                      type="url"
                      placeholder="https://yourcharity.org"
                      value={specificInfo.websiteUrl}
                      onChange={handleSpecificInfoChange}
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="missionStatement">
                      Mission Statement
                    </label>
                    <textarea
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="missionStatement"
                      name="missionStatement"
                      placeholder="Your organization's mission..."
                      value={specificInfo.missionStatement}
                      onChange={handleSpecificInfoChange}
                      rows="4"
                      required
                    />
                  </div>
                </>
              ) : (
                // Donor specific fields
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="preferredCauses">
                      Preferred Causes
                    </label>
                    <select
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="preferredCauses"
                      name="preferredCauses"
                      value={specificInfo.preferredCauses}
                      onChange={handleSpecificInfoChange}
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
                      value={specificInfo.donationPreferences}
                      onChange={handleSpecificInfoChange}
                      rows="4"
                    />
                  </div>
                </>
              )}
              <div className="flex items-center justify-end">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update Details'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;