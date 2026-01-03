import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  MapPin,
  TrendingUp,
  Calendar,
  BarChart3,
  Activity,
  Globe,
  Search,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
// Auth handled via localStorage

const sortOptions = ["Recent trips", "Popular City", "Popular Activity", "Size Travels and duration"];

const AdminPanel = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary text-xl font-display">Loading...</div>
      </div>
    );
  }

  const stats = [
    { label: "Total Users", value: "12,459", icon: Users, change: "+12%", color: "bg-primary" },
    { label: "Active Trips", value: "3,847", icon: MapPin, change: "+8%", color: "bg-accent" },
    { label: "Cities Covered", value: "526", icon: Globe, change: "+5%", color: "bg-golden" },
    { label: "Total Activities", value: "15,293", icon: Activity, change: "+18%", color: "bg-primary" },
  ];

  // Mock chart data
  const chartData = [40, 65, 45, 80, 55, 90, 70];
  const maxValue = Math.max(...chartData);

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
              Admin Panel
            </h1>
            <p className="text-muted-foreground">
              Monitor platform usage, track user trends, and manage the application
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

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {stats.map((stat) => (
              <Card key={stat.label} variant="elevated" className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            ))}
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Usage Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Usage Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Simple Line Chart Mockup */}
                  <div className="h-48 flex items-end gap-2 pt-4">
                    <svg className="w-full h-full" viewBox="0 0 300 150" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="hsl(var(--primary))" />
                          <stop offset="100%" stopColor="hsl(var(--accent))" />
                        </linearGradient>
                      </defs>
                      <polyline
                        fill="none"
                        stroke="url(#lineGradient)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points="0,100 50,60 100,80 150,40 200,65 250,25 300,45"
                      />
                      <polyline
                        fill="hsl(var(--primary) / 0.1)"
                        stroke="none"
                        points="0,150 0,100 50,60 100,80 150,40 200,65 250,25 300,45 300,150"
                      />
                    </svg>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-4">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Bar Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-accent" />
                    Top Destinations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-end justify-between gap-4">
                    {chartData.map((value, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div
                          className="w-full bg-gradient-hero rounded-t-lg transition-all duration-500"
                          style={{ height: `${(value / maxValue) * 100}%` }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-4">
                    <span>Paris</span>
                    <span>Tokyo</span>
                    <span>NYC</span>
                    <span>Bali</span>
                    <span>Rome</span>
                    <span>Dubai</span>
                    <span>London</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Manage list section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Manage User Section
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Here is the dashboard for this section, for managing the users and their actions.
                  The optional field show the search, for one of the key fields made by the
                  team and as well updated.
                </p>

                {/* Info boxes */}
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-lg bg-secondary/50">
                    <h4 className="font-semibold text-sm text-foreground mb-2">Left: All functions/actions</h4>
                    <p className="text-xs text-muted-foreground">
                      Left side displays where the users are cycling layout on
                      a map or as in normal order...
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/50">
                    <h4 className="font-semibold text-sm text-foreground mb-2">Popular Activity</h4>
                    <p className="text-xs text-muted-foreground">
                      % of the popular activity when the users are cycling layout on
                      a map or as in normal order...
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-secondary/50">
                    <h4 className="font-semibold text-sm text-foreground mb-2">Size Travels and durations</h4>
                    <p className="text-xs text-muted-foreground">
                      The users are doing layout on this
                      category and you will be updated...
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <h4 className="font-semibold text-sm text-primary mb-2">Lawful Bear</h4>
                    <p className="text-xs text-muted-foreground">
                      Active user management tools
                    </p>
                  </div>
                </div>

                {/* Alert Indicator */}
                <div className="mt-6 p-4 rounded-lg bg-accent/10 border border-accent/20 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                    <Activity className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Alert Alligator</p>
                    <p className="text-xs text-muted-foreground">System monitoring active</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
