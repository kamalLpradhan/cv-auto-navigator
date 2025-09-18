
import { Application } from '@/components/ApplicationTracker';

export const applyToJob = async (job: any): Promise<void> => {
  // Get existing applications
  const existingApplications = JSON.parse(localStorage.getItem('applications') || '[]');
  
  // Check if already applied to prevent duplicates
  const alreadyApplied = existingApplications.some((app: Application) => 
    app.jobId === job.id || 
    (app.jobTitle === job.title && app.company === job.company)
  );
  
  if (alreadyApplied) {
    throw new Error('You have already applied to this position');
  }
  
  // Get user profile information
  const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
  
  // Create new application with real-time tracking
  const newApplication: Application = {
    id: `app_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    jobId: job.id || `job_${Date.now()}`,
    jobTitle: job.title,
    company: job.company,
    position: job.title,
    appliedDate: new Date().toISOString(),
    status: 'Applied',
    autoApplied: false,
    source: job.source || 'Enhanced Job Search',
    sourceId: job.sourceId || job.id,
    contactEmail: job.contactEmail,
    contactName: job.contactName,
    contactLinkedIn: job.contactLinkedIn,
    // Add user profile information for tracking
    userLinkedIn: userProfile.linkedinProfile,
    userGithub: userProfile.githubProfile,
    userPortfolio: userProfile.portfolioWebsite,
    userTwitter: userProfile.twitterProfile,
    userIndeed: userProfile.indeedProfile,
    userGlassdoor: userProfile.glassdoorProfile,
    appliedVia: determineApplicationSource(job, userProfile),
    message: `Applied to ${job.title} at ${job.company} on ${new Date().toLocaleDateString()}`
  };
  
  // Add to existing applications (newest first for real-time visibility)
  const updatedApplications = [newApplication, ...existingApplications];
  
  // Save to localStorage
  localStorage.setItem('applications', JSON.stringify(updatedApplications));
  
  // Trigger multiple events to ensure all components update in real-time
  const applicationAddedEvent = new CustomEvent('applicationAdded', {
    detail: newApplication
  });
  
  const storageUpdateEvent = new StorageEvent('storage', {
    key: 'applications',
    newValue: JSON.stringify(updatedApplications),
    oldValue: JSON.stringify(existingApplications),
    url: window.location.href
  });
  
  // Dispatch both events for real-time updates
  window.dispatchEvent(applicationAddedEvent);
  window.dispatchEvent(storageUpdateEvent);
  
  // Also trigger a custom refresh event for real-time dashboard
  const refreshEvent = new CustomEvent('applicationsRefresh');
  window.dispatchEvent(refreshEvent);
  
  console.log('Real-time application added:', newApplication);
  
  // Quick response for better UX
  await new Promise(resolve => setTimeout(resolve, 200));
};

// Helper function to determine which profile was used for application
const determineApplicationSource = (job: any, userProfile: any): string => {
  if (job.source === 'LinkedIn Jobs' && userProfile.linkedinProfile) {
    return `Applied via LinkedIn (${userProfile.linkedinProfile})`;
  }
  if (job.source === 'Indeed' && userProfile.indeedProfile) {
    return `Applied via Indeed (${userProfile.indeedProfile})`;
  }
  if (job.source === 'Glassdoor' && userProfile.glassdoorProfile) {
    return `Applied via Glassdoor (${userProfile.glassdoorProfile})`;
  }
  if (userProfile.portfolioWebsite) {
    return `Applied with portfolio: ${userProfile.portfolioWebsite}`;
  }
  return 'Applied directly';
};
