import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const DOCUMENTS = [
  {
    id: 'pan-card',
    title: 'PAN Card',
    description: 'Apply for a new Permanent Account Number or request corrections to an existing card.',
    category: 'Identity',
    tags: ['Income Tax', 'KYC', 'ID Proof'],
    icon: '💳'
  },
  {
    id: 'aadhaar-card',
    title: 'Aadhaar Card',
    description: 'Update your address, mobile number, demographics, or order a PVC Aadhaar.',
    category: 'Identity',
    tags: ['UIDAI', 'Biometric', 'Address Proof'],
    icon: '🆔'
  },
  {
    id: 'passport',
    title: 'Passport',
    description: 'Apply for fresh issuance, renewal, or Police Clearance Certificate (PCC).',
    category: 'Travel',
    tags: ['International', 'Identity', 'MEA'],
    icon: '🛂'
  },
  {
    id: 'income-certificate',
    title: 'Income Certificate',
    description: 'Obtain an official certificate proving your family\'s annual income for subsidies.',
    category: 'Certificates',
    tags: ['State Govt', 'Subsidies', 'Education'],
    icon: '📜'
  },
  {
    id: 'domicile',
    title: 'Domicile Certificate',
    description: 'Prove your residency status in a specific state for educational or employment quotas.',
    category: 'Certificates',
    tags: ['State Govt', 'Residency', 'Education'],
    icon: '🏠'
  },
  {
    id: 'voter',
    title: 'Voter ID',
    description: 'Register as a new voter, update your constituency, or request a duplicate EPIC card.',
    category: 'Identity',
    tags: ['Election Commission', 'Democracy'],
    icon: '🗳️'
  }
];

const CATEGORIES = ['All', 'Identity', 'Travel', 'Certificates'];

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();

  const filteredDocuments = useMemo(() => {
    return DOCUMENTS.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = activeCategory === 'All' || doc.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

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
        {filteredDocuments.length > 0 ? (
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
