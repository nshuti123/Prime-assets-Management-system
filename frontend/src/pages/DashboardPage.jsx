import React, { useState, useEffect } from 'react';
import Sidebar from '../components/SideBar';
import DashboardCard from '../components/DashboardCard';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

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

  // Prepare data for charts
  const chartData = stats.map(({ title, value, color }) => ({
    name: title,
    value,
    color
  }));

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
          <>
            {/* Cards */}
            <section className="grid gap-7 grid-cols-[repeat(auto-fit,minmax(180px,1fr))] mb-8">
              {stats.map(({ title, value, color }) => (
                <DashboardCard key={title} title={title} value={value} color={color} />
              ))}
            </section>

            {/* Charts */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Pie Chart */}
              <div className="bg-white p-4 shadow rounded-lg">
                <h2 className="text-lg font-semibold mb-4">Asset Distribution</h2>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Bar Chart */}
              <div className="bg-white p-4 shadow rounded-lg">
                <h2 className="text-lg font-semibold mb-4">Asset Overview</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value">
                      {chartData.map((entry, index) => (
                        <Cell key={`bar-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
