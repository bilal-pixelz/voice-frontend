import React from 'react';

const GoogleIcon = ({ width = 20, height = 20 }) => {
  return (
    <img
      src="/icons/google.svg"
      alt="Google"
      width={width}
      height={height}
      style={{ marginRight: 10 }}
    />
  );
};

export default GoogleIcon;
