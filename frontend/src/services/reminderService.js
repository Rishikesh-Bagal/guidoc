import { officeService } from './officeService';
import { notificationService } from './notificationService';
import { emailService } from './emailService';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

class ReminderService {
  // This engine checks for pending reminders. 
  // It should be called on app mount or dashboard visit since we don't have a background worker.
  async evaluateReminders(user) {
    if (!user) return;
    
    console.log('[Reminder Engine] Evaluating reminders for user:', user.uid);
    try {
      await this.checkUpcomingAppointments(user);
      // Other checks like document renewals could go here
    } catch (error) {
      console.error('[Reminder Engine] Error:', error);
    }
  }

  async checkUpcomingAppointments(user) {
    // 1. Fetch user's appointments
    const appointments = await officeService.getUserAppointments(user.uid);
    if (!appointments || appointments.length === 0) return;

    const now = new Date();
    // Look ahead 24 hours
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    for (const apt of appointments) {
      // Assuming appointmentDate is YYYY-MM-DD and time is HH:MM
      const aptDateTimeStr = `${apt.appointmentDate}T${apt.appointmentTime}:00`;
      const aptDate = new Date(aptDateTimeStr);
      
      // If appointment is invalid or already passed, skip
      if (isNaN(aptDate.getTime()) || aptDate < now) continue;

      // If appointment is within the next 24 hours
      if (aptDate <= tomorrow) {
        // Check if we already sent a reminder for this specific appointment
        const hasBeenReminded = await this.hasReminderNotification(user.uid, apt.id);
        
        if (!hasBeenReminded) {
          // 1. Create In-App Notification
          await notificationService.createNotification({
            userId: user.uid,
            title: 'Upcoming Appointment',
            message: `You have an appointment for ${apt.service} at ${apt.officeName} tomorrow at ${apt.appointmentTime}.`,
            type: 'Appointment Reminder',
            priority: 'high',
            actionLink: `/office/${apt.officeId}`,
            // We use a custom field or format the message so we know we sent it, but simpler:
            // Store the appointment ID in the notification (would need a custom field, or just query the title)
          });

          // Hack to prevent duplicate reminders: Create a hidden 'system' notification or log
          // For simplicity in this demo, we'll store a specific metadata record in the notifications table
          await notificationService.createNotification({
            userId: user.uid,
            title: `_sys_reminded_${apt.id}`,
            message: 'system_record',
            type: 'System_Internal',
            isRead: true
          });

          // 2. Send Email
          await emailService.sendAppointmentReminder(
            user.uid,
            user.email,
            user.displayName || 'User',
            {
              service: apt.service,
              officeName: apt.officeName,
              date: apt.appointmentDate,
              time: apt.appointmentTime
            }
          );
        }
      }
    }
  }

  async hasReminderNotification(userId, appointmentId) {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId)
    );
    const snap = await getDocs(q);
    return snap.docs.some(doc => doc.data().title === `_sys_reminded_${appointmentId}`);
  }
}

export const reminderService = new ReminderService();
