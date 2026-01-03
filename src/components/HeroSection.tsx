import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Calendar, Wallet, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-travel.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Beautiful coastal Mediterranean town"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-24 lg:pt-32">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <MapPin className="w-4 h-4" />
              Your Adventure Awaits
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-foreground leading-tight mb-6"
          >
            Plan Your Perfect
            <span className="text-gradient block">Journey</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg"
          >
            Create personalized multi-city itineraries, discover amazing activities, 
            and stay on budget—all in one beautiful platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button variant="hero" size="xl" asChild>
              <Link to="/auth?mode=signup">
                Start Planning Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="glass" size="xl" asChild>
              <Link to="/explore">
                Explore Destinations
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-border/50"
          >
            <div>
              <p className="text-2xl md:text-3xl font-display font-bold text-foreground">500+</p>
              <p className="text-sm text-muted-foreground">Cities</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-display font-bold text-foreground">10K+</p>
              <p className="text-sm text-muted-foreground">Activities</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-display font-bold text-foreground">50K+</p>
              <p className="text-sm text-muted-foreground">Travelers</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Feature Cards */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-4 z-10">
        {[
          { icon: Calendar, label: "Smart Scheduling", color: "bg-primary" },
          { icon: Wallet, label: "Budget Tracking", color: "bg-accent" },
          { icon: Users, label: "Share & Collaborate", color: "bg-golden" },
        ].map((feature, index) => (
          <motion.div
            key={feature.label}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
            className="glass px-4 py-3 rounded-xl flex items-center gap-3 animate-float"
            style={{ animationDelay: `${index * 0.5}s` }}
          >
            <div className={`w-10 h-10 rounded-lg ${feature.color} flex items-center justify-center`}>
              <feature.icon className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-sm font-medium text-foreground whitespace-nowrap">
              {feature.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
