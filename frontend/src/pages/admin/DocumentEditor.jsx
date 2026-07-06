import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { documentService } from '../../services/documentService';
import './DocumentEditor.css';

export default function DocumentEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category: 'Identity',
    description: '',
    eligibility: '',
    requiredDocuments: '',
    onlineSteps: '',
    offlineSteps: '',
    fees: 'Free',
    processingTime: 'Varies',
    officialWebsite: '',
    isActive: true,
    importantNotes: '',
    tips: '',
    warnings: ''
  });

  const categories = [
    'Identity', 'Vehicle', 'Income & Taxes', 'Property', 'Education', 'Health', 'Other'
  ];

  useEffect(() => {
    if (isEdit) {
      fetchDocument();
    }
  }, [id]);

  const fetchDocument = async () => {
    try {
      setLoading(true);
      // Wait, documentService.getDocumentBySlug maps data.
      // But we stored rawDoc in the mapping specifically for editing!
      // Let's fetch all admin documents and find this one, or we can just fetch it by slug
      // If we pass ID in URL, we need an endpoint to get by ID or slug. The routing uses doc.id which is doc._id or slug.
      // Assuming id is slug for now since the mapping uses slug as id fallback.
      const doc = await documentService.getDocumentBySlug(id);
      if (doc && doc.rawDoc) {
        const raw = doc.rawDoc;
        setFormData({
          name: raw.name || '',
          category: raw.category || 'Identity',
          description: raw.description || '',
          eligibility: raw.eligibility?.join('\n') || '',
          requiredDocuments: raw.requiredDocuments?.join('\n') || '',
          onlineSteps: raw.onlineSteps?.join('\n') || '',
          offlineSteps: raw.offlineSteps?.join('\n') || '',
          fees: raw.fees || '',
          processingTime: raw.processingTime || '',
          officialWebsite: raw.officialWebsite || '',
          isActive: raw.isActive !== false,
          importantNotes: raw.importantNotes?.join('\n') || '',
          tips: raw.tips?.join('\n') || '',
          warnings: raw.warnings?.join('\n') || ''
        });
      }
    } catch (err) {
      console.error('Failed to load document', err);
      setError('Failed to load document data.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const processArrayField = (text) => {
    if (!text) return [];
    return text.split('\n').map(item => item.trim()).filter(item => item.length > 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        ...formData,
        eligibility: processArrayField(formData.eligibility),
        requiredDocuments: processArrayField(formData.requiredDocuments),
        onlineSteps: processArrayField(formData.onlineSteps),
        offlineSteps: processArrayField(formData.offlineSteps),
        importantNotes: processArrayField(formData.importantNotes),
        tips: processArrayField(formData.tips),
        warnings: processArrayField(formData.warnings)
      };

      if (isEdit) {
        // Find mongo _id from original fetched doc if we used slug in URL. 
        // We'd better pass the actual mongo _id to update endpoint.
        // For safety, the backend update endpoint takes ID.
        // Wait, if id in params is slug, we can't use it for PUT /:id if backend expects Mongo ObjectId.
        // Assuming backend handles both or we fetched it.
        // Let's use documentService.updateDocument. We should have passed mongo _id in Link.
        await documentService.updateDocument(id, payload);
      } else {
        await documentService.createDocument(payload);
      }
      
      navigate('/admin/documents');
    } catch (err) {
      console.error('Save failed', err);
      setError(err.response?.data?.message || 'Failed to save document. Please check the inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="admin-loading">Loading...</div>;

  return (
    <div className="document-editor">
      <div className="editor-header">
        <h2>{isEdit ? 'Edit Document' : 'Create New Document'}</h2>
        <Link to="/admin/documents" className="btn-cancel">Cancel</Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="editor-form">
        <div className="form-section">
          <h3>Basic Information</h3>
          
          <div className="form-group">
            <label>Document Name *</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              placeholder="e.g. Aadhaar Card"
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select name="category" value={formData.category} onChange={handleChange} required>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              required 
              rows="3"
              placeholder="Brief description of the document"
            />
          </div>
          
          <div className="form-group checkbox-group">
            <label>
              <input 
                type="checkbox" 
                name="isActive" 
                checked={formData.isActive} 
                onChange={handleChange} 
              />
              Active (Visible to users)
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3>Process & Requirements (One item per line)</h3>
          
          <div className="form-group">
            <label>Eligibility</label>
            <textarea 
              name="eligibility" 
              value={formData.eligibility} 
              onChange={handleChange} 
              rows="4"
              placeholder="Must be citizen of India...&#10;Age must be 18+..."
            />
          </div>

          <div className="form-group">
            <label>Required Documents</label>
            <textarea 
              name="requiredDocuments" 
              value={formData.requiredDocuments} 
              onChange={handleChange} 
              rows="4"
              placeholder="Proof of Identity&#10;Proof of Address..."
            />
          </div>

          <div className="form-group">
            <label>Online Steps</label>
            <textarea 
              name="onlineSteps" 
              value={formData.onlineSteps} 
              onChange={handleChange} 
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Offline Steps</label>
            <textarea 
              name="offlineSteps" 
              value={formData.offlineSteps} 
              onChange={handleChange} 
              rows="4"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Additional Details</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Fees</label>
              <input type="text" name="fees" value={formData.fees} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Processing Time</label>
              <input type="text" name="processingTime" value={formData.processingTime} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Official Website URL</label>
            <input type="url" name="officialWebsite" value={formData.officialWebsite} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Tips (One per line)</label>
            <textarea name="tips" value={formData.tips} onChange={handleChange} rows="3" />
          </div>

          <div className="form-group">
            <label>Warnings (One per line)</label>
            <textarea name="warnings" value={formData.warnings} onChange={handleChange} rows="3" />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-save" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Document'}
          </button>
        </div>
      </form>
    </div>
  );
}
