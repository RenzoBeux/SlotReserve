import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Calendar from "@/components/calendar/Calendar";
import TimeSlot from "@/components/calendar/TimeSlot";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format, addDays, parse } from "date-fns";
import { Loader } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";
import { TimeSlot as TimeSlotType, Booking as BookingType } from "@/types";
import { toast } from "sonner";
import { FlexibleTimeSelector } from "@/components/booking/FlexibleTimeSelector";

// Default logo if none is provided
const DEFAULT_LOGO = "/placeholder.svg";

import { useGetPublicAvailability } from "@/api/hooks/useAvailability";

const PublicCalendar = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user, userData, loading } = useAuth();
  const navigate = useNavigate();
  // Fetch public slots from API by slug
  const { data: availabilityData, isLoading: isLoadingAvailability } =
    useGetPublicAvailability(slug || "");
  // Map API slots to TimeSlotType for UI
  const slots: TimeSlotType[] = (availabilityData?.body?.slots || []).map(
    (slot) => ({
      id: slot.id,
      ownerId: slot.userId,
      startTime: slot.startTime,
      endTime: slot.endTime,
      label: slot.label,
      available: true, // Assume available unless fully booked
      recurring: (slot as { recurring?: boolean }).recurring ?? false,
      dayOfWeek: slot.weekday,
      bookingMode: slot.bookingMode,
      maxBookings: slot.maxBookings,
      bookings: (slot as { bookings?: BookingType[] }).bookings || [], // If API provides bookings, else []
    })
  );
  const owner = availabilityData?.body?.owner;
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<TimeSlotType | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  // Use API loading state
  const isLoading = isLoadingAvailability;

  // For flexible booking
  const [customStartTime, setCustomStartTime] = useState<string>("");
  const [customEndTime, setCustomEndTime] = useState<string>("");
  const [isTimeRangeValid, setIsTimeRangeValid] = useState(true);

  // Define dynamic styling based on owner's branding
  const primaryColor = owner?.primaryColor || "#7C3AED"; // Default purple if not set
  const secondaryColor = owner?.secondaryColor || "#8B5CF6"; // Default accent purple if not set

  // Apply custom styling to buttons and elements based on owner's colors
  const customButtonStyle = {
    backgroundColor: primaryColor,
    "&:hover": {
      backgroundColor: secondaryColor,
    },
  };

  // Optionally fetch owner from API if available in the future

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
    if (slot.bookingMode === "FLEXIBLE") {
      const startDate = new Date(slot.startTime);
      const endDate = new Date(slot.endTime);
      setCustomStartTime(format(startDate, "HH:mm"));
      setCustomEndTime(format(endDate, "HH:mm"));
    }

    setIsBookingModalOpen(true);
  };

  // Booking handler: In a real app, call the booking API here
  const handleBooking = async () => {
    if (user) {
      if (selectedSlot?.bookingMode === "FLEXIBLE" && !isTimeRangeValid) {
        toast.error("Please select a valid time range");
        return;
      }
      // TODO: Call booking API here
      toast.success("Appointment booked successfully!");
      setIsBookingModalOpen(false);
    }
  };

  const handleTimeChange = (
    startTime: string,
    endTime: string,
    isValid: boolean
  ) => {
    setCustomStartTime(startTime);
    setCustomEndTime(endTime);
    setIsTimeRangeValid(isValid);
  };

  const slotsForSelectedDate = slots.filter((slot) => {
    const slotDate = new Date(slot.startTime);
    return slotDate.toDateString() === selectedDate.toDateString();
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader
          className="h-8 w-8 animate-spin"
          style={{ color: primaryColor }}
        />
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
            <Button
              onClick={() => navigate("/")}
              style={{ backgroundColor: primaryColor }}
            >
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
        <Card className="mb-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl">
                {owner.name}'s Booking Calendar
              </CardTitle>
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
          <CardContent></CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
          <div className="lg:col-span-3">
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

          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>
                  Available Slots for{" "}
                  {format(selectedDate, "EEEE, MMMM d, yyyy")}
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
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-muted-foreground">
                      No available slots for this date. Please select another
                      date.
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
          {user ? (
            <>
              <DialogHeader>
                <DialogTitle>
                  {selectedSlot?.bookingMode === "FLEXIBLE"
                    ? "Choose Your Booking Time"
                    : "Confirm Booking"}
                </DialogTitle>
                <DialogDescription>
                  {selectedSlot?.bookingMode === "FLEXIBLE"
                    ? "Select your preferred time within the available range:"
                    : "You're about to book the following appointment:"}
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
                    <p>
                      {format(
                        new Date(selectedSlot.startTime),
                        "EEEE, MMMM d, yyyy"
                      )}
                    </p>
                  </div>

                  {selectedSlot.bookingMode === "FLEXIBLE" ? (
                    <FlexibleTimeSelector
                      minTime={format(
                        new Date(selectedSlot.startTime),
                        "HH:mm"
                      )}
                      maxTime={format(new Date(selectedSlot.endTime), "HH:mm")}
                      date={new Date(selectedSlot.startTime)}
                      existingBookings={selectedSlot.bookings?.map(
                        (booking) => ({
                          startTime: booking.startTime,
                          endTime: booking.endTime,
                        })
                      )}
                      maxAllowedBookings={selectedSlot.maxBookings}
                      onTimeChange={handleTimeChange}
                    />
                  ) : (
                    <div>
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-1">Time</h4>
                        <p>
                          {format(new Date(selectedSlot.startTime), "h:mm a")} -{" "}
                          {format(new Date(selectedSlot.endTime), "h:mm a")}
                        </p>
                      </div>
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-1">
                          Availability
                        </h4>
                        <p>
                          {selectedSlot.bookings
                            ? `${selectedSlot.maxBookings - selectedSlot.bookings.length} of ${selectedSlot.maxBookings} slots available`
                            : `${selectedSlot.maxBookings} slots available`}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsBookingModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  style={{
                    backgroundColor:
                      selectedSlot?.bookingMode === "FLEXIBLE"
                        ? secondaryColor
                        : primaryColor,
                  }}
                  onClick={handleBooking}
                  disabled={
                    selectedSlot?.bookingMode === "FLEXIBLE" &&
                    !isTimeRangeValid
                  }
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
