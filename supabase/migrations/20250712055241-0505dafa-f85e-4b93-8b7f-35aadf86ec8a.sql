-- Create storage bucket for movie images
INSERT INTO storage.buckets (id, name, public) VALUES ('movie-images', 'movie-images', true);

-- Create policies for movie image uploads
CREATE POLICY "Anyone can view movie images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'movie-images');

CREATE POLICY "Admins can upload movie images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'movie-images' AND 
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can update movie images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'movie-images' AND 
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete movie images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'movie-images' AND 
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);