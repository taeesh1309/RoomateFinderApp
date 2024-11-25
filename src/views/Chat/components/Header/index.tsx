import React, { useContext } from "react";
import { Header, BackTouchArea, Picture } from "./styles";
import Text from "~components/Text";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ThemeContext } from "styled-components/native";
import { IChat } from "~views/Chat";
import BackArrow from "~images/BackArrow.svg";

export default function Component() {
  const navigation = useNavigation();
  const { params } = useRoute<IChat>();
  const { colors } = useContext(ThemeContext);

  console.log("cc ", params);

  return (
    <Header>
      <BackTouchArea onPress={() => navigation.goBack()}>
        <BackArrow height={15} width={15} fill={colors.text} />
      </BackTouchArea>
      <Picture source={{ uri: params.user?.pictures[0] }} />
      <Text fontWeight="bold">
        {params.user?.matchedUserName || "Undefined"}
      </Text>
    </Header>
  );
}
