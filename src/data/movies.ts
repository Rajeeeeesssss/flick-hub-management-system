
export interface Movie {
  id: number;
  title: string;
  genre: string[];
  duration: number; // in minutes
  rating: string;
  releaseDate: string;
  director: string;
  description: string;
  posterUrl: string;
  heroUrl: string;
  language: string;
  certification: string;
}

export const movies: Movie[] = [
  {
    id: 1,
    title: "Cosmic Odyssey",
    genre: ["Sci-Fi", "Adventure"],
    duration: 148,
    rating: "PG-13",
    releaseDate: "2025-07-18",
    director: "Jane Doe",
    description: "A thrilling journey to the edge of the universe to uncover a cosmic mystery that threatens all of existence. A crew of explorers must risk everything to save humanity.",
    posterUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800",
    heroUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200",
    language: "English",
    certification: "U/A",
  },
  {
    id: 2,
    title: "Echoes of the Past",
    genre: ["Drama", "Mystery", "Thriller"],
    duration: 125,
    rating: "R",
    releaseDate: "2025-08-22",
    director: "John Smith",
    description: "A detective haunted by a cold case finds new clues that lead him down a rabbit hole of deceit and danger in his own town. The past never truly stays buried.",
    posterUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800",
    heroUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200",
    language: "English",
    certification: "A",
  },
  {
    id: 3,
    title: "The Last Stand",
    genre: ["Action", "War"],
    duration: 132,
    rating: "R",
    releaseDate: "2025-06-06",
    director: "Alex Johnson",
    description: "In a world overrun, a small group of soldiers makes a final, desperate stand against overwhelming odds. A story of courage, sacrifice, and the will to survive.",
    posterUrl: "https://images.unsplash.com/photo-1517022812141-23620dba5c23?q=80&w=800",
    heroUrl: "https://images.unsplash.com/photo-1517022812141-23620dba5c23?q=80&w=1200",
    language: "English",
    certification: "A",
  },
  {
    id: 4,
    title: "Cybernetic Dreams",
    genre: ["Sci-Fi", "Action"],
    duration: 118,
    rating: "PG-13",
    releaseDate: "2025-09-05",
    director: "Emily White",
    description: "In a futuristic city, a programmer discovers that the line between virtual reality and the real world is blurring, leading to a dangerous conspiracy.",
    posterUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=800",
    heroUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1200",
    language: "English",
    certification: "U/A",
  },
  {
    id: 5,
    title: "Mountain's Heart",
    genre: ["Adventure", "Drama"],
    duration: 110,
    rating: "PG",
    releaseDate: "2025-10-10",
    director: "Michael Brown",
    description: "An inspiring tale of a young climber who sets out to conquer a legendary peak, finding self-discovery and resilience along the arduous journey.",
    posterUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=800",
    heroUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=1200",
    language: "English",
    certification: "U",
  },
  {
    id: 6,
    title: "The Venice Enigma",
    genre: ["Mystery", "Crime"],
    duration: 128,
    rating: "PG-13",
    releaseDate: "2025-11-14",
    director: "Sophia Lorenzi",
    description: "A world-renowned art historian must solve a series of cryptic puzzles hidden within the masterpieces of Venice to prevent a catastrophic heist.",
    posterUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?q=80&w=800",
    heroUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?q=80&w=1200",
    language: "English",
    certification: "U/A",
  },
];
