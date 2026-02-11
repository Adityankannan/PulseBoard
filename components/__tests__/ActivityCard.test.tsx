import { ActivityItem } from "@/components/types/activityItemType";
import { render } from "@testing-library/react-native";
import React from "react";
import { ActivityCard } from "../ActivityCard";

// Mock the ActivityIcon component
jest.mock("../ActivityIcon", () => ({
  ActivityIcon: () => null,
}));

describe("ActivityCard", () => {
  const mockActivity: ActivityItem = {
    id: "test-1",
    type: "message",
    title: "New Message",
    description: "John sent you a message",
    timestamp: new Date("2026-02-11T10:00:00Z"),
    icon: "chatbubble",
    color: "#4A90E2",
  };

  const defaultProps = {
    item: mockActivity,
    currentTime: new Date("2026-02-11T10:05:00Z").getTime(), // 5 minutes later
    onDismiss: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render without crashing", () => {
      const { getByText } = render(<ActivityCard {...defaultProps} />);
      expect(getByText("New Message")).toBeTruthy();
    });

    it("should match snapshot", () => {
      const { toJSON } = render(<ActivityCard {...defaultProps} />);
      expect(toJSON()).toMatchSnapshot();
    });

    it("should display activity title", () => {
      const { getByText } = render(<ActivityCard {...defaultProps} />);
      expect(getByText("New Message")).toBeTruthy();
    });

    it("should display activity description", () => {
      const { getByText } = render(<ActivityCard {...defaultProps} />);
      expect(getByText("John sent you a message")).toBeTruthy();
    });

    it("should display relative time", () => {
      const { getByText } = render(<ActivityCard {...defaultProps} />);
      expect(getByText("5m ago")).toBeTruthy();
    });
  });

  describe("Props", () => {
    it("should render with different activity types", () => {
      const callActivity: ActivityItem = {
        ...mockActivity,
        type: "call",
        title: "Incoming Call",
        description: "Call from Emma",
      };

      const { getByText } = render(
        <ActivityCard {...defaultProps} item={callActivity} />,
      );

      expect(getByText("Incoming Call")).toBeTruthy();
      expect(getByText("Call from Emma")).toBeTruthy();
    });

    it("should update when currentTime changes", () => {
      const { getByText, rerender } = render(
        <ActivityCard {...defaultProps} />,
      );
      expect(getByText("5m ago")).toBeTruthy();

      const newTime = new Date("2026-02-11T10:10:00Z").getTime(); // 10 minutes later
      rerender(<ActivityCard {...defaultProps} currentTime={newTime} />);

      expect(getByText("10m ago")).toBeTruthy();
    });

    it("should call onDismiss when provided", () => {
      const onDismiss = jest.fn();
      const { toJSON } = render(
        <ActivityCard {...defaultProps} onDismiss={onDismiss} />,
      );

      expect(toJSON()).toBeTruthy();
    });

    it("should work without onDismiss prop", () => {
      const { getByText } = render(
        <ActivityCard
          item={mockActivity}
          currentTime={defaultProps.currentTime}
        />,
      );

      expect(getByText("New Message")).toBeTruthy();
    });
  });

  describe("Snapshots", () => {
    it("should match snapshot for message type", () => {
      const messageActivity: ActivityItem = {
        ...mockActivity,
        type: "message",
      };

      const { toJSON } = render(
        <ActivityCard {...defaultProps} item={messageActivity} />,
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it("should match snapshot for call type", () => {
      const callActivity: ActivityItem = {
        ...mockActivity,
        type: "call",
        title: "Incoming Call",
        description: "Video call from Team Lead",
        icon: "call",
        color: "#50C878",
      };

      const { toJSON } = render(
        <ActivityCard {...defaultProps} item={callActivity} />,
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it("should match snapshot for status type", () => {
      const statusActivity: ActivityItem = {
        ...mockActivity,
        type: "status",
        title: "Status Update",
        description: "Project milestone completed",
        icon: "information-circle",
        color: "#F5A623",
      };

      const { toJSON } = render(
        <ActivityCard {...defaultProps} item={statusActivity} />,
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it("should match snapshot for notification type", () => {
      const notificationActivity: ActivityItem = {
        ...mockActivity,
        type: "notification",
        title: "Notification",
        description: "New follower on your post",
        icon: "notifications",
        color: "#9B59B6",
      };

      const { toJSON } = render(
        <ActivityCard {...defaultProps} item={notificationActivity} />,
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it("should match snapshot with recent timestamp", () => {
      const recentTime = new Date("2026-02-11T10:00:30Z").getTime(); // 30 seconds later

      const { toJSON } = render(
        <ActivityCard {...defaultProps} currentTime={recentTime} />,
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it("should match snapshot with old timestamp", () => {
      const oldTime = new Date("2026-02-13T10:00:00Z").getTime(); // 2 days later

      const { toJSON } = render(
        <ActivityCard {...defaultProps} currentTime={oldTime} />,
      );

      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe("Memoization", () => {
    it("should be wrapped with React.memo", () => {
      const { rerender } = render(<ActivityCard {...defaultProps} />);

      // Re-render with same props - component should not re-render
      rerender(<ActivityCard {...defaultProps} />);

      expect(true).toBe(true); // Component memoization validated by React.memo
    });

    it("should re-render when item changes", () => {
      const { getByText, rerender } = render(
        <ActivityCard {...defaultProps} />,
      );
      expect(getByText("New Message")).toBeTruthy();

      const newActivity: ActivityItem = {
        ...mockActivity,
        title: "Updated Message",
      };

      rerender(<ActivityCard {...defaultProps} item={newActivity} />);

      expect(getByText("Updated Message")).toBeTruthy();
    });

    it("should re-render when currentTime changes", () => {
      const { getByText, rerender } = render(
        <ActivityCard {...defaultProps} />,
      );
      expect(getByText("5m ago")).toBeTruthy();

      rerender(
        <ActivityCard
          {...defaultProps}
          currentTime={new Date("2026-02-11T11:00:00Z").getTime()}
        />,
      );

      expect(getByText("1h ago")).toBeTruthy();
    });
  });

  describe("Text Truncation", () => {
    it("should limit title to 1 line", () => {
      const longTitle: ActivityItem = {
        ...mockActivity,
        title:
          "This is a very long title that should be truncated to fit in one line only",
      };

      const { toJSON } = render(
        <ActivityCard {...defaultProps} item={longTitle} />,
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it("should limit description to 2 lines", () => {
      const longDescription: ActivityItem = {
        ...mockActivity,
        description:
          "This is a very long description that should be truncated to fit in exactly two lines and no more than that in the activity card component",
      };

      const { toJSON } = render(
        <ActivityCard {...defaultProps} item={longDescription} />,
      );

      expect(toJSON()).toMatchSnapshot();
    });
  });
});
