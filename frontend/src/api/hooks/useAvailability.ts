import { tsrReactQuery } from "../tsRestClient";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const useGetAvailability = () => {
  return tsrReactQuery.availability.getMine.useQuery({
    queryKey: ["availability"],
  });
};

// Public availability by slug
export const useGetPublicAvailability = (slug: string) => {
  // ts-rest/react-query expects path params as the first argument: { slug }
  return tsrReactQuery.availability.getBySlug.useQuery({
    queryData: { params: { slug } },
    queryKey: ["availability", slug],
    enabled: !!slug, // Only run the query if slug is defined
  });
};

export const useCreateAvailability = () => {
  const queryClient = useQueryClient();
  return tsrReactQuery.availability.create.useMutation({
    mutationKey: ["availability-create"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      toast.success("Availability slot created");
    },
    onError: () => {
      toast.error("Failed to create availability slot");
    },
  });
};

export const useCreateBulkAvailability = () => {
  const queryClient = useQueryClient();
  return tsrReactQuery.availability.createBulk.useMutation({
    mutationKey: ["availability-create-bulk"],
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      toast.success(`${variables.body.length} availability slots created`);
    },
    onError: () => {
      toast.error("Failed to create availability slots");
    },
  });
};

export const useUpdateAvailability = () => {
  const queryClient = useQueryClient();
  return tsrReactQuery.availability.update.useMutation({
    mutationKey: ["availability-update"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      toast.success("Availability slot updated");
    },
    onError: () => {
      toast.error("Failed to update availability slot");
    },
  });
};

export const useDeleteAvailability = () => {
  const queryClient = useQueryClient();
  return tsrReactQuery.availability.delete.useMutation({
    mutationKey: ["availability-delete"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      toast.success("Availability slot deleted");
    },
    onError: () => {
      toast.error("Failed to delete availability slot");
    },
  });
};
