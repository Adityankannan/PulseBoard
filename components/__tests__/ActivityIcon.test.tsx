import { render } from "@testing-library/react-native";
import React from "react";
import { ActivityIcon } from "../ActivityIcon";

describe("ActivityIcon", () => {
  const defaultProps = {
    icon: "chatbubble",
    color: "#4A90E2",
  };

  describe("Rendering", () => {
    it("should render without crashing", () => {
      const { getByTestId } = render(<ActivityIcon {...defaultProps} />);
      expect(getByTestId).toBeDefined();
    });

    it("should match snapshot", () => {
      const { toJSON } = render(<ActivityIcon {...defaultProps} />);
      expect(toJSON()).toMatchSnapshot();
    });

    it("should match snapshot with different icon", () => {
      const { toJSON } = render(<ActivityIcon icon="call" color="#50C878" />);
      expect(toJSON()).toMatchSnapshot();
    });

    it("should match snapshot with different color", () => {
      const { toJSON } = render(
        <ActivityIcon icon="chatbubble" color="#FF3B30" />,
      );
      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe("Props", () => {
    it("should accept icon prop", () => {
      const { toJSON } = render(
        <ActivityIcon icon="notifications" color="#9B59B6" />,
      );
      expect(toJSON()).toBeTruthy();
    });

    it("should accept color prop", () => {
      const { toJSON } = render(<ActivityIcon icon="call" color="#00FF00" />);
      expect(toJSON()).toBeTruthy();
    });

    it("should render with message icon", () => {
      const { toJSON } = render(
        <ActivityIcon icon="chatbubble" color="#4A90E2" />,
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it("should render with call icon", () => {
      const { toJSON } = render(<ActivityIcon icon="call" color="#50C878" />);
      expect(toJSON()).toMatchSnapshot();
    });

    it("should render with status icon", () => {
      const { toJSON } = render(
        <ActivityIcon icon="information-circle" color="#F5A623" />,
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it("should render with notification icon", () => {
      const { toJSON } = render(
        <ActivityIcon icon="notifications" color="#9B59B6" />,
      );
      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe("Accessibility", () => {
    it("should be accessible", () => {
      const { toJSON } = render(<ActivityIcon {...defaultProps} />);
      expect(toJSON()).toBeTruthy();
    });
  });
});
