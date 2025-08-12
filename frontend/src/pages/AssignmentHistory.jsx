import React, { useEffect, useState } from 'react';
import Sidebar from '../components/SideBar'; // Admin sidebar

const AssignmentHistory = () => {
  const [assignments, setAssignments] = useState([]);
  const [assets, setAssets] = useState({});
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');

        const [assignmentsRes, assetsRes, usersRes] = await Promise.all([
          fetch('http://localhost:5000/api/assignments', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch('http://localhost:5000/api/assets', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch('http://localhost:5000/api/users', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        if (!assignmentsRes.ok) throw new Error('Failed to fetch assignments');
        if (!assetsRes.ok) throw new Error('Failed to fetch assets');
        if (!usersRes.ok) throw new Error('Failed to fetch users');

        const assignmentsData = await assignmentsRes.json();
        const assetsData = await assetsRes.json();
        const usersData = await usersRes.json();

        // Create id -> name maps for quick lookup
        const assetsMap = {};
        (Array.isArray(assetsData) ? assetsData : assetsData.assets || []).forEach(a => {
          assetsMap[a.id] = a.name;
        });

        const usersMap = {};
        (Array.isArray(usersData) ? usersData : usersData.users || []).forEach(u => {
          usersMap[u.id] = u.name;
        });

        setAssignments(assignmentsData.assignments || []);
        setAssets(assetsMap);
        setUsers(usersMap);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const markAsReturned = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/assignments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          returnedDate: new Date().toISOString()
        })
      });

      if (!res.ok) throw new Error('Failed to mark as returned.');

      const data = await res.json();
      alert('Marked as returned!');

      setAssignments(prev => prev.map(a => a.id === id ? data.assignment : a));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex-1">
      <Sidebar onToggle={setIsSidebarOpen} />
      <main
        className={`transition-all duration-300 mt-0 transform scale-90 ${
          isSidebarOpen ? 'ml-64' : 'ml-10'
        }`}
      >
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Assignment History</h1>

        {loading ? (
          <p className="text-center text-gray-500 text-lg">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-600 text-lg">{error}</p>
        ) : (
          <div className="overflow-x-auto">  
          <table className="min-w-full bg-white">
    <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700 sticky top-0 z-10">
      
                <tr>
                  <th className="px-4 py-2 border-b">#</th>
                  <th className="px-4 py-2 border-b">Asset</th>
                  <th className="px-4 py-2 border-b">User</th>
                  <th className="px-4 py-2 border-b">Assigned Date</th>
                  <th className="px-4 py-2 border-b">Returned Date</th>
                  <th className="px-4 py-2 border-b">Notes</th>
                  <th className="px-4 py-2 border-b">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {assignments.map((record, i) => (
                  <tr
                   key={record.id}
                    className={`hover:bg-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <td className="px-4 py-2 border-b">{i + 1}</td>
                    <td className="px-4 py-2 border-b">{assets[record.assetId] || record.assetId}</td>
                    <td className="px-4 py-2 border-b">{users[record.userId] || record.userId}</td>
                    <td className="px-4 py-2 border-b">{record.assignmentDate ? new Date(record.assignmentDate).toLocaleDateString() : 'N/A'}</td>
                    <td className="px-4 py-2 border-b">{record.returnedDate ? new Date(record.returnedDate).toLocaleDateString() : 'Not Returned'}</td>
                    <td className="px-4 py-2 border-b">{record.notes || '-'}</td>
                    <td className="px-4 py-2 border-b">
                      {record.returnedDate ? (
                        <span className="text-white bg-green-600 px-3 py-1 rounded text-sm">Returned</span>
                      ) : (
                        <button
                          onClick={() => markAsReturned(record.id)}
                          className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                        >
                          Mark as Returned
                        </button>
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

export default AssignmentHistory;
