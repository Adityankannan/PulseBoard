# PulseBoard - Real-Time Activity Feed

A performant React Native application built with Expo that simulates a real-time activity feed with platform-specific interactions and optimizations.

## 🚀 Features

- **Real-time Activity Feed**: Simulates live notifications with 3-5 second intervals
- **Background Queue Management**: Activities are queued when app is backgrounded and batch-added on foreground
- **Platform-Specific Interactions**:
  - iOS: Swipe-left-to-dismiss with haptic feedback
  - Android: Native toast notifications
- **Performance Optimized**: FlatList virtualization, memoization, and Reanimated for 60fps animations
- **Custom Hooks Architecture**: Separation of concerns with business logic in hooks
- **Comprehensive Test Suite**: 97 passing tests with Jest and React Native Testing Library

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (macOS) or Android Emulator

## 🛠️ Get Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the development server**

   ```bash
   npx expo start
   ```

3. **Run on your device**

   In the output, you'll find options to open the app in:
   - [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
   - [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
   - [Expo Go](https://expo.dev/go)

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Run tests with coverage:

```bash
npm test -- --coverage
```

## 🏗️ Project Structure

```
PulseBoard/
├── app/
│   ├── (tabs)/
│   │   └── index.tsx          # Main home screen (presentation layer)
│   └── index.tsx              # App entry point
├── components/
│   ├── ActivityCard.tsx        # Individual activity card component
│   ├── ActivityIcon.tsx        # Activity type icon component
│   └── types/
│       └── activityItemType.ts # TypeScript types
├── hooks/
│   ├── useActivityFeed.ts      # Activity feed state & logic
│   └── useActivityCardGesture.ts # Swipe gesture logic (⚠️ see Memory Bug section)
├── constants/
│   ├── appConstants.ts         # App-wide configuration constants
│   ├── theme.ts                # Theme colors, spacing, typography
│   └── styles.ts               # StyleSheet definitions
├── utils/
│   └── activityGenerator.ts    # Activity data generation utilities
└── __tests__/                  # Test files
```

## ⚠️ Memory Bug & Resolution

### The Problem

In `hooks/useActivityCardGesture.ts`, we discovered a critical memory leak when gesture objects were created without memoization.

**Non-Memoized Version (❌ CAUSES MEMORY LEAK):**

```typescript
const panGesture = Gesture.Pan()
  .activeOffsetX([-10, 10])
  .onUpdate((event) => {
    // ... gesture logic
  })
  .onEnd((event) => {
    // ... gesture logic
  });
```

**Issues with this approach:**

1. **Memory Leak**: Gesture object recreated on every component render
2. **Performance Degradation**: With 15-100 activity cards, creates 15-100 new gesture objects every render
3. **Excessive Garbage Collection**: Old gesture objects accumulate, forcing GC to work overtime
4. **Potential State Loss**: Gesture might lose state mid-swipe during re-renders

**When does re-rendering occur?**

- Every 10 seconds (when `currentTime` updates for timestamp refreshes)
- When new activities are added to the feed
- When activities are dismissed
- During list scrolling

### The Solution

**Memoized Version (✅ OPTIMIZED):**

```typescript
const panGesture = useMemo(
  () =>
    Gesture.Pan()
      .activeOffsetX([-10, 10])
      .onUpdate((event) => {
        // ... gesture logic
      })
      .onEnd((event) => {
        // ... gesture logic
      }),
  [], // Empty dependency array - create once and cache
);
```

**Benefits:**

1. **No Memory Leak**: Gesture created once per card instance
2. **Improved Performance**: Eliminates unnecessary recreations
3. **Consistent Behavior**: Gesture maintains state throughout component lifetime
4. **Reduced CPU Usage**: Less work for garbage collector

**Performance Impact:**

| Metric                                         | Without useMemo    | With useMemo          |
| ---------------------------------------------- | ------------------ | --------------------- |
| Gesture objects created (15 cards, 10s render) | ~150 objects       | 15 objects (one-time) |
| Memory overhead                                | High (accumulates) | Low (constant)        |
| Frame drops                                    | Noticeable         | Smooth 60fps          |

### Key Takeaway

Always use `useMemo` for expensive object creations in React components, especially when:

- The object is used in render
- The component renders frequently
- The object construction is expensive
- Multiple instances exist (list items)

See `hooks/useActivityCardGesture.ts` for both implementations (memoized active, non-memoized commented out for reference).

## 🎨 Architecture Highlights

### Custom Hooks Pattern

Business logic separated into reusable hooks:

- `useActivityFeed`: Manages activity state, real-time updates, app state transitions
- `useActivityCardGesture`: Handles swipe gestures and animations

### Performance Optimizations

1. **FlatList Configuration**:
   - `maxToRenderPerBatch={10}`: Batch rendering for smooth scrolling
   - `windowSize={10}`: Optimize memory with viewport limiting
   - `removeClippedSubviews={true}`: Unmount off-screen components
   - `getItemLayout`: Pre-calculated heights for instant scrolling

2. **Reanimated 2**: All animations run on UI thread at 60fps
3. **React.memo**: Components memoized to prevent unnecessary re-renders
4. **useMemo/useCallback**: Stable references for functions and objects

## 📱 Platform-Specific Features

### iOS

- Swipe-left-to-dismiss gesture
- Haptic feedback (light/medium impact, success patterns)
- Smooth spring animations

### Android

- Native toast notifications
- Material Design ripple effects

## 🔧 Configuration

All app constants are centralized in `constants/appConstants.ts`:

```typescript
APP_CONSTANTS = {
  ACTIVITY_FEED: {
    INITIAL_ACTIVITIES_COUNT: 15,
    TIME_UPDATE_INTERVAL_MS: 10000,
  },
  GESTURE: {
    SWIPE_THRESHOLD_PX: -100,
    SWIPE_DISMISS_TRANSLATION_PX: -400,
  },
  ANIMATION: {
    FADE_IN_DURATION_MS: 400,
    DISMISS_DURATION_MS: 200,
  },
  // ... more constants
};
```

## 📦 Dependencies

- **expo**: ~54.0.33
- **react-native**: 0.81.5
- **react-native-reanimated**: ~3.17.6
- **react-native-gesture-handler**: ~2.22.1
- **expo-haptics**: ~14.0.1

## 🚢 CI/CD

GitHub Actions workflows for automated builds:

- **Android**: Gradle builds (debug/release)
  See `.github/workflows/` for configuration.
