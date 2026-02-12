import {
  ActivityItem,
  ITEM_HEIGHT,
  MAX_ITEMS,
} from "@/components/types/activityItemType";
import { APP_CONSTANTS } from "@/constants/appConstants";
import {
  generateInitialActivities,
  generateRandomActivity,
} from "@/utils/activityGenerator";
import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus, Platform, ToastAndroid } from "react-native";

export function useActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [pendingCount, setPendingCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const queuedActivities = useRef<ActivityItem[]>([]);

  // Initialize with some activities
  useEffect(() => {
    setActivities(
      generateInitialActivities(
        APP_CONSTANTS.ACTIVITY_FEED.INITIAL_ACTIVITIES_COUNT,
      ),
    );
  }, []);

  // Update current time every 10 seconds for relative timestamps
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, APP_CONSTANTS.ACTIVITY_FEED.TIME_UPDATE_INTERVAL_MS);

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
              }, index * APP_CONSTANTS.ACTIVITY_FEED.ACTIVITY_STAGGER_DELAY_MS);
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
      const randomDelay =
        Math.random() * APP_CONSTANTS.EVENT_TIMING.MAX_RANDOM_DELAY_RANGE_MS +
        APP_CONSTANTS.EVENT_TIMING.MIN_RANDOM_DELAY_MS;

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
      return { item, currentTime };
    },
    [currentTime],
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

  return {
    activities,
    currentTime,
    pendingCount,
    handleDismiss,
    renderItem,
    keyExtractor,
    getItemLayout,
  };
}
