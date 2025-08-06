import React, { useEffect, useState } from 'react';
import EmployeeSidebar from '../components/EmployeeSidebar';

const MyAssets = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/assets/my-assets', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!res.ok) throw new Error('Failed to fetch assets.');

        const data = await res.json();
        setAssets(data.assets);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  return (
    <div className="flex min-h-screen">
      <EmployeeSidebar />

      <main className="flex-1 p-6 bg-gray-100 text-xs">
        <h1 className="text-2xl font-bold mb-6">My Assigned Assets</h1>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-200 text-gray-700 text-left">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Asset Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Value</th>
                  <th className="px-4 py-3">Condition</th>
                  <th className="px-4 py-3">Purchase Date</th>
                  <th className="px-4 py-3">Related Document</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {assets.map((asset, i) => (
                  <tr key={asset.id} className="hover:bg-gray-100">
                    <td className="px-4 py-3">{i + 1}</td>
                    <td className="px-4 py-3">{asset.name}</td>
                    <td className="px-4 py-3">{asset.category}</td>
                    <td className="px-4 py-3">{asset.value}</td>
                    <td className="px-4 py-3">{asset.condition}</td>
                    <td className="px-4 py-3">{new Date(asset.purchaseDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      {asset.document ? (
                        <a
                          href={`http://localhost:5000/uploads/${asset.document}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline hover:text-blue-800"
                        >
                          📄 Open
                        </a>
                      ) : (
                        <span className="text-gray-500 italic">No Doc</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyAssets;
