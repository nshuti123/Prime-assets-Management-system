import React, { useEffect, useState } from 'react';
import EmployeeSidebar from '../components/EmployeeSidebar';
import '../styles/MyAssets.css';

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
    <div className="dashboard-wrapper">
      <EmployeeSidebar />
      <main className="my-assets-main">
        <h1>My Assigned Assets</h1>

        {loading ? <p>Loading...</p> : error ? <p style={{ color: 'red' }}>{error}</p> : (
          <table className="my-assets-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Asset Name</th>
                <th>Category</th>
                <th>Value</th>
                <th>Condition</th>
                <th>Purchase Date</th>
                <th>Related Document</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset, i) => (
                <tr key={asset.id}>
                  <td>{i + 1}</td>
                  <td>{asset.name}</td>
                  <td>{asset.category}</td>
                  <td>{asset.value}</td>
                  <td>{asset.condition}</td>
                  <td>{new Date(asset.purchaseDate).toLocaleDateString()}</td>
                  <td>
                    {asset.document ? (
                      <a href={`http://localhost:5000/uploads/${asset.document}`} target="_blank" rel="noreferrer" className="doc-btn">
                        📄 Open
                      </a>
                    ) : (
                      <span className="no-doc">No Doc</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
};

export default MyAssets;
