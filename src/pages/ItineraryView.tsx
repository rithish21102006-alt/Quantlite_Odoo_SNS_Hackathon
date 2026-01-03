import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Wallet,
  Copy,
  Share2,
  Clock,
  Ticket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import BudgetBreakdown from "@/components/BudgetBreakdown";
import { useToast } from "@/hooks/use-toast";
import { getTripById, getTripByShareId, copyTrip } from "@/services/tripService";
import { formatCurrency } from "@/services/costService";
import type { TripWithDetails } from "@/types/database";

const ItineraryView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [trip, setTrip] = useState<TripWithDetails | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isPublicView, setIsPublicView] = useState(false);

  useEffect(() => {
    const loadTrip = async () => {
      if (!id) return;

      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        const user = userData ? JSON.parse(userData) : null;

        let tripData: TripWithDetails | null = null;

        // Try to load by ID
        try {
          tripData = await getTripById(id);
          if (tripData) {
            setIsOwner(user && tripData.user_id?.toString() === user.id?.toString());
            setIsPublicView(false);
          }
        } catch (e) {
          // Try share ID
          tripData = await getTripByShareId(id);
          if (tripData) {
            setIsOwner(user && tripData.user_id?.toString() === user.id?.toString());
            setIsPublicView(true);
          }
        }

        if (!tripData) {
          toast({
            title: "Trip not found",
            description: "We couldn't find the trip you're looking for.",
            variant: "destructive",
          });
          navigate("/trips");
          return;
        }

        setTrip(tripData);
      } catch (error) {
        console.error("Error loading trip:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTrip();
  }, [id, navigate, toast]);

  const handleCopyTrip = async () => {
    if (!trip) return;

    try {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;

      if (!token || !user) {
        toast({
          title: "Login required",
          description: "Please login to copy this trip to your account.",
        });
        navigate("/auth");
        return;
      }

      const newTrip = await copyTrip(trip.id, user.id);
      toast({
        title: "Trip copied!",
        description: `Trip "${trip.name}" has been added to your collection.`,
      });
      navigate(`/trips/${newTrip.id}/itinerary`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to copy trip.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary text-xl font-display">Loading...</div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold text-foreground mb-4">Trip Not Found</h2>
          <Button asChild>
            <Link to="/trips">Back to Trips</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" asChild>
              <Link to={isOwner ? "/trips" : "/"}>
                <ArrowLeft className="w-5 h-5" />
                {isOwner ? "Back to Trips" : "Back Home"}
              </Link>
            </Button>
            {!isOwner && (
              <Button onClick={handleCopyTrip} className="gap-2">
                <Copy className="w-4 h-4" />
                Copy to My Trips
              </Button>
            )}
            {isOwner && (
              <Button asChild variant="outline">
                <Link to={`/trips/${trip.id}/itinerary`}>
                  Edit Itinerary
                </Link>
              </Button>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
                  {trip.name}
                </h1>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">Total Estimate</p>
                <p className="text-2xl font-display font-bold text-primary">
                  {formatCurrency(trip.cost_breakdown?.total_estimated_cost || 0)}
                </p>
              </div>
            </div>
            {trip.description && (
              <p className="text-foreground/80 max-w-2xl">{trip.description}</p>
            )}
          </motion.div>

          <Tabs defaultValue="itinerary" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
              <TabsTrigger value="budget">Budget Breakdown</TabsTrigger>
            </TabsList>

            <TabsContent value="itinerary" className="space-y-6">
              <div className="grid gap-6">
                {(trip.stops || []).map((stop, index) => (
                  <motion.div
                    key={stop.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card variant="elevated">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between text-lg">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-primary" />
                            <span>{stop.city_name}{stop.country ? `, ${stop.country}` : ""}</span>
                          </div>
                          <span className="text-sm font-normal text-muted-foreground">
                            {new Date(stop.start_date).toLocaleDateString()} - {new Date(stop.end_date).toLocaleDateString()}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {stop.activities && stop.activities.length > 0 ? (
                            <div className="grid gap-3">
                              {stop.activities.map((activity) => (
                                <div
                                  key={activity.id}
                                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                      {activity.activity?.type === 'sightseeing' ? (
                                        <MapPin className="w-4 h-4 text-primary" />
                                      ) : (
                                        <Ticket className="w-4 h-4 text-primary" />
                                      )}
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">{activity.activity?.name || activity.custom_activity_name}</p>
                                      {activity.activity?.type && (
                                        <p className="text-xs text-muted-foreground capitalize">{activity.activity.type}</p>
                                      )}
                                    </div>
                                  </div>
                                  <p className="text-sm font-semibold text-primary">
                                    {formatCurrency(activity.estimated_cost)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground italic">No activities planned for this city.</p>
                          )}

                          {stop.notes && (
                            <div className="mt-4 p-3 rounded-lg bg-muted/50 text-sm">
                              <p className="text-muted-foreground">{stop.notes}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                {(trip.stops || []).length === 0 && (
                  <div className="py-12 text-center text-muted-foreground">
                    <p>No itinerary items found for this trip.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="budget">
              <BudgetBreakdown
                breakdown={trip.cost_breakdown || null}
                stops={trip.stops || []}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default ItineraryView;
