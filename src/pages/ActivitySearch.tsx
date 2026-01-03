import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Clock, DollarSign, Star, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const activities = [
  { id: 1, name: "Eiffel Tower Tour", city: "Paris", duration: "3 hours", price: "$45", rating: 4.9, type: "Sightseeing" },
  { id: 2, name: "Sushi Making Class", city: "Tokyo", duration: "2 hours", price: "$80", rating: 4.8, type: "Food & Drink" },
  { id: 3, name: "Bali Temple Visit", city: "Bali", duration: "4 hours", price: "$35", rating: 4.7, type: "Cultural" },
  { id: 4, name: "Broadway Show", city: "New York", duration: "3 hours", price: "$150", rating: 4.9, type: "Entertainment" },
  { id: 5, name: "Sagrada Familia", city: "Barcelona", duration: "2 hours", price: "$40", rating: 4.8, type: "Sightseeing" },
  { id: 6, name: "Sydney Opera House", city: "Sydney", duration: "1.5 hours", price: "$55", rating: 4.6, type: "Cultural" },
  { id: 7, name: "Colosseum Tour", city: "Rome", duration: "3 hours", price: "$50", rating: 4.9, type: "Historical" },
  { id: 8, name: "Street Food Tour", city: "Bangkok", duration: "4 hours", price: "$25", rating: 4.7, type: "Food & Drink" },
];

const categories = ["All", "Sightseeing", "Food & Drink", "Cultural", "Entertainment", "Historical", "Adventure"];

const ActivitySearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const filteredActivities = activities.filter((activity) => {
    const matchesSearch = 
      activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || activity.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto mb-10"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
              Activity <span className="text-gradient">Search</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Discover amazing activities and experiences for your trip
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search activities or cities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12"
                inputSize="lg"
              />
            </div>
          </motion.div>

          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-wrap gap-2 justify-center mb-10"
          >
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </motion.div>

          {/* Activities Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {filteredActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <Card variant="interactive" className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-display text-lg font-semibold text-foreground">
                          {activity.name}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full bg-secondary text-xs font-medium text-secondary-foreground">
                          {activity.type}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {activity.city}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {activity.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {activity.price}
                        </span>
                        <span className="flex items-center gap-1 text-golden">
                          <Star className="w-4 h-4 fill-golden" />
                          {activity.rating}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline">
                      View Details
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {filteredActivities.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                No activities found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ActivitySearch;
