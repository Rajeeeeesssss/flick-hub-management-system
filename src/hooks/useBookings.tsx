
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Booking {
  id: string;
  user_id: string;
  movie_id: number;
  seat_number: string;
  show_time: string;
  status: string;
  language: string;
  cancelled_at: string | null;
  created_at: string;
}

export function useBookings() {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Booking[];
    },
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const updateData: any = { status };
      if (status === 'cancelled') {
        updateData.cancelled_at = new Date().toISOString();
      }
      
      const { data, error } = await supabase
        .from("bookings")
        .update(updateData)
        .eq("id", id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast({
        title: "Success",
        description: "Booking status updated successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update booking status",
      });
    },
  });
}
