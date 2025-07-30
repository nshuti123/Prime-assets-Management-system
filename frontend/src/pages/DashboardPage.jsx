import React, { useState, useEffect } from 'react';
import Sidebar from '../components/SideBar';
import DashboardCard from '../components/DashboardCard';
import '../styles/DashboardPage.css';

const DashboardPage = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/dashboard', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!res.ok) throw new Error('Failed to fetch dashboard data');

        const data = await res.json();

        setStats([
          { title: "Total Assets", value: data.totalAssets, color: "#4f46e5" },
          { title: "Assigned Assets", value: data.assignedAssets, color: "#10b981" },
          { title: "Assets Needing Repair", value: data.assetsNeedingRepair, color: "#f59e0b" },
          { title: "Lost Assets", value: data.lostAssets, color: "#ef4444" },
        ]);

      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Welcome back, Admin</h1>
          <p>Here's a summary of your assets</p>
        </header>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <section className="dashboard-cards">
            {stats.map(({ title, value, color }) => (
              <DashboardCard key={title} title={title} value={value} color={color} />
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
