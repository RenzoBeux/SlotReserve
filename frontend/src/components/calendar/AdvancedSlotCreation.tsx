import { useState, useEffect } from "react";
import {
  format,
  addDays,
  getDay,
  setHours,
  setMinutes,
  addMinutes,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";

const WEEKDAYS = [
  { value: "0", label: "Sunday" },
  { value: "1", label: "Monday" },
  { value: "2", label: "Tuesday" },
  { value: "3", label: "Wednesday" },
  { value: "4", label: "Thursday" },
  { value: "5", label: "Friday" },
  { value: "6", label: "Saturday" },
];

interface AdvancedSlotCreationProps {
  onSubmit: (
    slots: Array<{
      weekday: number;
      startTime: string;
      endTime: string;
      label: string;
      userId: string;
      bookingMode: "FIXED" | "FLEXIBLE";
      maxBookings: number;
    }>
  ) => void;
  onCancel: () => void;
}

export const AdvancedSlotCreation = ({
  onSubmit,
  onCancel,
}: AdvancedSlotCreationProps) => {
  const [label, setLabel] = useState("Consultation");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(
    addDays(new Date(), 30)
  );
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [slotDuration, setSlotDuration] = useState("60");
  const [breakDuration, setBreakDuration] = useState("15");
  const [selectedDays, setSelectedDays] = useState<string[]>(["1", "3"]); // Monday and Wednesday by default
  const [bookingMode, setBookingMode] = useState<"FIXED" | "FLEXIBLE">("FIXED");
  const [maxBookings, setMaxBookings] = useState<number>(1);
  const userId = "owner-123"; // This should come from your auth context

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        options.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return options;
  };

  const handleSubmit = () => {
    if (!startDate || !endDate) {
      return;
    }

    // Create slots based on settings
    const slots = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const weekday = getDay(currentDate);

      // Check if this weekday is selected
      if (selectedDays.includes(weekday.toString())) {
        // For FLEXIBLE mode, create one slot per day
        if (bookingMode === "FLEXIBLE") {
          // Use ISO strings for start and end time (date+time)
          const [startHour, startMinute] = startTime.split(":").map(Number);
          const [endHour, endMinute] = endTime.split(":").map(Number);
          const slotStart = setHours(
            setMinutes(new Date(currentDate), startMinute),
            startHour
          );
          const slotEnd = setHours(
            setMinutes(new Date(currentDate), endMinute),
            endHour
          );
          slots.push({
            weekday,
            startTime: slotStart.toISOString(),
            endTime: slotEnd.toISOString(),
            label,
            userId,
            bookingMode,
            maxBookings,
          });
        } else {
          // For FIXED mode, create multiple slots based on duration and breaks, use ISO strings
          const [startHour, startMinute] = startTime.split(":").map(Number);
          const [endHour, endMinute] = endTime.split(":").map(Number);
          let slotStart = setHours(
            setMinutes(new Date(currentDate), startMinute),
            startHour
          );
          const dayEnd = setHours(
            setMinutes(new Date(currentDate), endMinute),
            endHour
          );
          while (slotStart < dayEnd) {
            const slotEnd = addMinutes(slotStart, parseInt(slotDuration, 10));
            // Only add the slot if it ends before or at the day end time
            if (slotEnd <= dayEnd) {
              slots.push({
                weekday,
                startTime: slotStart.toISOString(),
                endTime: slotEnd.toISOString(),
                label,
                userId,
                bookingMode,
                maxBookings,
              });
            }
            // Move to next slot start time (add slot duration + break)
            slotStart = addMinutes(
              slotStart,
              parseInt(slotDuration, 10) + parseInt(breakDuration, 10)
            );
          }
        }
      }

      // Move to next day
      currentDate = addDays(currentDate, 1);
    }

    onSubmit(slots);
  };

  const handleDayToggle = (value: string) => {
    setSelectedDays(
      selectedDays.includes(value)
        ? selectedDays.filter((day) => day !== value)
        : [...selectedDays, value]
    );
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="label">Appointment Type</Label>
        <Input
          id="label"
          placeholder="e.g. Consultation"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? (
                  format(startDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
                disabled={(date) => date < (startDate || new Date())}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">Daily Start Time</Label>
          <Select value={startTime} onValueChange={setStartTime}>
            <SelectTrigger>
              <SelectValue placeholder="Select start time" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {generateTimeOptions().map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="endTime">Daily End Time</Label>
          <Select value={endTime} onValueChange={setEndTime}>
            <SelectTrigger>
              <SelectValue placeholder="Select end time" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {generateTimeOptions().map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Booking Mode</Label>
        <RadioGroup
          value={bookingMode}
          onValueChange={(value) =>
            setBookingMode(value as "FIXED" | "FLEXIBLE")
          }
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="FIXED" id="fixed" />
            <Label htmlFor="fixed" className="cursor-pointer">
              Fixed
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="FLEXIBLE" id="flexible" />
            <Label htmlFor="flexible" className="cursor-pointer">
              Flexible
            </Label>
          </div>
        </RadioGroup>
        <p className="text-sm text-muted-foreground mt-1">
          {bookingMode === "FIXED"
            ? "Fixed slots have specific start and end times that clients must book exactly as defined."
            : "Flexible slots allow clients to choose their own start and end time within your available hours."}
        </p>
      </div>

      {bookingMode === "FIXED" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="slotDuration">Slot Duration (minutes)</Label>
            <Input
              id="slotDuration"
              type="number"
              min="5"
              step="5"
              value={slotDuration}
              onChange={(e) => setSlotDuration(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="breakDuration">Break Between Slots (minutes)</Label>
            <Input
              id="breakDuration"
              type="number"
              min="0"
              step="5"
              value={breakDuration}
              onChange={(e) => setBreakDuration(e.target.value)}
            />
          </div>
        </div>
      )}

      {bookingMode === "FLEXIBLE" && (
        <Alert>
          <AlertDescription>
            Flexible slots will be created as full-day availability for each
            selected day, allowing clients to choose their own times within your
            set hours.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="maxBookings">Max Bookings Per Slot</Label>
        <Input
          id="maxBookings"
          type="number"
          min="1"
          value={maxBookings}
          onChange={(e) => setMaxBookings(parseInt(e.target.value) || 1)}
          className="w-full"
        />
        <p className="text-sm text-muted-foreground mt-1">
          {bookingMode === "FIXED"
            ? "Maximum number of people who can book this exact time slot."
            : "Maximum number of overlapping bookings allowed during flexible hours."}
        </p>
      </div>

      <div className="space-y-2">
        <Label>Days of Week</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
          {WEEKDAYS.map((day) => (
            <div key={day.value} className="flex items-center space-x-2">
              <Checkbox
                id={`day-${day.value}`}
                checked={selectedDays.includes(day.value)}
                onCheckedChange={() => handleDayToggle(day.value)}
              />
              <Label htmlFor={`day-${day.value}`} className="cursor-pointer">
                {day.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2">
        <div className="bg-muted p-3 rounded-md text-sm">
          <p className="font-medium">Summary:</p>
          <p>
            Creating{" "}
            {selectedDays.length > 0
              ? WEEKDAYS.filter((day) => selectedDays.includes(day.value))
                  .map((day) => day.label)
                  .join(", ")
              : "no days"}{" "}
            from {startDate ? format(startDate, "MMM d, yyyy") : "–"} to{" "}
            {endDate ? format(endDate, "MMM d, yyyy") : "–"}
          </p>
          {bookingMode === "FIXED" ? (
            <p>
              {slotDuration} minute slots with {breakDuration} minute breaks
              between {startTime} and {endTime}
            </p>
          ) : (
            <p>
              Flexible availability from {startTime} to {endTime}
            </p>
          )}
          <p>
            {bookingMode === "FIXED" ? "Fixed" : "Flexible"} booking mode with{" "}
            {maxBookings} max booking{maxBookings > 1 ? "s" : ""} per slot
          </p>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className="bg-bookify-500 hover:bg-bookify-600"
        >
          Create Slots
        </Button>
      </DialogFooter>
    </div>
  );
};
