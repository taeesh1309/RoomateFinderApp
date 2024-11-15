import React from "react";
import { Container, Name, Age, Description } from "./styles";
import Glassmorphism from "~components/Glassmorphism";

function PersonalInfo({ user }) {
  // const { matches } = user.params;
  // console.log("matches", matches);
  return (
    <Glassmorphism>
      <Container>
        <Name>
          {"Faraz"}
          {/* {user.na me} */}
          <Age>, {user.age}</Age>
        </Name>
        <Description>{user.description}</Description>
      </Container>
    </Glassmorphism>
  );
}

export default PersonalInfo;
