
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  ExternalLink,
  BriefcaseBusiness,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Application } from './ApplicationTracker';
import { useState } from 'react';

interface ApplicationCardProps {
  application: Application;
}

const ApplicationCard = ({ application }: ApplicationCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getStatusIcon = () => {
    switch (application.status) {
      case 'Applied':
        return <CheckCircle className="text-green-600 dark:text-green-400" size={18} />;
      case 'Failed':
        return <AlertTriangle className="text-amber-600 dark:text-amber-400" size={18} />;
      default:
        return <Clock className="text-blue-600 dark:text-blue-400" size={18} />;
    }
  };
  
  const getStatusText = () => {
    switch (application.status) {
      case 'Applied':
        return 'Applied Successfully';
      case 'Failed':
        return 'Application Failed';
      case 'In Review':
        return 'In Review';
      case 'Rejected':
        return 'Rejected';
      case 'Interview':
        return 'Interview Scheduled';
      case 'Offer':
        return 'Offer Received';
      default:
        return application.status;
    }
  };
  
  const getStatusClass = () => {
    switch (application.status) {
      case 'Applied':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Failed':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'In Review':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'Interview':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'Offer':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  return (
    <Card className="overflow-hidden card-hover">
      <CardContent className="p-0">
        <div className="p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <BriefcaseBusiness size={15} />
                <span>{application.company}</span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
                <Calendar size={15} />
                <span>{formatDate(application.appliedDate)}</span>
              </div>
              
              <h3 className="text-lg font-medium">{application.jobTitle}</h3>
              
              <div className="flex flex-wrap gap-2 mt-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass()}`}>
                  {getStatusIcon()}
                  <span className="ml-1">{getStatusText()}</span>
                </span>
                
                {application.autoApplied ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    Auto-Applied
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                    Manual Application
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-shrink-0">
                <ExternalLink size={15} className="mr-1" />
                View Job
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsExpanded(!isExpanded)}
                aria-label={isExpanded ? "Show less details" : "Show more details"} 
                className="flex-shrink-0"
              >
                {isExpanded ? (
                  <ChevronUp size={15} />
                ) : (
                  <ChevronDown size={15} />
                )}
              </Button>
            </div>
          </div>
          
          {isExpanded && application.message && (
            <div className={`mt-4 p-3 text-sm rounded ${
              application.status === 'Failed' 
                ? 'bg-amber-50 text-amber-800 dark:bg-amber-900/10 dark:text-amber-400' 
                : 'bg-muted/50'
            }`}>
              <p className="font-medium mb-1">Application Notes:</p>
              <p>{application.message}</p>
              
              {application.status === 'Failed' && (
                <div className="mt-3">
                  <p className="font-medium mb-1">Recommended Actions:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Check the company website directly</li>
                    <li>Try using a different browser</li>
                    <li>Make sure your CV is in a supported format</li>
                    <li>Consider reaching out to the company via email</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationCard;
