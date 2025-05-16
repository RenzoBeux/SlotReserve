
import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Mock data
const MOCK_UPCOMING_BOOKINGS = [
  {
    id: '1',
    label: 'Consultation',
    userName: 'John Doe',
    startTime: new Date(2025, 4, 15, 10, 0).toISOString(),
    endTime: new Date(2025, 4, 15, 11, 0).toISOString(),
  },
  {
    id: '2',
    label: 'Review',
    userName: 'Jane Smith',
    startTime: new Date(2025, 4, 16, 14, 0).toISOString(),
    endTime: new Date(2025, 4, 16, 15, 0).toISOString(),
  }
];

const Bookings = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Bookings</h1>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_UPCOMING_BOOKINGS.map((booking) => (
            <Card key={booking.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{booking.label}</CardTitle>
                <CardDescription>with {booking.userName}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <Calendar className="w-4 h-4 mr-2 text-bookify-500" />
                  <span>
                    {new Date(booking.startTime).toLocaleDateString('en-US', { 
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 mr-2 text-bookify-500" />
                  <span>
                    {new Date(booking.startTime).toLocaleTimeString('en-US', { 
                      hour: 'numeric',
                      minute: '2-digit'
                    })} - {new Date(booking.endTime).toLocaleTimeString('en-US', { 
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Reschedule
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Past Appointments</h2>
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">No past appointments found.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Bookings;
