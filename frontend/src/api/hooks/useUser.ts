import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { tsrReactQuery } from "../tsRestClient";

export const useGetMe = () => {
  return tsrReactQuery.user.getMe.useQuery({
    queryKey: ["me"],
  });
};

export const useUpdateMe = () => {
  const queryClient = useQueryClient();
  return tsrReactQuery.user.updateMe.useMutation({
    mutationKey: ["user-update-me"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Profile updated successfully");
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });
};
