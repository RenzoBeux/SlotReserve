
import { useState, useEffect } from 'react';
import { format, parse, isWithinInterval, areIntervalsOverlapping } from 'date-fns';
import { Label } from '@/components/ui/label';
import { TimePickerInput } from '@/components/ui/time-picker-input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ExistingBooking {
  startTime: string; // Format: "HH:mm"
  endTime: string; // Format: "HH:mm"
  count?: number; // Number of bookings in this time range
}

interface FlexibleTimeSelectorProps {
  minTime: string; // Format: "HH:mm"
  maxTime: string; // Format: "HH:mm"
  date: Date;
  existingBookings?: ExistingBooking[];
  maxAllowedBookings: number; // Maximum allowed concurrent bookings
  onTimeChange: (startTime: string, endTime: string, isValid: boolean) => void;
}

export function FlexibleTimeSelector({
  minTime,
  maxTime,
  date,
  existingBookings = [],
  maxAllowedBookings = 1,
  onTimeChange,
}: FlexibleTimeSelectorProps) {
  const [startTime, setStartTime] = useState(minTime);
  const [endTime, setEndTime] = useState(maxTime);
  const [error, setError] = useState<string | null>(null);

  // Convert time strings to Date objects for easier comparison
  const getTimeAsDate = (timeStr: string) => {
    const baseDate = new Date(date);
    const [hours, minutes] = timeStr.split(':').map(Number);
    
    baseDate.setHours(hours, minutes, 0, 0);
    return baseDate;
  };

  // Validate that the selected time doesn't exceed the maximum concurrent bookings
  const validateTimeAgainstMaxBookings = (start: Date, end: Date) => {
    // For each minute in the selected range, check the current booking count
    let currentMinute = new Date(start);
    const selectedInterval = { start, end };
    
    // Create a map of all time slots and their booking counts
    const bookingCounts: Record<string, number> = {};
    
    // Initialize with 0 for each time slot
    while (currentMinute < end) {
      const timeKey = format(currentMinute, 'HH:mm');
      bookingCounts[timeKey] = 0;
      currentMinute = new Date(currentMinute.getTime() + 60000); // Add 1 minute
    }
    
    // Count existing bookings for each time slot
    existingBookings.forEach(booking => {
      const bookingStart = getTimeAsDate(booking.startTime);
      const bookingEnd = getTimeAsDate(booking.endTime);
      const count = booking.count || 1;
      
      // Add this booking's count to all time slots it covers
      let timeSlot = new Date(bookingStart);
      while (timeSlot < bookingEnd) {
        const timeKey = format(timeSlot, 'HH:mm');
        if (bookingCounts[timeKey] !== undefined) {
          bookingCounts[timeKey] += count;
        }
        timeSlot = new Date(timeSlot.getTime() + 60000); // Add 1 minute
      }
    });
    
    // Check if any time slot exceeds max bookings
    for (const timeKey in bookingCounts) {
      if (bookingCounts[timeKey] >= maxAllowedBookings) {
        return {
          valid: false,
          message: `The ${timeKey} time slot already has the maximum number of bookings (${maxAllowedBookings}).`
        };
      }
    }
    
    return { valid: true };
  };

  const validateTimeRange = () => {
    // Convert all times to Date objects for comparison
    const selectedStart = getTimeAsDate(startTime);
    const selectedEnd = getTimeAsDate(endTime);
    const minDate = getTimeAsDate(minTime);
    const maxDate = getTimeAsDate(maxTime);

    // Check if selection is within allowed time range
    if (selectedStart < minDate) {
      setError(`Start time cannot be before ${minTime}`);
      return false;
    }

    if (selectedEnd > maxDate) {
      setError(`End time cannot be after ${maxTime}`);
      return false;
    }

    if (selectedStart >= selectedEnd) {
      setError("End time must be after start time");
      return false;
    }

    // Check for overlaps with existing bookings and max bookings constraint
    const maxBookingsCheck = validateTimeAgainstMaxBookings(selectedStart, selectedEnd);
    if (!maxBookingsCheck.valid) {
      setError(maxBookingsCheck.message || "Time slot unavailable due to maximum bookings limit");
      return false;
    }

    setError(null);
    return true;
  };

  useEffect(() => {
    const isValid = validateTimeRange();
    onTimeChange(startTime, endTime, isValid);
  }, [startTime, endTime]);

  // Count existing bookings by time range for UI display
  const getBookingCountsByTime = () => {
    if (existingBookings.length === 0) return [];
    
    return existingBookings.map(booking => ({
      ...booking,
      count: booking.count || 1,
      remaining: maxAllowedBookings - (booking.count || 1)
    }));
  };

  const bookingCounts = getBookingCountsByTime();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start-time">Start Time</Label>
          <TimePickerInput 
            value={startTime} 
            onChange={(time) => setStartTime(time)} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end-time">End Time</Label>
          <TimePickerInput 
            value={endTime} 
            onChange={(time) => setEndTime(time)} 
          />
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="text-sm text-muted-foreground">
        <p>Available time range: {minTime} - {maxTime}</p>
        <p className="mt-1">Maximum concurrent bookings: {maxAllowedBookings}</p>
        
        {bookingCounts.length > 0 && (
          <div className="mt-2">
            <p>Existing bookings:</p>
            <ul className="list-disc list-inside">
              {bookingCounts.map((booking, index) => (
                <li key={index}>
                  {booking.startTime} - {booking.endTime} 
                  <span className="text-muted-foreground ml-2">
                    ({booking.count}/{maxAllowedBookings} slots taken)
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
