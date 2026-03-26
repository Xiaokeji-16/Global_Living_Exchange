import type { LucideIcon } from "lucide-react";
import {
  Bath,
  BedDouble,
  BriefcaseBusiness,
  Car,
  CookingPot,
  Heater,
  Home,
  ShieldCheck,
  Snowflake,
  Tv,
  Users,
  WashingMachine,
  Wifi,
} from "lucide-react";

export type AmenityCategory =
  | "Essentials"
  | "Kitchen & dining"
  | "Bathroom & laundry"
  | "Comfort"
  | "Work & family"
  | "Outdoors & views"
  | "Safety & access"
  | "Parking & services";

export type AmenityOption = {
  id: string;
  label: string;
  category: AmenityCategory;
};

export const AMENITY_OPTIONS: AmenityOption[] = [
  { id: "wifi", label: "Wi-Fi", category: "Essentials" },
  { id: "essentials", label: "Essentials", category: "Essentials" },
  { id: "heating", label: "Heating", category: "Essentials" },
  { id: "air-conditioning", label: "Air conditioning", category: "Essentials" },
  { id: "hot-water", label: "Hot water", category: "Essentials" },
  { id: "tv", label: "TV", category: "Essentials" },
  { id: "streaming", label: "Streaming services", category: "Essentials" },

  { id: "kitchen", label: "Kitchen", category: "Kitchen & dining" },
  { id: "microwave", label: "Microwave", category: "Kitchen & dining" },
  { id: "fridge", label: "Refrigerator", category: "Kitchen & dining" },
  { id: "freezer", label: "Freezer", category: "Kitchen & dining" },
  { id: "dishwasher", label: "Dishwasher", category: "Kitchen & dining" },
  { id: "oven", label: "Oven", category: "Kitchen & dining" },
  { id: "stove", label: "Stove", category: "Kitchen & dining" },
  { id: "coffee-maker", label: "Coffee maker", category: "Kitchen & dining" },
  { id: "dining-table", label: "Dining table", category: "Kitchen & dining" },
  { id: "bbq", label: "BBQ grill", category: "Kitchen & dining" },

  { id: "washer", label: "Washing machine", category: "Bathroom & laundry" },
  { id: "dryer", label: "Dryer", category: "Bathroom & laundry" },
  { id: "iron", label: "Iron", category: "Bathroom & laundry" },
  { id: "hair-dryer", label: "Hair dryer", category: "Bathroom & laundry" },
  { id: "bathtub", label: "Bathtub", category: "Bathroom & laundry" },
  { id: "bidet", label: "Bidet", category: "Bathroom & laundry" },

  { id: "workspace", label: "Dedicated workspace", category: "Comfort" },
  { id: "fireplace", label: "Fireplace", category: "Comfort" },
  { id: "ceiling-fan", label: "Ceiling fan", category: "Comfort" },
  { id: "blackout-blinds", label: "Blackout blinds", category: "Comfort" },
  { id: "room-darkening", label: "Room-darkening shades", category: "Comfort" },
  { id: "sound-system", label: "Sound system", category: "Comfort" },
  { id: "books", label: "Books & reading material", category: "Comfort" },

  { id: "crib", label: "Crib", category: "Work & family" },
  { id: "high-chair", label: "High chair", category: "Work & family" },
  { id: "travel-cot", label: "Travel cot", category: "Work & family" },
  { id: "children-books", label: "Children's books & toys", category: "Work & family" },
  { id: "pets-allowed", label: "Pets allowed", category: "Work & family" },
  { id: "long-stays", label: "Long-term stays allowed", category: "Work & family" },

  { id: "balcony", label: "Private balcony", category: "Outdoors & views" },
  { id: "patio", label: "Patio", category: "Outdoors & views" },
  { id: "backyard", label: "Backyard", category: "Outdoors & views" },
  { id: "garden-view", label: "Garden view", category: "Outdoors & views" },
  { id: "city-view", label: "City view", category: "Outdoors & views" },
  { id: "pool", label: "Pool", category: "Outdoors & views" },
  { id: "hot-tub", label: "Hot tub", category: "Outdoors & views" },
  { id: "outdoor-dining", label: "Outdoor dining area", category: "Outdoors & views" },

  { id: "smoke-alarm", label: "Smoke alarm", category: "Safety & access" },
  { id: "carbon-monoxide-alarm", label: "Carbon monoxide alarm", category: "Safety & access" },
  { id: "fire-extinguisher", label: "Fire extinguisher", category: "Safety & access" },
  { id: "first-aid-kit", label: "First aid kit", category: "Safety & access" },
  { id: "keypad-entry", label: "Keypad entry", category: "Safety & access" },
  { id: "step-free-access", label: "Step-free access", category: "Safety & access" },
  { id: "elevator", label: "Elevator access", category: "Safety & access" },

  { id: "parking", label: "Free parking", category: "Parking & services" },
  { id: "ev-charger", label: "EV charger", category: "Parking & services" },
  { id: "self-check-in", label: "Self check-in", category: "Parking & services" },
  { id: "cleaning-available", label: "Cleaning available", category: "Parking & services" },
] as const;

export function formatAmenityLabel(value: string): string {
  const matched = AMENITY_OPTIONS.find((item) => item.id === value);
  if (matched) return matched.label;

  return value
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getAmenityIcon(amenity: string): LucideIcon {
  switch (amenity) {
    case "wifi":
      return Wifi;
    case "tv":
    case "streaming":
      return Tv;
    case "air-conditioning":
      return Snowflake;
    case "heating":
    case "fireplace":
      return Heater;
    case "kitchen":
    case "microwave":
    case "fridge":
    case "freezer":
    case "dishwasher":
    case "oven":
    case "stove":
    case "coffee-maker":
    case "dining-table":
    case "bbq":
      return CookingPot;
    case "washer":
    case "dryer":
      return WashingMachine;
    case "hot-water":
    case "iron":
    case "hair-dryer":
    case "bathtub":
    case "bidet":
      return Bath;
    case "workspace":
      return BriefcaseBusiness;
    case "crib":
    case "high-chair":
    case "travel-cot":
    case "children-books":
    case "pets-allowed":
    case "long-stays":
      return Users;
    case "parking":
    case "ev-charger":
      return Car;
    case "smoke-alarm":
    case "carbon-monoxide-alarm":
    case "fire-extinguisher":
    case "first-aid-kit":
    case "keypad-entry":
    case "step-free-access":
    case "elevator":
    case "self-check-in":
      return ShieldCheck;
    case "ceiling-fan":
    case "blackout-blinds":
    case "room-darkening":
    case "sound-system":
    case "books":
      return BedDouble;
    default:
      return Home;
  }
}
