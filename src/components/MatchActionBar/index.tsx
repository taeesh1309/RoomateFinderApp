import React from "react";
import Animated, { FadeInDown, ZoomOutDown } from "react-native-reanimated";
import {
  Container,
  ActionItem,
  HomeSadEmoji,
  HomeSmileEmoji,
} from "./styles";

const MatchActionBar = ({
  onNope,
  onYep,
  animated,
  ...props
}: any) => {
  return (
    <Container exiting={ZoomOutDown} {...props}>
      <Animated.View entering={animated && FadeInDown.delay(300)}>
        <ActionItem onPress={onNope}>
          <HomeSadEmoji />
        </ActionItem>
      </Animated.View>

      <Animated.View entering={animated && FadeInDown.delay(400)}>
        <ActionItem onPress={onYep}>
          <HomeSmileEmoji />
        </ActionItem>
      </Animated.View>
    </Container>
  );
};

export default MatchActionBar;
