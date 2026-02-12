import { theme } from "@/constants/theme";

export type ActivityType = "message" | "call" | "status" | "notification";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: Date;
  icon: string;
  color: string;
}

// Re-export theme constants for backward compatibility
export const ACTIVITY_COLORS = theme.colors.activity;
export const ACTIVITY_ICONS = theme.activityIcons;
export const ITEM_HEIGHT = theme.layout.itemHeight;
export const MAX_ITEMS = theme.constants.maxItems;
