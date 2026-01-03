import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus,
  Calendar,
  MapPin,
  Wallet,
  TrendingUp,
  ChevronRight,
  Sparkles,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { getUserTrips, getTripStats } from "@/services/tripService";
import { formatCurrency } from "@/services/costService";
import type { Trip } from "@/types/database";

const popularDestinations = [
  { name: "Paris", country: "France", image: "🗼", travelers: "12K+" },
  { name: "Tokyo", country: "Japan", image: "🏯", travelers: "8K+" },
  { name: "Bali", country: "Indonesia", image: "🌴", travelers: "15K+" },
  { name: "New York", country: "USA", image: "🗽", travelers: "20K+" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [stats, setStats] = useState({
    upcomingTrips: 0,
    citiesExplored: 0,
    totalBudget: 0,
    daysPlanned: 0,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (!token) {
        navigate("/auth");
        return;
      }

      if (userData) {
        setUser(JSON.parse(userData));
      }

      await loadData();
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const loadData = async () => {
    try {
      const [tripsData, statsData] = await Promise.all([
        getUserTrips(),
        getTripStats(),
      ]);
      setTrips(Array.isArray(tripsData) ? tripsData.slice(0, 3) : []);
      setStats(statsData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleSignOut = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary text-xl font-display">Loading...</div>
      </div>
    );
  }

  const userName = user?.full_name || user?.email?.split("@")[0] || "Traveler";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
                  Welcome back, {userName}!
                </h1>
                <p className="text-muted-foreground">
                  Ready to plan your next adventure?
                </p>
              </div>
              <Button variant="hero" size="lg" asChild>
                <Link to="/trips/new">
                  <Plus className="w-5 h-5" />
                  Plan New Trip
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
          >
            {[
              { icon: Calendar, label: "Upcoming Trips", value: stats.upcomingTrips.toString(), color: "bg-primary" },
              { icon: MapPin, label: "Cities Explored", value: stats.citiesExplored.toString(), color: "bg-accent" },
              { icon: Wallet, label: "Total Budget", value: formatCurrency(stats.totalBudget), color: "bg-golden" },
              { icon: TrendingUp, label: "Days Planned", value: stats.daysPlanned.toString(), color: "bg-primary" },
            ].map((stat) => (
              <Card key={stat.label} variant="elevated" className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>
                <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            ))}
          </motion.div>

          {/* Recent Trips & Popular Destinations */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Trips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-semibold text-foreground">
                  Your Trips
                </h2>
                <Link to="/trips" className="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {trips.length === 0 ? (
                <Card variant="elevated" className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                    No trips yet
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                    Start planning your first adventure! Create a trip and begin adding destinations.
                  </p>
                  <Button variant="hero" asChild>
                    <Link to="/trips/new">
                      <Plus className="w-5 h-5" />
                      Create Your First Trip
                    </Link>
                  </Button>
                </Card>
              ) : (
                <div className="space-y-4">
                  {trips.map((trip) => (
                    <Card
                      key={trip.id}
                      variant="interactive"
                      className="p-5 cursor-pointer"
                      onClick={() => navigate(`/trips/${trip.id}/itinerary`)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-display font-semibold text-lg text-foreground mb-1">
                            {trip.name}
                          </h3>
                          {trip.description && (
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {trip.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(trip.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              {' - '}
                              {new Date(trip.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Popular Destinations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-xl font-display font-semibold text-foreground mb-6">
                Popular Destinations
              </h2>
              <div className="space-y-4">
                {popularDestinations.map((dest, index) => (
                  <Card
                    key={dest.name}
                    variant="interactive"
                    className="p-4"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{dest.image}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{dest.name}</p>
                        <p className="text-sm text-muted-foreground">{dest.country}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-primary">{dest.travelers}</p>
                        <p className="text-xs text-muted-foreground">travelers</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sign Out */}
          <div className="mt-12 text-center">
            <Button variant="ghost" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
