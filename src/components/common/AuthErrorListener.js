// components/common/AuthErrorListener.js
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { handleAuthError } from '../../redux/slices/authSlice';

const AuthErrorListener = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Handle auth errors
    const handleAuthErrorEvent = (event) => {
      dispatch(handleAuthError());
      navigate('/login');
    };
    
    window.addEventListener('authError', handleAuthErrorEvent);
    
    return () => {
      window.removeEventListener('authError', handleAuthErrorEvent);
    };
  }, [dispatch, navigate]);
  
  // This component doesn't render anything
  return null;
};

export default AuthErrorListener;