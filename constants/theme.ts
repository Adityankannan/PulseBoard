// Theme configuration for PulseBoard
export const theme = {
  // Color palette
  colors: {
    // Activity type colors
    activity: {
      message: "#4A90E2",
      call: "#50C878",
      status: "#F5A623",
      notification: "#9B59B6",
    },

    // Background colors
    background: {
      primary: "#F5F7FA",
      secondary: "#FFFFFF",
    },

    // Text colors
    text: {
      primary: "#1A1A1A",
      secondary: "#666",
      tertiary: "#999",
      white: "#FFFFFF",
    },

    // UI element colors
    border: "#E0E0E0",
    shadow: "#000",
    badge: "#FF3B30",
  },

  // Spacing scale
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 60,
  },

  // Border radius scale
  borderRadius: {
    sm: 12,
    md: 24,
  },

  // Typography
  typography: {
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 28,
    },
    fontWeight: {
      normal: "400" as const,
      semibold: "600" as const,
      bold: "bold" as const,
    },
    lineHeight: {
      sm: 18,
    },
  },

  // Shadows
  shadows: {
    card: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
  },

  // Layout constants
  layout: {
    itemHeight: 88,
    iconSize: {
      sm: 24,
      md: 48,
    },
    badge: {
      minWidth: 24,
      height: 24,
    },
  },

  // Activity icons mapping
  activityIcons: {
    message: "chatbubble",
    call: "call",
    status: "information-circle",
    notification: "notifications",
  } as const,

  // App constants
  constants: {
    maxItems: 100,
  },
} as const;

export type Theme = typeof theme;
