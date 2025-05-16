
import { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Calendar as CalendarIcon, Users } from 'lucide-react';
import { TimeSlot as TimeSlotType } from '@/types';
import { cn } from '@/lib/utils';

interface TimeSlotProps {
  slot: TimeSlotType;
  onSelect?: () => void;
  isSelected?: boolean;
  showActions?: boolean;
}

const TimeSlot = ({ slot, onSelect, isSelected, showActions = true }: TimeSlotProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const startTime = new Date(slot.startTime);
  const endTime = new Date(slot.endTime);

  const formattedDate = format(startTime, 'MMMM d, yyyy');
  const formattedStartTime = format(startTime, 'h:mm a');
  const formattedEndTime = format(endTime, 'h:mm a');

  // Calculate available slots
  const bookedCount = slot.bookings?.length || 0;
  const availableCount = Math.max(0, slot.maxBookings - bookedCount);
  const isFullyBooked = availableCount === 0;

  // Add visual styling for flexible slots
  const isFlexible = slot.bookingMode === 'FLEXIBLE';

  return (
    <Card 
      className={cn(
        "border transition-all duration-200",
        isSelected ? "border-bookify-500 ring-1 ring-bookify-500" : "border-border",
        !slot.available && "opacity-60",
        isFlexible && "bg-purple-50 dark:bg-purple-900/20", // Add purple background for flexible slots
        isFullyBooked && "bg-gray-100 dark:bg-gray-800/50 opacity-70" // Add styling for fully booked slots
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center flex-wrap gap-1">
          <span className="font-medium">{slot.label}</span>
          {!slot.available && (
            <span className="ml-2 text-xs py-0.5 px-2 bg-gray-100 text-gray-600 rounded-full dark:bg-gray-700 dark:text-gray-300">
              Booked
            </span>
          )}
          {slot.recurring && (
            <span className="ml-2 text-xs py-0.5 px-2 bg-bookify-50 text-bookify-600 rounded-full dark:bg-bookify-900/30 dark:text-bookify-300">
              Recurring
            </span>
          )}
          {isFlexible && (
            <span className="ml-2 text-xs py-0.5 px-2 bg-purple-100 text-purple-600 rounded-full dark:bg-purple-900/50 dark:text-purple-300">
              Flexible
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <CalendarIcon className="w-4 h-4 mr-2 text-bookify-500" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Clock className="w-4 h-4 mr-2 text-bookify-500" />
          <span>{formattedStartTime} - {formattedEndTime}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="w-4 h-4 mr-2 text-bookify-500" />
          <span>{availableCount} of {slot.maxBookings} slots available</span>
        </div>
        {isFlexible && (
          <div className="mt-2 text-xs text-purple-600 dark:text-purple-300">
            <p>You can choose your own time within this period</p>
          </div>
        )}
      </CardContent>
      {showActions && slot.available && !isFullyBooked && (
        <CardFooter>
          <Button 
            className={cn(
              "w-full",
              isFlexible 
                ? "bg-purple-500 hover:bg-purple-600 dark:bg-purple-700 dark:hover:bg-purple-600" 
                : "bg-bookify-500 hover:bg-bookify-600"
            )}
            onClick={onSelect}
          >
            Book this slot
          </Button>
        </CardFooter>
      )}
      {isFullyBooked && showActions && (
        <CardFooter>
          <div className="w-full text-center text-sm text-muted-foreground py-1">
            Fully booked
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default TimeSlot;
