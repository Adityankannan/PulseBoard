import { ITEM_HEIGHT } from "@/components/types/activityItemType";
import { StyleSheet } from "react-native";
import { theme } from "./theme";

export const activityIconStyles = StyleSheet.create({
  iconContainer: {
    width: theme.layout.iconSize.md,
    height: theme.layout.iconSize.md,
    borderRadius: theme.borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
});

export const activityCardStyles = StyleSheet.create({
  container: {
    height: ITEM_HEIGHT,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  card: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    ...theme.shadows.card,
  },
  content: {
    flex: 1,
    marginLeft: theme.spacing.md,
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  title: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    flex: 1,
  },
  timestamp: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
    marginLeft: theme.spacing.sm,
  },
  description: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeight.sm,
  },
});

export const homeScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  header: {
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  badge: {
    backgroundColor: theme.colors.badge,
    borderRadius: theme.borderRadius.sm,
    minWidth: theme.layout.badge.minWidth,
    height: theme.layout.badge.height,
    paddingHorizontal: theme.spacing.sm,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: theme.spacing.md,
  },
  badgeText: {
    color: theme.colors.text.white,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
  },
  pendingText: {
    color: theme.colors.badge,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  headerSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  hint: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
    fontStyle: "italic",
  },
  listContent: {
    paddingVertical: theme.spacing.sm,
  },
});
