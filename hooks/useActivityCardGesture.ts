import { ActivityItem } from "@/components/types/activityItemType";
import { getRelativeTime } from "@/utils/activityGenerator";
import * as Haptics from "expo-haptics";
import { useMemo } from "react";
import { Platform } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface UseActivityCardGestureProps {
  item: ActivityItem;
  currentTime: number;
  onDismiss?: (id: string) => void;
}

export function useActivityCardGesture({
  item,
  currentTime,
  onDismiss,
}: UseActivityCardGestureProps) {
  // Calculate relative time from passed currentTime prop
  // No internal timer needed - performance optimization
  const relativeTime = getRelativeTime(item.timestamp, currentTime);

  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const triggerHaptic = () => {
    if (Platform.OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss(item.id);
    }
  };

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-10, 10])
        .onUpdate((event) => {
          // Only allow swipe left on iOS
          if (Platform.OS === "ios" && event.translationX < 0) {
            translateX.value = event.translationX;
            opacity.value = Math.max(0, 1 + event.translationX / 200);
          }
        })
        .onEnd((event) => {
          if (Platform.OS === "ios" && event.translationX < -100) {
            // Swipe threshold reached - dismiss immediately for faster UX
            runOnJS(triggerHaptic)();
            // Call dismiss right away so the list removes item and fills gap
            runOnJS(handleDismiss)();
            // Quick fade out animation
            translateX.value = withTiming(-400, { duration: 200 });
            opacity.value = withTiming(0, { duration: 200 });
          } else {
            // Snap back
            translateX.value = withSpring(0);
            opacity.value = withSpring(1);
          }
        }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [], // Empty dependencies - gesture created once and cached
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  return {
    relativeTime,
    panGesture,
    animatedStyle,
  };
}
