import { APP_CONSTANTS } from "@/constants/appConstants";
import { activityIconStyles as styles } from "@/constants/styles";
import { theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";

interface ActivityIconProps {
  icon: string;
  color: string;
}

export const ActivityIcon: React.FC<ActivityIconProps> = ({ icon, color }) => {
  return (
    <View
      style={[
        styles.iconContainer,
        { backgroundColor: color + APP_CONSTANTS.UI.ICON_BACKGROUND_OPACITY },
      ]}
    >
      <Ionicons
        name={icon as any}
        size={theme.layout.iconSize.sm}
        color={color}
      />
    </View>
  );
};
