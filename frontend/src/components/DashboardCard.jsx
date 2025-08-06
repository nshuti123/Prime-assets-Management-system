import React from 'react';

const DashboardCard = ({ title, value, color }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-center"
      style={{ borderLeft: `5px solid ${color}` }}
    >
      <h4 className="text-gray-700 font-semibold mb-2">{title}</h4>
      <p className="text-4xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

export default DashboardCard;
