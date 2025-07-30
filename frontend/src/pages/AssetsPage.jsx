import React, { useState, useEffect } from 'react';
import Sidebar from '../components/SideBar';
import '../styles/AssetsPage.css';
import { FiEdit, FiTrash2, FiUserPlus, FiPlus, FiPlusCircle } from 'react-icons/fi';
import AssignAssetModal from '../components/AssignAssetModal';
import AddAssetModal from '../components/AddAssetModal';
import EditAssetModal from '../components/EditAssetModal';
import TransferAssetModal from "../components/TransferAssetModal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillTransfer } from '@fortawesome/free-solid-svg-icons';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import AddMultipleAssetsModal from '../components/AddMultipleAssetsModal';


const AssetsPage = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showMultipleAssetsModal, setShowMultipleAssetsModal] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);

  const [selectedAssetForTransfer, setSelectedAssetForTransfer] = useState(null);
  const [showTransferModal, setShowTransferModal] = useState(false);

  const [employees, setEmployees] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Fetch assets
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/assets', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) throw new Error('Failed to fetch assets');

        const data = await response.json();
        setAssets(data.assets);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/users/employees', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        const data = await res.json();
        setEmployees(data);
      } catch (err) {
        console.error('Failed to fetch employees', err);
      }
    };

    fetchEmployees();
  }, []);

  // Search filter
  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAssets = filteredAssets.slice(indexOfFirstItem, indexOfLastItem);

  // Handlers
  const handleAddAsset = (newAsset) => {
    setAssets(prev => [...prev, newAsset]);
  };

 const handleUploadCSV = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('http://localhost:5000/api/assets/upload-csv', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: formData,
    });

    const contentType = response.headers.get('content-type') || '';
    let data = null;
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(`Unexpected response: ${text}`);
    }

    if (response.ok) {
      alert(data.message);
      setShowMultipleAssetsModal(false);
      // Optional: Refresh assets
    } else {
      alert(data.message || 'Upload failed');
    }
  } catch (err) {
    console.error(err);
    alert('Error uploading CSV file: ' + err.message);
  }
};



  const handleEditClick = (asset) => {
    setEditingAsset(asset);
    setShowEditModal(true);
  };

  const handleSaveAsset = (updatedAsset) => {
    setAssets(prevAssets =>
      prevAssets.map(asset =>
        asset.id === updatedAsset.id ? updatedAsset : asset
      )
    );
  };

  const handleDelete = async (asset) => {
    if (window.confirm(`Are you sure you want to delete "${asset.name}"?`)) {
      try {
        await fetch(`http://localhost:5000/api/assets/${asset.id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        setAssets(prevAssets => prevAssets.filter(a => a.id !== asset.id));
        alert('Asset Deleted!');
      } catch (err) {
        console.error(err);
        alert('Failed to delete Asset');
      }
    }
  };

  const handleAssign = async (assetId, employeeId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/assets/${assetId}/assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ assignedTo: Number(employeeId) }),
      });

      if (!response.ok) throw new Error('Failed to assign asset');

      const updatedAsset = await response.json();

      const assignedEmployee = employees.find(emp => emp.id === Number(employeeId));

      const enrichedAsset = {
        ...updatedAsset,
        assignedUser: assignedEmployee ? { id: assignedEmployee.id, name: assignedEmployee.name } : null,
      };

      setAssets(prevAssets =>
        prevAssets.map(asset =>
          asset.id === assetId ? enrichedAsset : asset
        )
      );

      alert('Asset assigned!');
    } catch (err) {
      console.error(err);
      alert('Failed to assign asset');
    }
  };

  const openTransferModal = (asset) => {
    setSelectedAssetForTransfer(asset);
    setShowTransferModal(true);
  };

  const handleExportCSV = () => {
    const csvData = assets.map(asset => ({
      Name: asset.name,
      Category: asset.category,
      SerialNumber: asset.serialNumber,
      Value: asset.value,
      Condition: asset.condition,
      AssignedTo: asset.assignedUser ? asset.assignedUser.name : 'Unassigned',
      PurchaseDate: new Date(asset.purchaseDate).toLocaleDateString(),
      Document: asset.document || 'N/A',
    }));


    const csv = Papa.unparse(csvData);

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'assets_export.csv');
  };

  return (
    <div className="dashboard-wrapper">
     <Sidebar />
      <main className="assets-main">
        <header className="assets-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ margin: 0, fontWeight: '600', fontSize: '1.8rem' }}>Asset Management</h1>
            <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>View and manage company assets</p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search by name, category, or serial number..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '5px',
                border: '1px solid #ccc',
                fontSize: '1rem'
              }}
            />

            <button onClick={handleExportCSV} style={{
              backgroundColor: '#007bff', color: '#fff', border: 'none',
              padding: '0.5rem 1rem', borderRadius: '5px', fontSize: '1rem',
              cursor: 'pointer'
            }}>
              Export CSV
            </button>
            <button
              onClick={() => window.print()}
               className="print-btn"
              style={{
              backgroundColor: '#28a745', // Green color for print
              color: '#fff',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '5px',
              fontSize: '1rem',
              cursor: 'pointer'
                }}
                >
              Print
              </button>

            <button onClick={() => setShowAddModal(true)} style={{
              backgroundColor: '#222', color: '#fff', border: 'none',
              padding: '0.5rem 1rem', borderRadius: '5px', fontSize: '1rem',
              cursor: 'pointer'
            }}>
              <FiPlus /> Add Asset
            </button>

            <button
  onClick={() => setShowMultipleAssetsModal(true)}
  style={{
    backgroundColor: '#6c757d', color: '#fff', border: 'none',
    padding: '0.5rem 1rem', borderRadius: '5px', fontSize: '1rem',
    cursor: 'pointer'
  }}
>
  <FiPlusCircle /> Add Multiple Assets
</button>
          </div>
        </header>

        {loading ? (
          <p>Loading assets...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <>
            <div className='table-scroll-container'>
              <table className="assets-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Asset Name</th>
                    <th>Category</th>
                    <th>Serial Number</th>
                    <th>Value</th>
                    <th>Condition</th>
                    <th>Assigned To</th>
                    <th>Purchase Date</th>
                    <th className="no-print">Document</th>
                    <th className="no-print">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentAssets.map((asset, index) => (
                    <tr key={asset.id}>
                      <td>{indexOfFirstItem + index + 1}</td>
                      <td>{asset.name}</td>
                      <td>{asset.category}</td>
                      <td>{asset.serialNumber}</td>
                      <td>{asset.value}</td>
                      <td>
                        <span className={`condition ${asset.condition.toLowerCase().replace(' ', '-')}`}>
                          {asset.condition}
                        </span>
                      </td>
                      <td>{asset.assignedUser ? asset.assignedUser.name : 'Unassigned'}</td>
                      <td>{new Date(asset.purchaseDate).toLocaleDateString()}</td>
                      <td  className="no-print">
                        {asset.document ? (
                          <a href={`http://localhost:5000/uploads/${asset.document}`} target="_blank" rel="noreferrer">View</a>
                        ) : 'N/A'}
                      </td>
                      <td  className="no-print">
                        <button className="action-btn edit" onClick={() => handleEditClick(asset)}><FiEdit /></button>
                        <button className="action-btn delete" onClick={() => handleDelete(asset)}><FiTrash2 /></button>
                        <button className="action-btn assign" onClick={() => { setSelectedAsset(asset); setShowModal(true); }}><FiUserPlus /></button>
                        <button onClick={() => openTransferModal(asset)} className="action-btn transfer">
                          <FontAwesomeIcon icon={faMoneyBillTransfer} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                Previous
              </button>

              <span>Page {currentPage} of {Math.ceil(filteredAssets.length / itemsPerPage)}</span>

              <button onClick={() => setCurrentPage(prev => prev + 1)} disabled={indexOfLastItem >= filteredAssets.length}>
                Next
              </button>
            </div>
          </>
        )}

        {showAddModal && (
          <AddAssetModal onClose={() => setShowAddModal(false)} onAdd={handleAddAsset} />
        )}

        {showModal && selectedAsset && (
          <AssignAssetModal
            asset={selectedAsset}
            employees={employees}
            onClose={() => setShowModal(false)}
            onAssign={handleAssign}
          />
        )}

        {showMultipleAssetsModal && (
  <AddMultipleAssetsModal
    onClose={() => setShowMultipleAssetsModal(false)}
    onUpload={handleUploadCSV}
  />
)}


        {showEditModal && editingAsset && (
          <EditAssetModal
            asset={editingAsset}
            onClose={() => setShowEditModal(false)}
            onSave={handleSaveAsset}
          />
        )}

        {showTransferModal && selectedAssetForTransfer && (
          <TransferAssetModal
            asset={selectedAssetForTransfer}
            onClose={() => setShowTransferModal(false)}
            onTransferSuccess={() => setShowTransferModal(false)}
          />
        )}
      </main>
    </div>
  );
};

export default AssetsPage;
