import {
  ACTIVITY_COLORS,
  ACTIVITY_ICONS,
  ActivityItem,
  ActivityType,
} from "@/components/types/activityItemType";

const ACTIVITY_TEMPLATES = {
  message: [
    {
      title: "New Message",
      descriptions: [
        "John sent you a message",
        "Sarah replied to your comment",
        "Team chat updated",
        "Alex mentioned you in a thread",
      ],
    },
  ],
  call: [
    {
      title: "Incoming Call",
      descriptions: [
        "Call from Emma Williams",
        "Video call from Team Lead",
        "Missed call from Client",
        "Conference call starting",
      ],
    },
  ],
  status: [
    {
      title: "Status Update",
      descriptions: [
        "Project milestone completed",
        "Deployment successful",
        "Build finished",
        "Task status changed",
      ],
    },
  ],
  notification: [
    {
      title: "Notification",
      descriptions: [
        "New follower on your post",
        "Comment on your update",
        "Weekly report ready",
        "Reminder: Meeting in 15 min",
      ],
    },
  ],
};

let activityCounter = 0;

export function generateRandomActivity(): ActivityItem {
  const types: ActivityType[] = ["message", "call", "status", "notification"];
  const randomType = types[Math.floor(Math.random() * types.length)];

  const templates = ACTIVITY_TEMPLATES[randomType];
  const template = templates[Math.floor(Math.random() * templates.length)];
  const description =
    template.descriptions[
      Math.floor(Math.random() * template.descriptions.length)
    ];

  activityCounter++;

  return {
    id: `activity-${Date.now()}-${activityCounter}`,
    type: randomType,
    title: template.title,
    description: description,
    timestamp: new Date(),
    icon: ACTIVITY_ICONS[randomType],
    color: ACTIVITY_COLORS[randomType],
  };
}

export function generateInitialActivities(count: number = 10): ActivityItem[] {
  const activities: ActivityItem[] = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const activity = generateRandomActivity();
    // Simulate older timestamps
    activity.timestamp = new Date(now - (count - i) * 60000); // 1 minute apart
    activities.push(activity);
  }

  return activities;
}

export function getRelativeTime(timestamp: Date, currentTime?: number): string {
  const now = currentTime || Date.now();
  const diff = now - timestamp.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}
