import React, { useEffect, useState } from 'react';
import SideBar from '../components/SideBar'; // Admin sidebar
import '../styles/MyAssets.css'; // Reuse same styles

const AssignmentHistory = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    <div className="dashboard-wrapper">
      <SideBar />
      <main className="my-assets-main">
        <h1>Assignment History</h1>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <table className="my-assets-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Asset ID</th>
                <th>User ID</th>
                <th>Assigned Date</th>
                <th>Returned Date</th>
                <th>Notes</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((record, i) => (
                <tr key={record.id}>
                  <td>{i + 1}</td>
                  <td>{record.assetId}</td>
                  <td>{record.userId}</td>
                  <td>{record.assignmentDate ? new Date(record.assignmentDate).toLocaleDateString() : 'N/A'}</td>
                  <td>{record.returnedDate ? new Date(record.returnedDate).toLocaleDateString() : 'Not Returned'}</td>
                  <td>{record.notes || '-'}</td>
                  <td>
                    {record.returnedDate ? (
                      <span style={{ color: 'green' }}>Returned</span>
                    ) : (
                      <button onClick={() => markAsReturned(record.id)} className="return-btn">
                        Mark as Returned
                      </button>
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

export default AssignmentHistory;
