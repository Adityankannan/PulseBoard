import { render } from "@testing-library/react-native";
import React from "react";
import HomeScreen from "../HomeScreen";

// Mock Date.now() for consistent snapshots
const MOCK_NOW = 1609459200000; // 2021-01-01 00:00:00
global.Date.now = jest.fn(() => MOCK_NOW);

// Mock dependencies
jest.mock("@/components/ActivityCard", () => ({
  ActivityCard: () => null,
}));

jest.mock("@/utils/activityGenerator", () => ({
  generateInitialActivities: jest.fn(() =>
    Array.from({ length: 15 }, (_, i) => ({
      id: `activity-${i}`,
      type: "message",
      title: `Activity ${i}`,
      description: `Description ${i}`,
      timestamp: new Date(1609459200000),
      icon: "chatbubble",
      color: "#4A90E2",
    })),
  ),
  generateRandomActivity: jest.fn(() => ({
    id: "new-activity",
    type: "call",
    title: "New Activity",
    description: "New Description",
    timestamp: new Date(1609459200000),
    icon: "call",
    color: "#50C878",
  })),
  getRelativeTime: jest.fn(() => "5m ago"),
}));

describe("HomeScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render without crashing", () => {
      const { getByText } = render(<HomeScreen />);
      expect(getByText("PulseBoard")).toBeTruthy();
    });

    it("should display the header title", () => {
      const { getByText } = render(<HomeScreen />);
      expect(getByText("PulseBoard")).toBeTruthy();
    });

    it("should display activity count", () => {
      const { getByText } = render(<HomeScreen />);
      expect(getByText(/activities/)).toBeTruthy();
    });
  });

  describe("Initial Data Loading", () => {
    it("should load initial activities on mount", () => {
      const {
        generateInitialActivities,
        // eslint-disable-next-line @typescript-eslint/no-require-imports
      } = require("@/utils/activityGenerator");
      render(<HomeScreen />);
      expect(generateInitialActivities).toHaveBeenCalledWith(15);
    });
  });

  describe("Snapshots", () => {
    it("should match snapshot", () => {
      const { toJSON } = render(<HomeScreen />);
      expect(toJSON()).toMatchSnapshot();
    });
  });
});
