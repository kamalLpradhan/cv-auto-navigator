
interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  salary?: {
    min?: number;
    max?: number;
    currency: string;
    period: 'hourly' | 'monthly' | 'yearly' | 'weekly';
  };
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Remote';
  postedDate: string;
  applyUrl: string;
  source: string;
  skills: string[];
  benefits?: string[];
  companyLogo?: string;
  companySize?: string;
  industry?: string;
}

interface JobSearchParams {
  query: string;
  location?: string;
  jobType?: string;
  salaryMin?: number;
  experienceLevel?: string;
  remote?: boolean;
}

// Mock job data for demonstration and fallback - Comprehensive job types
const MOCK_JOBS: JobListing[] = [
  // Technology Jobs
  {
    id: "job-1",
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    description: "We are looking for a Senior Frontend Developer to join our dynamic team. You will be responsible for building responsive web applications using React, TypeScript, and modern frontend technologies.",
    requirements: ["5+ years React experience", "TypeScript", "CSS frameworks", "State management", "Testing"],
    salary: { min: 120000, max: 180000, currency: "USD", period: "yearly" },
    type: "Full-time",
    postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://techcorp.com/jobs/senior-frontend-dev",
    source: "TechCorp Careers",
    skills: ["React", "TypeScript", "CSS", "JavaScript", "Redux", "Jest"],
    benefits: ["Health Insurance", "401k", "Remote Work", "Stock Options"],
    companySize: "500-1000 employees",
    industry: "Technology"
  },
  {
    id: "job-2",
    title: "Backend Engineer",
    company: "CloudTech Solutions",
    location: "Remote",
    description: "Build scalable backend systems using Node.js, Python, and cloud technologies. Work with microservices and API development.",
    requirements: ["4+ years backend experience", "Node.js or Python", "Database design", "Cloud platforms", "API development"],
    salary: { min: 100000, max: 150000, currency: "USD", period: "yearly" },
    type: "Remote",
    postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://cloudtech.com/careers/backend-engineer",
    source: "CloudTech Jobs",
    skills: ["Node.js", "Python", "AWS", "PostgreSQL", "Docker", "Kubernetes"],
    benefits: ["Remote Work", "Health Insurance", "Learning Budget", "Flexible Hours"],
    companySize: "100-500 employees",
    industry: "Cloud Computing"
  },
  {
    id: "job-3",
    title: "Mobile App Developer",
    company: "MobileTech Inc",
    location: "Austin, TX",
    description: "Develop native and cross-platform mobile applications for iOS and Android. Work with React Native and Flutter.",
    requirements: ["3+ years mobile dev", "React Native or Flutter", "iOS/Android", "App Store experience", "UI/UX knowledge"],
    salary: { min: 90000, max: 140000, currency: "USD", period: "yearly" },
    type: "Full-time",
    postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://mobiletech.com/jobs/mobile-developer",
    source: "MobileTech Careers",
    skills: ["React Native", "Flutter", "iOS", "Android", "JavaScript", "Swift"],
    benefits: ["Health Insurance", "Stock Options", "Gym Membership", "Conference Budget"],
    companySize: "50-200 employees",
    industry: "Mobile Technology"
  },
  {
    id: "job-4",
    title: "DevOps Engineer",
    company: "InfraCloud Systems",
    location: "Seattle, WA",
    description: "Manage cloud infrastructure, CI/CD pipelines, and containerization. Work with AWS, Kubernetes, and monitoring tools.",
    requirements: ["5+ years DevOps", "AWS/Azure/GCP", "Kubernetes", "CI/CD", "Infrastructure as Code"],
    salary: { min: 110000, max: 170000, currency: "USD", period: "yearly" },
    type: "Full-time",
    postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://infracloud.com/careers/devops-engineer",
    source: "InfraCloud Jobs",
    skills: ["AWS", "Kubernetes", "Docker", "Terraform", "Jenkins", "Monitoring"],
    benefits: ["Health Insurance", "Stock Options", "Remote Work", "Training Budget"],
    companySize: "200-500 employees",
    industry: "Cloud Infrastructure"
  },

  // Design & Creative Jobs
  {
    id: "job-5",
    title: "UX/UI Designer",
    company: "DesignStudio Pro",
    location: "Los Angeles, CA",
    description: "Craft beautiful user experiences for web and mobile applications. Work with product teams to create intuitive designs.",
    requirements: ["3+ years UX/UI", "Figma/Adobe Suite", "Portfolio", "Design systems", "User research"],
    salary: { min: 80000, max: 120000, currency: "USD", period: "yearly" },
    type: "Full-time",
    postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://designstudiopro.com/careers/ux-ui-designer",
    source: "DesignStudio Careers",
    skills: ["Figma", "Adobe XD", "Sketch", "Prototyping", "User Research", "Design Systems"],
    benefits: ["Health Insurance", "Creative Days", "Conference Budget", "Gym Membership"],
    companySize: "50-100 employees",
    industry: "Design Agency"
  },
  {
    id: "job-6",
    title: "Graphic Designer",
    company: "Creative Agency Plus",
    location: "New York, NY",
    description: "Create visual content for digital and print media. Work on branding, marketing materials, and digital campaigns.",
    requirements: ["2+ years graphic design", "Adobe Creative Suite", "Portfolio", "Print/Digital experience", "Brand design"],
    salary: { min: 50000, max: 75000, currency: "USD", period: "yearly" },
    type: "Full-time",
    postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://creativeplus.com/jobs/graphic-designer",
    source: "Creative Agency Jobs",
    skills: ["Photoshop", "Illustrator", "InDesign", "Branding", "Typography", "Layout"],
    benefits: ["Health Insurance", "Creative Freedom", "Flexible Hours", "Portfolio Projects"],
    companySize: "10-50 employees",
    industry: "Marketing & Advertising"
  },

  // Sales & Marketing Jobs
  {
    id: "job-7",
    title: "Sales Manager",
    company: "TechSales India",
    location: "Pune, India",
    description: "Lead sales team and drive revenue growth in the Indian market. Develop sales strategies and manage key accounts.",
    requirements: ["5+ years sales", "Team management", "B2B sales", "CRM systems", "Market knowledge"],
    salary: { min: 800000, max: 1500000, currency: "INR", period: "yearly" },
    type: "Full-time",
    postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://techsalesindia.com/careers/sales-manager",
    source: "TechSales India Careers",
    skills: ["Sales", "Team Management", "B2B Sales", "CRM", "Leadership", "Negotiation"],
    benefits: ["Health Insurance", "Performance Bonus", "Travel Allowance", "Phone Allowance"],
    companySize: "100-500 employees",
    industry: "Technology Sales"
  },
  {
    id: "job-8",
    title: "Digital Marketing Manager",
    company: "MarketingPro Agency",
    location: "Chicago, IL",
    description: "Plan and execute digital marketing campaigns across multiple channels. Manage SEO, SEM, social media, and content marketing.",
    requirements: ["4+ years digital marketing", "SEO/SEM", "Social media", "Analytics", "Content strategy"],
    salary: { min: 70000, max: 100000, currency: "USD", period: "yearly" },
    type: "Full-time",
    postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://marketingpro.com/jobs/digital-marketing-manager",
    source: "MarketingPro Careers",
    skills: ["SEO", "Google Ads", "Facebook Ads", "Analytics", "Content Marketing", "Email Marketing"],
    benefits: ["Health Insurance", "Flexible Work", "Marketing Budget", "Conference Tickets"],
    companySize: "25-100 employees",
    industry: "Digital Marketing"
  },

  // Data & Analytics Jobs
  {
    id: "job-9",
    title: "Data Scientist",
    company: "DataCorp Analytics",
    location: "Boston, MA",
    description: "Analyze large datasets, build predictive models, and provide insights to drive business decisions.",
    requirements: ["Masters in Data Science", "Python/R", "Machine Learning", "Statistics", "SQL"],
    salary: { min: 100000, max: 150000, currency: "USD", period: "yearly" },
    type: "Full-time",
    postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://datacorp.com/jobs/data-scientist",
    source: "DataCorp Careers",
    skills: ["Python", "R", "Machine Learning", "SQL", "Tableau", "Statistics"],
    benefits: ["Health Insurance", "Research Time", "Conference Attendance", "Stock Options"],
    companySize: "200-500 employees",
    industry: "Analytics"
  },
  {
    id: "job-10",
    title: "Business Analyst",
    company: "ConsultingFirm LLC",
    location: "Dallas, TX",
    description: "Analyze business processes, gather requirements, and work with stakeholders to improve business operations.",
    requirements: ["3+ years BA experience", "Requirements gathering", "Process mapping", "SQL knowledge", "Stakeholder management"],
    salary: { min: 75000, max: 110000, currency: "USD", period: "yearly" },
    type: "Full-time",
    postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://consultingfirm.com/careers/business-analyst",
    source: "ConsultingFirm Jobs",
    skills: ["SQL", "Excel", "Process Mapping", "Requirements Analysis", "Stakeholder Management"],
    benefits: ["Health Insurance", "401k", "Training Programs", "Flexible Schedule"],
    companySize: "100-300 employees",
    industry: "Consulting"
  },

  // Finance & Accounting Jobs
  {
    id: "job-11",
    title: "Financial Analyst",
    company: "FinanceMax Corp",
    location: "New York, NY",
    description: "Perform financial analysis, prepare reports, and support investment decisions. Work with financial models and forecasting.",
    requirements: ["Bachelor's in Finance", "Financial modeling", "Excel proficiency", "CFA preferred", "Analytical skills"],
    salary: { min: 80000, max: 120000, currency: "USD", period: "yearly" },
    type: "Full-time",
    postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://financemax.com/jobs/financial-analyst",
    source: "FinanceMax Careers",
    skills: ["Financial Modeling", "Excel", "Bloomberg", "PowerBI", "Risk Analysis"],
    benefits: ["Health Insurance", "Bonus Structure", "Professional Development", "Stock Options"],
    companySize: "500-1000 employees",
    industry: "Financial Services"
  },
  {
    id: "job-12",
    title: "Accountant",
    company: "AccountingPro Services",
    location: "Phoenix, AZ",
    description: "Handle accounts payable/receivable, prepare financial statements, and assist with tax preparation and audits.",
    requirements: ["Bachelor's in Accounting", "CPA preferred", "QuickBooks", "Tax preparation", "Attention to detail"],
    salary: { min: 50000, max: 70000, currency: "USD", period: "yearly" },
    type: "Full-time",
    postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://accountingpro.com/careers/accountant",
    source: "AccountingPro Jobs",
    skills: ["QuickBooks", "Excel", "Tax Preparation", "Financial Statements", "Auditing"],
    benefits: ["Health Insurance", "Retirement Plan", "Paid Time Off", "Professional Certifications"],
    companySize: "20-50 employees",
    industry: "Accounting Services"
  },

  // Healthcare Jobs
  {
    id: "job-13",
    title: "Registered Nurse",
    company: "City General Hospital",
    location: "Miami, FL",
    description: "Provide patient care in hospital setting. Work in medical-surgical unit with diverse patient population.",
    requirements: ["RN license", "BSN preferred", "2+ years experience", "BLS certification", "Patient care skills"],
    salary: { min: 65000, max: 85000, currency: "USD", period: "yearly" },
    type: "Full-time",
    postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://citygeneral.com/jobs/registered-nurse",
    source: "City General Careers",
    skills: ["Patient Care", "Medical Knowledge", "Communication", "Critical Thinking", "Teamwork"],
    benefits: ["Health Insurance", "Retirement Plan", "Shift Differentials", "Tuition Assistance"],
    companySize: "1000+ employees",
    industry: "Healthcare"
  },
  {
    id: "job-14",
    title: "Medical Assistant",
    company: "Family Care Clinic",
    location: "Denver, CO",
    description: "Support physicians with patient care, administrative tasks, and clinical procedures in family practice setting.",
    requirements: ["Medical Assistant certification", "Clinical experience", "EMR systems", "Patient interaction", "Multitasking"],
    salary: { min: 35000, max: 45000, currency: "USD", period: "yearly" },
    type: "Full-time",
    postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://familycare.com/careers/medical-assistant",
    source: "Family Care Jobs",
    skills: ["Clinical Skills", "EMR", "Patient Care", "Administrative", "Communication"],
    benefits: ["Health Insurance", "Paid Time Off", "Training Programs", "Flexible Schedule"],
    companySize: "10-25 employees",
    industry: "Healthcare"
  },

  // Education Jobs
  {
    id: "job-15",
    title: "Elementary School Teacher",
    company: "Sunshine Elementary School",
    location: "Portland, OR",
    description: "Teach 3rd grade students in public school setting. Develop lesson plans and create engaging learning environment.",
    requirements: ["Teaching license", "Bachelor's in Education", "Classroom management", "Curriculum development", "Student assessment"],
    salary: { min: 45000, max: 65000, currency: "USD", period: "yearly" },
    type: "Full-time",
    postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://sunshineelementary.edu/jobs/teacher",
    source: "Sunshine Elementary HR",
    skills: ["Lesson Planning", "Classroom Management", "Student Assessment", "Communication", "Patience"],
    benefits: ["Health Insurance", "Pension Plan", "Summer Break", "Professional Development"],
    companySize: "50-100 employees",
    industry: "Education"
  },
  {
    id: "job-16",
    title: "Training Specialist",
    company: "CorporateEd Solutions",
    location: "Atlanta, GA",
    description: "Design and deliver training programs for corporate clients. Create learning materials and conduct workshops.",
    requirements: ["Training experience", "Instructional design", "Adult learning", "Presentation skills", "LMS knowledge"],
    salary: { min: 55000, max: 75000, currency: "USD", period: "yearly" },
    type: "Full-time",
    postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://corporateed.com/careers/training-specialist",
    source: "CorporateEd Jobs",
    skills: ["Training Design", "Presentation", "LMS", "Adult Learning", "Assessment"],
    benefits: ["Health Insurance", "Professional Development", "Travel Opportunities", "Flexible Work"],
    companySize: "50-200 employees",
    industry: "Corporate Training"
  },

  // Customer Service Jobs
  {
    id: "job-17",
    title: "Customer Service Representative",
    company: "ServiceFirst Inc",
    location: "Remote",
    description: "Handle customer inquiries via phone, email, and chat. Resolve issues and provide excellent customer support.",
    requirements: ["High school diploma", "Customer service experience", "Communication skills", "Problem solving", "Computer literacy"],
    salary: { min: 35000, max: 50000, currency: "USD", period: "yearly" },
    type: "Remote",
    postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://servicefirst.com/jobs/customer-service-rep",
    source: "ServiceFirst Careers",
    skills: ["Communication", "Problem Solving", "CRM Software", "Multitasking", "Patience"],
    benefits: ["Health Insurance", "Remote Work", "Paid Training", "Performance Bonuses"],
    companySize: "200-500 employees",
    industry: "Customer Service"
  },
  {
    id: "job-18",
    title: "Customer Success Manager",
    company: "TechSuccess Solutions",
    location: "San Diego, CA",
    description: "Manage customer relationships, ensure product adoption, and drive customer retention and growth.",
    requirements: ["3+ years customer success", "SaaS experience", "Account management", "Data analysis", "Relationship building"],
    salary: { min: 70000, max: 95000, currency: "USD", period: "yearly" },
    type: "Full-time",
    postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://techsuccess.com/careers/customer-success-manager",
    source: "TechSuccess Jobs",
    skills: ["Customer Success", "SaaS", "Account Management", "Data Analysis", "CRM"],
    benefits: ["Health Insurance", "Stock Options", "Flexible PTO", "Professional Development"],
    companySize: "100-300 employees",
    industry: "SaaS"
  },

  // Operations & Logistics Jobs
  {
    id: "job-19",
    title: "Operations Manager",
    company: "LogisticsPro Corp",
    location: "Chicago, IL",
    description: "Oversee daily operations, manage supply chain processes, and optimize operational efficiency.",
    requirements: ["5+ years operations", "Supply chain knowledge", "Leadership skills", "Process improvement", "Data analysis"],
    salary: { min: 85000, max: 120000, currency: "USD", period: "yearly" },
    type: "Full-time",
    postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://logisticspro.com/jobs/operations-manager",
    source: "LogisticsPro Careers",
    skills: ["Operations Management", "Supply Chain", "Leadership", "Process Improvement", "Analytics"],
    benefits: ["Health Insurance", "401k", "Performance Bonus", "Professional Development"],
    companySize: "500-1000 employees",
    industry: "Logistics"
  },
  {
    id: "job-20",
    title: "Warehouse Associate",
    company: "Distribution Center Plus",
    location: "Memphis, TN",
    description: "Handle shipping and receiving, inventory management, and warehouse operations. Physical role with growth opportunities.",
    requirements: ["High school diploma", "Physical ability", "Attention to detail", "Teamwork", "Basic computer skills"],
    salary: { min: 30000, max: 40000, currency: "USD", period: "yearly" },
    type: "Full-time",
    postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://distributionplus.com/careers/warehouse-associate",
    source: "Distribution Center Jobs",
    skills: ["Inventory Management", "Forklift Operation", "Teamwork", "Safety Procedures", "Physical Work"],
    benefits: ["Health Insurance", "Overtime Pay", "Safety Training", "Advancement Opportunities"],
    companySize: "100-300 employees",
    industry: "Warehousing"
  },

  // Entry Level & Internships
  {
    id: "job-21",
    title: "Junior Software Developer",
    company: "StartupTech Inc",
    location: "Austin, TX",
    description: "Entry-level position for new graduates. Learn and grow while contributing to web application development.",
    requirements: ["Bachelor's in CS", "Basic programming", "Eagerness to learn", "Problem solving", "Team collaboration"],
    salary: { min: 60000, max: 80000, currency: "USD", period: "yearly" },
    type: "Full-time",
    postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://startuptech.com/jobs/junior-developer",
    source: "StartupTech Careers",
    skills: ["JavaScript", "HTML", "CSS", "Git", "Problem Solving", "Learning"],
    benefits: ["Health Insurance", "Mentorship Program", "Learning Budget", "Flexible Hours"],
    companySize: "25-50 employees",
    industry: "Technology"
  },
  {
    id: "job-22",
    title: "Marketing Intern",
    company: "Growth Marketing Agency",
    location: "Los Angeles, CA",
    description: "3-month internship program. Assist with social media, content creation, and marketing campaigns.",
    requirements: ["Marketing student", "Social media knowledge", "Creative writing", "Adobe Creative Suite", "Internship credit"],
    salary: { min: 15, max: 18, currency: "USD", period: "hourly" },
    type: "Internship",
    postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://growthmarketing.com/internships/marketing-intern",
    source: "Growth Marketing Jobs",
    skills: ["Social Media", "Content Creation", "Adobe Creative Suite", "Writing", "Analytics"],
    benefits: ["Learning Experience", "Mentorship", "Portfolio Building", "Networking"],
    companySize: "10-25 employees",
    industry: "Marketing"
  },

  // Part-time & Contract Jobs
  {
    id: "job-23",
    title: "Freelance Content Writer",
    company: "ContentPro Agency",
    location: "Remote",
    description: "Write blog posts, articles, and marketing content for various clients. Flexible schedule and project-based work.",
    requirements: ["Writing portfolio", "SEO knowledge", "Research skills", "Time management", "Grammar expertise"],
    salary: { min: 25, max: 50, currency: "USD", period: "hourly" },
    type: "Contract",
    postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://contentpro.com/freelance/content-writer",
    source: "ContentPro Freelance",
    skills: ["Writing", "SEO", "Research", "WordPress", "Content Strategy"],
    benefits: ["Flexible Schedule", "Remote Work", "Project Variety", "Skill Development"],
    companySize: "10-50 employees",
    industry: "Content Marketing"
  },
  {
    id: "job-24",
    title: "Part-time Bookkeeper",
    company: "Small Business Solutions",
    location: "Nashville, TN",
    description: "Manage books for small businesses. 20 hours per week, flexible schedule. Great for work-life balance.",
    requirements: ["Bookkeeping experience", "QuickBooks", "Attention to detail", "Reliability", "Basic accounting"],
    salary: { min: 18, max: 25, currency: "USD", period: "hourly" },
    type: "Part-time",
    postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://smallbizsolutions.com/jobs/part-time-bookkeeper",
    source: "Small Business Jobs",
    skills: ["QuickBooks", "Excel", "Bookkeeping", "Attention to Detail", "Organization"],
    benefits: ["Flexible Schedule", "Part-time", "Multiple Clients", "Skill Building"],
    companySize: "1-10 employees",
    industry: "Accounting"
  },

  // International Jobs
  {
    id: "job-25",
    title: "Software Engineer",
    company: "InfoTech Solutions",
    location: "Pune, India",
    description: "Join our engineering team in Pune. Work on cutting-edge software solutions and collaborate with global teams.",
    requirements: ["3+ years software development", "Java or Python", "Web technologies", "Database knowledge", "Problem solving"],
    salary: { min: 600000, max: 1200000, currency: "INR", period: "yearly" },
    type: "Full-time",
    postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    applyUrl: "https://infotech.com/careers/software-engineer",
    source: "InfoTech Careers",
    skills: ["Java", "Python", "Web Development", "SQL", "Problem Solving"],
    benefits: ["Health Insurance", "Training Programs", "Flexible Work", "Team Outings"],
    companySize: "200-1000 employees",
    industry: "Information Technology"
  }
];

