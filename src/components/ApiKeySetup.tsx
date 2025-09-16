import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Lock, CheckCircle, XCircle } from 'lucide-react';
import { AdzunaService } from '@/utils/adzunaService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function ApiKeySetup() {
  const [adzunaAppId, setAdzunaAppId] = useState('');
  const [adzunaAppKey, setAdzunaAppKey] = useState('');
  const [reedApiKey, setReedApiKey] = useState('');
  const [hasAdzunaKeys, setHasAdzunaKeys] = useState(false);
  const [hasReedKey, setHasReedKey] = useState(false);

  useEffect(() => {
    setHasAdzunaKeys(AdzunaService.hasCredentials());
    setHasReedKey(!!localStorage.getItem('reed_api_key'));
  }, []);

  const saveAdzunaKeys = () => {
    if (!adzunaAppId || !adzunaAppKey) {
      toast({
        title: "Error",
        description: "Please enter both App ID and App Key",
        variant: "destructive"
      });
      return;
    }

    AdzunaService.setCredentials(adzunaAppId, adzunaAppKey);
    setHasAdzunaKeys(true);
    toast({
      title: "Success",
      description: "Adzuna API keys saved successfully"
    });
  };

  const saveReedKey = () => {
    if (!reedApiKey) {
      toast({
        title: "Error",
        description: "Please enter the Reed API key",
        variant: "destructive"
      });
      return;
    }

    localStorage.setItem('reed_api_key', reedApiKey);
    setHasReedKey(true);
    toast({
      title: "Success",
      description: "Reed API key saved successfully"
    });
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">API Configuration</h2>
      <p className="text-muted-foreground mb-6">
        Configure API keys to access more job sources and get better search results.
      </p>

      <Tabs defaultValue="adzuna" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="adzuna">
            Adzuna {hasAdzunaKeys && <CheckCircle className="ml-2 h-4 w-4 text-green-500" />}
          </TabsTrigger>
          <TabsTrigger value="reed">
            Reed {hasReedKey && <CheckCircle className="ml-2 h-4 w-4 text-green-500" />}
          </TabsTrigger>
          <TabsTrigger value="remoteok">RemoteOK</TabsTrigger>
        </TabsList>

        <TabsContent value="adzuna" className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Adzuna API</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Free tier: 250 requests/month. Sign up at{' '}
              <a href="https://developer.adzuna.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                developer.adzuna.com
              </a>
            </p>
            <div className="space-y-4">
              <div>
                <Label htmlFor="adzuna-app-id">App ID</Label>
                <Input
                  id="adzuna-app-id"
                  type="text"
                  value={adzunaAppId}
                  onChange={(e) => setAdzunaAppId(e.target.value)}
                  placeholder="Enter your Adzuna App ID"
                />
              </div>
              <div>
                <Label htmlFor="adzuna-app-key">App Key</Label>
                <Input
                  id="adzuna-app-key"
                  type="password"
                  value={adzunaAppKey}
                  onChange={(e) => setAdzunaAppKey(e.target.value)}
                  placeholder="Enter your Adzuna App Key"
                />
              </div>
              <Button onClick={saveAdzunaKeys} className="w-full">
                <Lock className="mr-2 h-4 w-4" />
                Save Adzuna Keys
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reed" className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Reed API</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Free tier available. Sign up at{' '}
              <a href="https://www.reed.co.uk/developers/jobseeker" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                reed.co.uk/developers
              </a>
            </p>
            <div className="space-y-4">
              <div>
                <Label htmlFor="reed-api-key">API Key</Label>
                <Input
                  id="reed-api-key"
                  type="password"
                  value={reedApiKey}
                  onChange={(e) => setReedApiKey(e.target.value)}
                  placeholder="Enter your Reed API Key"
                />
              </div>
              <Button onClick={saveReedKey} className="w-full">
                <Lock className="mr-2 h-4 w-4" />
                Save Reed API Key
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="remoteok" className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">RemoteOK API</h3>
            <p className="text-sm text-muted-foreground">
              <CheckCircle className="inline mr-2 h-4 w-4 text-green-500" />
              No API key required! RemoteOK provides free access to remote job listings.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Automatically searches when you include "remote" in location or enable remote filter.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}