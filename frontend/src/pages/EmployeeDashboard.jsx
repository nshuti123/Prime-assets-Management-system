import React, { useEffect, useState } from 'react';
import EmployeeSidebar from '../components/EmployeeSidebar';
import '../styles/EmployeeDashboard.css';

const EmployeeDashboard = () => {
  const [myAssets, setMyAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyAssets = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/assets/my-assets', {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
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
    good: myAssets.filter(a => a.condition === 'Good').length,
    needsRepair: myAssets.filter(a => a.condition === 'Needs-Repair').length,
    broken: myAssets.filter(a => a.condition === 'Broken').length,
    lost: myAssets.filter(a => a.condition === 'Lost').length,
  };

  return (
    <div className="dashboard-wrapper">
      <EmployeeSidebar />
      <main className="employee-dashboard">
        <h1>Welcome to Your Dashboard</h1>

        {loading ? <p>Loading...</p> : error ? <p style={{ color: 'red' }}>{error}</p> : (
          <>
            <div className="dashboard-cards">
              <div className="card"><h3>Total Assets</h3><p>{total}</p></div>
              <div className="card"><h3>In Good Condition</h3><p>{conditionCount.good}</p></div>
              <div className="card"><h3>Needs Repair</h3><p>{conditionCount.needsRepair}</p></div>
              <div className="card"><h3>My Lost Assets</h3><p>{conditionCount.lost}</p></div>
            </div>

            <section className="recent-assets">
              <h2>Recently Assigned</h2>
              <table>
                <thead>
                  <tr>
                    <th>Asset Name</th>
                    <th>Condition</th>
                    <th>Purchase Date</th>
                  </tr>
                </thead>
                <tbody>
                  {myAssets.slice(0, 3).map(asset => (
                    <tr key={asset.id}>
                    <td>{asset.name}</td>
                    <td>
                      <div className={`condition ${asset.condition.toLowerCase().replace(' ', '-')}`}>
                        {asset.condition}
                      </div>
                    </td>
                    <td>{new Date(asset.purchaseDate).toLocaleDateString()}</td>
                    </tr>
                  ))}

                </tbody>
              </table>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default EmployeeDashboard;
