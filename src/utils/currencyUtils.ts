// Currency conversion utilities for displaying salaries in INR

// Exchange rates (you can update these or fetch from an API)
const EXCHANGE_RATES: { [key: string]: number } = {
  USD: 83.50,  // 1 USD = 83.50 INR
  EUR: 90.75,  // 1 EUR = 90.75 INR
  GBP: 106.20, // 1 GBP = 106.20 INR
  AUD: 54.80,  // 1 AUD = 54.80 INR
  CAD: 61.50,  // 1 CAD = 61.50 INR
  AED: 22.75,  // 1 AED = 22.75 INR
  SGD: 62.30,  // 1 SGD = 62.30 INR
  JPY: 0.56,   // 1 JPY = 0.56 INR
  INR: 1,      // Already in INR
};

export interface Salary {
  min?: number;
  max?: number;
  currency: string;
  period: 'hourly' | 'monthly' | 'yearly' | 'weekly';
}

export interface ConvertedSalary extends Salary {
  originalCurrency?: string;
  originalMin?: number;
  originalMax?: number;
}

// Convert any currency to INR
export const convertToINR = (amount: number, fromCurrency: string): number => {
  const currency = fromCurrency.toUpperCase();
  const rate = EXCHANGE_RATES[currency] || EXCHANGE_RATES.USD; // Default to USD if currency not found
  return Math.round(amount * rate);
};

// Convert salary object to INR
export const convertSalaryToINR = (salary: Salary | undefined): ConvertedSalary | undefined => {
  if (!salary) return undefined;
  
  const currency = salary.currency.toUpperCase();
  
  // If already in INR, return as-is
  if (currency === 'INR') {
    return salary;
  }
  
  // Convert to INR
  const convertedSalary: ConvertedSalary = {
    ...salary,
    originalCurrency: salary.currency,
    originalMin: salary.min,
    originalMax: salary.max,
    currency: 'INR',
    min: salary.min ? convertToINR(salary.min, currency) : undefined,
    max: salary.max ? convertToINR(salary.max, currency) : undefined,
  };
  
  return convertedSalary;
};

// Format salary for display in INR
export const formatSalaryINR = (salary: Salary | ConvertedSalary | undefined): string => {
  if (!salary) return 'Salary not disclosed';
  
  // Convert to INR if not already
  const inrSalary = salary.currency === 'INR' ? salary : convertSalaryToINR(salary);
  if (!inrSalary) return 'Salary not disclosed';
  
  const { min, max, period } = inrSalary;
  
  // Format numbers with Indian numbering system (lakhs, crores)
  const formatIndianNumber = (num: number): string => {
    if (num >= 10000000) {
      return `${(num / 10000000).toFixed(2)} Cr`;
    } else if (num >= 100000) {
      return `${(num / 100000).toFixed(2)} L`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`;
    }
    return num.toLocaleString('en-IN');
  };
  
  // Convert to yearly if needed for better display
  let displayMin = min;
  let displayMax = max;
  let displayPeriod = period;
  
  if (period === 'hourly' && min) {
    // Convert hourly to yearly (assuming 2080 hours/year)
    displayMin = min * 2080;
    displayMax = max ? max * 2080 : undefined;
    displayPeriod = 'yearly';
  } else if (period === 'monthly' && min) {
    // Convert monthly to yearly
    displayMin = min * 12;
    displayMax = max ? max * 12 : undefined;
    displayPeriod = 'yearly';
  } else if (period === 'weekly' && min) {
    // Convert weekly to yearly
    displayMin = min * 52;
    displayMax = max ? max * 52 : undefined;
    displayPeriod = 'yearly';
  }
  
  // Format the display string
  if (displayMin && displayMax) {
    return `₹${formatIndianNumber(displayMin)} - ₹${formatIndianNumber(displayMax)} per ${displayPeriod === 'yearly' ? 'annum' : displayPeriod}`;
  } else if (displayMin) {
    return `₹${formatIndianNumber(displayMin)}${displayMax ? '+' : ''} per ${displayPeriod === 'yearly' ? 'annum' : displayPeriod}`;
  }
  
  return 'Salary not disclosed';
};

// Parse salary from text (common patterns in job descriptions)
export const parseSalaryFromText = (text: string): Salary | undefined => {
  // Common salary patterns
  const patterns = [
    // INR patterns
    /₹\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:k|K|lakh|L|lakhs|cr|Cr|crore)?\s*(?:-|to)\s*₹?\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:k|K|lakh|L|lakhs|cr|Cr|crore)?/i,
    /INR\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:k|K|lakh|L|lakhs|cr|Cr|crore)?\s*(?:-|to)\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:k|K|lakh|L|lakhs|cr|Cr|crore)?/i,
    // USD patterns
    /\$\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:k|K)?\s*(?:-|to)\s*\$?\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:k|K)?/i,
    /USD\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:k|K)?\s*(?:-|to)\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:k|K)?/i,
    // Generic patterns
    /(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:k|K|lakh|L|lakhs|cr|Cr|crore)?\s*(?:-|to)\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:k|K|lakh|L|lakhs|cr|Cr|crore)?\s*(?:per|\/)\s*(year|annual|month|hour|week)/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      let min = parseFloat(match[1].replace(/,/g, ''));
      let max = parseFloat(match[2].replace(/,/g, ''));
      
      // Handle multipliers
      const minMultiplier = match[1].toLowerCase();
      const maxMultiplier = match[2].toLowerCase();
      
      if (minMultiplier.includes('k')) min *= 1000;
      if (minMultiplier.includes('lakh') || minMultiplier.includes('l')) min *= 100000;
      if (minMultiplier.includes('cr') || minMultiplier.includes('crore')) min *= 10000000;
      
      if (maxMultiplier.includes('k')) max *= 1000;
      if (maxMultiplier.includes('lakh') || maxMultiplier.includes('l')) max *= 100000;
      if (maxMultiplier.includes('cr') || maxMultiplier.includes('crore')) max *= 10000000;
      
      // Determine currency
      let currency = 'INR';
      if (text.includes('$') || text.toLowerCase().includes('usd')) {
        currency = 'USD';
      } else if (text.includes('€') || text.toLowerCase().includes('eur')) {
        currency = 'EUR';
      } else if (text.includes('£') || text.toLowerCase().includes('gbp')) {
        currency = 'GBP';
      }
      
      // Determine period
      let period: 'hourly' | 'monthly' | 'yearly' | 'weekly' = 'yearly';
      if (match[3]) {
        const periodText = match[3].toLowerCase();
        if (periodText.includes('hour')) period = 'hourly';
        else if (periodText.includes('month')) period = 'monthly';
        else if (periodText.includes('week')) period = 'weekly';
      }
      
      return {
        min,
        max,
        currency,
        period,
      };
    }
  }
  
  return undefined;
};