import React from "react";
import { Text } from "~components";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Container, Picture } from "./styles";
import { SceneName } from "~src/@types/SceneName";

export const Message = ({ item }) => {
  const navigation = useNavigation();

  const pictureUri =
    Array.isArray(item?.pictures) && item.pictures.length > 0
      ? item.pictures[0]
      : "https://picsum.photos/200";
  return (
    <Container
      onPress={() => navigation.navigate(SceneName.Chat, { user: item })}
    >
      <Picture source={{ uri: pictureUri }} />

      <View>
        <Text fontWeight="semiBold">{item.matchedUserName}</Text>
        <Text fontSize="small">Hello, I am looking for a roommate</Text>
      </View>
    </Container>
  );
};
