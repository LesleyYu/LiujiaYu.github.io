import React, { useEffect, useState } from 'react';

// A component that computes and displays relative time auto updating every second.
const RelativeTime: React.FC<{ time: string }> = ({ time }) => {
  const [relative, setRelative] = useState('');

  const computeRelative = () => {
    const now = new Date();
    const past = new Date(time);
    const diffSec = Math.floor((now.getTime() - past.getTime()) / 1000);
    if (diffSec < 60) {
      return `${diffSec || 1} second${diffSec === 1 ? '' : 's'} ago`;
    }
    const minutes = Math.floor(diffSec / 60);
    if (minutes < 60) {
      return `${minutes || 1} minute${minutes === 1 ? '' : 's'} ago`;
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours || 1} hour${hours === 1 ? '' : 's'} ago`;
    }
    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  };

  useEffect(() => {
    setRelative(computeRelative());
    const interval = setInterval(() => {
      setRelative(computeRelative());
    }, 1000);
    return () => clearInterval(interval);
  }, [time]);

  return <span>{relative}</span>;
};

export default RelativeTime;