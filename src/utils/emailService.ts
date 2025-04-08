
// Email notification service

import { toast } from "sonner";
import { Lead } from "./leadsService";

// In a real application, this would connect to an actual email service
// For now, we'll simulate sending emails with console logs and toast notifications

export interface EmailOptions {
  to: string;
  subject: string;
  body: string;
  from?: string;
}

export const emailService = {
  sendEmail: async (options: EmailOptions): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Log the email details (in a real app, this would actually send an email)
    console.log("Email sent:", {
      to: options.to,
      subject: options.subject,
      body: options.body,
      from: options.from || "noreply@leadflow.com"
    });
    
    // Simulate success with 95% probability
    const success = Math.random() < 0.95;
    
    if (success) {
      toast.success(`Email sent to ${options.to}`);
      return true;
    } else {
      toast.error(`Failed to send email to ${options.to}`);
      return false;
    }
  },
  
  // Send lead status update notification
  sendStatusUpdateNotification: async (lead: Lead, newStatus: string): Promise<boolean> => {
    const statusDescriptions = {
      new: "has been received and is pending review",
      contacted: "has been reviewed and we've made initial contact",
      qualified: "has been qualified and we're working on a solution",
      converted: "has been successfully converted! We're preparing your solution",
      lost: "is currently not being pursued, but we appreciate your interest"
    };
    
    const statusDescription = statusDescriptions[newStatus as keyof typeof statusDescriptions] || 'has been updated';
    
    return await emailService.sendEmail({
      to: lead.email,
      subject: `Your Request Status Update - LeadFlow`,
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0066cc;">LeadFlow Status Update</h2>
          <p>Hello ${lead.name},</p>
          <p>Your request ${statusDescription}.</p>
          <p>Request Details:</p>
          <ul>
            <li><strong>Type:</strong> ${lead.requestType}</li>
            <li><strong>Status:</strong> ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}</li>
          </ul>
          <p>If you have any questions, please don't hesitate to reply to this email.</p>
          <p>Thank you for choosing LeadFlow!</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
            <p>LeadFlow - Professional Lead Management</p>
          </div>
        </div>
      `
    });
  },
  
  // Send welcome email to new users
  sendWelcomeEmail: async (name: string, email: string): Promise<boolean> => {
    return await emailService.sendEmail({
      to: email,
      subject: `Welcome to LeadFlow`,
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0066cc;">Welcome to LeadFlow!</h2>
          <p>Hello ${name},</p>
          <p>Thank you for registering with LeadFlow. We're excited to have you on board!</p>
          <p>With LeadFlow, you can:</p>
          <ul>
            <li>Manage and track your requests easily</li>
            <li>Communicate directly with our team</li>
            <li>Receive real-time updates on your request status</li>
          </ul>
          <p>If you have any questions, feel free to contact our support team.</p>
          <p>Best regards,</p>
          <p>The LeadFlow Team</p>
        </div>
      `
    });
  },
  
  // Send notification about team assignment
  sendTeamAssignmentNotification: async (lead: Lead, teamMemberName: string): Promise<boolean> => {
    return await emailService.sendEmail({
      to: lead.email,
      subject: `Your Request Has Been Assigned - LeadFlow`,
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0066cc;">Request Assignment Update</h2>
          <p>Hello ${lead.name},</p>
          <p>Your request has been assigned to <strong>${teamMemberName}</strong>, who will be working with you directly.</p>
          <p>Your team member will reach out soon to discuss your request in more detail.</p>
          <p>Thank you for choosing LeadFlow!</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
            <p>LeadFlow - Professional Lead Management</p>
          </div>
        </div>
      `
    });
  }
};
