import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardPage from '../DashboardPage';

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // No token? Redirect to login
      navigate('/login');
    }
    // Optionally verify token validity here
  }, [navigate]);

  return (
    <div>
      <DashboardPage />
    </div>
  );
}

export default Dashboard;
