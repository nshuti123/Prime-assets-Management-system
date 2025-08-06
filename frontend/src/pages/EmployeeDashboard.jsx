import React, { useEffect, useState } from 'react';
import EmployeeSidebar from '../components/EmployeeSidebar';

const EmployeeDashboard = () => {
  const [myAssets, setMyAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyAssets = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/assets/my-assets', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch your assets.');

        const data = await res.json();
        setMyAssets(data.assets);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyAssets();
  }, []);

  const total = myAssets.length;
  const conditionCount = {
    good: myAssets.filter((a) => a.condition === 'Good').length,
    needsRepair: myAssets.filter((a) => a.condition === 'Needs-Repair').length,
    broken: myAssets.filter((a) => a.condition === 'Broken').length,
    lost: myAssets.filter((a) => a.condition === 'Lost').length,
  };

  return (
    <div className="flex min-h-screen bg-[#f9fafb] text-black">
      <EmployeeSidebar />
      <main className="flex-1 p-6 transform scale-90">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold">Welcome to Your Dashboard</h1>
          <p className="text-gray-600 text-sm mt-1">Quick overview of your assigned assets</p>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <>
            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-4 shadow rounded-lg border-l-4 border-blue-600">
                <h3 className="text-gray-600 text-sm">Total Assets</h3>
                <p className="text-2xl font-semibold">{total}</p>
              </div>
              <div className="bg-white p-4 shadow rounded-lg border-l-4 border-green-600">
                <h3 className="text-gray-600 text-sm">In Good Condition</h3>
                <p className="text-2xl font-semibold">{conditionCount.good}</p>
              </div>
              <div className="bg-white p-4 shadow rounded-lg border-l-4 border-yellow-600">
                <h3 className="text-gray-600 text-sm">Needs Repair</h3>
                <p className="text-2xl font-semibold">{conditionCount.needsRepair}</p>
              </div>
              <div className="bg-white p-4 shadow rounded-lg border-l-4 border-red-600">
                <h3 className="text-gray-600 text-sm">My Lost Assets</h3>
                <p className="text-2xl font-semibold">{conditionCount.lost}</p>
              </div>
            </div>

            {/* Recently Assigned Assets */}
            <section className="bg-white p-6 shadow rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Recently Assigned</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-100 text-left">
                    <tr>
                      <th className="px-4 py-2 font-semibold text-gray-700">Asset Name</th>
                      <th className="px-4 py-2 font-semibold text-gray-700">Condition</th>
                      <th className="px-4 py-2 font-semibold text-gray-700">Purchase Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {myAssets.slice(0, 3).map((asset) => (
                      <tr key={asset.id}>
                        <td className="px-4 py-2">{asset.name}</td>
                        <td className="px-4 py-2">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              asset.condition === 'Good'
                                ? 'bg-green-100 text-green-700'
                                : asset.condition === 'Needs-Repair'
                                ? 'bg-yellow-100 text-yellow-700'
                                : asset.condition === 'Lost'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {asset.condition}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          {new Date(asset.purchaseDate).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default EmployeeDashboard;
