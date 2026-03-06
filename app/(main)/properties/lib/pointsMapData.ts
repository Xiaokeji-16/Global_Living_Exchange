// app/properties/lib/pointsMapData.ts

export type PointsBubble = {
  id: number;
  label: string;   // 显示内容：520 / 450 / Est.
  caption: string; // Hover 时显示的小提示文字
  top: string;
  left: string;
};

export const POINTS_BUBBLES: PointsBubble[] = [
  {
    id: 1,
    label: "520",
    caption: "Amsterdam · Cozy Canal-side Loft",
    top: "18%",
    left: "55%",
  },
  {
    id: 2,
    label: "450",
    caption: "Lisbon · Penthouse with Sea View",
    top: "45%",
    left: "40%",
  },
  {
    id: 3,
    label: "800",
    caption: "Bali · Beachfront Villa Retreat",
    top: "42%",
    left: "70%",
  },
  {
    id: 4,
    label: "620",
    caption: "Sample · Long-stay home",
    top: "65%",
    left: "60%",
  },
  {
    id: 5,
    label: "Est.",
    caption: "Est. · Estimated points coming soon",
    top: "75%",
    left: "30%",
  },
];