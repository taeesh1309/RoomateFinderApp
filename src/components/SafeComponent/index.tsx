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
  return (
    <Container>
      <Content>
        <ErrorIllustration />
        <Title>Oops, something went wrong</Title>
        <ContainedText>
          We couldn't process your request at the moment, but we're already
          working on fixing the problem.
        </ContainedText>
        <Button onPress={() => refetch()}>Try Again</Button>
      </Content>
    </Container>
  );
};

export const UnknownErrorComponent = () => {
  return (
    <Container>
      <Content>
        <ErrorIllustration />
        <Title>Oops, something went wrong</Title>
        <ContainedText>Try Again</ContainedText>
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
  request?: { data?: any; error?: any; loading?: boolean };
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
    <ErrorBoundary FallbackComponent={UnknownErrorComponent}>
      {children || null}
    </ErrorBoundary>
  );

  if (request?.loading)
    return (
      <Content>
        <Loading />
      </Content>
    );

  if (request?.data) return SafeChildren;
  if (request && offline) return <OfflineComponent refetch={refetch} />;
  if (request?.error) return <RequestErrorComponent refetch={refetch} />;

  return SafeChildren;
}
