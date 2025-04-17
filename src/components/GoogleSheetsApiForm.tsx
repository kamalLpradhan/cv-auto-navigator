
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { Info } from 'lucide-react';

const GoogleSheetsApiForm = () => {
  const { googleSheetsApiKey, setGoogleSheetsApiKey } = useAuth();
  const [apiKey, setApiKey] = useState(googleSheetsApiKey);
  const { toast } = useToast();

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "API key cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    setGoogleSheetsApiKey(apiKey.trim());
    toast({
      title: "Google Sheets API Key Saved",
      description: "Your API key has been saved successfully",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Google Sheets Integration</CardTitle>
        <CardDescription>Connect to Google Sheets to store user data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-md border border-amber-200 dark:border-amber-800">
          <div className="flex gap-2">
            <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-amber-800 dark:text-amber-300">
                You need a Google Sheets API key to use this feature. This allows the app to store user data in your Google Sheet.
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-400 mt-2">
                <strong>Note:</strong> In a production app, API keys should be handled by a secure backend service, not in the frontend.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col space-y-2">
          <Label htmlFor="google-sheets-api-key">Google Sheets API Key</Label>
          <Input
            id="google-sheets-api-key"
            placeholder="Enter your Google Sheets API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            This key will be stored in your browser and used to connect to the specified Google Sheet.
          </p>
        </div>
        
        <div className="flex flex-col space-y-2">
          <Label>Spreadsheet Information</Label>
          <div className="text-sm text-muted-foreground">
            <p>Sheet ID: <span className="font-mono">17nfr1gMWO7FgMgY195p_pU3hh8YLS3GcyJqHDL6umg0</span></p>
            <p>Sheet Name: <span className="font-mono">Users</span></p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} className="w-full sm:w-auto">
          Save API Key
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GoogleSheetsApiForm;
