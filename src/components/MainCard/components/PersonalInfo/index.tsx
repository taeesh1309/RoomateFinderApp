import React from "react";
import { Container, Name, Age, Description } from "./styles";
import Glassmorphism from "~components/Glassmorphism";
import { useMatches } from '~views/MatchesContext';

function PersonalInfo({ user }) {
  const { matches } = useMatches();
  return (
    <Glassmorphism>
      <Container>
        <Name>
          {user.name}
          <Age>, {user.age}</Age>
        </Name>
        <Description>{user.description}</Description>
      </Container>
    </Glassmorphism>
  );
}

export default PersonalInfo;
