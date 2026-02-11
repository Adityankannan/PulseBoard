import { ActivityCard } from "@/components/ActivityCard";
import { homeScreenStyles as styles } from "@/constants/styles";
import { ActivityItem, ITEM_HEIGHT, MAX_ITEMS } from "@/types/activity";
import {
  generateInitialActivities,
  generateRandomActivity,
} from "@/utils/activityGenerator";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  AppState,
  AppStateStatus,
  FlatList,
  Platform,
  StatusBar,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

export default function HomeScreen() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [pendingCount, setPendingCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const queuedActivities = useRef<ActivityItem[]>([]);

  // Initialize with some activities
  useEffect(() => {
    setActivities(generateInitialActivities(15));
  }, []);

  // Update current time every 10 seconds for relative timestamps
  // Single timer instead of one per card (better performance)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  // Handle app state changes (background/foreground)
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        // App came to foreground
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          // Add queued activities with animation
          if (queuedActivities.current.length > 0) {
            const queued = [...queuedActivities.current];
            queuedActivities.current = [];
            setPendingCount(0);

            // Add queued activities one by one with slight delay for stagger effect
            queued.reverse().forEach((activity, index) => {
              setTimeout(() => {
                setActivities((prev) => {
                  const updated = [activity, ...prev];
                  return updated.slice(0, MAX_ITEMS);
                });

                // Haptic feedback for first item
                if (index === 0 && Platform.OS === "ios") {
                  Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Success,
                  );
                }
              }, index * 100); // Stagger by 100ms
            });

            setCurrentTime(Date.now());
          }
        }

        appState.current = nextAppState;
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);

  // Simulate real-time push notification events using timers
  // Events are queued when backgrounded and batch-added when foregrounded
  useEffect(() => {
    const startInterval = () => {
      // Random interval between 3-5 seconds
      const randomDelay = Math.random() * 2000 + 3000;

      intervalRef.current = setTimeout(() => {
        const newActivity = generateRandomActivity();

        // Check if app is in foreground or background
        const isActive = appState.current === "active";

        if (isActive) {
          // App is active - add immediately with animation
          setActivities((prev) => {
            const updated = [newActivity, ...prev];
            // Keep only the latest MAX_ITEMS
            return updated.slice(0, MAX_ITEMS);
          });

          // Update currentTime immediately when adding new activity for accurate timestamps
          setCurrentTime(Date.now());

          // Platform-specific feedback for new activity
          if (Platform.OS === "ios") {
            // iOS: Provide haptic feedback
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          } else if (Platform.OS === "android") {
            // Android: Show native toast notification
            ToastAndroid.show(
              `New ${newActivity.type}: ${newActivity.title}`,
              ToastAndroid.SHORT,
            );
          }
        } else {
          // App is backgrounded - queue the activity
          queuedActivities.current.push(newActivity);
          setPendingCount(queuedActivities.current.length);

          // Platform-specific background notification
          if (Platform.OS === "android") {
            // Android can show toast even in background
            ToastAndroid.show(
              `${queuedActivities.current.length} pending updates`,
              ToastAndroid.SHORT,
            );
          }
        }

        // Schedule next update
        startInterval();
      }, randomDelay);
    };

    startInterval();

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, []);

  const handleDismiss = useCallback((id: string) => {
    setActivities((prev) => prev.filter((activity) => activity.id !== id));
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: ActivityItem }) => {
      return (
        <ActivityCard
          item={item}
          currentTime={currentTime}
          onDismiss={handleDismiss}
        />
      );
    },
    [currentTime, handleDismiss],
  );

  const keyExtractor = useCallback((item: ActivityItem) => item.id, []);

  const getItemLayout = useCallback(
    (_data: ArrayLike<ActivityItem> | null | undefined, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    [],
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />

        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>PulseBoard</Text>
            {pendingCount > 0 && (
              <Animated.View
                entering={FadeIn.duration(300)}
                exiting={FadeOut.duration(300)}
                style={styles.badge}
              >
                <Text style={styles.badgeText}>{pendingCount}</Text>
              </Animated.View>
            )}
          </View>
          <Text style={styles.headerSubtitle}>
            {`${activities.length}   `}
            {activities.length === 1 ? "activity" : "activities"}
            {pendingCount > 0 && (
              <Text style={styles.pendingText}> • {pendingCount} pending</Text>
            )}
            {Platform.OS === "ios" && pendingCount === 0 && (
              <Text style={styles.hint}> • Swipe left to dismiss</Text>
            )}
          </Text>
        </View>

        <FlatList
          data={activities}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews={true}
          initialNumToRender={15}
          updateCellsBatchingPeriod={50}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </GestureHandlerRootView>
  );
}
