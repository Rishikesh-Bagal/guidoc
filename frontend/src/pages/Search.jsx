import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { documentService } from '../services/documentService';

const CATEGORIES = ['All', 'Identity', 'Vehicle', 'Income & Taxes', 'Property', 'Education', 'Health', 'Other'];

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    
    const fetchDocuments = async () => {
      setLoading(true);
      setError(null);
      try {
        let docs = [];
        if (searchQuery.trim()) {
          docs = await documentService.searchDocuments(searchQuery);
        } else {
          docs = await documentService.getAllDocuments();
        }
        if (isMounted) {
          setDocuments(docs);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load documents. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const timerId = setTimeout(() => {
      fetchDocuments();
    }, 300); // 300ms debounce

    return () => {
      isMounted = false;
      clearTimeout(timerId);
    };
  }, [searchQuery]);

  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const matchesCategory = activeCategory === 'All' || doc.category === activeCategory;
      return matchesCategory;
    });
  }, [documents, activeCategory]);

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>Find Your Government Document</h1>
        <p>Search by document name, category, or purpose to view exact requirements and official procedures.</p>
        
        <div className="search-bar-container">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            className="search-input" 
            placeholder="e.g. 'Update address in Aadhaar' or 'Income Certificate'"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-container">
          {CATEGORIES.map(category => (
            <button 
              key={category} 
              className={`filter-chip ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="search-results-container">
        {loading ? (
          <div className="empty-state">
            <div className="empty-icon">⏳</div>
            <h3>Loading documents...</h3>
          </div>
        ) : error ? (
          <div className="empty-state">
            <div className="empty-icon">⚠️</div>
            <h3>{error}</h3>
            <button className="btn-secondary" onClick={() => setSearchQuery(searchQuery)}>
              Retry
            </button>
          </div>
        ) : filteredDocuments.length > 0 ? (
          <div className="documents-grid">
            {filteredDocuments.map(doc => (
              <div 
                key={doc.id} 
                className="doc-card" 
                onClick={() => navigate(`/documents/${doc.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="doc-card-header">
                  <div className="doc-icon">{doc.icon}</div>
                  <span className="doc-category-label">{doc.category}</span>
                </div>
                <h3>{doc.title}</h3>
                <p className="doc-desc">{doc.description}</p>
                <div className="doc-tags">
                  {doc.tags.map(tag => (
                    <span key={tag} className="doc-tag">{tag}</span>
                  ))}
                </div>
                <div className="doc-actions">
                  <button className="btn-secondary doc-btn" onClick={() => navigate(`/documents/${doc.id}`)}>
                    View Requirements
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📂</div>
            <h3>No matching documents found</h3>
            <p>We couldn't find anything matching "{searchQuery}" in the {activeCategory} category. Try adjusting your search terms.</p>
            <button className="btn-secondary" onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}>
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
