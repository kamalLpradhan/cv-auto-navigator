// Application service utility for handling job applications

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  skills: string[];
  postedDate: string;
  canAutoApply: boolean;
  sourceId?: string;
  source?: string;
  applyUrl?: string;
}

interface ApplicationResult {
  success: boolean;
  message: string;
  position?: string;
  contactEmail?: string;
  contactName?: string;
  contactLinkedIn?: string;
}

// Function to simulate applying to a job with CV data
export const applyToJob = async (job: Job): Promise<ApplicationResult> => {
  // Get the CV data from localStorage
  const cvData = JSON.parse(localStorage.getItem('cv') || '{}');
  
  if (!cvData || !cvData.name) {
    return {
      success: false,
      message: 'CV data is missing or invalid. Please upload your CV properly.',
    };
  }
  
  // Check if this is a Google job with external apply link
  if (job.source === 'Google Jobs' && job.applyUrl) {
    console.log(`Google Job - Opening external application URL: ${job.applyUrl}`);
    
    // In a real app, we would track this event and potentially open in a new tab
    // For this simulation, we'll return a partial success
    const contactInfo = generateContactInfo(job.company);
    
    return {
      success: true,
      message: `Application initiated for ${job.title} at ${job.company}. You've been redirected to the company's application page.`,
      position: job.title,
      ...contactInfo
    };
  }
  
  // Standard application simulation
  return new Promise((resolve) => {
    // Simulate API delay - more realistic timing (1.5-3.5 seconds)
    const delay = 1500 + Math.floor(Math.random() * 2000);
    
    console.log(`Applying for ${job.title} at ${job.company} with CV: ${cvData.name}`);
    
    setTimeout(() => {
      if (job.canAutoApply) {
        // Generate dynamic contact information for successful applications
        const contactInfo = generateContactInfo(job.company);
        
        // Check if CV skills match job requirements (simplified matching)
        const skillMatch = checkSkillMatch(cvData, job);
        
        if (skillMatch.isMatch) {
          // Successful application
          resolve({
            success: true,
            message: `Successfully applied to ${job.title} at ${job.company}. Your application has been submitted.`,
            position: job.title,
            ...contactInfo
          });
        } else {
          // Application with warnings
          resolve({
            success: true,
            message: `Applied to ${job.title} at ${job.company}, but ${skillMatch.message}`,
            position: job.title,
            ...contactInfo
          });
        }
      } else {
        // Simulate failed application that requires manual intervention
        const reasons = [
          "This job requires completing a custom application form on the company website.",
          "The company requires a cover letter to be uploaded separately.",
          "This position requires answering pre-screening questions before applying.",
          "The application system requires creating an account on the company website.",
          "The job posting may have expired or been removed from the company website."
        ];
        
        // Randomly select a reason
        const reason = reasons[Math.floor(Math.random() * reasons.length)];
        
        // Generate partial contact info for failed applications
        const partialContactInfo = {
          contactName: generateContactName(job.company),
          contactLinkedIn: `linkedin.com/in/${generateLinkedInUsername(job.company)}`
        };
        
        resolve({
          success: false,
          message: `Unable to auto-apply for this position. Reason: ${reason}`,
          position: job.title,
          ...partialContactInfo
        });
      }
    }, delay);
  });
};

// Helper function to generate realistic contact information
const generateContactInfo = (company: string) => {
  const firstName = ['John', 'Sarah', 'Michael', 'Emma', 'David', 'Jessica', 'Robert', 'Jennifer'][Math.floor(Math.random() * 8)];
  const lastName = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'][Math.floor(Math.random() * 8)];
  const name = `${firstName} ${lastName}`;
  const domain = company.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;
  const linkedInUsername = `${firstName.toLowerCase()}-${lastName.toLowerCase()}-${Math.floor(Math.random() * 1000)}`;
  
  return {
    contactName: name,
    contactEmail: email,
    contactLinkedIn: `linkedin.com/in/${linkedInUsername}`
  };
};

// Helper function to generate contact name
const generateContactName = (company: string) => {
  const firstName = ['John', 'Sarah', 'Michael', 'Emma', 'David', 'Jessica', 'Robert', 'Jennifer'][Math.floor(Math.random() * 8)];
  const lastName = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'][Math.floor(Math.random() * 8)];
  return `${firstName} ${lastName}`;
};

