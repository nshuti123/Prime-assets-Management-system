import React, { useState, useEffect } from 'react';
import Sidebar from '../components/SideBar';
import DashboardCard from '../components/DashboardCard';

const DashboardPage = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
    <div className="flex-1">
      <Sidebar onToggle={setIsSidebarOpen} />
      <main
        className={`transition-all duration-300 p-4 transform scale-90 text-sm ${
          isSidebarOpen ? 'ml-64' : 'ml-10'
        }`}
      >
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome back, Admin</h1>
          <p className="text-gray-500">Here's a summary of your assets</p>
        </header>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <section className="grid gap-7 grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
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
