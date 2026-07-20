import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { officeService } from '../../services/officeService';
import './AppointmentModal.css';

export default function AppointmentModal({ office, onClose }) {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: currentUser?.displayName || '',
    email: currentUser?.email || '',
    phone: '',
    service: office?.servicesOffered?.[0] || '',
    appointmentDate: '',
    appointmentTime: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    setLoading(true);
    try {
      await officeService.bookAppointment(currentUser.uid, {
        officeId: office.id,
        officeName: office.name,
        ...formData
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Prevent closing when clicking inside modal
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  if (!office) return null;

  return (
    <div className="appointment-modal-overlay" onClick={onClose}>
      <div className="appointment-modal" onClick={handleModalClick}>
        <div className="modal-header">
          <h2>Book Appointment</h2>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div className="modal-body" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
            <div style={{ color: '#10b981', fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
            <h3>Appointment Confirmed!</h3>
            <p>Your appointment at {office.name} has been successfully booked.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="appointment-form">
            <div className="modal-body">
              <p>Booking for: <strong>{office.name}</strong></p>
              
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Service Type</label>
                <select
                  name="service"
                  className="form-select"
                  value={formData.service}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select a service</option>
                  {office.servicesOffered?.map(service => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Date</label>
                  <input
                    type="date"
                    name="appointmentDate"
                    className="form-input"
                    value={formData.appointmentDate}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Time</label>
                  <input
                    type="time"
                    name="appointmentTime"
                    className="form-input"
                    value={formData.appointmentTime}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '1.25rem' }}>
                <label>Additional Notes (Optional)</label>
                <textarea
                  name="notes"
                  className="form-textarea"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any special requests or information"
                ></textarea>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? <><Loader2 size={18} className="animate-spin" /> Booking...</> : 'Confirm Booking'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
