
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Calendar from '@/components/calendar/Calendar';
import TimeSlot from '@/components/calendar/TimeSlot';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format, addDays, parse } from 'date-fns';
import { Loader } from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';
import { TimeSlot as TimeSlotType, Booking as BookingType } from '@/types';
import { toast } from 'sonner';
import { FlexibleTimeSelector } from '@/components/booking/FlexibleTimeSelector';

// Default logo if none is provided
const DEFAULT_LOGO = "/placeholder.svg";

// Mock data
const MOCK_OWNER = {
  id: 'owner-123',
  name: 'Dr. Jane Smith',
  profession: 'Therapist',
  description: 'Specialized in cognitive behavioral therapy with over 10 years of experience.',
  logo: '',
  primaryColor: '#7C3AED', // Default purple
  secondaryColor: '#8B5CF6', // Default accent purple
};

// Add max bookings to the mock data
const MOCK_SLOTS: TimeSlotType[] = Array.from({ length: 30 }, (_, i) => ({
  id: `slot-${i}`,
  ownerId: 'owner-123',
  startTime: addDays(new Date(), i % 14).setHours(9 + (i % 8), 0, 0, 0).toString(),
  endTime: addDays(new Date(), i % 14).setHours(10 + (i % 8), 0, 0, 0).toString(),
  label: i % 3 === 0 ? 'Consultation' : i % 3 === 1 ? 'Follow-up' : 'Session',
  available: i % 5 !== 0,
  recurring: i % 7 === 0,
  dayOfWeek: i % 7,
  // Add flexible booking mode to some slots
  bookingMode: i % 4 === 0 ? 'FLEXIBLE' : 'FIXED',
  // Add max bookings (higher for flexible slots)
  maxBookings: i % 4 === 0 ? 5 : 2,
  // Add some mock bookings to flexible slots
  bookings: i % 4 === 0 ? [
    {
      id: `booking-${i}-1`,
      slotId: `slot-${i}`,
      ownerId: 'owner-123',
      userId: 'user-456',
      startTime: format(addDays(new Date(), i % 14).setHours(11, 0, 0, 0), 'HH:mm'),
      endTime: format(addDays(new Date(), i % 14).setHours(12, 0, 0, 0), 'HH:mm'),
      userName: 'John Doe',
      label: 'Booked Session',
      status: 'confirmed' as const
    }
  ] : [],
}));

// TEMPORARY: Flag to bypass authentication
const BYPASS_AUTH = true;

