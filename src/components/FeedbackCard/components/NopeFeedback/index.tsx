import React from "react";
import { Image } from "react-native";
import { Container } from "./styles";

const NopeFeedback: React.FC = () => {
  return (
    <Container>
      <Image source={require("~assets/images/home-sad.png")} />
    </Container>
  );
};

export default NopeFeedback;
