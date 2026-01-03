import { motion } from "framer-motion";
import { MapPin, Calendar, Wallet, Share2, Sparkles, Route } from "lucide-react";

const features = [
  {
    icon: Route,
    title: "Multi-City Itineraries",
    description: "Plan complex trips with multiple stops, custom durations, and flexible scheduling.",
    color: "bg-primary",
  },
  {
    icon: Calendar,
    title: "Visual Timeline",
    description: "See your entire trip at a glance with our beautiful calendar and day-by-day view.",
    color: "bg-accent",
  },
  {
    icon: Wallet,
    title: "Budget Tracking",
    description: "Get real-time cost estimates and keep your spending organized by category.",
    color: "bg-golden",
  },
  {
    icon: Sparkles,
    title: "Activity Discovery",
    description: "Explore curated activities, tours, and experiences for every destination.",
    color: "bg-primary",
  },
  {
    icon: MapPin,
    title: "City Search",
    description: "Find the perfect destinations with detailed information and travel tips.",
    color: "bg-accent",
  },
  {
    icon: Share2,
    title: "Share & Collaborate",
    description: "Share your itineraries publicly or invite friends to plan together.",
    color: "bg-golden",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mt-3 mb-4">
            Everything You Need to
            <span className="text-gradient"> Plan Smarter</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            From initial inspiration to final booking, we've got you covered with powerful tools designed for modern travelers.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-lg transition-all duration-300 group"
            >
              <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
