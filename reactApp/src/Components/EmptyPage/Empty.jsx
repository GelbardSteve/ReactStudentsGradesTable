import React from 'react';

export const EmptyPage = () => {
  const styles = {
    transform: 'translate(-50%, -50%)',
    position: 'absolute',
    top: '50%',
    left: '50%',
  };
  return <div style={styles}>No favorites were added</div>;
};
