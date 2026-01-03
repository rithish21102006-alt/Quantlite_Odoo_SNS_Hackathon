import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Search, Filter, MapPin, Calendar, Trash2, Edit, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { getUserTrips, deleteTrip } from "@/services/tripService";
import { formatCurrency } from "@/services/costService";
import { useToast } from "@/hooks/use-toast";
import type { Trip } from "@/types/database";

const Trips = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const loadTrips = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/auth");
        return;
      }
      const userTrips = await getUserTrips();
      setTrips(Array.isArray(userTrips) ? userTrips : []);
    } catch (error) {
      console.error("Error loading trips:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, [navigate]);

  const handleDeleteTrip = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this trip?")) return;

    try {
      await deleteTrip(id);
      setTrips(trips.filter(t => t.id !== id));
      toast({
        title: "Trip deleted",
        description: "The trip has been removed successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete trip.",
        variant: "destructive",
      });
    }
  };

  const filteredTrips = trips.filter(trip =>
    trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (trip.description && trip.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary text-xl font-display">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
                  My Trips
                </h1>
                <p className="text-muted-foreground">
                  Manage and view all your travel plans
                </p>
              </div>
              <Button variant="hero" size="lg" asChild>
                <Link to="/trips/new">
                  <Plus className="w-5 h-5" />
                  New Trip
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Search & Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-4 mb-8"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search trips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12"
              />
            </div>
          </motion.div>

          {/* Trips Grid */}
          {filteredTrips.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrips.map((trip, index) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={`/trips/${trip.id}/itinerary`}>
                    <Card variant="elevated" className="h-full hover:border-primary/50 transition-colors group">
                      <div className="aspect-video w-full bg-secondary overflow-hidden relative">
                        {trip.cover_image_url ? (
                          <img
                            src={trip.cover_image_url}
                            alt={trip.name}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-hero">
                            <MapPin className="w-8 h-8 text-primary-foreground opacity-50" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2 flex gap-1">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => handleDeleteTrip(trip.id, e)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                      <CardHeader className="p-5 pb-2">
                        <CardTitle className="text-xl font-display group-hover:text-primary transition-colors">
                          {trip.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-5 pt-0 space-y-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                        </div>
                        {trip.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {trip.description}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card variant="elevated" className="p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-10 h-10 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-display font-semibold text-foreground mb-3">
                  {searchQuery ? "No matching trips" : "No trips planned yet"}
                </h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  {searchQuery
                    ? "Try adjusting your search query."
                    : "Create your first trip and start adding destinations, activities, and budget estimates."}
                </p>
                {!searchQuery && (
                  <Button variant="hero" size="lg" asChild>
                    <Link to="/trips/new">
                      <Plus className="w-5 h-5" />
                      Create Your First Trip
                    </Link>
                  </Button>
                )}
              </Card>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Trips;
