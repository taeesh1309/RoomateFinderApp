import React, { useState, useEffect } from "react";
import {
  Container,
  Content,
  Title,
  ContainedText,
  DisconnectedIllustration,
  ErrorIllustration,
} from "./styles";
import Loading from "~components/Loading";
import Button from "~components/Button";
import NetInfo from "@react-native-community/netinfo";
import { useNavigation } from "@react-navigation/native";
import ErrorBoundary from "react-native-error-boundary";

export const OfflineComponent = ({ refetch }: { refetch: () => void }) => {
  return (
    <Container>
      <Content>
        <DisconnectedIllustration />
        <Title>Oops, you are offline</Title>
        <ContainedText>
          Please wait a moment and try again when your connection is stable.
        </ContainedText>
        <Button onPress={() => refetch()}>Try Again</Button>
      </Content>
    </Container>
  );
};

export const RequestErrorComponent = ({ refetch }: { refetch: () => void }) => {
  const navigation = useNavigation();

  return (
    <Container>
      <Content
        style={{
          alignItems: "center", // Center content
          justifyContent: "center", // Vertically center content
          padding: 20, // Add padding for spacing
        }}
      >
        {/* Illustration */}
        <ErrorIllustration
          style={{
            width: 150,
            height: 150,
            marginBottom: 20, // Add spacing below the illustration
          }}
        />

        {/* Title */}
        <Title style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}>
          No More Matches Found
        </Title>

        {/* Spacer */}
        <ContainedText style={{ marginVertical: 10, textAlign: "center" }}>
          It seems like you've run out of potential matches. 
        </ContainedText>

        {/* Instruction Text */}
        <ContainedText style={{ textAlign: "center", color: "#555" }}>
          Try updating your preferences to explore new options. Tap the button
          below to edit your requirements and press "Continue" to find more matches.
        </ContainedText>

        {/* Button */}
        <Button
          onPress={() => navigation.navigate("EditProfile")}
          style={{
            marginTop: 20,
            width: "80%", // Adjust button width
            alignSelf: "center",
          }}
        >
          Go to Edit Profile
        </Button>
      </Content>
    </Container>
  );
};

export const OutOfMatchesComponent = () => {
  const navigation = useNavigation();

  return (
    <Container>
      <Content>
        <ErrorIllustration />
        <Title>No More Matches Found</Title>
        <ContainedText>
          It seems like you've run out of potential matches. Try updating your
          preferences to explore new options. Tap the button below to edit your
          requirements and press "Continue" to find more matches.
        </ContainedText>
        <Button onPress={() => navigation.navigate("EditProfile")}>
          Go to Edit Profile
        </Button>
      </Content>
    </Container>
  );
};

// NetInfo is always disconnected on the first render. Workaround hook
export function useIsOffline() {
  const [netInfo, setNetInfo] = useState({
    isInternetReachable: true,
  });

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(setNetInfo);
    return unsubscribe;
  }, []);

  return !netInfo.isInternetReachable;
}

interface SafeComponentProps {
  request?: { data?: any; error?: any; loading?: boolean; matches?: any[] };
  refetch?: () => void;
  children: any;
}

export default function SafeComponent({
  request,
  children,
  refetch,
}: SafeComponentProps) {
  const offline = useIsOffline();

  const SafeChildren = (
    <ErrorBoundary FallbackComponent={RequestErrorComponent}>
      {children || null}
    </ErrorBoundary>
  );

  if (request?.loading)
    return (
      <Content>
        <Loading />
      </Content>
    );

  if (request?.data && request.matches?.length === 0) {
    return <OutOfMatchesComponent />;
  }

  if (request?.data) return SafeChildren;
  if (request && offline) return <OfflineComponent refetch={refetch} />;
  if (request?.error) return <RequestErrorComponent refetch={refetch} />;

  return SafeChildren;
}
