// app/dashboard/lib/dashboardData.ts

// 顶部统计 & 会员信息
export type DashboardSummary = {
  upcomingStays: number;
  listedHomes: number;
  pendingTasks: number;
  membershipStatus: string;
  membershipNote: string;
};

export type UpcomingStayStatus = "Confirmed" | "Pending review";

export type UpcomingStay = {
  id: number;
  city: string;
  country: string;
  dateRange: string;
  summary: string;
  status: UpcomingStayStatus;
};

export type HomeStatus = "Active" | "Draft";

export type HomeItem = {
  id: number;
  title: string;
  city: string;
  country: string;
  stayType: string;
  guests: number;
  status: HomeStatus;
  imageSrc: string;
};

export type TaskStatus = "Required" | "In progress" | "Recommended";

export type NextStepTask = {
  id: number;
  title: string;
  status: TaskStatus;
};

export const DASHBOARD_SUMMARY: DashboardSummary = {
  upcomingStays: 2,
  listedHomes: 2,
  pendingTasks: 3,
  membershipStatus: "Pre-launch beta member",
  membershipNote:
    "Access to curated community once vetting is complete.",
};

export const UPCOMING_STAYS: UpcomingStay[] = [
  {
    id: 1,
    city: "Lisbon",
    country: "Portugal",
    dateRange: "2026 Jan 10 – Feb 5",
    summary:
      "Modern apartment in the heart of the historic center. Close to all amenities and public transport.",
    status: "Confirmed",
  },
  {
    id: 2,
    city: "Amsterdam",
    country: "Netherlands",
    dateRange: "2026 Mar 1 – Mar 20",
    summary:
      "Canal-side home with a beautiful view, located in a quiet neighborhood.",
    status: "Pending review",
  },
];

export const DASHBOARD_HOMES: HomeItem[] = [
  {
    id: 1,
    title: "Penthouse with Sea View",
    city: "Lisbon",
    country: "Portugal",
    stayType: "Entire home",
    guests: 2,
    status: "Active",
    imageSrc: "/icon/cozy_home.jpg",
  },
  {
    id: 2,
    title: "Cozy Canal-side Loft",
    city: "Amsterdam",
    country: "Netherlands",
    stayType: "Apartment",
    guests: 4,
    status: "Draft",
    imageSrc: "/icon/cozy_home.jpg",
  },
];

export const NEXT_STEP_TASKS: NextStepTask[] = [
  {
    id: 1,
    title: "Complete ID verification",
    status: "Required",
  },
  {
    id: 2,
    title: "Upload home ownership proof for Lisbon home",
    status: "In progress",
  },
  {
    id: 3,
    title: "Add profile photo and short bio",
    status: "Recommended",
  },
];