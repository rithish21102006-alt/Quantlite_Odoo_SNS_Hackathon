import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Image as ImageIcon,
  MapPin,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { createTrip } from "@/services/tripService";

const CreateTrip = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const [tripData, setTripData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    coverImageUrl: "",
  });

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/auth");
        return;
      }
      setAuthLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate dates
      if (new Date(tripData.startDate) > new Date(tripData.endDate)) {
        toast({
          title: "Invalid dates",
          description: "End date must be after start date.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Create trip in database
      const newTrip = await createTrip({
        name: tripData.name,
        description: tripData.description || undefined,
        start_date: tripData.startDate,
        end_date: tripData.endDate,
        cover_image_url: tripData.coverImageUrl || undefined,
      });

      toast({
        title: "Trip created!",
        description: `Your trip "${tripData.name}" has been created successfully.`,
      });

      // Navigate to itinerary builder for the new trip
      navigate(`/trips/${newTrip.id}/itinerary`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create trip.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
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
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Button variant="ghost" asChild className="mb-6">
              <Link to="/trips">
                <ArrowLeft className="w-5 h-5" />
                Back to Trips
              </Link>
            </Button>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
              Create New Trip
            </h1>
            <p className="text-muted-foreground">
              Start planning your next adventure by filling in the details below.
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Trip Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Trip Name *
                    </label>
                    <Input
                      placeholder="e.g., European Summer Adventure"
                      value={tripData.name}
                      onChange={(e) => setTripData({ ...tripData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Description
                    </label>
                    <textarea
                      placeholder="Describe your trip..."
                      value={tripData.description}
                      onChange={(e) => setTripData({ ...tripData, description: e.target.value })}
                      className="flex w-full rounded-lg border border-input bg-background px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[100px] resize-none"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        Start Date *
                      </label>
                      <Input
                        type="date"
                        value={tripData.startDate}
                        onChange={(e) => setTripData({ ...tripData, startDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        End Date *
                      </label>
                      <Input
                        type="date"
                        value={tripData.endDate}
                        onChange={(e) => setTripData({ ...tripData, endDate: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-muted-foreground" />
                      Cover Photo (Optional)
                    </label>
                    <div className="border-2 border-dashed border-input rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                      <ImageIcon className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG up to 5MB
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => navigate("/trips")}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="hero"
                      className="flex-1"
                      disabled={loading}
                    >
                      <Save className="w-5 h-5" />
                      {loading ? "Creating..." : "Create Trip"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default CreateTrip;
