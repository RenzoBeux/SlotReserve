
export type UserRole = 'OWNER' | 'USER';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  slug?: string; // Only for OWNER users
  logo?: string; // URL to the user's logo
  primaryColor?: string; // Primary color for calendar customization
  secondaryColor?: string; // Secondary color for calendar customization
}

export interface TimeSlot {
  id: string;
  ownerId: string;
  startTime: string; // ISO string
  endTime: string;  // ISO string
  label: string; // e.g., "Consultation", "Haircut"
  available: boolean;
  recurring: boolean;
  dayOfWeek?: number; // 0-6 for Sunday-Saturday (if recurring)
  bookingId?: string; // If booked
  bookingMode: "FIXED" | "FLEXIBLE"; // Default to FIXED if not specified
  bookings?: Booking[]; // Added bookings array
  maxBookings: number; // Maximum number of bookings allowed
}

export interface Booking {
  id: string;
  slotId: string;
  ownerId: string;
  userId: string;
  startTime: string;
  endTime: string;
  userName: string;
  label: string;
  status: 'confirmed' | 'cancelled' | 'completed';
}

export interface RecurringSlotTemplate {
  id: string;
  ownerId: string;
  dayOfWeek: number; // 0-6 for Sunday-Saturday
  startTime: string; // 24h format, e.g., "09:00"
  endTime: string; // 24h format, e.g., "10:00"
  label: string; // e.g., "Consultation", "Haircut"
  bookingMode: "FIXED" | "FLEXIBLE";
  maxBookings: number; // Maximum number of bookings allowed
}
