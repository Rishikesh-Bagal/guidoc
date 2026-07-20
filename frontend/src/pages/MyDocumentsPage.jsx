import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { userDocumentService } from '../services/userDocumentService';
import { FileText, Search, Plus, Filter, File, FileIcon, FileDigit, Calendar, Trash2, Brain, Loader2, X, AlertCircle } from 'lucide-react';
import axios from 'axios';
import './MyDocuments.css';

export default function MyDocumentsPage() {
  const { currentUser } = useAuth();
  const { addNotification } = useNotification();
  
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');
  
  // Modals state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  
  // Upload state
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadMetadata, setUploadMetadata] = useState({
    documentName: '',
    documentType: 'Aadhaar',
    expiryDate: '',
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // AI State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState('');

  const documentTypes = [
    'Aadhaar', 'PAN', 'Passport', 'Driving License', 'Voter ID', 
    'Income Certificate', 'Caste Certificate', 'Birth Certificate', 'Other'
  ];

  useEffect(() => {
    if (currentUser) {
      loadDocuments();
    }
  }, [currentUser]);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      // Evaluate statuses before fetching to ensure they are up to date
      await userDocumentService.evaluateDocumentStatuses(currentUser.uid);
      const docs = await userDocumentService.getUserDocuments(currentUser.uid);
      setDocuments(docs);
    } catch (error) {
      console.error('Error loading documents:', error);
      addNotification('error', 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        addNotification('error', 'Only PDF, JPG, and PNG files are allowed');
        return;
      }
      setUploadFile(file);
      if (!uploadMetadata.documentName) {
        setUploadMetadata({ ...uploadMetadata, documentName: file.name.split('.')[0] });
      }
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      addNotification('error', 'Please select a file to upload');
      return;
    }

    setUploading(true);
    setUploadProgress(30); // Simulated progress start

    try {
      const newDoc = await userDocumentService.uploadDocument(currentUser.uid, uploadFile, uploadMetadata);
      setUploadProgress(100);
      setDocuments([newDoc, ...documents]);
      addNotification('success', 'Document uploaded successfully');
      
      setTimeout(() => {
        setShowUploadModal(false);
        setUploadFile(null);
        setUploadMetadata({ documentName: '', documentType: 'Aadhaar', expiryDate: '' });
        setUploadProgress(0);
        setUploading(false);
      }, 500);
    } catch (error) {
      console.error('Upload error:', error);
      addNotification('error', 'Failed to upload document');
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (doc) => {
    if (!window.confirm(`Are you sure you want to delete ${doc.documentName}?`)) return;
    
    try {
      await userDocumentService.deleteDocument(doc.id, doc.storagePath);
      setDocuments(documents.filter(d => d.id !== doc.id));
      addNotification('success', 'Document deleted successfully');
    } catch (error) {
      addNotification('error', 'Failed to delete document');
    }
  };

  const triggerAI = async (action, doc) => {
    setAiLoading(true);
    setAiResult('');
    
    let promptText = '';
    const docInfo = `Document: ${doc.documentName} (${doc.documentType}). Status: ${doc.status}.`;
    
    if (action === 'summarize') {
      promptText = `Summarize the typical contents and importance of this government document: ${docInfo}`;
    } else if (action === 'missing') {
      promptText = `What information is typically missing or commonly overlooked when people submit a ${doc.documentType}?`;
    } else if (action === 'explain') {
      promptText = `Explain what a ${doc.documentType} is used for and its main benefits in India.`;
    } else if (action === 'services') {
      promptText = `Based on having a valid ${doc.documentType}, what next government services or applications am I eligible for?`;
    } else if (action === 'renewals') {
      promptText = `What is the standard renewal process for a ${doc.documentType}? Are there any tips to keep in mind?`;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/v1/ai/chat', {
        message: promptText
      });
      setAiResult(response.data.reply || 'Analysis complete, but no result returned.');
    } catch (error) {
      console.error('AI error:', error);
      setAiResult('Sorry, AI analysis failed. Please try again later.');
    } finally {
      setAiLoading(false);
    }
  };

  const openAiModal = (doc) => {
    setSelectedDoc(doc);
    setAiResult('');
    setShowAiModal(true);
  };

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.documentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.documentType.toLowerCase().includes(searchQuery.toLowerCase());
    if (filter === 'All') return matchesSearch;
    return matchesSearch && doc.status === filter;
  });

  const getStatusClass = (status) => {
    if (status === 'Valid') return 'status-valid';
    if (status === 'Expiring Soon') return 'status-expiring';
    if (status === 'Expired') return 'status-expired';
    return '';
  };

  return (
    <div className="my-documents-container">
      <header className="my-documents-header">
        <div className="header-title">
          <h1>My Documents</h1>
          <p>Securely manage and analyze your government documents in one place</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setShowUploadModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', background: 'var(--primary-color)', color: 'white' }}>
            <Plus size={18} /> Add Document
          </button>
        </div>
      </header>

      <div className="controls-section">
        <div className="search-bar">
          <Search size={18} color="var(--text-secondary)" />
          <input 
            type="text" 
            placeholder="Search documents by name or type..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="filters">
          {['All', 'Valid', 'Expiring Soon', 'Expired'].map(f => (
            <button 
              key={f} 
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <Loader2 className="spin" size={32} color="var(--primary-color)" />
        </div>
      ) : filteredDocs.length > 0 ? (
        <div className="document-grid">
          {filteredDocs.map(doc => (
            <div key={doc.id} className="document-card">
              <div className="card-header">
                <div className="doc-icon">
                  {doc.fileUrl?.includes('.pdf') ? <FileText size={24} /> : <File size={24} />}
                </div>
                <span className={`doc-status ${getStatusClass(doc.status)}`}>{doc.status}</span>
              </div>
              <div className="card-body">
                <h3>{doc.documentName}</h3>
                <div className="doc-type">{doc.documentType}</div>
                <div className="doc-meta">
                  <div className="meta-item">
                    <Calendar size={14} /> Uploaded: {new Date(doc.uploadDate?.toDate ? doc.uploadDate.toDate() : doc.uploadDate).toLocaleDateString()}
                  </div>
                  {doc.expiryDate && (
                    <div className="meta-item" style={{ color: doc.status === 'Expired' ? '#ef4444' : doc.status === 'Expiring Soon' ? '#f59e0b' : 'var(--text-secondary)'}}>
                      <AlertCircle size={14} /> Expiry: {new Date(doc.expiryDate.toDate ? doc.expiryDate.toDate() : doc.expiryDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
              <div className="card-footer">
                <button className="btn-ai" onClick={() => openAiModal(doc)}>
                  <Brain size={16} /> Analyze
                </button>
                <button className="btn-action" onClick={() => window.open(doc.fileUrl, '_blank')}>
                  View
                </button>
                <button className="btn-action delete" onClick={() => handleDelete(doc)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="icon">
            <FileText size={32} />
          </div>
          <h3>No documents found</h3>
          <p>You haven't uploaded any {filter !== 'All' ? filter.toLowerCase() : ''} documents yet.</p>
          <button className="btn-primary" onClick={() => setShowUploadModal(true)} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', background: 'var(--primary-color)', color: 'white' }}>
            Upload your first document
          </button>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay">
          <div className="upload-modal">
            <div className="modal-header">
              <h2><Plus size={24} /> Upload Document</h2>
              <button className="close-btn" onClick={() => !uploading && setShowUploadModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleUploadSubmit}>
                <div className="form-group">
                  <label>Document Type</label>
                  <select 
                    value={uploadMetadata.documentType} 
                    onChange={(e) => setUploadMetadata({...uploadMetadata, documentType: e.target.value})}
                    disabled={uploading}
                  >
                    {documentTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Document Name</label>
                  <input 
                    type="text" 
                    value={uploadMetadata.documentName} 
                    onChange={(e) => setUploadMetadata({...uploadMetadata, documentName: e.target.value})}
                    placeholder="e.g. My Aadhaar Card"
                    required
                    disabled={uploading}
                  />
                </div>
                
                <div className="form-group">
                  <label>Expiry Date (Optional)</label>
                  <input 
                    type="date" 
                    value={uploadMetadata.expiryDate} 
                    onChange={(e) => setUploadMetadata({...uploadMetadata, expiryDate: e.target.value})}
                    disabled={uploading}
                  />
                </div>

                <div className="form-group">
                  <label>File (PDF, JPG, PNG)</label>
                  <input 
                    type="file" 
                    accept=".pdf,image/jpeg,image/png"
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                </div>
                
                {uploading && (
                  <div className="upload-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                    <div className="upload-status">Uploading... Please wait</div>
                  </div>
                )}

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                  <button type="button" className="btn-action" onClick={() => setShowUploadModal(false)} disabled={uploading}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" disabled={uploading || !uploadFile} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', background: 'var(--primary-color)', color: 'white', opacity: uploading || !uploadFile ? 0.5 : 1 }}>
                    {uploading ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* AI Analysis Modal */}
      {showAiModal && selectedDoc && (
        <div className="modal-overlay">
          <div className="ai-modal">
            <div className="modal-header">
              <h2><Brain size={24} color="var(--primary-color)" /> AI Analysis: {selectedDoc.documentName}</h2>
              <button className="close-btn" onClick={() => setShowAiModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="ai-actions">
                <button className="ai-action-btn" onClick={() => triggerAI('summarize', selectedDoc)} disabled={aiLoading}>
                  <FileText className="icon" size={20} />
                  <div>
                    <strong>Summarize</strong>
                    <div style={{fontSize: '0.75rem', color: 'var(--text-secondary)'}}>Get document overview</div>
                  </div>
                </button>
                <button className="ai-action-btn" onClick={() => triggerAI('missing', selectedDoc)} disabled={aiLoading}>
                  <Search className="icon" size={20} />
                  <div>
                    <strong>Detect Missing Info</strong>
                    <div style={{fontSize: '0.75rem', color: 'var(--text-secondary)'}}>Find common oversights</div>
                  </div>
                </button>
                <button className="ai-action-btn" onClick={() => triggerAI('explain', selectedDoc)} disabled={aiLoading}>
                  <AlertCircle className="icon" size={20} />
                  <div>
                    <strong>Explain Document</strong>
                    <div style={{fontSize: '0.75rem', color: 'var(--text-secondary)'}}>Understand its purpose</div>
                  </div>
                </button>
                <button className="ai-action-btn" onClick={() => triggerAI('services', selectedDoc)} disabled={aiLoading}>
                  <FileDigit className="icon" size={20} />
                  <div>
                    <strong>Suggest Services</strong>
                    <div style={{fontSize: '0.75rem', color: 'var(--text-secondary)'}}>What to do next</div>
                  </div>
                </button>
                <button className="ai-action-btn" onClick={() => triggerAI('renewals', selectedDoc)} disabled={aiLoading}>
                  <Calendar className="icon" size={20} />
                  <div>
                    <strong>Recommend Renewals</strong>
                    <div style={{fontSize: '0.75rem', color: 'var(--text-secondary)'}}>Renewal tips</div>
                  </div>
                </button>
              </div>

              <div className={`ai-result-area ${aiLoading ? 'loading' : ''}`}>
                {aiLoading ? (
                  <>
                    <Loader2 className="spin" size={32} color="var(--primary-color)" />
                    <span>Analyzing document with AI...</span>
                  </>
                ) : aiResult ? (
                  <div style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                    {aiResult}
                  </div>
                ) : (
                  <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem 0' }}>
                    Select an AI action above to analyze this document.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
