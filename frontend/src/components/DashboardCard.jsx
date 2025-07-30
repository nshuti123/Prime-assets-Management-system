import React from 'react';

const DashboardCard = ({ title, value, color }) => {
  return (
    <div className="dashboard-card" style={{ borderLeft: `5px solid ${color}` }}>
      <h4>{title}</h4>
      <p className="value">{value}</p>
    </div>
  );
};

export default DashboardCard;