export class JobApiService {
  private static readonly JSEARCH_API_KEY = ''; // API key would need to be configured
  private static readonly JSEARCH_BASE_URL = 'https://jsearch.p.rapidapi.com';

  static async searchJobs(params: JobSearchParams): Promise<JobListing[]> {
    console.log('Searching jobs with params:', params);
    
    // Simulate realistic API delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    // Try JSearch API first if API key is available
    if (this.JSEARCH_API_KEY) {
      try {
        return await this.searchWithJSearchAPI(params);
      } catch (error) {
        console.error('JSearch API failed, falling back to mock data:', error);
      }
    }

    // Enhanced mock data search with realistic results
    return this.searchMockJobs(params);
  }

  private static async searchWithJSearchAPI(params: JobSearchParams): Promise<JobListing[]> {
    const { query, location = '', jobType, salaryMin, remote } = params;
    
    const searchQuery = `${query} ${location}`.trim();
    const url = `${this.JSEARCH_BASE_URL}/search`;
    
    const queryParams = new URLSearchParams({
      query: searchQuery,
      page: '1',
      num_pages: '3',
      date_posted: 'month'
    });

    if (remote) {
      queryParams.append('remote_jobs_only', 'true');
    }

    const response = await fetch(`${url}?${queryParams}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': this.JSEARCH_API_KEY,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      throw new Error(`JSearch API error: ${response.status}`);
    }

    const data = await response.json();
    
    return (data.data || []).map((job: any) => this.transformJSearchJob(job));
  }

  private static transformJSearchJob(job: any): JobListing {
    return {
      id: job.job_id || Math.random().toString(36).substr(2, 9),
      title: job.job_title || 'Job Position',
      company: job.employer_name || 'Company',
      location: job.job_city && job.job_state 
        ? `${job.job_city}, ${job.job_state}` 
        : job.job_country || 'Location',
      description: job.job_description || '',
      requirements: job.job_highlights?.Qualifications || [],
      salary: job.job_min_salary && job.job_max_salary ? {
        min: job.job_min_salary,
        max: job.job_max_salary,
        currency: 'USD',
        period: 'yearly'
      } : undefined,
      type: this.mapJobType(job.job_employment_type),
      postedDate: job.job_posted_at_datetime_utc || new Date().toISOString(),
      applyUrl: job.job_apply_link || '#',
      source: 'JSearch API',
      skills: job.job_required_skills || [],
      benefits: job.job_highlights?.Benefits || [],
      companyLogo: job.employer_logo,
      industry: job.job_publisher || 'Various'
    };
  }

  private static mapJobType(type: string): JobListing['type'] {
    const typeMap: Record<string, JobListing['type']> = {
      'FULLTIME': 'Full-time',
      'PARTTIME': 'Part-time',
      'CONTRACT': 'Contract',
      'INTERN': 'Internship'
    };
    return typeMap[type?.toUpperCase()] || 'Full-time';
  }

  private static searchMockJobs(params: JobSearchParams): JobListing[] {
    const { query, location, jobType, salaryMin, remote } = params;
    
    let filteredJobs = [...MOCK_JOBS];

    // Filter by query (title, company, skills, description)
    if (query) {
      const queryLower = query.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.title.toLowerCase().includes(queryLower) ||
        job.company.toLowerCase().includes(queryLower) ||
        job.skills.some(skill => skill.toLowerCase().includes(queryLower)) ||
        job.description.toLowerCase().includes(queryLower) ||
        job.industry?.toLowerCase().includes(queryLower)
      );
    }

    // Filter by location
    if (location) {
      const locationLower = location.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.location.toLowerCase().includes(locationLower)
      );
    }

    // Filter by job type
    if (jobType) {
      filteredJobs = filteredJobs.filter(job => 
        job.type.toLowerCase() === jobType.toLowerCase()
      );
    }

    // Filter by remote
    if (remote) {
      filteredJobs = filteredJobs.filter(job => 
        job.type === 'Remote' || job.location.toLowerCase().includes('remote')
      );
    }

    // Filter by salary
    if (salaryMin && filteredJobs.length > 0) {
      filteredJobs = filteredJobs.filter(job => 
        job.salary && job.salary.min && job.salary.min >= salaryMin
      );
    }

    // Sort by relevance (recently posted first)
    filteredJobs.sort((a, b) => 
      new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
    );

    return filteredJobs;
  }

  static extractJobKeywords(jobDescription: string, jobTitle: string): string[] {
    const text = `${jobTitle} ${jobDescription}`.toLowerCase();
    const keywords = new Set<string>();

    // Common tech keywords
    const techKeywords = [
      'javascript', 'typescript', 'react', 'vue', 'angular', 'node',
      'python', 'java', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin',
      'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins',
      'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch',
      'graphql', 'rest', 'api', 'microservices', 'devops',
      'machine learning', 'ai', 'data science', 'analytics',
      'product management', 'agile', 'scrum', 'design', 'ux', 'ui'
    ];

    techKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        keywords.add(keyword);
      }
    });

    // Extract words from job title
    jobTitle.toLowerCase().split(/\s+/).forEach(word => {
      if (word.length > 3 && !['the', 'and', 'for', 'with'].includes(word)) {
        keywords.add(word);
      }
    });

    return Array.from(keywords);
  }

  static async searchJobsByWebsite(websiteUrl: string, position: string, location?: string): Promise<JobListing[]> {
    console.log(`Searching for ${position} jobs on ${websiteUrl}`);
    
    // For now, return filtered mock jobs based on the search criteria
    // In a real implementation, you would scrape or use specific APIs for each job board
    return this.searchMockJobs({
      query: position,
      location: location
    });
  }
}
