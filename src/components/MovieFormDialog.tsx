import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateMovie, useUpdateMovie, MovieDb } from "@/hooks/useMoviesDb";
import { PlusCircle, Edit } from "lucide-react";

interface MovieFormDialogProps {
  movie?: MovieDb;
  trigger?: React.ReactNode;
  isEdit?: boolean;
}

export function MovieFormDialog({ movie, trigger, isEdit = false }: MovieFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: movie?.title || "",
    description: movie?.description || "",
    genre: movie?.genre?.join(", ") || "",
    duration: movie?.duration?.toString() || "",
    rating: movie?.rating || "",
    release_date: movie?.release_date || "",
    poster_url: movie?.poster_url || "",
    hero_url: movie?.hero_url || "",
    trailer_url: movie?.trailer_url || "",
    director: movie?.director || "",
    actors: movie?.actors?.join(", ") || "",
    language: movie?.language || "english",
    is_active: movie?.is_active ?? true,
  });

  const createMovie = useCreateMovie();
  const updateMovie = useUpdateMovie();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const movieData = {
        ...formData,
        duration: parseInt(formData.duration),
        genre: formData.genre.split(",").map(g => g.trim()).filter(g => g),
        actors: formData.actors ? formData.actors.split(",").map(a => a.trim()).filter(a => a) : null,
      };

      if (isEdit && movie) {
        await updateMovie.mutateAsync({ id: movie.id, movieData });
      } else {
        await createMovie.mutateAsync(movieData);
      }
      
      setOpen(false);
      if (!isEdit) {
        setFormData({
          title: "",
          description: "",
          genre: "",
          duration: "",
          rating: "",
          release_date: "",
          poster_url: "",
          hero_url: "",
          trailer_url: "",
          director: "",
          actors: "",
          language: "english",
          is_active: true,
        });
      }
    } catch (error) {
      console.error("Error submitting movie form:", error);
    }
  };

  const defaultTrigger = isEdit ? (
    <Button variant="ghost" size="sm">
      <Edit className="h-4 w-4" />
    </Button>
  ) : (
    <Button>
      <PlusCircle className="mr-2 h-4 w-4" />
      Add Movie
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Movie' : 'Add New Movie'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes) *</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="genre">Genre (comma-separated)</Label>
              <Input
                id="genre"
                value={formData.genre}
                onChange={(e) => setFormData(prev => ({ ...prev, genre: e.target.value }))}
                placeholder="Action, Drama, Comedy"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <Input
                id="rating"
                value={formData.rating}
                onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
                placeholder="PG-13, R, etc."
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="release_date">Release Date</Label>
              <Input
                id="release_date"
                type="date"
                value={formData.release_date}
                onChange={(e) => setFormData(prev => ({ ...prev, release_date: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={formData.language} onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="hindi">Hindi</SelectItem>
                  <SelectItem value="tamil">Tamil</SelectItem>
                  <SelectItem value="telugu">Telugu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="director">Director</Label>
            <Input
              id="director"
              value={formData.director}
              onChange={(e) => setFormData(prev => ({ ...prev, director: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="actors">Actors (comma-separated)</Label>
            <Input
              id="actors"
              value={formData.actors}
              onChange={(e) => setFormData(prev => ({ ...prev, actors: e.target.value }))}
              placeholder="Actor 1, Actor 2, Actor 3"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="poster_url">Poster URL</Label>
            <Input
              id="poster_url"
              type="url"
              value={formData.poster_url}
              onChange={(e) => setFormData(prev => ({ ...prev, poster_url: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="hero_url">Hero Image URL</Label>
            <Input
              id="hero_url"
              type="url"
              value={formData.hero_url}
              onChange={(e) => setFormData(prev => ({ ...prev, hero_url: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="trailer_url">Trailer URL</Label>
            <Input
              id="trailer_url"
              type="url"
              value={formData.trailer_url}
              onChange={(e) => setFormData(prev => ({ ...prev, trailer_url: e.target.value }))}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMovie.isPending || updateMovie.isPending}>
              {isEdit ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}