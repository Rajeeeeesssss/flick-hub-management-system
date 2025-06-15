import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useAdminRole(userId: string | undefined) {
  return useQuery({
    queryKey: ["admin-role", userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) return false;
      // This works ONLY if the has_role function is present, but let's keep the query unchanged as the booking issues were the main build errors.
      const { data, error } = await supabase.rpc("has_role", {
        _user_id: userId,
        _role: "admin",
      });
      if (error) throw new Error(error.message);
      return !!data;
    },
  });
}
