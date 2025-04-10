import React from 'react';

const Spinner = ({ size = 'medium' }) => {
  let sizeClass;
  
  switch (size) {
    case 'small':
      sizeClass = 'w-4 h-4';
      break;
    case 'large':
      sizeClass = 'w-10 h-10';
      break;
    case 'medium':
    default:
      sizeClass = 'w-6 h-6';
  }
  
  return (
    <div className="flex justify-center items-center">
      <div className={`${sizeClass} border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin`}></div>
    </div>
  );
};

export default Spinner;