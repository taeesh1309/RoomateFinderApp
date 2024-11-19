import React from "react";
import { Text } from "~components";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Container, Picture } from "./styles";
import { SceneName } from "~src/@types/SceneName";

export const Message = ({ item }) => {
  const navigation = useNavigation();

  return (
    <Container
      onPress={() => navigation.navigate(SceneName.Chat, { user: item })}
    >
      <Picture source={{ uri: "https://picsum.photos/200" }} />
      <View>
        <Text fontWeight="semiBold">{item.matchedUserName}</Text>
        <Text fontSize="small">"Hello!!"</Text>
      </View>
    </Container>
  );
};
