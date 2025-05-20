import { initContract } from "@ts-rest/core";

export type UserRole = "OWNER" | "USER";

export interface User {
  id: string; // Firebase UID
  email: string;
  name: string;
  slug: string;
  role: UserRole;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  timezone: string;
}

export interface AvailabilitySlot {
  id: string;
  weekday: number; // 0 (Sunday) - 6 (Saturday)
  startTime: string; // ISO string (date and time)
  endTime: string; // ISO string (date and time)
  label: string;
  userId: string;
  bookingMode: "FIXED" | "FLEXIBLE";
  maxBookings: number;
}

export interface Booking {
  id: string;
  startTime: string; // ISO string (date and time)
  endTime: string; // ISO string (date and time)
  ownerId: string;
  userId: string;
  note?: string;
}

const c = initContract();

export const contract = c.router({
  user: c.router({
    getMe: c.query({
      method: "GET",
      path: "/user/me",
      responses: {
        200: c.type<User>(),
        404: c.type<null>(),
      },
    }),
    updateMe: c.mutation({
      method: "PUT",
      path: "/user/me",
      body: c.type<Partial<Omit<User, "id" | "role" | "email">>>(),
      responses: {
        200: c.type<User>(),
      },
    }),
  }),
  availability: c.router({
    getMine: c.query({
      method: "GET",
      path: "/availability",
      responses: {
        200: c.type<AvailabilitySlot[]>(),
      },
    }),
    /**
     * Get public availability slots for a user by slug (for public calendar)
     */
    getBySlug: c.query({
      method: "GET",
      path: "/availability/public/:slug",
      responses: {
        200: c.type<AvailabilitySlot[]>(),
        404: c.type<null>(),
      },
      pathParams: c.type<{ slug: string }>(),
    }),
    create: c.mutation({
      method: "POST",
      path: "/availability",
      body: c.type<Omit<AvailabilitySlot, "id">>(),
      responses: {
        201: c.type<AvailabilitySlot>(),
      },
    }),
    /**
     * Bulk create availability slots
     * Accepts an array of slots (without id) and returns the created slots (with id)
     */
    createBulk: c.mutation({
      method: "POST",
      description: "Bulk create availability slots",
      path: "/availability/bulk",
      body: c.type<Array<Omit<AvailabilitySlot, "id">>>(),
      responses: {
        201: c.type<AvailabilitySlot[]>(),
      },
    }),
    update: c.mutation({
      method: "PUT",
      path: "/availability",
      body: c.type<AvailabilitySlot>(),
      responses: {
        200: c.type<AvailabilitySlot>(),
      },
    }),
    delete: c.mutation({
      method: "DELETE",
      path: "/availability",
      body: c.type<{ id: string }>(),
      responses: {
        204: c.type<undefined>(),
      },
    }),
  }),
  booking: c.router({
    getMine: c.query({
      method: "GET",
      path: "/booking",
      responses: {
        200: c.type<Booking[]>(),
      },
    }),
    create: c.mutation({
      method: "POST",
      path: "/booking",
      body: c.type<Omit<Booking, "id">>(),
      responses: {
        201: c.type<Booking>(),
      },
    }),
    delete: c.mutation({
      method: "DELETE",
      path: "/booking",
      body: c.type<{ id: string }>(),
      responses: {
        204: c.type<undefined>(),
      },
    }),
  }),
});