// Helper function to generate LinkedIn username
const generateLinkedInUsername = (company: string) => {
  const firstName = ['john', 'sarah', 'michael', 'emma', 'david', 'jessica', 'robert', 'jennifer'][Math.floor(Math.random() * 8)];
  const lastName = ['smith', 'johnson', 'williams', 'brown', 'jones', 'garcia', 'miller', 'davis'][Math.floor(Math.random() * 8)];
  return `${firstName}-${lastName}-${Math.floor(Math.random() * 1000)}`;
};

// Function to check if CV skills match job requirements
const checkSkillMatch = (cvData: any, job: Job) => {
  if (!cvData.skills || !Array.isArray(cvData.skills) || cvData.skills.length === 0) {
    return { 
      isMatch: false, 
      message: 'your CV does not have any skills listed. Consider updating your CV with relevant skills.'
    };
  }
  
  // Convert skill arrays to lowercase for case-insensitive matching
  const cvSkills = (cvData.skills || []).map((skill: string) => skill.toLowerCase());
  const jobSkills = (job.skills || []).map(skill => skill.toLowerCase());
  
  // Find matching skills
  const matchingSkills = jobSkills.filter(skill => cvSkills.includes(skill));
  
  if (matchingSkills.length === 0) {
    return { 
      isMatch: false, 
      message: 'your CV skills do not match any of the required skills for this position. Consider tailoring your CV.'
    };
  }
  
  if (matchingSkills.length < jobSkills.length / 2) {
    return { 
      isMatch: true, 
      message: `your CV only matches ${matchingSkills.length} out of ${jobSkills.length} required skills. Consider adding more relevant experience.`
    };
  }
  
  return { 
    isMatch: true, 
    message: 'Great match! Your skills align well with this position.'
  };
};

// Function to check application status (for future implementation)
export const checkApplicationStatus = async (applicationId: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const statuses = ['In Review', 'Rejected', 'Interview', 'Offer'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      resolve(randomStatus);
    }, 1000);
  });
};

// Function to parse and extract data from CV (for future implementation)
export const parseCV = async (file: File): Promise<Record<string, any>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '(123) 456-7890',
        skills: ['JavaScript', 'React', 'TypeScript', 'Node.js'],
        experience: [
          {
            title: 'Frontend Developer',
            company: 'Tech Company',
            startDate: '2020-01',
            endDate: 'Present',
          }
        ],
        education: [
          {
            degree: 'Bachelor of Science, Computer Science',
            institution: 'University Name',
            graduationYear: '2019'
          }
        ]
      });
    }, 2000);
  });
};

