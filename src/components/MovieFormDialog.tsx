import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Upload, X, ImageIcon, Edit } from "lucide-react";
import { useCreateMovie, useUpdateMovie, MovieDb } from "@/hooks/useMoviesDb";
import { useToast } from "@/hooks/use-toast";
import { uploadMovieImage, deleteMovieImage } from "@/utils/imageUpload";

interface MovieFormDialogProps {
  movie?: MovieDb;
  trigger?: React.ReactNode;
  isEdit?: boolean;
}

export function MovieFormDialog({ movie, trigger, isEdit = false }: MovieFormDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [posterFile, setPosterFile] = React.useState<File | null>(null);
  const [heroFile, setHeroFile] = React.useState<File | null>(null);
  const [posterPreview, setPosterPreview] = React.useState<string>("");
  const [heroPreview, setHeroPreview] = React.useState<string>("");
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    genre: [] as string[],
    duration: 0,
    rating: "",
    release_date: "",
    director: "",
    actors: [] as string[],
    language: "english",
    is_active: true,
    trailer_url: "",
  });

  const { toast } = useToast();
  const createMovie = useCreateMovie();
  const updateMovie = useUpdateMovie();

  React.useEffect(() => {
    if (movie && isEdit) {
      setFormData({
        title: movie.title,
        description: movie.description || "",
        genre: movie.genre,
        duration: movie.duration,
        rating: movie.rating || "",
        release_date: movie.release_date || "",
        director: movie.director || "",
        actors: movie.actors || [],
        language: movie.language || "english",
        is_active: movie.is_active ?? true,
        trailer_url: movie.trailer_url || "",
      });
      setPosterPreview(movie.poster_url || "");
      setHeroPreview(movie.hero_url || "");
    }
  }, [movie, isEdit]);

  const handleFileChange = (file: File | null, type: 'poster' | 'hero') => {
    if (type === 'poster') {
      setPosterFile(file);
      if (file) {
        const reader = new FileReader();
        reader.onload = () => setPosterPreview(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setPosterPreview(movie?.poster_url || "");
      }
    } else {
      setHeroFile(file);
      if (file) {
        const reader = new FileReader();
        reader.onload = () => setHeroPreview(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setHeroPreview(movie?.hero_url || "");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let poster_url = movie?.poster_url || "";
      let hero_url = movie?.hero_url || "";

      // Upload poster if new file selected
      if (posterFile) {
        if (movie?.poster_url && movie.poster_url.includes('movie-images')) {
          await deleteMovieImage(movie.poster_url);
        }
        poster_url = await uploadMovieImage(posterFile, 'poster');
      }

      // Upload hero image if new file selected
      if (heroFile) {
        if (movie?.hero_url && movie.hero_url.includes('movie-images')) {
          await deleteMovieImage(movie.hero_url);
        }
        hero_url = await uploadMovieImage(heroFile, 'hero');
      }

      const movieData = {
        ...formData,
        poster_url,
        hero_url,
      };

      if (isEdit && movie) {
        await updateMovie.mutateAsync({ id: movie.id, movieData });
      } else {
        await createMovie.mutateAsync(movieData);
      }

      setOpen(false);
      resetForm();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save movie. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      genre: [],
      duration: 0,
      rating: "",
      release_date: "",
      director: "",
      actors: [],
      language: "english",
      is_active: true,
      trailer_url: "",
    });
    setPosterFile(null);
    setHeroFile(null);
    setPosterPreview("");
    setHeroPreview("");
  };

  const FileUploadSection = ({ 
    label, 
    file, 
    preview, 
    onChange, 
    type 
  }: { 
    label: string; 
    file: File | null; 
    preview: string; 
    onChange: (file: File | null) => void; 
    type: 'poster' | 'hero';
  }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
        {preview ? (
          <div className="relative">
            <img src={preview} alt={label} className="w-full h-32 object-cover rounded" />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => onChange(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4">
            <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-2">Upload {label.toLowerCase()}</p>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                onChange(file);
              }}
              className="w-full"
            />
          </div>
        )}
      </div>
    </div>
  );

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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Movie" : "Add New Movie"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update movie information" : "Add a new movie to the database"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FileUploadSection
                label="Poster Image"
                file={posterFile}
                preview={posterPreview}
                onChange={(file) => handleFileChange(file, 'poster')}
                type="poster"
              />
              <FileUploadSection
                label="Hero Image"
                file={heroFile}
                preview={heroPreview}
                onChange={(file) => handleFileChange(file, 'hero')}
                type="hero"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="genre">Genre (comma-separated)</Label>
                <Input
                  id="genre"
                  value={formData.genre.join(", ")}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    genre: e.target.value.split(",").map(g => g.trim()).filter(Boolean)
                  })}
                  placeholder="Action, Drama, Comedy"
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration || ""}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rating">Rating</Label>
                <Input
                  id="rating"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  placeholder="PG-13, R, etc."
                />
              </div>
              <div>
                <Label htmlFor="release_date">Release Date</Label>
                <Input
                  id="release_date"
                  type="date"
                  value={formData.release_date}
                  onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="director">Director</Label>
                <Input
                  id="director"
                  value={formData.director}
                  onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="language">Language</Label>
                <Select value={formData.language} onValueChange={(value) => setFormData({ ...formData, language: value })}>
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

            <div>
              <Label htmlFor="actors">Actors (comma-separated)</Label>
              <Input
                id="actors"
                value={(formData.actors || []).join(", ")}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  actors: e.target.value.split(",").map(a => a.trim()).filter(Boolean)
                })}
                placeholder="Actor 1, Actor 2, Actor 3"
              />
            </div>

            <div>
              <Label htmlFor="trailer_url">Trailer URL (optional)</Label>
              <Input
                id="trailer_url"
                type="url"
                value={formData.trailer_url}
                onChange={(e) => setFormData({ ...formData, trailer_url: e.target.value })}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : (isEdit ? "Update Movie" : "Create Movie")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}