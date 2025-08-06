import React, { useState, useEffect } from 'react';
import Sidebar from '../components/SideBar';
import '../styles/AssetsPage.css';
import { FiEdit, FiTrash2, FiUserPlus, FiPlus, FiPlusCircle } from 'react-icons/fi';
import AssignAssetModal from '../components/AssignAssetModal';
import AddAssetModal from '../components/AddAssetModal';
import EditAssetModal from '../components/EditAssetModal';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import AddMultipleAssetsModal from '../components/AddMultipleAssetsModal';


const AssetsPage = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showMultipleAssetsModal, setShowMultipleAssetsModal] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);

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
    <div className="flex-1">
      <Sidebar onToggle={setIsSidebarOpen} />
      <main
        className={`transition-all duration-300 p-4 ${
          isSidebarOpen ? 'ml-64' : 'ml-10'
        }`}
      >
        <header className="flex flex-wrap justify-between items-center mb-6 text-sm">
          <div className="mb-2 sm:mb-0">
            <h1 className="text-xl font-semibold text-gray-900 mb-1">Asset Management</h1>
            <p className="text-gray-500 text-xs">View and manage company assets</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              placeholder="Search by name, category, or serial number..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="px-3 py-1.5 rounded border border-gray-300 text-sm"
            />

            <button onClick={handleExportCSV} className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm">Export CSV</button>
            <button onClick={() => window.print()} className="bg-green-600 text-white px-3 py-1.5 rounded text-sm">Print</button>
            <button onClick={() => setShowAddModal(true)} className="bg-gray-800 text-white px-3 py-1.5 rounded text-sm flex items-center gap-1">
              <FiPlus /> Add Asset
            </button>
            <button onClick={() => setShowMultipleAssetsModal(true)} className="bg-gray-500 text-white px-3 py-1.5 rounded text-sm flex items-center gap-1">
              <FiPlusCircle /> Add Multiple Assets
            </button>
          </div>
        </header>

        {loading ? (
          <p className="text-center">Loading assets...</p>
        ) : error ? (
          <p className="text-red-600 text-center">{error}</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full bg-white text-xs rounded-lg overflow-hidden shadow-md transform scale-95">
                <thead className="bg-gray-100">
                  <tr className='w-full'>
                    <th className="px-3 py-2 text-left">#</th>
                    <th className="px-3 py-2 text-left">Asset Name</th>
                    <th className="px-3 py-2 text-left">Category</th>
                    <th className="px-3 py-2 text-left">Serial Number</th>
                    <th className="px-3 py-2 text-left">Value</th>
                    <th className="px-3 py-2 text-left">Condition</th>
                    <th className="px-3 py-2 text-left">Assigned To</th>
                    <th className="px-3 py-2 text-left">Purchase Date</th>
                    <th className="px-3 py-2 text-left print:hidden">Document</th>
                    <th className="px-3 py-2 text-left print:hidden">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentAssets.map((asset, index) => (
                    <tr key={asset.id} className="border-b hover:bg-gray-50">
                      <td className="px-3 py-2">{indexOfFirstItem + index + 1}</td>
                      <td className="px-3 py-2">{asset.name}</td>
                      <td className="px-3 py-2">{asset.category}</td>
                      <td className="px-3 py-2">{asset.serialNumber}</td>
                      <td className="px-3 py-2">{asset.value}</td>
                      <td className="px-3 py-2 font-semibold capitalize text-xs">
                        <span
                            className={`inline-block px-2 py-1 rounded text-xs font-medium ${
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
                      <td className="px-3 py-2">{asset.assignedUser ? asset.assignedUser.name : 'Unassigned'}</td>
                      <td className="px-3 py-2">{new Date(asset.purchaseDate).toLocaleDateString()}</td>
                      <td className="px-3 py-2 print:hidden">
                        {asset.document ? (
                          <a href={`http://localhost:5000/uploads/${asset.document}`} target="_blank" rel="noreferrer">View</a>
                        ) : 'N/A'}
                      </td>
                      <td className="px-3 py-2 flex gap-1 print:hidden">
                        <button className="text-blue-600 text-sm" onClick={() => handleEditClick(asset)}><FiEdit /></button>
                        <button className="text-red-600 text-sm" onClick={() => handleDelete(asset)}><FiTrash2 /></button>
                        <button className="text-green-600 text-sm" onClick={() => { setSelectedAsset(asset); setShowModal(true); }}><FiUserPlus /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-center gap-4 text-sm">
              <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Previous</button>
              <span>Page {currentPage} of {Math.ceil(filteredAssets.length / itemsPerPage)}</span>
              <button onClick={() => setCurrentPage(prev => prev + 1)} disabled={indexOfFirstItem + currentAssets.length >= filteredAssets.length} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Next</button>
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
      </main>
    </div>
  );
};

export default AssetsPage;
