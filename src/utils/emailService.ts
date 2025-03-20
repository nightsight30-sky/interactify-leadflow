
import axios from 'axios';

const API_URL = '/api/emails';

export interface Email {
  _id?: string;
  to: string;
  from: string;
  subject: string;
  message: string;
  cc?: string[];
  bcc?: string[];
  date?: Date;
  leadId?: string;
  read?: boolean;
}

export const emailService = {
  // Get all emails
  async getEmails(): Promise<Email[]> {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching emails:', error);
      return [];
    }
  },

  // Get emails by lead ID
  async getEmailsByLeadId(leadId: string): Promise<Email[]> {
    try {
      const response = await axios.get(`${API_URL}/lead/${leadId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching emails for lead ${leadId}:`, error);
      return [];
    }
  },

  // Send an email
  async sendEmail(email: Email): Promise<Email | null> {
    try {
      const response = await axios.post(API_URL, email);
      return response.data;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  },

  // Mark email as read
  async markAsRead(emailId: string): Promise<Email | null> {
    try {
      const response = await axios.patch(`${API_URL}/${emailId}/read`, {});
      return response.data;
    } catch (error) {
      console.error('Error marking email as read:', error);
      return null;
    }
  },

  // Delete an email
  async deleteEmail(emailId: string): Promise<boolean> {
    try {
      await axios.delete(`${API_URL}/${emailId}`);
      return true;
    } catch (error) {
      console.error('Error deleting email:', error);
      return false;
    }
  }
};

export default emailService;
