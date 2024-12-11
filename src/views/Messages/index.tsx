import React, { useContext, useState, useEffect } from "react";
import { Container } from "./styles";
import { SafeComponent } from "~components";
import { FlatList, Text } from "react-native";
import { Message } from "./components/Message";
import { Header } from "./components/Header";
import Divider from "~components/Divider";
import { PICTURE_SIZE } from "./components/Message/styles";
import { mockRequest } from "./__mocks__";
import axios from "axios";
import { UserContext } from "~views/UserContext";

function Component() {
  const { userId, setUserId, currentTab } = useContext(UserContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const messageRequest = {
    data: data,
    loading: loading,
    error: false,
  };

  useEffect(() => {
    if (currentTab === "Messages") {

      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `http://127.0.0.1:5000/firebase/chats/${userId}`
          );
          setData(response.data);
        } catch (error) {
          console.error("Error fetching message data:", error);
        } finally {
          setLoading(false); // 로딩 상태를 false로 설정
        }
      };

      fetchData();

      return () => {
      };
    }
  }, [currentTab, userId]);

  if (loading) {
    return (
      <Container>
        <SafeComponent>
          <Text>Loading...</Text>
        </SafeComponent>
      </Container>
    );
  }

  return (
    <Container>
      <SafeComponent request={messageRequest}>
        <FlatList
          ListHeaderComponent={Header}
          data={messageRequest.data}
          keyExtractor={(message) => String(message.id)}
          ItemSeparatorComponent={() => (
            <Divider
              style={{ marginHorizontal: 15, marginLeft: 30 + PICTURE_SIZE }}
            />
          )}
          renderItem={({ item }) => <Message item={item} />}
        />
      </SafeComponent>
    </Container>
  );
}

export default Component;
