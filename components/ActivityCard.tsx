import { ActivityItem } from "@/components/types/activityItemType";
import { APP_CONSTANTS } from "@/constants/appConstants";
import { activityCardStyles as styles } from "@/constants/styles";
import { useActivityCardGesture } from "@/hooks/useActivityCardGesture";
import React from "react";
import { Text, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, {
  FadeInDown,
  LinearTransition,
} from "react-native-reanimated";
import { ActivityIcon } from "./ActivityIcon";

interface ActivityCardProps {
  item: ActivityItem;
  currentTime: number;
  onDismiss?: (id: string) => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = React.memo(
  ({ item, currentTime, onDismiss }) => {
    const { relativeTime, panGesture, animatedStyle } = useActivityCardGesture({
      item,
      currentTime,
      onDismiss,
    });

    return (
      <Animated.View
        // Entry animations only trigger when items are actually added to the list
        // This ensures animations only occur when app is active (not backgrounded)
        entering={FadeInDown.duration(
          APP_CONSTANTS.ANIMATION.FADE_IN_DURATION_MS,
        ).springify()}
        // Faster layout transition for smoother gap filling on dismiss
        layout={LinearTransition.duration(
          APP_CONSTANTS.ANIMATION.LAYOUT_TRANSITION_DURATION_MS,
        )}
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
