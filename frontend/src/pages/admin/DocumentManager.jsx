import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { documentService } from '../../services/documentService';
import './DocumentManager.css';

export default function DocumentManager() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchDocuments();
  }, [page, searchQuery]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await documentService.getAdminDocuments(page, 10, searchQuery);
      setDocuments(res.documents);
      setTotalPages(res.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch documents', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await documentService.deleteDocument(id);
        fetchDocuments();
      } catch (error) {
        console.error('Failed to delete document', error);
        alert('Failed to delete document');
      }
    }
  };

  const handleToggleStatus = async (doc) => {
    try {
      // Toggle isActive flag (if your backend supports it, otherwise this just demonstrates the UI)
      await documentService.updateDocument(doc.id, { isActive: !doc.isActive });
      fetchDocuments();
    } catch (error) {
      console.error('Failed to update document status', error);
      alert('Failed to update status');
    }
  };

  return (
    <div className="document-manager">
      <div className="manager-header">
        <h2>Document Management</h2>
        <Link to="/admin/documents/new" className="btn-primary">
          + Add New Document
        </Link>
      </div>

      <div className="manager-controls">
        <input 
          type="text" 
          placeholder="Search documents..." 
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading-state">Loading documents...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.length > 0 ? (
                documents.map(doc => (
                  <tr key={doc.id}>
                    <td>
                      <div className="doc-name-cell">
                        <span className="doc-icon">{doc.icon}</span>
                        <span>{doc.title}</span>
                      </div>
                    </td>
                    <td>
                      <span className="category-badge">{doc.category}</span>
                    </td>
                    <td>
                      <button 
                        className={`status-badge ${doc.isActive ? 'active' : 'inactive'}`}
                        onClick={() => handleToggleStatus(doc)}
                      >
                        {doc.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Link to={`/admin/documents/edit/${doc.id}`} className="btn-action edit">
                          Edit
                        </Link>
                        <button onClick={() => handleDelete(doc.id)} className="btn-action delete">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="empty-state">No documents found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            disabled={page === 1} 
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <span className="page-info">Page {page} of {totalPages}</span>
          <button 
            disabled={page === totalPages} 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
