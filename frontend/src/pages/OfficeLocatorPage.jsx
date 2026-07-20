import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Clock, Phone, Map } from 'lucide-react';
import { officeService } from '../services/officeService';
import SkeletonLoader from '../components/common/SkeletonLoader';
import SEO from '../components/common/SEO';
import AppointmentModal from '../components/OfficeLocator/AppointmentModal';
import './OfficeLocatorPage.css';

export default function OfficeLocatorPage() {
  const navigate = useNavigate();
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', department: '', city: '' });
  
  // Appointment modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOffice, setSelectedOffice] = useState(null);

  useEffect(() => {
    fetchOffices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.department, filters.city]); // Fetch on filter change

  const fetchOffices = async () => {
    setLoading(true);
    try {
      const data = await officeService.getOffices(filters);
      setOffices(data);
    } catch (error) {
      console.error('Failed to fetch offices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setFilters(prev => ({ ...prev, search: value }));
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      fetchOffices();
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const openBookModal = (office) => {
    setSelectedOffice(office);
    setIsModalOpen(true);
  };

  const departments = [
    'Aadhaar Centers', 'Passport Seva Kendra', 'RTO Offices',
    'PAN Service Centers', 'Tehsil Offices', 'Municipal Corporation Offices'
  ];

  const cities = ['Bangalore']; // Expand later

  return (
    <main className="office-locator-page">
      <SEO title="Office Locator | GUIDOC" description="Find nearby government offices and book appointments." />
      
      <div className="locator-header">
        <h1>Government Office Locator</h1>
        <p>Find nearby government offices, view details, and book appointments easily.</p>
      </div>

      <div className="locator-filters">
        <div className="search-box">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            className="search-input"
            placeholder="Search by office name or address..."
            value={filters.search}
            onChange={handleSearchChange}
            onKeyDown={handleSearchSubmit}
          />
        </div>
        
        <select
          className="filter-select"
          name="department"
          value={filters.department}
          onChange={handleFilterChange}
        >
          <option value="">All Departments</option>
          {departments.map(dept => (
             <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>

        <select
          className="filter-select"
          name="city"
          value={filters.city}
          onChange={handleFilterChange}
        >
          <option value="">All Cities</option>
          {cities.map(city => (
             <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="offices-grid">
          {[1, 2, 3, 4, 5, 6].map(i => (
             <div key={i} className="office-card" style={{ height: '280px' }}>
               <SkeletonLoader height="100%" width="100%" />
             </div>
          ))}
        </div>
      ) : offices.length > 0 ? (
        <div className="offices-grid">
          {offices.map(office => (
            <div key={office.id} className="office-card">
              <div className="office-header">
                <div className="office-title">
                  <h3>{office.name}</h3>
                  <span className="office-department">{office.department}</span>
                </div>
                <span className={`status-badge ${office.status.toLowerCase()}`}>
                  {office.status}
                </span>
              </div>
              
              <div className="office-details">
                <div className="detail-row">
                  <MapPin className="detail-icon" size={16} />
                  <span>{office.address}</span>
                </div>
                <div className="detail-row">
                  <Clock className="detail-icon" size={16} />
                  <span>{office.workingHours}</span>
                </div>
                <div className="detail-row">
                  <Phone className="detail-icon" size={16} />
                  <span>{office.contactNumber}</span>
                </div>
                <div className="detail-row">
                  <Map className="detail-icon" size={16} />
                  <span>{office.distance} away</span>
                </div>
              </div>
              
              <div className="office-actions">
                <button 
                  className="btn-view"
                  onClick={() => navigate(`/office/${office.id}`)}
                >
                  View Details
                </button>
                <button 
                  className="btn-book"
                  onClick={() => openBookModal(office)}
                >
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-container">
          <MapPin className="icon" size={48} />
          <h2>No offices found</h2>
          <p>Try adjusting your search or filters.</p>
        </div>
      )}

      {isModalOpen && (
        <AppointmentModal 
          office={selectedOffice}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </main>
  );
}
