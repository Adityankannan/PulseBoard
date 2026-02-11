import {
  ACTIVITY_COLORS,
  ACTIVITY_ICONS,
  ActivityItem,
  ActivityType,
  ITEM_HEIGHT,
  MAX_ITEMS,
} from "../activity";

describe("activity types", () => {
  describe("ACTIVITY_COLORS", () => {
    it("should have correct color for message type", () => {
      expect(ACTIVITY_COLORS.message).toBe("#4A90E2");
    });

    it("should have correct color for call type", () => {
      expect(ACTIVITY_COLORS.call).toBe("#50C878");
    });

    it("should have correct color for status type", () => {
      expect(ACTIVITY_COLORS.status).toBe("#F5A623");
    });

    it("should have correct color for notification type", () => {
      expect(ACTIVITY_COLORS.notification).toBe("#9B59B6");
    });

    it("should have all activity types defined", () => {
      expect(Object.keys(ACTIVITY_COLORS)).toEqual([
        "message",
        "call",
        "status",
        "notification",
      ]);
    });
  });

  describe("ACTIVITY_ICONS", () => {
    it("should have correct icon for message type", () => {
      expect(ACTIVITY_ICONS.message).toBe("chatbubble");
    });

    it("should have correct icon for call type", () => {
      expect(ACTIVITY_ICONS.call).toBe("call");
    });

    it("should have correct icon for status type", () => {
      expect(ACTIVITY_ICONS.status).toBe("information-circle");
    });

    it("should have correct icon for notification type", () => {
      expect(ACTIVITY_ICONS.notification).toBe("notifications");
    });

    it("should have all activity types defined", () => {
      expect(Object.keys(ACTIVITY_ICONS)).toEqual([
        "message",
        "call",
        "status",
        "notification",
      ]);
    });
  });

  describe("Constants", () => {
    it("should have correct ITEM_HEIGHT", () => {
      expect(ITEM_HEIGHT).toBe(88);
    });

    it("should have correct MAX_ITEMS", () => {
      expect(MAX_ITEMS).toBe(100);
    });
  });

  describe("ActivityType", () => {
    it("should accept valid activity types", () => {
      const validTypes: ActivityType[] = [
        "message",
        "call",
        "status",
        "notification",
      ];

      validTypes.forEach((type) => {
        expect(["message", "call", "status", "notification"]).toContain(type);
      });
    });
  });

  describe("ActivityItem Interface", () => {
    it("should create valid ActivityItem", () => {
      const activity: ActivityItem = {
        id: "test-1",
        type: "message",
        title: "Test Title",
        description: "Test Description",
        timestamp: new Date(),
        icon: "chatbubble",
        color: "#4A90E2",
      };

      expect(activity.id).toBe("test-1");
      expect(activity.type).toBe("message");
      expect(activity.title).toBe("Test Title");
      expect(activity.description).toBe("Test Description");
      expect(activity.timestamp).toBeInstanceOf(Date);
      expect(activity.icon).toBe("chatbubble");
      expect(activity.color).toBe("#4A90E2");
    });

    it("should validate all activity types", () => {
      const types: ActivityType[] = [
        "message",
        "call",
        "status",
        "notification",
      ];

      types.forEach((type) => {
        const activity: ActivityItem = {
          id: `test-${type}`,
          type,
          title: "Test",
          description: "Test",
          timestamp: new Date(),
          icon: ACTIVITY_ICONS[type],
          color: ACTIVITY_COLORS[type],
        };

        expect(activity.type).toBe(type);
        expect(ACTIVITY_COLORS[type]).toBeDefined();
        expect(ACTIVITY_ICONS[type]).toBeDefined();
      });
    });
  });

  describe("Color-Icon Mapping", () => {
    it("should have matching keys in ACTIVITY_COLORS and ACTIVITY_ICONS", () => {
      const colorKeys = Object.keys(ACTIVITY_COLORS);
      const iconKeys = Object.keys(ACTIVITY_ICONS);

      expect(colorKeys).toEqual(iconKeys);
    });

    it("should have valid hex colors", () => {
      Object.values(ACTIVITY_COLORS).forEach((color) => {
        expect(color).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });

    it("should have non-empty icon names", () => {
      Object.values(ACTIVITY_ICONS).forEach((icon) => {
        expect(icon).toBeTruthy();
        expect(icon.length).toBeGreaterThan(0);
      });
    });
  });
});
