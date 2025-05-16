import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { tsrReactQuery } from "../tsRestClient";

export const useGetBookings = () => {
  return tsrReactQuery.booking.getMine.useQuery({
    queryKey: ["bookings"],
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  return tsrReactQuery.booking.create.useMutation({
    mutationKey: ["booking-create"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking created successfully");
    },
    onError: () => {
      toast.error("Failed to create booking");
    },
  });
};

export const useDeleteBooking = () => {
  const queryClient = useQueryClient();
  return tsrReactQuery.booking.delete.useMutation({
    mutationKey: ["booking-delete"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete booking");
    },
  });
};
