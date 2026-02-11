import { activityCardStyles as styles } from "@/constants/styles";
import { ActivityItem } from "@/types/activity";
import { getRelativeTime } from "@/utils/activityGenerator";
import * as Haptics from "expo-haptics";
import React, { useMemo } from "react";
import { Platform, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  FadeInDown,
  LinearTransition,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { ActivityIcon } from "./ActivityIcon";

interface ActivityCardProps {
  item: ActivityItem;
  currentTime: number;
  onDismiss?: (id: string) => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = React.memo(
  ({ item, currentTime, onDismiss }) => {
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

    // const panGesture = Gesture.Pan()
    //   .activeOffsetX([-10, 10])
    //   .onUpdate((event) => {
    //     if (Platform.OS === "ios" && event.translationX < 0) {
    //       translateX.value = event.translationX;
    //       opacity.value = Math.max(0, 1 + event.translationX / 200);
    //     }
    //   })
    //   .onEnd((event) => {
    //     if (Platform.OS === "ios" && event.translationX < -100) {
    //       runOnJS(triggerHaptic)();
    //       runOnJS(handleDismiss)();
    //       translateX.value = withTiming(-400, { duration: 200 });
    //       opacity.value = withTiming(0, { duration: 200 });
    //     } else {
    //       translateX.value = withSpring(0);
    //       opacity.value = withSpring(1);
    //     }
    //   });

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

    return (
      <Animated.View
        // Entry animations only trigger when items are actually added to the list
        // This ensures animations only occur when app is active (not backgrounded)
        entering={FadeInDown.duration(400).springify()}
        // Faster layout transition for smoother gap filling on dismiss
        layout={LinearTransition.duration(250)}
        style={styles.container}
      >
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.card, animatedStyle]}>
            <ActivityIcon icon={item.icon} color={item.color} />

            <View style={styles.content}>
              <View style={styles.header}>
                <Text style={styles.title} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.timestamp}>{relativeTime}</Text>
              </View>

              <Text style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>
            </View>
          </Animated.View>
        </GestureDetector>
      </Animated.View>
    );
  },
);

ActivityCard.displayName = "ActivityCard";
