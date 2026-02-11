import { ACTIVITY_COLORS, ACTIVITY_ICONS } from "@/types/activity";
import {
  generateInitialActivities,
  generateRandomActivity,
  getRelativeTime,
} from "../activityGenerator";

describe("activityGenerator", () => {
  describe("generateRandomActivity", () => {
    it("should generate a valid activity item", () => {
      const activity = generateRandomActivity();

      expect(activity).toHaveProperty("id");
      expect(activity).toHaveProperty("type");
      expect(activity).toHaveProperty("title");
      expect(activity).toHaveProperty("description");
      expect(activity).toHaveProperty("timestamp");
      expect(activity).toHaveProperty("icon");
      expect(activity).toHaveProperty("color");
    });

    it("should generate unique IDs for each activity", () => {
      const activity1 = generateRandomActivity();
      const activity2 = generateRandomActivity();

      expect(activity1.id).not.toBe(activity2.id);
    });

    it("should generate valid activity types", () => {
      const validTypes = ["message", "call", "status", "notification"];
      const activity = generateRandomActivity();

      expect(validTypes).toContain(activity.type);
    });

    it("should have matching color for activity type", () => {
      const activity = generateRandomActivity();
      expect(activity.color).toBe(ACTIVITY_COLORS[activity.type]);
    });

    it("should have matching icon for activity type", () => {
      const activity = generateRandomActivity();
      expect(activity.icon).toBe(ACTIVITY_ICONS[activity.type]);
    });

    it("should have a timestamp of type Date", () => {
      const activity = generateRandomActivity();
      expect(activity.timestamp).toBeInstanceOf(Date);
    });

    it("should have a non-empty title", () => {
      const activity = generateRandomActivity();
      expect(activity.title).toBeTruthy();
      expect(activity.title.length).toBeGreaterThan(0);
    });

    it("should have a non-empty description", () => {
      const activity = generateRandomActivity();
      expect(activity.description).toBeTruthy();
      expect(activity.description.length).toBeGreaterThan(0);
    });
  });

  describe("generateInitialActivities", () => {
    it("should generate the specified number of activities", () => {
      const count = 10;
      const activities = generateInitialActivities(count);

      expect(activities).toHaveLength(count);
    });

    it("should generate default number of activities when no count provided", () => {
      const activities = generateInitialActivities();

      expect(activities).toHaveLength(10);
    });

    it("should generate activities with older timestamps", () => {
      const activities = generateInitialActivities(5);

      // Check that each activity has an older timestamp than the next
      // (older = smaller number, since they go backwards in time)
      for (let i = 0; i < activities.length - 1; i++) {
        expect(activities[i].timestamp.getTime()).toBeLessThan(
          activities[i + 1].timestamp.getTime(),
        );
      }
    });

    it("should generate unique IDs for all activities", () => {
      const activities = generateInitialActivities(10);
      const ids = activities.map((a) => a.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(activities.length);
    });

    it("should generate valid activity items", () => {
      const activities = generateInitialActivities(5);

      activities.forEach((activity) => {
        expect(activity).toHaveProperty("id");
        expect(activity).toHaveProperty("type");
        expect(activity).toHaveProperty("title");
        expect(activity).toHaveProperty("description");
        expect(activity).toHaveProperty("timestamp");
        expect(activity).toHaveProperty("icon");
        expect(activity).toHaveProperty("color");
      });
    });

    it("should handle edge case of 0 activities", () => {
      const activities = generateInitialActivities(0);
      expect(activities).toHaveLength(0);
    });

    it("should handle edge case of 1 activity", () => {
      const activities = generateInitialActivities(1);
      expect(activities).toHaveLength(1);
    });
  });

  describe("getRelativeTime", () => {
    it('should return "Xs ago" for timestamps less than 60 seconds old', () => {
      const now = Date.now();
      const timestamp = new Date(now - 30000); // 30 seconds ago

      const result = getRelativeTime(timestamp, now);

      expect(result).toMatch(/^\d+s ago$/);
    });

    it('should return "Xm ago" for timestamps less than 60 minutes old', () => {
      const now = Date.now();
      const timestamp = new Date(now - 300000); // 5 minutes ago

      const result = getRelativeTime(timestamp, now);

      expect(result).toMatch(/^\d+m ago$/);
    });

    it('should return "Xh ago" for timestamps less than 24 hours old', () => {
      const now = Date.now();
      const timestamp = new Date(now - 7200000); // 2 hours ago

      const result = getRelativeTime(timestamp, now);

      expect(result).toMatch(/^\d+h ago$/);
    });

    it('should return "Xd ago" for timestamps 24+ hours old', () => {
      const now = Date.now();
      const timestamp = new Date(now - 86400000 * 2); // 2 days ago

      const result = getRelativeTime(timestamp, now);

      expect(result).toMatch(/^\d+d ago$/);
    });

    it("should use current time when no currentTime provided", () => {
      const timestamp = new Date(Date.now() - 1000); // 1 second ago

      const result = getRelativeTime(timestamp);

      expect(result).toMatch(/^\d+s ago$/);
    });

    it('should return "0s ago" for current timestamp', () => {
      const now = Date.now();
      const timestamp = new Date(now);

      const result = getRelativeTime(timestamp, now);

      expect(result).toBe("0s ago");
    });

    it("should handle exact minute boundary", () => {
      const now = Date.now();
      const timestamp = new Date(now - 60000); // exactly 1 minute ago

      const result = getRelativeTime(timestamp, now);

      expect(result).toBe("1m ago");
    });

    it("should handle exact hour boundary", () => {
      const now = Date.now();
      const timestamp = new Date(now - 3600000); // exactly 1 hour ago

      const result = getRelativeTime(timestamp, now);

      expect(result).toBe("1h ago");
    });

    it("should handle exact day boundary", () => {
      const now = Date.now();
      const timestamp = new Date(now - 86400000); // exactly 1 day ago

      const result = getRelativeTime(timestamp, now);

      expect(result).toBe("1d ago");
    });
  });
});
