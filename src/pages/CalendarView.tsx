import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
// Auth handled via localStorage

interface TripEvent {
  id: string;
  name: string;
  startDay: number;
  endDay: number;
  color: string;
}

// Mock calendar data
const mockTrips: TripEvent[] = [
  { id: "1", name: "PARIS TRIP", startDay: 7, endDay: 10, color: "bg-primary" },
  { id: "2", name: "NYC GETAWAY", startDay: 13, endDay: 16, color: "bg-accent" },
  { id: "3", name: "BALI_ADVENTURE", startDay: 17, endDay: 20, color: "bg-golden" },
  { id: "4", name: "NYC GETAWAY", startDay: 26, endDay: 28, color: "bg-accent" },
];

const sortOptions = ["Recent trips", "Popular City", "Popular Activity", "Size Travels and duration"];

const CalendarView = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 1)); // January 2024
  const [selectedSort, setSelectedSort] = useState("Recent trips");

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

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  const getTripForDay = (day: number) => {
    return mockTrips.find(trip => day >= trip.startDay && day <= trip.endDay);
  };

  const isStartOfTrip = (day: number) => {
    return mockTrips.some(trip => trip.startDay === day);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary text-xl font-display">Loading...</div>
      </div>
    );
  }

  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
              Calendar View
            </h1>
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

          {/* Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card variant="elevated" className="p-6">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                <Button variant="ghost" size="icon" onClick={prevMonth}>
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <h2 className="text-xl font-display font-semibold text-foreground">
                  {monthName}
                </h2>
                <Button variant="ghost" size="icon" onClick={nextMonth}>
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {days.map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for days before first of month */}
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square p-1" />
                ))}

                {/* Days of month */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const trip = getTripForDay(day);
                  const isStart = isStartOfTrip(day);

                  return (
                    <div
                      key={day}
                      className={`aspect-square p-1 relative ${trip ? 'cursor-pointer' : ''}`}
                    >
                      <div className={`w-full h-full rounded-lg flex flex-col items-center justify-start pt-1 text-sm transition-colors ${trip ? `${trip.color} text-primary-foreground` : 'hover:bg-secondary'
                        }`}>
                        <span className="font-medium">{day}</span>
                        {isStart && trip && (
                          <span className="text-[8px] mt-0.5 px-1 truncate max-w-full">
                            {trip.name}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-border">
                {mockTrips.filter((trip, index, self) =>
                  index === self.findIndex(t => t.name === trip.name)
                ).map((trip) => (
                  <div key={trip.id} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded ${trip.color}`} />
                    <span className="text-sm text-muted-foreground">{trip.name}</span>
                  </div>
                ))}
              </div>

              {/* User */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                  P
                </div>
                <span className="text-sm font-medium text-foreground">Prajith VL</span>
              </div>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default CalendarView;
