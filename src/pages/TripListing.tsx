import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Eye,
  Edit,
  Clock,
  CheckCircle,
  Plane
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";

interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: "ongoing" | "upcoming" | "completed";
}

// Mock data for demonstration
const mockTrips: Trip[] = [
  { id: "1", name: "Paris Trip", destination: "Paris, France", startDate: "2024-01-10", endDate: "2024-01-15", status: "ongoing" },
  { id: "2", name: "Tokyo Adventure", destination: "Tokyo, Japan", startDate: "2024-02-20", endDate: "2024-03-01", status: "upcoming" },
  { id: "3", name: "NYC Getaway", destination: "New York, USA", startDate: "2024-03-15", endDate: "2024-03-20", status: "upcoming" },
  { id: "4", name: "Bali Vacation", destination: "Bali, Indonesia", startDate: "2023-12-01", endDate: "2023-12-10", status: "completed" },
];

const TripListing = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [trips] = useState<Trip[]>(mockTrips);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/auth");
        return;
      }
      setLoading(false);
    };
    checkAuth();
  }, [navigate]);

  const getStatusIcon = (status: Trip["status"]) => {
    switch (status) {
      case "ongoing":
        return <Plane className="w-4 h-4" />;
      case "upcoming":
        return <Clock className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Trip["status"]) => {
    switch (status) {
      case "ongoing":
        return "bg-primary text-primary-foreground";
      case "upcoming":
        return "bg-accent text-accent-foreground";
      case "completed":
        return "bg-muted text-muted-foreground";
    }
  };

  const filterTrips = (status: Trip["status"]) => trips.filter(t => t.status === status);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary text-xl font-display">Loading...</div>
      </div>
    );
  }

  const TripCard = ({ trip }: { trip: Trip }) => (
    <Card variant="interactive" className="p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground mb-1">
            {trip.name}
          </h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {trip.destination}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${getStatusColor(trip.status)}`}>
          {getStatusIcon(trip.status)}
          {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
        <span className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
        </span>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <Link to={`/trips/${trip.id}/view`}>
            <Eye className="w-4 h-4" />
            View
          </Link>
        </Button>
        <Button variant="ghost" size="sm" className="flex-1" asChild>
          <Link to={`/trips/${trip.id}/edit`}>
            <Edit className="w-4 h-4" />
            Edit
          </Link>
        </Button>
      </div>
    </Card>
  );

  const TripSection = ({ title, trips, icon: Icon }: { title: string; trips: Trip[]; icon: any }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-10"
    >
      <h2 className="text-xl font-display font-semibold text-foreground mb-4 flex items-center gap-2">
        <Icon className="w-5 h-5 text-primary" />
        {title}
      </h2>
      {trips.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      ) : (
        <Card variant="elevated" className="p-6 text-center text-muted-foreground">
          No {title.toLowerCase()} trips
        </Card>
      )}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
              User Trip Listing
            </h1>
            <p className="text-muted-foreground">
              View and manage all your trips organized by status
            </p>
          </motion.div>

          <TripSection title="Ongoing" trips={filterTrips("ongoing")} icon={Plane} />
          <TripSection title="Up-coming" trips={filterTrips("upcoming")} icon={Clock} />
          <TripSection title="Completed" trips={filterTrips("completed")} icon={CheckCircle} />
        </div>
      </main>
    </div>
  );
};

export default TripListing;
