// Database types for Quantlite application
// These types match the database schema

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Trip {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string;
  cover_image_url: string | null;
  is_public: boolean;
  public_share_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface TripStop {
  id: string;
  trip_id: string;
  city_name: string;
  country: string | null;
  start_date: string;
  end_date: string;
  order_index: number;
  notes: string | null;
  created_at: string;
}

export interface Activity {
  id: string;
  name: string;
  type: string;
  description: string | null;
  typical_duration_hours: number | null;
  min_cost_usd: number;
  max_cost_usd: number;
  created_at: string;
}

export interface TripActivity {
  id: string;
  trip_stop_id: string;
  activity_id: string | null;
  custom_activity_name: string | null;
  estimated_cost: number;
  duration_hours: number | null;
  notes: string | null;
  scheduled_time: string | null;
  created_at: string;
}

export interface CityCostIndex {
  id: string;
  city_name: string;
  country: string;
  accommodation_per_day_usd: number;
  food_per_day_usd: number;
  transport_per_day_usd: number;
  cost_index: number;
  updated_at: string;
}

export interface CostBreakdown {
  id: string;
  trip_id: string;
  total_accommodation: number;
  total_food: number;
  total_transport: number;
  total_activities: number;
  total_estimated_cost: number;
  per_day_average: number;
  calculated_at: string;
}

// Extended types with relationships
export interface TripWithDetails extends Trip {
  stops?: TripStopWithActivities[];
  cost_breakdown?: CostBreakdown;
}

export interface TripStopWithActivities extends TripStop {
  activities?: TripActivityWithDetails[];
  estimated_cost?: number;
}

export interface TripActivityWithDetails extends TripActivity {
  activity?: Activity;
}

// Form types for creating/updating
export interface CreateTripInput {
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  cover_image_url?: string;
}

export interface UpdateTripInput {
  name?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  cover_image_url?: string;
  is_public?: boolean;
}

export interface CreateTripStopInput {
  trip_id: string;
  city_name: string;
  country?: string;
  start_date: string;
  end_date: string;
  order_index: number;
  notes?: string;
}

export interface UpdateTripStopInput {
  city_name?: string;
  country?: string;
  start_date?: string;
  end_date?: string;
  order_index?: number;
  notes?: string;
}

export interface CreateTripActivityInput {
  trip_stop_id: string;
  activity_id?: string;
  custom_activity_name?: string;
  estimated_cost: number;
  duration_hours?: number;
  notes?: string;
  scheduled_time?: string;
}

export interface UpdateTripActivityInput {
  activity_id?: string;
  custom_activity_name?: string;
  estimated_cost?: number;
  duration_hours?: number;
  notes?: string;
  scheduled_time?: string;
}

// Activity type categories
export const ACTIVITY_TYPES = [
  'sightseeing',
  'culture',
  'food',
  'adventure',
  'entertainment',
  'nightlife',
  'wellness',
  'water',
  'shopping',
  'nature',
  'daytrip',
  'unique'
] as const;

export type ActivityType = typeof ACTIVITY_TYPES[number];
