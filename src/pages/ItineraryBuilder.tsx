import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  Calendar,
  MapPin,
  Wallet,
  Trash2,
  GripVertical,
  Save,
  Sparkles,
  X,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import BudgetBreakdown from "@/components/BudgetBreakdown";
import { useToast } from "@/hooks/use-toast";
import { getTripById, generatePublicShareId } from "@/services/tripService";
import { addTripStop, updateTripStop, deleteTripStop, reorderTripStops } from "@/services/tripStopService";
import { getActivities, addTripActivity, deleteTripActivity, calculateAverageCost } from "@/services/activityService";
import { calculateTripCost, formatCurrency } from "@/services/costService";
import type { TripWithDetails, TripStopWithActivities, Activity, TripActivity } from "@/types/database";

const ItineraryBuilder = () => {
  const navigate = useNavigate();
  const { id: tripId } = useParams<{ id: string }>();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [trip, setTrip] = useState<TripWithDetails | null>(null);
  const [stops, setStops] = useState<TripStopWithActivities[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [totalCost, setTotalCost] = useState(0);

  // Dialog states
  const [showAddStopDialog, setShowAddStopDialog] = useState(false);
  const [showAddActivityDialog, setShowAddActivityDialog] = useState(false);
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);

  // Form states
  const [newStop, setNewStop] = useState({
    city_name: "",
    country: "",
    start_date: "",
    end_date: "",
    notes: "",
  });

  const [selectedActivityId, setSelectedActivityId] = useState<string>("");
  const [customActivityName, setCustomActivityName] = useState("");
  const [activityCost, setActivityCost] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/auth");
        return;
      }
      if (tripId) {
        await loadTripData();
      }
      setLoading(false);
    };
    checkAuth();
  }, [navigate, tripId]);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadTripData = async () => {
    if (!tripId) return;

    try {
      const tripData = await getTripById(tripId);
      if (!tripData) {
        toast({
          title: "Trip not found",
          description: "The requested trip could not be found.",
          variant: "destructive",
        });
        navigate("/trips");
        return;
      }

      setTrip(tripData);
      setStops(tripData.stops || []);

      // Calculate total cost
      if (tripData.cost_breakdown) {
        setTotalCost(tripData.cost_breakdown.total_estimated_cost);
      }
    } catch (error: any) {
      console.error("Error loading trip:", error);
      toast({
        title: "Error",
        description: "Failed to load trip data.",
        variant: "destructive",
      });
    }
  };

  const loadActivities = async () => {
    try {
      const activitiesData = await getActivities();
      setActivities(activitiesData);
    } catch (error) {
      console.error("Error loading activities:", error);
    }
  };

  const handleAddStop = async () => {
    if (!tripId || !newStop.city_name || !newStop.start_date || !newStop.end_date) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const stop = await addTripStop({
        trip_id: tripId,
        city_name: newStop.city_name,
        country: newStop.country || undefined,
        start_date: newStop.start_date,
        end_date: newStop.end_date,
        order_index: stops.length,
        notes: newStop.notes || undefined,
      });

      setStops([...stops, { ...stop, activities: [] }]);
      setShowAddStopDialog(false);
      setNewStop({
        city_name: "",
        country: "",
        start_date: "",
        end_date: "",
        notes: "",
      });

      toast({
        title: "City added!",
        description: `${newStop.city_name} has been added to your trip.`,
      });

      // Recalculate costs
      await recalculateCosts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add city.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveStop = async (stopId: string) => {
    try {
      await deleteTripStop(stopId);
      setStops(stops.filter(s => s.id !== stopId));

      toast({
        title: "City removed",
        description: "The city has been removed from your trip.",
      });

      await recalculateCosts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove city.",
        variant: "destructive",
      });
    }
  };

  const handleAddActivity = async () => {
    if (!selectedStopId) return;

    if (!selectedActivityId && !customActivityName) {
      toast({
        title: "Missing information",
        description: "Please select an activity or enter a custom activity name.",
        variant: "destructive",
      });
      return;
    }

    if (!activityCost) {
      toast({
        title: "Missing cost",
        description: "Please enter an estimated cost for this activity.",
        variant: "destructive",
      });
      return;
    }

    try {
      const activity = await addTripActivity({
        trip_stop_id: selectedStopId,
        activity_id: selectedActivityId || undefined,
        custom_activity_name: customActivityName || undefined,
        estimated_cost: parseFloat(activityCost),
      });

      // Update stops with new activity
      setStops(stops.map(stop => {
        if (stop.id === selectedStopId) {
          const activityDetails = selectedActivityId
            ? activities.find(a => a.id === selectedActivityId)
            : undefined;

          return {
            ...stop,
            activities: [
              ...(stop.activities || []),
              {
                ...activity,
                activity: activityDetails,
              }
            ],
          };
        }
        return stop;
      }));

      setShowAddActivityDialog(false);
      setSelectedActivityId("");
      setCustomActivityName("");
      setActivityCost("");

      toast({
        title: "Activity added!",
        description: "The activity has been added to this city.",
      });

      await recalculateCosts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add activity.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveActivity = async (stopId: string, activityId: string) => {
    try {
      await deleteTripActivity(activityId);

      setStops(stops.map(stop => {
        if (stop.id === stopId) {
          return {
            ...stop,
            activities: (stop.activities || []).filter(a => a.id !== activityId),
          };
        }
        return stop;
      }));

      toast({
        title: "Activity removed",
        description: "The activity has been removed.",
      });

      await recalculateCosts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove activity.",
        variant: "destructive",
      });
    }
  };

  const recalculateCosts = async () => {
    if (!tripId) return;

    try {
      const breakdown = await calculateTripCost(tripId);
      setTotalCost(breakdown.total_estimated_cost);
    } catch (error) {
      console.error("Error calculating costs:", error);
    }
  };

  const handleActivitySelect = (activityId: string) => {
    setSelectedActivityId(activityId);
    const activity = activities.find(a => a.id === activityId);
    if (activity) {
      const avgCost = calculateAverageCost(activity);
      setActivityCost(avgCost.toString());
    }
  };

  const handleShare = async () => {
    if (!tripId) return;
    try {
      const shareId = await generatePublicShareId(tripId);
      const shareUrl = `${window.location.origin}/trips/${shareId}/view`;
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied!",
        description: "Public share link has been copied to your clipboard.",
      });
      // Update local trip state
      setTrip(prev => prev ? { ...prev, is_public: true, public_share_id: shareId } : null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to generate share link.",
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
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">Trip not found</h2>
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
              <Link to="/trips">
                <ArrowLeft className="w-5 h-5" />
                Back to Trips
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              {trip.is_public ? "Copy Share Link" : "Share Trip"}
            </Button>
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
                <p className="text-muted-foreground">
                  {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">Estimated Cost</p>
                <p className="text-2xl font-display font-bold text-primary">
                  {formatCurrency(totalCost)}
                </p>
              </div>
            </div>
          </motion.div>

          <Tabs defaultValue="itinerary" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
              <TabsTrigger value="budget">Budget Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="itinerary" className="space-y-6">
              {/* Cities/Stops */}
              <div className="space-y-6">
                {stops.length === 0 ? (
                  <Card variant="elevated" className="p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                      <MapPin className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                      No cities added yet
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                      Start building your itinerary by adding cities to visit.
                    </p>
                  </Card>
                ) : (
                  stops.map((stop, index) => (
                    <motion.div
                      key={stop.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card variant="elevated">
                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                          <div className="flex items-center gap-3">
                            <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
                            <div>
                              <h3 className="font-display text-lg font-semibold text-foreground">
                                {stop.city_name}
                                {stop.country && <span className="text-muted-foreground">, {stop.country}</span>}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                <Calendar className="w-3 h-3 inline mr-1" />
                                {new Date(stop.start_date).toLocaleDateString()} - {new Date(stop.end_date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveStop(stop.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Activities */}
                          {stop.activities && stop.activities.length > 0 && (
                            <div className="space-y-2">
                              {stop.activities.map((activity) => (
                                <div
                                  key={activity.id}
                                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                                >
                                  <div className="flex-1">
                                    <p className="font-medium text-foreground">
                                      {activity.activity?.name || activity.custom_activity_name}
                                    </p>
                                    {activity.activity?.type && (
                                      <p className="text-xs text-muted-foreground capitalize">
                                        {activity.activity.type}
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <p className="text-sm font-medium text-primary">
                                      {formatCurrency(activity.estimated_cost)}
                                    </p>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => handleRemoveActivity(stop.id, activity.id)}
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Add Activity Button */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedStopId(stop.id);
                              setShowAddActivityDialog(true);
                            }}
                            className="w-full"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Activity
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Add City Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6"
              >
                <Button
                  variant="outline"
                  onClick={() => setShowAddStopDialog(true)}
                  className="w-full border-dashed border-2"
                >
                  <Plus className="w-5 h-5" />
                  Add City
                </Button>
              </motion.div>
            </TabsContent>

            <TabsContent value="budget">
              <BudgetBreakdown
                breakdown={trip.cost_breakdown || null}
                stops={stops}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Add City Dialog */}
      <Dialog open={showAddStopDialog} onOpenChange={setShowAddStopDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add City to Trip</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">City Name *</label>
              <Input
                placeholder="e.g., Paris"
                value={newStop.city_name}
                onChange={(e) => setNewStop({ ...newStop, city_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Country</label>
              <Input
                placeholder="e.g., France"
                value={newStop.country}
                onChange={(e) => setNewStop({ ...newStop, country: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date *</label>
                <Input
                  type="date"
                  value={newStop.start_date}
                  onChange={(e) => setNewStop({ ...newStop, start_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End Date *</label>
                <Input
                  type="date"
                  value={newStop.end_date}
                  onChange={(e) => setNewStop({ ...newStop, end_date: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <textarea
                placeholder="Any notes about this city..."
                value={newStop.notes}
                onChange={(e) => setNewStop({ ...newStop, notes: e.target.value })}
                className="w-full min-h-[80px] rounded-lg border border-input bg-background px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowAddStopDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleAddStop} className="flex-1">
                Add City
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Activity Dialog */}
      <Dialog open={showAddActivityDialog} onOpenChange={setShowAddActivityDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Activity</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Activity</label>
              <Select value={selectedActivityId} onValueChange={handleActivitySelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose from catalog" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {activities.slice(0, 50).map((activity) => (
                    <SelectItem key={activity.id} value={activity.id}>
                      {activity.name} ({activity.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-center text-sm text-muted-foreground">or</div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Custom Activity Name</label>
              <Input
                placeholder="Enter custom activity"
                value={customActivityName}
                onChange={(e) => setCustomActivityName(e.target.value)}
                disabled={!!selectedActivityId}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Estimated Cost (USD) *</label>
              <Input
                type="number"
                placeholder="0.00"
                value={activityCost}
                onChange={(e) => setActivityCost(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddActivityDialog(false);
                  setSelectedActivityId("");
                  setCustomActivityName("");
                  setActivityCost("");
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleAddActivity} className="flex-1">
                Add Activity
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ItineraryBuilder;
