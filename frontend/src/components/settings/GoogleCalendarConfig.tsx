
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Calendar, Check, RefreshCw, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export const GoogleCalendarConfig = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncEnabled, setIsSyncEnabled] = useState(false);
  const [calendarId, setCalendarId] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);

  const connectGoogleCalendar = () => {
    setIsConnecting(true);
    // In a real app, this would initiate OAuth flow
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      setCalendarId('primary');
      setLastSynced(new Date().toISOString());
      toast.success('Connected to Google Calendar');
    }, 1500);
  };

  const disconnectGoogleCalendar = () => {
    // In a real app, this would revoke OAuth tokens
    setIsConnected(false);
    setIsSyncEnabled(false);
    setCalendarId('');
    toast.success('Disconnected from Google Calendar');
  };

  const handleSync = () => {
    // In a real app, this would trigger a sync with Google Calendar
    toast.success('Sync with Google Calendar started');
    setTimeout(() => {
      setLastSynced(new Date().toISOString());
      toast.success('Sync completed successfully');
    }, 1500);
  };

  const toggleSync = (enabled: boolean) => {
    setIsSyncEnabled(enabled);
    if (enabled) {
      toast.success('Auto-sync enabled');
    } else {
      toast.success('Auto-sync disabled');
    }
  };

  return (
    <Card className="dark:bg-gray-800">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Google Calendar Integration</CardTitle>
        <CardDescription>
          Sync your availability and bookings with Google Calendar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isConnected ? (
          <>
            <div className="flex items-center space-x-2 mb-4 text-sm text-green-600 dark:text-green-400">
              <Check className="h-4 w-4" />
              <span>Connected to Google Calendar</span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="calendar-id">Calendar ID</Label>
              <Input 
                id="calendar-id" 
                value={calendarId}
                onChange={(e) => setCalendarId(e.target.value)}
                placeholder="primary"
              />
              <p className="text-xs text-muted-foreground">
                Leave as "primary" to use your main calendar or specify a calendar ID
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-sync">Automatic Sync</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically sync changes between platforms
                  </p>
                </div>
                <Switch
                  id="auto-sync"
                  checked={isSyncEnabled}
                  onCheckedChange={toggleSync}
                />
              </div>
            </div>

            {lastSynced && (
              <div className="text-xs text-muted-foreground pt-2">
                Last synced: {new Date(lastSynced).toLocaleString()}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-bookify-100 dark:bg-bookify-900 flex items-center justify-center">
              <Calendar className="h-8 w-8 text-bookify-500 dark:text-bookify-300" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium">Connect to Google Calendar</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Connect your Google Calendar to automatically sync your availability and bookings
              </p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {isConnected ? (
          <div className="flex w-full flex-col md:flex-row md:justify-between gap-2">
            <Button 
              variant="outline" 
              className="text-red-500 dark:text-red-400 border-red-300 dark:border-red-500/30 hover:bg-red-50 dark:hover:bg-red-950/30"
              onClick={disconnectGoogleCalendar}
            >
              <X className="h-4 w-4 mr-2" />
              Disconnect
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline" 
                className="flex-1 md:flex-none"
                onClick={handleSync}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync Now
              </Button>
              <Button 
                className="flex-1 md:flex-none bg-bookify-500 hover:bg-bookify-600"
                onClick={() => toast.success('Settings saved')}
              >
                Save Changes
              </Button>
            </div>
          </div>
        ) : (
          <Button 
            className="w-full bg-bookify-500 hover:bg-bookify-600" 
            onClick={connectGoogleCalendar}
            disabled={isConnecting}
          >
            {isConnecting && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
            Connect to Google Calendar
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
