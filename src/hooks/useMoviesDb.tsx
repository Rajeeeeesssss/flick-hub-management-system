
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface MovieDb {
  id: number;
  title: string;
  description: string | null;
  genre: string[];
  duration: number;
  rating: string | null;
  release_date: string | null;
  poster_url: string | null;
  hero_url: string | null;
  trailer_url: string | null;
  director: string | null;
  actors: string[] | null;
  language: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useMoviesDb() {
  return useQuery({
    queryKey: ["movies-db"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("movies")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as MovieDb[];
    },
  });
}

export function useCreateMovie() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (movieData: Omit<MovieDb, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from("movies")
        .insert(movieData)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies-db"] });
      toast({
        title: "Success",
        description: "Movie created successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create movie",
      });
    },
  });
}

export function useUpdateMovie() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, movieData }: { id: number; movieData: Partial<Omit<MovieDb, 'id' | 'created_at' | 'updated_at'>> }) => {
      const { data, error } = await supabase
        .from("movies")
        .update(movieData)
        .eq("id", id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies-db"] });
      toast({
        title: "Success",
        description: "Movie updated successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update movie",
      });
    },
  });
}

export function useDeleteMovie() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from("movies")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies-db"] });
      toast({
        title: "Success",
        description: "Movie deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete movie",
      });
    },
  });
}

export function useToggleMovieStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, is_active }: { id: number; is_active: boolean }) => {
      const { data, error } = await supabase
        .from("movies")
        .update({ is_active })
        .eq("id", id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies-db"] });
      toast({
        title: "Success",
        description: "Movie status updated successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update movie status",
      });
    },
  });
}
