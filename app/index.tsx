import { ActivityCard } from "@/components/ActivityCard";
import { ActivityItem } from "@/components/types/activityItemType";
import { homeScreenStyles as styles } from "@/constants/styles";
import { useActivityFeed } from "@/hooks/useActivityFeed";
import React from "react";
import { FlatList, Platform, StatusBar, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

export default function HomeScreen() {
  const {
    activities,
    currentTime,
    pendingCount,
    handleDismiss,
    keyExtractor,
    getItemLayout,
  } = useActivityFeed();

  const renderItem = ({ item }: { item: ActivityItem }) => {
    return (
      <ActivityCard
        item={item}
        currentTime={currentTime}
        onDismiss={handleDismiss}
      />
    );
  };

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
