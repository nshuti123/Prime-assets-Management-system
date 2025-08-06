import React, { useEffect, useState } from 'react';
import Sidebar from '../components/SideBar'; // Admin sidebar
import '../styles/MyAssets.css'; // Reuse same styles

const AssignmentHistory = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/assignments', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!res.ok) throw new Error('Failed to fetch assignment history.');

      const data = await res.json();
      setAssignments(data.assignments);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const markAsReturned = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/assignments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          returnedDate: new Date().toISOString()
        })
      });

      if (!res.ok) throw new Error('Failed to mark as returned.');

      const data = await res.json();
      alert('Marked as returned!');

      // Update the assignment in state
      setAssignments(prev => prev.map(a => a.id === id ? data.assignment : a));

    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="flex-1">
      <Sidebar onToggle={setIsSidebarOpen} />
      <main
        className={`transition-all duration-300 p-4 ${
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
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                <tr>
                  <th className="px-4 py-2 border-b">#</th>
                  <th className="px-4 py-2 border-b">Asset ID</th>
                  <th className="px-4 py-2 border-b">User ID</th>
                  <th className="px-4 py-2 border-b">Assigned Date</th>
                  <th className="px-4 py-2 border-b">Returned Date</th>
                  <th className="px-4 py-2 border-b">Notes</th>
                  <th className="px-4 py-2 border-b">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {assignments.map((record, i) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{i + 1}</td>
                    <td className="px-4 py-2 border-b">{record.assetId}</td>
                    <td className="px-4 py-2 border-b">{record.userId}</td>
                    <td className="px-4 py-2 border-b">{record.assignmentDate ? new Date(record.assignmentDate).toLocaleDateString() : 'N/A'}</td>
                    <td className="px-4 py-2 border-b">{record.returnedDate ? new Date(record.returnedDate).toLocaleDateString() : 'Not Returned'}</td>
                    <td className="px-4 py-2 border-b">{record.notes || '-'}</td>
                    <td className="px-4 py-2 border-b">
                      {record.returnedDate ? (
                        <span className="text-white bg-green-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">Returned</span>
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
