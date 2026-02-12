import "@testing-library/jest-native/extend-expect";

// Mock Expo Winter runtime
global.__ExpoImportMetaRegistry = {
  register: jest.fn(),
  get: jest.fn(),
};

// Mock structuredClone for Expo Winter
global.structuredClone = jest.fn((val) => JSON.parse(JSON.stringify(val)));

// Mock expo-haptics
jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: "light",
    Medium: "medium",
    Heavy: "heavy",
  },
  NotificationFeedbackType: {
    Success: "success",
    Warning: "warning",
    Error: "error",
  },
}));

// Mock react-native-reanimated
jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock react-native-gesture-handler
jest.mock("react-native-gesture-handler", () => {
  const View = require("react-native").View;
  const React = require("react");
  return {
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    ScrollView: View,
    Slider: View,
    Switch: View,
    TextInput: View,
    ToolbarAndroid: View,
    ViewPagerAndroid: View,
    DrawerLayoutAndroid: View,
    WebView: View,
    NativeViewGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    PanGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    RawButton: View,
    BaseButton: View,
    RectButton: View,
    BorderlessButton: View,
    FlatList: View,
    gestureHandlerRootHOC: jest.fn((Component) => Component),
    Directions: {},
    GestureDetector: View,
    Gesture: {
      Pan: () => ({
        activeOffsetX: jest.fn().mockReturnThis(),
        onUpdate: jest.fn().mockReturnThis(),
        onEnd: jest.fn().mockReturnThis(),
      }),
    },
    GestureHandlerRootView: ({ children }) =>
      React.createElement(View, null, children),
  };
});

// Mock Platform
jest.mock("react-native/Libraries/Utilities/Platform", () => ({
  OS: "ios",
  select: jest.fn((obj) => obj.ios),
}));

// Mock ToastAndroid
jest.mock(
  "react-native/Libraries/Components/ToastAndroid/ToastAndroid",
  () => ({
    show: jest.fn(),
    showWithGravity: jest.fn(),
    showWithGravityAndOffset: jest.fn(),
    SHORT: 0,
    LONG: 1,
    TOP: 0,
    BOTTOM: 1,
    CENTER: 2,
  }),
);

global.beforeEach(() => {
  jest.clearAllMocks();
});
