
import { Application } from '@/components/ApplicationTracker';

export const applyToJob = async (job: any): Promise<void> => {
  // Get existing applications
  const existingApplications = JSON.parse(localStorage.getItem('applications') || '[]');
  
  // Create new application
  const newApplication: Application = {
    id: Math.random().toString(36).substring(2, 15),
    jobId: job.id,
    jobTitle: job.title,
    company: job.company,
    position: job.title,
    appliedDate: new Date().toISOString(),
    status: 'Applied',
    autoApplied: true,
    source: job.source || 'Job Search',
    sourceId: job.sourceId || job.id,
    contactEmail: job.contactEmail,
    contactName: job.contactName,
    contactLinkedIn: job.contactLinkedIn
  };
  
  // Add to existing applications
  const updatedApplications = [...existingApplications, newApplication];
  
  // Save to localStorage
  localStorage.setItem('applications', JSON.stringify(updatedApplications));
  
  // Trigger custom event to notify components
  const event = new CustomEvent('applicationAdded', {
    detail: newApplication
  });
  window.dispatchEvent(event);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
};
