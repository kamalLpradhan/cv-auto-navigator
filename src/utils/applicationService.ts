
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
  
  // In a real application, this would make API calls to external job sites
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
  // This would be more sophisticated in a real application
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
  // This would check the status of a submitted application
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
  // This would use an API to parse the CV and extract relevant data
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
