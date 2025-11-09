import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Route = {
  id: string;
  user_id: string;
  start_location: string;
  end_location: string;
  start_lat: number;
  start_lng: number;
  end_lat: number;
  end_lng: number;
  distance_km: number;
  frequency: number;
  created_at: string;
  updated_at: string;
};

export type TrafficHistory = {
  id: string;
  route_id: string;
  timestamp: string;
  congestion_level: number;
  day_of_week: number;
  hour_of_day: number;
  weather_condition: string;
  temperature: number;
  estimated_time_minutes: number;
};

export type SavedRoute = {
  id: string;
  user_id: string;
  route_id: string;
  label: string;
  created_at: string;
};
