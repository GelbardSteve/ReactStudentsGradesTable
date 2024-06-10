import React from 'react';

export const EmptyPage = ({ text }) => {
  const styles = {
    transform: 'translate(-50%, -50%)',
    position: 'absolute',
    top: '50%',
    left: '50%',
  };
  return <div style={styles}>{text}</div>;
};