const PublicCalendar = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user, userData, loading } = useAuth();
  const navigate = useNavigate();
  
  const [owner, setOwner] = useState<any>(null);
  const [slots, setSlots] = useState<TimeSlotType[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<TimeSlotType | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // For flexible booking
  const [customStartTime, setCustomStartTime] = useState<string>('');
  const [customEndTime, setCustomEndTime] = useState<string>('');
  const [isTimeRangeValid, setIsTimeRangeValid] = useState(true);

  // Define dynamic styling based on owner's branding
  const primaryColor = owner?.primaryColor || '#7C3AED'; // Default purple if not set
  const secondaryColor = owner?.secondaryColor || '#8B5CF6'; // Default accent purple if not set

  // Apply custom styling to buttons and elements based on owner's colors
  const customButtonStyle = {
    backgroundColor: primaryColor,
    '&:hover': {
      backgroundColor: secondaryColor,
    }
  };

  // Fetch owner and slots (mock)
  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      
      // In a real app, we would fetch the owner and slots from the API
      setTimeout(() => {
        setOwner(MOCK_OWNER);
        setSlots(MOCK_SLOTS.map(slot => ({...slot})));
        setIsLoading(false);
      }, 1000);
    };

    fetchData();
  }, [slug]);

  const handleSlotSelect = (slot: TimeSlotType) => {
    // Check if slot has reached its booking limit
    const bookedCount = slot.bookings?.length || 0;
    const availableSlots = slot.maxBookings - bookedCount;
    
    if (availableSlots <= 0) {
      toast.error("This slot is fully booked");
      return;
    }
    
    setSelectedSlot(slot);
    
    // If flexible, initialize with slot's time range
    if (slot.bookingMode === 'FLEXIBLE') {
      const startDate = new Date(slot.startTime);
      const endDate = new Date(slot.endTime);
      setCustomStartTime(format(startDate, 'HH:mm'));
      setCustomEndTime(format(endDate, 'HH:mm'));
    }
    
    setIsBookingModalOpen(true);
  };

  const handleBooking = async () => {
    // When bypassing auth, allow booking without user check
    if (BYPASS_AUTH || user) {
      if (selectedSlot?.bookingMode === 'FLEXIBLE' && !isTimeRangeValid) {
        toast.error('Please select a valid time range');
        return;
      }
      
      // In a real app, we would call the API to book the slot
      toast.success('Appointment booked successfully!');
      setIsBookingModalOpen(false);
      
      // Update local state to simulate booking
      if (selectedSlot) {
        // For fixed slots: mark as unavailable if max bookings is 1
        // For flexible slots or slots with maxBookings > 1: add a booking but keep available
        
        const bookings = selectedSlot.bookings || [];
        const newBooking: BookingType = {
          id: `booking-new-${Date.now()}`,
          slotId: selectedSlot.id,
          ownerId: selectedSlot.ownerId,
          userId: 'user-current',
          startTime: selectedSlot.bookingMode === 'FLEXIBLE' ? customStartTime : format(new Date(selectedSlot.startTime), 'HH:mm'),
          endTime: selectedSlot.bookingMode === 'FLEXIBLE' ? customEndTime : format(new Date(selectedSlot.endTime), 'HH:mm'),
          userName: 'Current User',
          label: selectedSlot.label,
          status: 'confirmed'
        };
        
        const updatedBookings = [...bookings, newBooking];
        
        setSlots(slots.map(slot => 
          slot.id === selectedSlot.id 
            ? { 
                ...slot, 
                bookings: updatedBookings,
                // Only mark as unavailable if it's a fixed slot with maxBookings=1
                available: !(slot.bookingMode === 'FIXED' && slot.maxBookings === 1)
              } 
            : slot
        ));
      }
    }
  };

  const handleTimeChange = (startTime: string, endTime: string, isValid: boolean) => {
    setCustomStartTime(startTime);
    setCustomEndTime(endTime);
    setIsTimeRangeValid(isValid);
  };

  const slotsForSelectedDate = slots.filter(slot => {
    const slotDate = new Date(slot.startTime);
    return slotDate.toDateString() === selectedDate.toDateString();
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin" style={{ color: primaryColor }} />
      </div>
    );
  }

  if (!owner) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Calendar Not Found</CardTitle>
            <CardDescription>
              The calendar you're looking for could not be found.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate('/')} style={{ backgroundColor: primaryColor }}>
              Return to Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{owner.name}'s Booking Calendar</CardTitle>
              <CardDescription>{owner.profession}</CardDescription>
            </div>
            <div className="ml-auto">
              {owner.logo ? (
                <img 
                  src={owner.logo} 
                  alt={`${owner.name}'s Logo`} 
                  className="h-16 w-auto object-contain" 
                />
              ) : (
                <img 
                  src={DEFAULT_LOGO} 
                  alt="Default Logo" 
                  className="h-16 w-auto object-contain opacity-70" 
                />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p>{owner.description}</p>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Select a Date</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar 
                  slots={slots}
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                  onSlotSelect={handleSlotSelect}
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  Available Slots for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {slotsForSelectedDate.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {slotsForSelectedDate.map((slot) => (
                      <TimeSlot
                        key={slot.id}
                        slot={slot}
                        onSelect={() => handleSlotSelect(slot)}
                        showActions={slot.available}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-muted-foreground">
                      No available slots for this date. Please select another date.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent>
          {BYPASS_AUTH || user ? (
            <>
              <DialogHeader>
                <DialogTitle>
                  {selectedSlot?.bookingMode === 'FLEXIBLE' 
                    ? 'Choose Your Booking Time' 
                    : 'Confirm Booking'
                  }
                </DialogTitle>
                <DialogDescription>
                  {selectedSlot?.bookingMode === 'FLEXIBLE' 
                    ? 'Select your preferred time within the available range:' 
                    : 'You\'re about to book the following appointment:'
                  }
                </DialogDescription>
              </DialogHeader>
              
              {selectedSlot && (
                <div className="py-4">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-1">Service</h4>
                    <p>{selectedSlot.label}</p>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-1">Date</h4>
                    <p>{format(new Date(selectedSlot.startTime), 'EEEE, MMMM d, yyyy')}</p>
                  </div>
                  
                  {selectedSlot.bookingMode === 'FLEXIBLE' ? (
                    <FlexibleTimeSelector
                      minTime={format(new Date(selectedSlot.startTime), 'HH:mm')}
                      maxTime={format(new Date(selectedSlot.endTime), 'HH:mm')}
                      date={new Date(selectedSlot.startTime)}
                      existingBookings={selectedSlot.bookings?.map(booking => ({
                        startTime: booking.startTime,
                        endTime: booking.endTime
                      }))}
                      maxAllowedBookings={selectedSlot.maxBookings}
                      onTimeChange={handleTimeChange}
                      primaryColor={primaryColor}
                    />
                  ) : (
                    <div>
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-1">Time</h4>
                        <p>
                          {format(new Date(selectedSlot.startTime), 'h:mm a')} - {format(new Date(selectedSlot.endTime), 'h:mm a')}
                        </p>
                      </div>
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-1">Availability</h4>
                        <p>
                          {selectedSlot.bookings ? 
                            `${selectedSlot.maxBookings - selectedSlot.bookings.length} of ${selectedSlot.maxBookings} slots available` :
                            `${selectedSlot.maxBookings} slots available`}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsBookingModalOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  style={{
                    backgroundColor: selectedSlot?.bookingMode === 'FLEXIBLE' ? secondaryColor : primaryColor
                  }}
                  onClick={handleBooking}
                  disabled={selectedSlot?.bookingMode === 'FLEXIBLE' && !isTimeRangeValid}
                  className="hover:opacity-90"
                >
                  Confirm Booking
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Login Required</DialogTitle>
                <DialogDescription>
                  Please log in or create an account to book this appointment
                </DialogDescription>
              </DialogHeader>
              
              <LoginForm redirect={`/p/${slug}`} />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PublicCalendar;
