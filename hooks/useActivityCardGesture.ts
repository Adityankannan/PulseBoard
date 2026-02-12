import { ActivityItem } from "@/components/types/activityItemType";
import { APP_CONSTANTS } from "@/constants/appConstants";
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

  const translateX = useSharedValue(APP_CONSTANTS.OPACITY.MIN);
  const opacity = useSharedValue(APP_CONSTANTS.OPACITY.MAX);

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

  // This version recreates the gesture object on every render, causing:
  // - Memory leaks (gesture objects not properly cleaned up)
  // - Performance degradation (creating 15-100 gestures per render)
  // - Potential gesture state loss mid-swipe
  // const panGesture = Gesture.Pan()
  //   .activeOffsetX([
  //     APP_CONSTANTS.GESTURE.ACTIVE_OFFSET_X_MIN,
  //     APP_CONSTANTS.GESTURE.ACTIVE_OFFSET_X_MAX,
  //   ])
  //   .onUpdate((event) => {
  //     if (Platform.OS === "ios" && event.translationX < 0) {
  //       translateX.value = event.translationX;
  //       opacity.value = Math.max(
  //         APP_CONSTANTS.OPACITY.MIN,
  //         APP_CONSTANTS.OPACITY.MAX +
  //           event.translationX /
  //             APP_CONSTANTS.GESTURE.OPACITY_CALCULATION_DIVISOR,
  //       );
  //     }
  //   })
  //   .onEnd((event) => {
  //     if (
  //       Platform.OS === "ios" &&
  //       event.translationX < APP_CONSTANTS.GESTURE.SWIPE_THRESHOLD_PX
  //     ) {
  //       runOnJS(triggerHaptic)();
  //       runOnJS(handleDismiss)();
  //       translateX.value = withTiming(
  //         APP_CONSTANTS.GESTURE.SWIPE_DISMISS_TRANSLATION_PX,
  //         { duration: APP_CONSTANTS.ANIMATION.DISMISS_DURATION_MS },
  //       );
  //       opacity.value = withTiming(APP_CONSTANTS.OPACITY.MIN, {
  //         duration: APP_CONSTANTS.ANIMATION.DISMISS_DURATION_MS,
  //       });
  //     } else {
  //       translateX.value = withSpring(APP_CONSTANTS.OPACITY.MIN);
  //       opacity.value = withSpring(APP_CONSTANTS.OPACITY.MAX);
  //     }
  //   });

  // useMemo ensures the gesture is created once and cached for the component's lifetime
  // This prevents recreation on every render, improving performance and preventing memory leaks
  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([
          APP_CONSTANTS.GESTURE.ACTIVE_OFFSET_X_MIN,
          APP_CONSTANTS.GESTURE.ACTIVE_OFFSET_X_MAX,
        ])
        .onUpdate((event) => {
          if (Platform.OS === "ios" && event.translationX < 0) {
            translateX.value = event.translationX;
            opacity.value = Math.max(
              APP_CONSTANTS.OPACITY.MIN,
              APP_CONSTANTS.OPACITY.MAX +
                event.translationX /
                  APP_CONSTANTS.GESTURE.OPACITY_CALCULATION_DIVISOR,
            );
          }
        })
        .onEnd((event) => {
          if (
            Platform.OS === "ios" &&
            event.translationX < APP_CONSTANTS.GESTURE.SWIPE_THRESHOLD_PX
          ) {
            runOnJS(triggerHaptic)();
            runOnJS(handleDismiss)();
            translateX.value = withTiming(
              APP_CONSTANTS.GESTURE.SWIPE_DISMISS_TRANSLATION_PX,
              { duration: APP_CONSTANTS.ANIMATION.DISMISS_DURATION_MS },
            );
            opacity.value = withTiming(APP_CONSTANTS.OPACITY.MIN, {
              duration: APP_CONSTANTS.ANIMATION.DISMISS_DURATION_MS,
            });
          } else {
            translateX.value = withSpring(APP_CONSTANTS.OPACITY.MIN);
            opacity.value = withSpring(APP_CONSTANTS.OPACITY.MAX);
          }
        }),
    [],
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
