import emailjs from '@emailjs/browser';
import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

class EmailService {
  constructor() {
    this.serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'default_service';
    this.templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'default_template';
    this.publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'default_key';
    
    // Initialize EmailJS
    try {
      if (this.publicKey !== 'default_key') {
        emailjs.init(this.publicKey);
      }
    } catch (e) {
      console.warn('EmailJS initialization failed', e);
    }
  }

  async shouldSendEmail(userId, emailType) {
    // Determine if the user has opted in for this specific email type
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const prefs = userSnap.data().preferences?.notifications || {};
        
        // If they disabled all emails, return false
        if (prefs.email === false) return false;

        // Check specific types (default to true if email is on but type isn't specified)
        if (emailType === 'appointment' && prefs.appointmentReminders === false) return false;
        if (emailType === 'ai_suggestion' && prefs.aiSuggestions === false) return false;
        if (emailType === 'system' && prefs.systemUpdates === false) return false;

        return true;
      }
      return false; // Default to not sending if user not found
    } catch (error) {
      console.error('Error checking email preferences:', error);
      return false;
    }
  }

  async sendEmail(userId, userEmail, userName, templateParams, emailType = 'system') {
    if (!userEmail) return false;
    
    const canSend = await this.shouldSendEmail(userId, emailType);
    if (!canSend) {
      console.log(`Email of type ${emailType} skipped due to user preferences for ${userEmail}`);
      return false;
    }

    const params = {
      to_email: userEmail,
      to_name: userName || 'User',
      ...templateParams
    };

    if (this.publicKey === 'default_key') {
      console.log('[MOCK EMAIL]', `Would have sent email to ${userEmail}:`, params);
      return true;
    }

    try {
      const response = await emailjs.send(
        this.serviceId,
        this.templateId,
        params,
        this.publicKey
      );
      console.log('Email sent successfully:', response.status, response.text);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  // Helper methods for specific email types
  async sendAppointmentConfirmation(userId, userEmail, userName, appointmentDetails) {
    return this.sendEmail(userId, userEmail, userName, {
      subject: 'Appointment Confirmation',
      message: `Your appointment for ${appointmentDetails.service} at ${appointmentDetails.officeName} is confirmed for ${appointmentDetails.date} at ${appointmentDetails.time}.`,
      type: 'Appointment'
    }, 'appointment');
  }

  async sendAppointmentReminder(userId, userEmail, userName, appointmentDetails) {
    return this.sendEmail(userId, userEmail, userName, {
      subject: 'Upcoming Appointment Reminder',
      message: `Reminder: You have an upcoming appointment for ${appointmentDetails.service} at ${appointmentDetails.officeName} on ${appointmentDetails.date} at ${appointmentDetails.time}.`,
      type: 'Reminder'
    }, 'appointment');
  }
}

export const emailService = new EmailService();
