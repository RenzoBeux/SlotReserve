
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

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

const OwnerDashboard = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link to="/calendar">
          <Button variant="default" className="bg-bookify-500 hover:bg-bookify-600">
            <CalendarIcon className="mr-2 h-4 w-4" />
            View Calendar
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Bookings</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{MOCK_UPCOMING_BOOKINGS.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Slots</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              For the next 30 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +3 new this month
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Upcoming Bookings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_UPCOMING_BOOKINGS.map((booking) => (
            <Card key={booking.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{booking.label}</CardTitle>
                <CardDescription>with {booking.userName}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <CalendarIcon className="w-4 h-4 mr-2 text-bookify-500" />
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
              <CardFooter className="flex justify-between">
                <Button variant="outline">Reschedule</Button>
                <Button variant="ghost" className="text-red-500 hover:text-red-600">
                  Cancel
                </Button>
              </CardFooter>
            </Card>
          ))}

          <Card className="border-dashed border-gray-300 bg-gray-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-gray-500">Configure Availability</CardTitle>
              <CardDescription>Set up your weekly schedule</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-8">
              <Link to="/settings">
                <Button className="bg-bookify-500 hover:bg-bookify-600">
                  <Clock className="mr-2 h-4 w-4" />
                  Manage Slots
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const UserDashboard = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Bookings</h1>
        <Button variant="default" className="bg-bookify-500 hover:bg-bookify-600">
          <CalendarIcon className="mr-2 h-4 w-4" />
          Book New Appointment
        </Button>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_UPCOMING_BOOKINGS.map((booking) => (
            <Card key={booking.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{booking.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <CalendarIcon className="w-4 h-4 mr-2 text-bookify-500" />
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

          <Card className="border-dashed border-gray-300 bg-gray-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-gray-500">Find Available Slots</CardTitle>
              <CardDescription>Book a new appointment</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-8">
              <Link to="/calendar">
                <Button className="bg-bookify-500 hover:bg-bookify-600">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  View Calendar
                </Button>
              </Link>
            </CardContent>
          </Card>
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

const Dashboard = () => {
  const { userData, loading } = useAuth();
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (userData) {
      setIsOwner(userData.role === 'OWNER');
    }
  }, [userData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {isOwner ? <OwnerDashboard /> : <UserDashboard />}
    </div>
  );
};

export default Dashboard;
