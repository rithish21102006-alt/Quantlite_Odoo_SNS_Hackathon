import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Filter, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const destinations = [
  { id: 1, name: "Paris", country: "France", rating: 4.8, travelers: "15K+", emoji: "🗼", costIndex: "$$$$" },
  { id: 2, name: "Tokyo", country: "Japan", rating: 4.9, travelers: "12K+", emoji: "🏯", costIndex: "$$$" },
  { id: 3, name: "Bali", country: "Indonesia", rating: 4.7, travelers: "20K+", emoji: "🌴", costIndex: "$$" },
  { id: 4, name: "New York", country: "USA", rating: 4.6, travelers: "25K+", emoji: "🗽", costIndex: "$$$$" },
  { id: 5, name: "Barcelona", country: "Spain", rating: 4.7, travelers: "10K+", emoji: "🏖️", costIndex: "$$$" },
  { id: 6, name: "Sydney", country: "Australia", rating: 4.5, travelers: "8K+", emoji: "🦘", costIndex: "$$$$" },
  { id: 7, name: "Rome", country: "Italy", rating: 4.8, travelers: "18K+", emoji: "🏛️", costIndex: "$$$" },
  { id: 8, name: "Bangkok", country: "Thailand", rating: 4.6, travelers: "22K+", emoji: "🛕", costIndex: "$" },
];

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredDestinations = destinations.filter(
    (dest) =>
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchQuery.toLowerCase())
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
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
              Explore <span className="text-gradient">Destinations</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Discover amazing cities and find your next travel destination
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-12"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search cities or countries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12"
                inputSize="lg"
              />
            </div>
            <Button variant="outline" size="lg">
              <Filter className="w-5 h-5" />
              Filters
            </Button>
          </motion.div>

          {/* Destinations Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredDestinations.map((dest, index) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Card variant="trip" className="group">
                  {/* Image Placeholder */}
                  <div className="h-40 bg-gradient-hero flex items-center justify-center relative overflow-hidden">
                    <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                      {dest.emoji}
                    </span>
                    <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                      {dest.costIndex}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-display text-lg font-semibold text-foreground">
                          {dest.name}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {dest.country}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-golden">
                        <Star className="w-4 h-4 fill-golden" />
                        <span className="text-sm font-medium">{dest.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <span className="text-xs text-muted-foreground">
                        {dest.travelers} travelers
                      </span>
                      <Button variant="ghost" size="sm" className="text-primary">
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {filteredDestinations.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                No destinations found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Explore;
