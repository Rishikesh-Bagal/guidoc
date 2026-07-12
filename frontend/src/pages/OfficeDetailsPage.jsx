import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Phone, Building, Info, FileCheck, Map } from 'lucide-react';
import { officeService } from '../services/officeService';
import SkeletonLoader from '../components/common/SkeletonLoader';
import SEO from '../components/common/SEO';
import AppointmentModal from '../components/OfficeLocator/AppointmentModal';
import './OfficeDetailsPage.css';

export default function OfficeDetailsPage() {
  const { id } = useParams();
  const [office, setOffice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchOffice = async () => {
      try {
        const data = await officeService.getOfficeById(id);
        setOffice(data);
      } catch (error) {
        console.error('Failed to fetch office details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOffice();
  }, [id]);

  if (loading) {
    return (
      <div className="office-details-page">
        <SkeletonLoader height="40px" width="200px" style={{ marginBottom: '2rem' }} />
        <SkeletonLoader height="60px" width="60%" style={{ marginBottom: '1rem' }} />
        <SkeletonLoader height="30px" width="150px" style={{ marginBottom: '2rem' }} />
        <div className="office-content-grid">
          <SkeletonLoader height="400px" />
          <SkeletonLoader height="400px" />
        </div>
      </div>
    );
  }

  if (!office) {
    return (
      <div className="office-details-page">
        <Link to="/office-locator" className="back-link">
          <ArrowLeft size={20} /> Back to Locator
        </Link>
        <div className="empty-container">
          <h2>Office Not Found</h2>
          <p>The office you are looking for does not exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="office-details-page">
      <SEO title={`${office.name} | GUIDOC Office Locator`} description={`Details for ${office.name}`} />
      
      <Link to="/office-locator" className="back-link">
        <ArrowLeft size={20} /> Back to Offices
      </Link>

      <div className="office-details-header">
        <div className="office-title-section">
          <h1>{office.name}</h1>
          <div className="office-department-badge">{office.department}</div>
        </div>
        <button className="office-main-action" onClick={() => setIsModalOpen(true)}>
          Book Appointment
        </button>
      </div>

      <div className="office-content-grid">
        <div className="main-details">
          <section className="details-section">
            <h2><Info size={20} /> General Information</h2>
            <div className="info-list">
              <div className="info-item">
                <div className="info-item-icon">
                  <MapPin size={24} />
                </div>
                <div className="info-item-content">
                  <h3>Full Address</h3>
                  <p>{office.address}</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-item-icon">
                  <Clock size={24} />
                </div>
                <div className="info-item-content">
                  <h3>Working Hours</h3>
                  <p>{office.workingHours}</p>
                  <p style={{ color: office.status === 'Open' ? '#10b981' : '#ef4444', fontWeight: 500, marginTop: '0.25rem' }}>
                    Currently {office.status}
                  </p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-item-icon">
                  <Phone size={24} />
                </div>
                <div className="info-item-content">
                  <h3>Contact Information</h3>
                  <p>{office.contactNumber}</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-item-icon">
                  <Building size={24} />
                </div>
                <div className="info-item-content">
                  <h3>City / State</h3>
                  <p>{office.city}, {office.state}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="details-section">
            <h2><FileCheck size={20} /> Services & Requirements</h2>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>Services Offered</h3>
              <div className="tags-container">
                {office.servicesOffered?.map(service => (
                  <span key={service} className="service-tag">{service}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>Common Required Documents</h3>
              <div className="tags-container">
                {office.requiredDocuments?.map(doc => (
                  <span key={doc} className="doc-tag">{doc}</span>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="sidebar-details">
          <section className="details-section">
            <h2><Map size={20} /> Location Map</h2>
            <div className="map-placeholder">
              <Map size={48} />
              <span>Interactive Map Integration Placeholder</span>
              <span style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>
                Lat: {office.lat}, Lng: {office.lng}
              </span>
            </div>
          </section>
        </div>
      </div>

      {isModalOpen && (
        <AppointmentModal 
          office={office}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </main>
  );
}
