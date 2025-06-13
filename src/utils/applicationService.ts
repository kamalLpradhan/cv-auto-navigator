
import { Application } from '@/components/ApplicationTracker';

export const applyToJob = async (job: any): Promise<void> => {
  // Get existing applications
  const existingApplications = JSON.parse(localStorage.getItem('applications') || '[]');
  
  // Create new application with better data structure
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
  
  // Trigger multiple events to ensure all components update
  const applicationAddedEvent = new CustomEvent('applicationAdded', {
    detail: newApplication
  });
  
  const storageUpdateEvent = new StorageEvent('storage', {
    key: 'applications',
    newValue: JSON.stringify(updatedApplications),
    oldValue: JSON.stringify(existingApplications),
    url: window.location.href
  });
  
  // Dispatch both events
  window.dispatchEvent(applicationAddedEvent);
  window.dispatchEvent(storageUpdateEvent);
  
  // Also trigger a custom refresh event
  const refreshEvent = new CustomEvent('applicationsRefresh');
  window.dispatchEvent(refreshEvent);
  
  console.log('Application added successfully:', newApplication);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
};
