import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Heart,
  MessageCircle,
  Share2,
  MapPin,
  User,
  Eye,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface SharedTrip {
  id: string;
  title: string;
  author: string;
  avatar: string;
  image: string;
  destination: string;
  likes: number;
  comments: number;
  views: number;
  description: string;
}

const sharedTrips: SharedTrip[] = [
  {
    id: "1",
    title: "Amazing 2 weeks in Japan",
    author: "Remarkable Raccoon",
    avatar: "🦝",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    destination: "Tokyo, Kyoto, Osaka",
    likes: 234,
    comments: 45,
    views: 1200,
    description: "An incredible journey through Japan exploring temples, cuisine, and culture...",
  },
  {
    id: "2",
    title: "Backpacking through Europe",
    author: "Caleb_the_exotic",
    avatar: "🌍",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    destination: "Paris, Amsterdam, Berlin",
    likes: 189,
    comments: 32,
    views: 890,
    description: "Budget-friendly tips for exploring Europe's most beautiful cities...",
  },
  {
    id: "3",
    title: "Bali Paradise Getaway",
    author: "Actual Rhinoceros",
    avatar: "🦏",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    destination: "Bali, Indonesia",
    likes: 312,
    comments: 67,
    views: 1500,
    description: "Discovering hidden beaches, rice terraces, and spiritual temples...",
  },
  {
    id: "4",
    title: "NYC Food Tour Adventure",
    author: "Colorful Horse",
    avatar: "🐴",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80",
    destination: "New York City",
    likes: 156,
    comments: 28,
    views: 720,
    description: "The ultimate food lover's guide to New York City neighborhoods...",
  },
  {
    id: "5",
    title: "Safari in Tanzania",
    author: "Automatic Caribou",
    avatar: "🦌",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80",
    destination: "Serengeti, Tanzania",
    likes: 421,
    comments: 89,
    views: 2100,
    description: "Witnessing the great migration and meeting the Big Five...",
  },
];

const sortOptions = ["Recent", "Popular City", "Popular Activities", "Size: Travels and durations"];

const Community = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSort, setSelectedSort] = useState("Recent");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filteredTrips = sharedTrips.filter(
    (trip) =>
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
              Community
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Community section where all the users can share their experience about trips and routes.
              Any other use can see those and may utilize the filter and sorting option. The user
              might feel that he is looking for...
            </p>
          </motion.div>

          {/* Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-4 mb-6"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search for..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <span className="text-muted-foreground">Group by</span>
              </Button>
              <Button variant="outline">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
              <Button variant="outline" className="gap-2">
                <span className="text-muted-foreground">Sort by...</span>
              </Button>
            </div>
          </motion.div>

          {/* Sort Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {sortOptions.map((option) => (
              <Button
                key={option}
                variant={selectedSort === option ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSort(option)}
              >
                {option}
              </Button>
            ))}
          </motion.div>

          {/* Community Cards Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredTrips.map((trip, index) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card variant="trip" className="group h-full">
                  {/* Image Background */}
                  <div
                    className="h-48 relative overflow-hidden cursor-zoom-in"
                    onClick={() => setSelectedImage(trip.image)}
                  >
                    <img
                      src={trip.image}
                      alt={trip.destination}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-sm flex items-center justify-center text-xl">
                      {trip.avatar}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Author */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-semibold text-foreground">{trip.author}</span>
                    </div>

                    <h3 className="font-display text-lg font-bold text-foreground mb-2 line-clamp-1">
                      {trip.title}
                    </h3>

                    <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                      <MapPin className="w-3 h-3 text-primary" />
                      {trip.destination}
                    </p>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {trip.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
                          <Heart className="w-4 h-4" />
                          {trip.likes}
                        </span>
                        <span className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
                          <MessageCircle className="w-4 h-4" />
                          {trip.comments}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {trip.views}
                        </span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 lg:p-12 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center"
          >
            <button
              className="absolute top-0 right-0 p-4 text-white/70 hover:text-white transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={selectedImage}
              alt="Destination"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
            <p className="mt-4 text-white/50 text-sm">Click anywhere to close</p>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Community;
