
import { useState, useMemo } from 'react';
import { addDays, format, getDay, startOfMonth, endOfMonth, getDaysInMonth, isSameMonth, isToday, addMonths, subMonths, isSameDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TimeSlot as TimeSlotType } from '@/types';
import TimeSlot from './TimeSlot';

interface CalendarProps {
  slots: TimeSlotType[];
  onSlotSelect?: (slot: TimeSlotType) => void;
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
}

const Calendar = ({ slots, onSlotSelect, selectedDate, onDateChange }: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const calendarDays = useMemo(() => {
    const days = [];
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = addDays(monthStart, -getDay(monthStart));
    const daysToDisplay = getDay(monthStart) + getDaysInMonth(monthStart) + (6 - getDay(monthEnd));

    for (let i = 0; i < daysToDisplay; i++) {
      days.push(addDays(startDate, i));
    }

    return days;
  }, [currentMonth]);

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleDateClick = (day: Date) => {
    if (onDateChange) {
      onDateChange(day);
    }
  };

  const slotsForDate = (date: Date) => {
    return slots.filter(slot => {
      const slotDate = new Date(slot.startTime);
      return isSameDay(slotDate, date);
    });
  };

  const getSlotAvailabilityInfo = (daySlots: TimeSlotType[]) => {
    const flexibleSlots = daySlots.filter(slot => slot.bookingMode === 'FLEXIBLE');
    const fixedSlots = daySlots.filter(slot => slot.bookingMode === 'FIXED');
    
    const hasFlexibleSlots = flexibleSlots.length > 0;
    const hasFullyBookedSlots = daySlots.some(slot => {
      const bookedCount = slot.bookings?.length || 0;
      return bookedCount >= slot.maxBookings;
    });
    
    const availableCount = daySlots.reduce((total, slot) => {
      const bookedCount = slot.bookings?.length || 0;
      return total + Math.max(0, slot.maxBookings - bookedCount);
    }, 0);
    
    return {
      hasFlexibleSlots,
      hasFullyBookedSlots,
      availableCount,
      fixedSlotsCount: fixedSlots.length,
      flexibleSlotsCount: flexibleSlots.length
    };
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{format(currentMonth, 'MMMM yyyy')}</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={handlePrevMonth} className="dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextMonth} className="dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center font-medium text-sm text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden">
        {calendarDays.map((day, index) => {
          const daySlots = slotsForDate(day);
          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
          const { 
            hasFlexibleSlots, 
            hasFullyBookedSlots,
            availableCount,
            fixedSlotsCount,
            flexibleSlotsCount
          } = getSlotAvailabilityInfo(daySlots);
          
          return (
            <div 
              key={index}
              className={cn(
                "calendar-day bg-white dark:bg-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-1 min-h-24",
                !isSameMonth(day, currentMonth) && "text-gray-400 dark:text-gray-500",
                isToday(day) && "border border-bookify-300 dark:border-bookify-700",
                isSelected && "ring-1 ring-bookify-500 dark:ring-bookify-400",
              )}
              onClick={() => handleDateClick(day)}
            >
              <div className={cn(
                "calendar-day-header text-right p-1 font-medium",
                isToday(day) && "text-bookify-600 dark:text-bookify-300",
                !isSameMonth(day, currentMonth) && "text-gray-400 dark:text-gray-500"
              )}>
                {format(day, 'd')}
              </div>
              <div className="overflow-y-auto max-h-20 dark:text-gray-100">
                {daySlots.length > 0 && (
                  <div className={cn(
                    "text-xs px-1 py-0.5 rounded mb-1 flex flex-wrap justify-between",
                    hasFlexibleSlots 
                      ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300" 
                      : "bg-bookify-100 dark:bg-bookify-900/30 text-bookify-700 dark:text-bookify-300"
                  )}>
                    <span>
                      {daySlots.length} {daySlots.length === 1 ? 'slot' : 'slots'}
                    </span>
                    <span>
                      {availableCount} available
                    </span>
                  </div>
                )}
                {daySlots.slice(0, 2).map((slot) => {
                  const bookedCount = slot.bookings?.length || 0;
                  const availableCount = Math.max(0, slot.maxBookings - bookedCount);
                  const isFullyBooked = availableCount === 0;
                  
                  return (
                    <div 
                      key={slot.id} 
                      className={cn(
                        "px-1 py-0.5 text-xs rounded mb-0.5 truncate flex justify-between",
                        isFullyBooked && "line-through opacity-60",
                        slot.bookingMode === 'FLEXIBLE'
                          ? "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
                          : "bg-bookify-50 dark:bg-bookify-900/20 text-bookify-700 dark:text-bookify-300"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        !isFullyBooked && onSlotSelect && onSlotSelect(slot);
                      }}
                    >
                      <span>
                        {format(new Date(slot.startTime), 'HH:mm')} - {slot.label}
                      </span>
                      <span className="ml-1">
                        {availableCount}/{slot.maxBookings}
                      </span>
                    </div>
                  );
                })}
                {daySlots.length > 2 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 px-1">
                    + {daySlots.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
