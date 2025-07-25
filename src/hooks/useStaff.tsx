
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Staff {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  position: string;
  department: string | null;
  hire_date: string;
  salary: number | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export function useStaff() {
  return useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("staff")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Staff[];
    },
  });
}

export function useCreateStaff() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (staffData: Omit<Staff, 'id' | 'created_at' | 'updated_at'> & { password?: string }) => {
      // If password is provided, use edge function to create auth user and staff record
      if (staffData.password) {
        const { data: session } = await supabase.auth.getSession();
        if (!session.session) {
          throw new Error('Authentication required');
        }

        const { password, ...userData } = staffData;
        
        const { data, error } = await supabase.functions.invoke('create-staff-user', {
          body: {
            email: staffData.email,
            password,
            userData,
          },
        });

        if (error) {
          throw new Error(error.message || 'Failed to create staff user');
        }

        return data.data;
      } else {
        // Create staff record without auth user (existing flow)
        const { password, ...staffDataWithoutPassword } = staffData;
        const { data, error } = await supabase
          .from("staff")
          .insert(staffDataWithoutPassword)
          .select();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast({
        title: "Success",
        description: "Staff member added successfully with login credentials",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add staff member",
      });
    },
  });
}

export function useUpdateStaff() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, staffData }: { id: string; staffData: Partial<Omit<Staff, 'id' | 'created_at' | 'updated_at'>> }) => {
      const { data, error } = await supabase
        .from("staff")
        .update(staffData)
        .eq("id", id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast({
        title: "Success",
        description: "Staff member updated successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update staff member",
      });
    },
  });
}

export function useDeleteStaff() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("staff")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast({
        title: "Success",
        description: "Staff member deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete staff member",
      });
    },
  });
}
