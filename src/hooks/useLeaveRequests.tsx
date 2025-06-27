
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface LeaveRequest {
  id: string;
  staff_id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  days_requested: number;
  reason: string | null;
  status: string;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
  staff?: {
    name: string;
    email: string;
    position: string;
  };
}

export function useLeaveRequests() {
  return useQuery({
    queryKey: ["leave-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leave_requests")
        .select(`
          *,
          staff!staff_id (
            name,
            email,
            position
          )
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as LeaveRequest[];
    },
  });
}

export function useUpdateLeaveRequest() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, status, approved_by }: { id: string; status: string; approved_by?: string }) => {
      const updateData: any = { status };
      if (status === 'approved' || status === 'rejected') {
        updateData.approved_at = new Date().toISOString();
        if (approved_by) updateData.approved_by = approved_by;
      }
      
      const { data, error } = await supabase
        .from("leave_requests")
        .update(updateData)
        .eq("id", id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leave-requests"] });
      toast({
        title: "Success",
        description: "Leave request status updated successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update leave request status",
      });
    },
  });
}