// New function to fetch Google Jobs API data
export const fetchGoogleJobs = async (searchTerm?: string, location?: string): Promise<Job[]> => {
  console.log(`Fetching Google Jobs with searchTerm: ${searchTerm}, location: ${location}`);
  
  // In a real implementation, this would make an API call to Google Jobs or a proxy service
  // For demo purposes, we'll simulate the API response
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1800 + Math.random() * 1200));
  
  // Default search terms for Product Manager and Growth Manager positions if no search term is provided
  const defaultSearchTerms = ['product manager', 'growth manager'];
  const effectiveSearchTerm = searchTerm || defaultSearchTerms[Math.floor(Math.random() * defaultSearchTerms.length)];
  
  // Generate some realistic Google Jobs data
  let googleJobs: Job[] = [
    {
      id: 'g' + Math.random().toString(36).substring(2, 10),
      title: 'Senior Product Manager',
      company: 'Google',
      location: 'Mountain View, CA',
      type: 'Full-time',
      description: 'Lead product development initiatives at Google, working with cross-functional teams to deliver innovative solutions.',
      requirements: ['5+ years of product management experience', 'Technical background', 'Experience with data-driven decision making'],
      skills: ['Product Management', 'Agile', 'User Research', 'Data Analysis', 'Roadmapping'],
      postedDate: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      canAutoApply: true,
      source: 'Google Jobs',
      sourceId: 'google-23456',
      applyUrl: 'https://careers.google.com/jobs/results/234567890/'
    },
    {
      id: 'g' + Math.random().toString(36).substring(2, 10),
      title: 'Product Manager, AI Solutions',
      company: 'Amazon',
      location: 'Seattle, WA',
      type: 'Full-time',
      description: 'Define and deliver AI-powered products that solve real customer problems at scale.',
      requirements: ['3+ years of product management experience', 'Experience with machine learning or AI products', 'Strong analytical skills'],
      skills: ['Product Management', 'AI/ML', 'Customer Development', 'Stakeholder Management', 'Data Analysis'],
      postedDate: new Date(Date.now() - Math.floor(Math.random() * 5 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      canAutoApply: true,
      source: 'Google Jobs',
      sourceId: 'google-34567',
      applyUrl: 'https://www.amazon.jobs/en/jobs/123456/'
    },
    {
      id: 'g' + Math.random().toString(36).substring(2, 10),
      title: 'Growth Manager',
      company: 'Meta',
      location: 'New York, NY',
      type: 'Full-time',
      description: 'Drive user acquisition and retention strategies to accelerate business growth.',
      requirements: ['4+ years of growth marketing experience', 'Experience with A/B testing', 'Strong analytical mindset'],
      skills: ['Growth Marketing', 'User Acquisition', 'A/B Testing', 'Data Analysis', 'Marketing Automation'],
      postedDate: new Date(Date.now() - Math.floor(Math.random() * 3 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      canAutoApply: true,
      source: 'Google Jobs',
      sourceId: 'google-45678',
      applyUrl: 'https://www.metacareers.com/jobs/123456789/'
    },
    {
      id: 'g' + Math.random().toString(36).substring(2, 10),
      title: 'Senior Growth Manager',
      company: 'Microsoft',
      location: 'Redmond, WA',
      type: 'Full-time',
      description: 'Lead growth initiatives to drive user acquisition, engagement, and retention across Microsoft products.',
      requirements: ['5+ years in growth marketing', 'Experience scaling consumer products', 'Strong data analysis skills'],
      skills: ['Growth Strategy', 'User Retention', 'Funnel Optimization', 'Marketing Analytics', 'CRM'],
      postedDate: new Date(Date.now() - Math.floor(Math.random() * 10 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      canAutoApply: true,
      source: 'Google Jobs',
      sourceId: 'google-56789',
      applyUrl: 'https://careers.microsoft.com/job/123456/'
    },
    {
      id: 'g' + Math.random().toString(36).substring(2, 10),
      title: 'Technical Product Manager',
      company: 'Apple',
      location: 'Cupertino, CA',
      type: 'Full-time',
      description: 'Define and drive the product roadmap for technical products, working closely with engineering teams.',
      requirements: ['3+ years of technical product management', 'Software development background', 'Experience with Agile methodologies'],
      skills: ['Technical Product Management', 'Software Development', 'Agile', 'Requirements Gathering', 'Roadmapping'],
      postedDate: new Date(Date.now() - Math.floor(Math.random() * 6 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      canAutoApply: false,
      source: 'Google Jobs',
      sourceId: 'google-67890',
      applyUrl: 'https://jobs.apple.com/en-us/details/123456/'
    },
    {
      id: 'g' + Math.random().toString(36).substring(2, 10),
      title: 'Product Manager, Remote',
      company: 'Shopify',
      location: 'Remote',
      type: 'Full-time',
      description: 'Help shape the future of commerce by leading product initiatives that empower entrepreneurs worldwide.',
      requirements: ['3+ years of product management experience', 'Experience with e-commerce platforms', 'Strong communication skills'],
      skills: ['Product Management', 'E-commerce', 'User Research', 'Stakeholder Management', 'Strategic Planning'],
      postedDate: new Date(Date.now() - Math.floor(Math.random() * 4 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      canAutoApply: true,
      source: 'Google Jobs',
      sourceId: 'google-78901',
      applyUrl: 'https://www.shopify.com/careers/opportunities/123456/'
    },
    {
      id: 'g' + Math.random().toString(36).substring(2, 10),
      title: 'Growth Marketing Manager',
      company: 'Twitter',
      location: 'San Francisco, CA',
      type: 'Full-time',
      description: 'Lead user acquisition and retention strategies to drive platform growth and engagement.',
      requirements: ['4+ years of growth marketing experience', 'Experience with social media platforms', 'Strong analytical skills'],
      skills: ['Growth Marketing', 'User Acquisition', 'Social Media', 'Analytics', 'A/B Testing'],
      postedDate: new Date(Date.now() - Math.floor(Math.random() * 8 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      canAutoApply: true,
      source: 'Google Jobs',
      sourceId: 'google-89012',
      applyUrl: 'https://careers.twitter.com/en/work-for-twitter/jobs/123456.html'
    }
  ];
  
  // Add more role-specific jobs based on search term
  if (searchTerm) {
    const searchTermLower = searchTerm.toLowerCase();
    
    // If searching specifically for product manager roles
    if (searchTermLower.includes('product manager')) {
      googleJobs.push(
        {
          id: 'g' + Math.random().toString(36).substring(2, 10),
          title: 'Associate Product Manager',
          company: 'LinkedIn',
          location: 'Sunnyvale, CA',
          type: 'Full-time',
          description: "Join LinkedIn's Product team to help shape the future of professional networking.",
          requirements: ['1-3 years of product management experience', 'Strong analytical skills', 'Excellent communication abilities'],
          skills: ['Product Management', 'User Research', 'Data Analysis', 'Agile', 'Prototyping'],
          postedDate: new Date(Date.now() - Math.floor(Math.random() * 2 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
          canAutoApply: true,
          source: 'Google Jobs',
          sourceId: 'google-90123',
          applyUrl: 'https://www.linkedin.com/jobs/view/123456/'
        },
        {
          id: 'g' + Math.random().toString(36).substring(2, 10),
          title: 'Senior Product Manager, Mobile',
          company: 'Spotify',
          location: 'New York, NY',
          type: 'Full-time',
          description: "Lead the product strategy and execution for Spotify's mobile application features.",
          requirements: ['5+ years of product management experience', 'Experience with mobile products', 'Music industry knowledge a plus'],
          skills: ['Mobile Product Management', 'User Experience', 'A/B Testing', 'Agile', 'Roadmapping'],
          postedDate: new Date(Date.now() - Math.floor(Math.random() * 5 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
          canAutoApply: true,
          source: 'Google Jobs',
          sourceId: 'google-01234',
          applyUrl: 'https://www.spotifyjobs.com/job/123456/'
        }
      );
    }
    
    // If searching specifically for growth manager roles
    if (searchTermLower.includes('growth manager')) {
      googleJobs.push(
        {
          id: 'g' + Math.random().toString(36).substring(2, 10),
          title: 'Growth Marketing Manager',
          company: 'Netflix',
          location: 'Los Gatos, CA',
          type: 'Full-time',
          description: 'Drive subscriber growth through innovative marketing strategies and campaigns.',
          requirements: ['4+ years of growth marketing experience', 'Experience with subscription businesses', 'Strong data analysis skills'],
          skills: ['Growth Marketing', 'Subscription Models', 'Customer Acquisition', 'Retention Strategies', 'A/B Testing'],
          postedDate: new Date(Date.now() - Math.floor(Math.random() * 3 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
          canAutoApply: true,
          source: 'Google Jobs',
          sourceId: 'google-12345',
          applyUrl: 'https://jobs.netflix.com/jobs/123456/'
        },
        {
          id: 'g' + Math.random().toString(36).substring(2, 10),
          title: 'Growth Operations Manager',
          company: 'Airbnb',
          location: 'San Francisco, CA',
          type: 'Full-time',
          description: 'Optimize and scale growth operations to drive marketplace efficiency and expansion.',
          requirements: ['3+ years of operations or growth experience', 'Experience with marketplace businesses', 'Strong project management skills'],
          skills: ['Growth Operations', 'Marketplace Dynamics', 'Process Optimization', 'Data Analysis', 'Project Management'],
          postedDate: new Date(Date.now() - Math.floor(Math.random() * 6 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
          canAutoApply: false,
          source: 'Google Jobs',
          sourceId: 'google-23456',
          applyUrl: 'https://careers.airbnb.com/positions/123456/'
        }
      );
    }
  }
  
  // Filter jobs based on search criteria
  let filteredJobs = [...googleJobs];
  
  if (searchTerm) {
    const searchTermLower = searchTerm.toLowerCase();
    filteredJobs = filteredJobs.filter(job => 
      job.title.toLowerCase().includes(searchTermLower) || 
      job.company.toLowerCase().includes(searchTermLower) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchTermLower))
    );
  }
  
  if (location) {
    const locationLower = location.toLowerCase();
    filteredJobs = filteredJobs.filter(job => 
      job.location.toLowerCase().includes(locationLower)
    );
  }
  
  return filteredJobs;
};

// New function to fetch jobs from multiple sources
export const fetchJobs = async (searchTerm?: string, location?: string): Promise<Job[]> => {
  // Fetch Google Jobs
  const googleJobs = await fetchGoogleJobs(searchTerm, location);
  
  // In a real implementation, you would fetch from multiple job sources
  // and combine the results
  
  return googleJobs;
};
