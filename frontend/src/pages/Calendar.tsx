import React, { useState } from "react";
import { format, parseISO, addHours } from "date-fns";
import { Calendar as CalendarIcon, Plus, Save, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import Calendar from "@/components/calendar/Calendar";
import TimeSlot from "@/components/calendar/TimeSlot";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetMe } from "@/api/hooks/useUser";
import { TimeSlot as TimeSlotType } from "@/types";
import type { AvailabilitySlot } from "../../../ts-rest-contract/src";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdvancedSlotCreation } from "@/components/calendar/AdvancedSlotCreation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  useGetAvailability,
  useCreateAvailability,
  useUpdateAvailability,
  useDeleteAvailability,
  useCreateBulkAvailability,
} from "@/api/hooks/useAvailability";

const CalendarPage = () => {
  const { data: availabilityData, isLoading: isLoadingAvailability } =
    useGetAvailability();
  // Convert backend slots to TimeSlotType for UI
  const slots: TimeSlotType[] = (availabilityData?.body || []).map(
    (slot: AvailabilitySlot) => ({
      id: slot.id,
      ownerId: slot.userId,
      startTime: slot.startTime, // These may need to be combined with a date for display
      endTime: slot.endTime,
      label: slot.label,
      available: true, // Assume available by default
      recurring: false, // Backend does not provide, default to false
      bookingMode: "FIXED", // Backend only supports FIXED for now
      maxBookings: slot.maxBookings,
      bookings: [],
    })
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [isAddingSlot, setIsAddingSlot] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlotType | null>(null);
  // Only allow FIXED for now, since backend only supports FIXED
  const [newSlot, setNewSlot] = useState({
    label: "",
    startTime: format(new Date().setMinutes(0, 0, 0), "yyyy-MM-dd'T'HH:mm"),
    endTime: format(
      addHours(new Date().setMinutes(0, 0, 0), 1),
      "yyyy-MM-dd'T'HH:mm"
    ),
    recurring: false,
    bookingMode: "FIXED" as const,
    maxBookings: 1,
  });
  const [createMode, setCreateMode] = useState<"simple" | "advanced">("simple");
  const { data: meData } = useGetMe();
  const userData = meData?.body;
  const isOwner = userData?.role === "OWNER";

  const slotsForSelectedDate = selectedDate
    ? slots.filter((slot) => {
        const slotDate = new Date(slot.startTime);
        return slotDate.toDateString() === selectedDate.toDateString();
      })
    : [];

  // All slot creation, update, and deletion should use backend mutations, not setSlots
  // Remove setSlots and related logic
  const { mutate: createSlot } = useCreateAvailability();
  const handleAddSlot = () => {
    if (!newSlot.label) {
      toast.error("Please provide a label for the time slot");
      return;
    }
    createSlot(
      {
        body: {
          label: newSlot.label,
          weekday: selectedDate ? selectedDate.getDay() : 0,
          startTime: newSlot.startTime,
          endTime: newSlot.endTime,
          userId: userData?.id || "",
          bookingMode: newSlot.bookingMode,
          maxBookings: newSlot.maxBookings,
        },
      },
      {
        onSuccess: () => {
          setIsAddingSlot(false);
          setNewSlot({
            label: "",
            startTime: format(
              new Date().setMinutes(0, 0, 0),
              "yyyy-MM-dd'T'HH:mm"
            ),
            endTime: format(
              addHours(new Date().setMinutes(0, 0, 0), 1),
              "yyyy-MM-dd'T'HH:mm"
            ),
            recurring: false,
            bookingMode: "FIXED",
            maxBookings: 1,
          });
          toast.success("Time slot added successfully");
        },
        onError: () => {
          toast.error("Failed to add time slot");
        },
      }
    );
  };

  const { mutate: updateSlot } = useUpdateAvailability();
  const handleUpdateSlot = () => {
    if (!editingSlot) return;
    updateSlot(
      {
        body: {
          id: editingSlot.id,
          label: editingSlot.label,
          weekday: selectedDate ? selectedDate.getDay() : 0,
          startTime: editingSlot.startTime,
          endTime: editingSlot.endTime,
          userId: userData?.id || "",
          bookingMode: editingSlot.bookingMode,
          maxBookings: editingSlot.maxBookings,
        },
      },
      {
        onSuccess: () => {
          setEditingSlot(null);
          toast.success("Time slot updated successfully");
        },
        onError: () => {
          toast.error("Failed to update time slot");
        },
      }
    );
  };

  const { mutate: deleteSlot } = useDeleteAvailability();
  const handleDeleteSlot = (id: string) => {
    deleteSlot(
      { body: { id } },
      {
        onSuccess: () => {
          if (editingSlot?.id === id) {
            setEditingSlot(null);
          }
          toast.success("Time slot deleted successfully");
        },
        onError: () => {
          toast.error("Failed to delete time slot");
        },
      }
    );
  };

  const { mutate: createBulkSlots } = useCreateBulkAvailability();
  const handleCreateBulkSlots = (newSlots: Omit<AvailabilitySlot, "id">[]) => {
    createBulkSlots(
      { body: newSlots },
      {
        onSuccess: (data) => {
          setIsAddingSlot(false);
          toast.success(`${data.body?.length || 0} time slots created`);
        },
        onError: () => {
          toast.error("Failed to create slots");
        },
      }
    );
  };

  if (isLoadingAvailability) {
    return <div>Loading availability...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Calendar</h1>
        {isOwner && (
          <div className="flex space-x-2">
            <Dialog open={isAddingSlot} onOpenChange={setIsAddingSlot}>
              <DialogTrigger asChild>
                <Button className="bg-bookify-500 hover:bg-bookify-600">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Time Slot
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md dark:bg-gray-800">
                <DialogHeader>
                  <DialogTitle>Create New Time Slot</DialogTitle>
                  <DialogDescription>
                    Add a new time slot to your calendar.
                  </DialogDescription>
                </DialogHeader>

                <Tabs
                  defaultValue="simple"
                  value={createMode}
                  onValueChange={(v) =>
                    setCreateMode(v as "simple" | "advanced")
                  }
                >
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="simple">Simple</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  </TabsList>

                  <TabsContent value="simple" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="label">Label</Label>
                      <Input
                        id="label"
                        placeholder="e.g. Consultation"
                        value={newSlot.label}
                        onChange={(e) =>
                          setNewSlot({ ...newSlot, label: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="start-time">Start Time</Label>
                        <Input
                          id="start-time"
                          type="datetime-local"
                          value={newSlot.startTime}
                          onChange={(e) =>
                            setNewSlot({
                              ...newSlot,
                              startTime: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="end-time">End Time</Label>
                        <Input
                          id="end-time"
                          type="datetime-local"
                          value={newSlot.endTime}
                          onChange={(e) =>
                            setNewSlot({ ...newSlot, endTime: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    {/* Only show FIXED booking mode, since backend only supports FIXED */}
                    <div className="space-y-2">
                      <Label>Booking Mode</Label>
                      <div className="flex items-center space-x-2">
                        <input type="radio" checked readOnly id="new-fixed" />
                        <Label htmlFor="new-fixed" className="cursor-pointer">
                          Fixed
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Fixed slots have specific start and end times that
                        clients must book exactly as defined.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxBookings">Max Bookings</Label>
                      <Input
                        id="maxBookings"
                        type="number"
                        min="1"
                        value={newSlot.maxBookings}
                        onChange={(e) =>
                          setNewSlot({
                            ...newSlot,
                            maxBookings: parseInt(e.target.value) || 1,
                          })
                        }
                      />
                      <p className="text-sm text-muted-foreground">
                        {newSlot.bookingMode === "FIXED"
                          ? "Maximum number of people who can book this exact time slot."
                          : "Maximum number of overlapping bookings allowed during flexible hours."}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="recurring"
                        className="rounded border-gray-300 text-bookify-600 shadow-sm focus:border-bookify-300 focus:ring focus:ring-offset-0 focus:ring-bookify-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700"
                        checked={newSlot.recurring}
                        onChange={(e) =>
                          setNewSlot({
                            ...newSlot,
                            recurring: e.target.checked,
                          })
                        }
                      />
                      <Label htmlFor="recurring">Recurring weekly</Label>
                    </div>

                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsAddingSlot(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddSlot}
                        className="bg-bookify-500 hover:bg-bookify-600"
                      >
                        Create Slot
                      </Button>
                    </DialogFooter>
                  </TabsContent>

                  <TabsContent value="advanced">
                    <AdvancedSlotCreation
                      onSubmit={handleCreateBulkSlots}
                      onCancel={() => setIsAddingSlot(false)}
                    />
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 dark:bg-gray-800">
          <CardContent className="p-6">
            <Calendar
              slots={slots}
              onSlotSelect={(slot) => setEditingSlot(slot)}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          {editingSlot && isOwner && (
            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Edit Time Slot</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-label">Label</Label>
                  <Input
                    id="edit-label"
                    value={editingSlot.label}
                    onChange={(e) =>
                      setEditingSlot({ ...editingSlot, label: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-start-time">Start Time</Label>
                    <Input
                      id="edit-start-time"
                      type="datetime-local"
                      value={format(
                        new Date(editingSlot.startTime),
                        "yyyy-MM-dd'T'HH:mm"
                      )}
                      onChange={(e) => {
                        const newDate = new Date(e.target.value);
                        setEditingSlot({
                          ...editingSlot,
                          startTime: newDate.toISOString(),
                        });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-end-time">End Time</Label>
                    <Input
                      id="edit-end-time"
                      type="datetime-local"
                      value={format(
                        new Date(editingSlot.endTime),
                        "yyyy-MM-dd'T'HH:mm"
                      )}
                      onChange={(e) => {
                        const newDate = new Date(e.target.value);
                        setEditingSlot({
                          ...editingSlot,
                          endTime: newDate.toISOString(),
                        });
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Booking Mode</Label>
                  <RadioGroup
                    value={editingSlot.bookingMode}
                    onValueChange={(value) =>
                      setEditingSlot({
                        ...editingSlot,
                        bookingMode: value as "FIXED" | "FLEXIBLE",
                      })
                    }
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="FIXED" id="edit-fixed" />
                      <Label htmlFor="edit-fixed" className="cursor-pointer">
                        Fixed
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="FLEXIBLE" id="edit-flexible" />
                      <Label htmlFor="edit-flexible" className="cursor-pointer">
                        Flexible
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-max-bookings">Max Bookings</Label>
                  <Input
                    id="edit-max-bookings"
                    type="number"
                    min="1"
                    value={editingSlot.maxBookings}
                    onChange={(e) =>
                      setEditingSlot({
                        ...editingSlot,
                        maxBookings: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit-recurring"
                    className="rounded border-gray-300 text-bookify-600 shadow-sm focus:border-bookify-300 focus:ring focus:ring-offset-0 focus:ring-bookify-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700"
                    checked={editingSlot.recurring}
                    onChange={(e) =>
                      setEditingSlot({
                        ...editingSlot,
                        recurring: e.target.checked,
                      })
                    }
                  />
                  <Label htmlFor="edit-recurring">Recurring weekly</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="edit-available">Status</Label>
                  <Select
                    value={editingSlot.available ? "available" : "booked"}
                    onValueChange={(value) =>
                      setEditingSlot({
                        ...editingSlot,
                        available: value === "available",
                      })
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-700">
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="booked">Booked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-between pt-4">
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteSlot(editingSlot.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                  <Button
                    onClick={handleUpdateSlot}
                    className="bg-bookify-500 hover:bg-bookify-600"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5" />
                {selectedDate
                  ? format(selectedDate, "MMMM d, yyyy")
                  : "Select a date"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {slotsForSelectedDate.length > 0 ? (
                <div className="space-y-4">
                  {slotsForSelectedDate.map((slot) => (
                    <TimeSlot
                      key={slot.id}
                      slot={slot}
                      onSelect={() => isOwner && setEditingSlot(slot)}
                      showActions={!isOwner}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {selectedDate
                    ? "No time slots available for this date."
                    : "Please select a date to view available time slots."}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
