import React, { useContext, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { ThemeContext } from "styled-components/native";
import axios from "axios";
import Authentication from "./Authentication";
import OneTimeCode from "./OneTimeCode";
import UserProfile from "./UserProfile";
import EditProfile from "./EditProfile";
import Chat from "./Chat";
import {
  CardStyleInterpolators,
  createStackNavigator,
  HeaderStyleInterpolators,
} from "@react-navigation/stack";
import { RootStackParamList } from "~src/@types/react-navigation.d";
import { SceneName } from "~src/@types/SceneName";
import SwipeView from "~views/Swipe";
import EditProfileView from "~views/EditProfile";
import MessagesView from "~views/Messages";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import Logo from "~images/Logo.svg";
import Messages from "~images/Messages.svg";
import Profile from "~images/User.svg";

import LogoActive from "~images/LogoActive.svg";
import MessagesActive from "~images/MessagesActive.svg";
import ProfileActive from "~images/UserActive.svg";
import { Dimensions } from "react-native";

const Tab = createMaterialTopTabNavigator<RootStackParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const screenWidth = Dimensions.get("window").width;

const Tabs = () => {
  const themeContext = useContext(ThemeContext);
  const [userId, setUserId] = useState(null); // 최신 userId를 저장할 상태

  // 가장 최근에 추가된 userId를 가져오는 useEffect
  useEffect(() => {
    const fetchLatestUserId = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/users/latest"); // 최신 userId를 반환하는 API 호출
        console.log("fetching latest userId@@@@ :", response.data.userId);
        setUserId(response.data.userId); // 최신 userId 상태에 저장
        console.log("fetching latest userId2 @@@@@:", userId);
      } catch (error) {
        console.error("Error fetching latest userId:", error);
      }
    };

    fetchLatestUserId();
  }, []);

  return (
    <Tab.Navigator
      tabBar={(props) => <Navbar {...props} />}
      initialLayout={{ width: screenWidth }}
      screenOptions={{
        tabBarInactiveTintColor: themeContext.colors.text,
      }}
      initialRouteName={SceneName.Swipe}
    >
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused, color }) =>
            focused ? <LogoActive /> : <Logo fill={color} />,
        }}
        name={SceneName.Swipe}
        component={SwipeView}
      />
      <Tab.Screen
        name={SceneName.Messages}
        options={{
          tabBarIcon: ({ focused, color }) =>
            focused ? <Messages fill={"maroon"} /> : <Messages fill={color} />,
        }}
        component={MessagesView}
      />
      <Tab.Screen
        name={SceneName.Profile}
        options={{
          tabBarIcon: ({ focused, color }) =>
            focused ? <Profile fill={"maroon"} /> : <Profile fill={color} />,
        }}
        initialParams={{ userId }}
        component={EditProfileView}
      />
    </Tab.Navigator>
  );
};

function Router() {
  const theme = useContext(ThemeContext);

  return (
    <Stack.Navigator
      initialRouteName={SceneName.EditProfile}
      screenOptions={{
        headerShown: false,
        headerBackTitle: "Voltar",
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTitleStyle: {
          fontFamily: theme.typography.fontFamily.bold,
          fontSize: 20,
          color: theme.colors.text,
        },
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
      }}
    >
      <Stack.Group>
        <Stack.Screen name={SceneName.Main} component={Tabs} />
        <Stack.Screen name={SceneName.UserProfile} component={UserProfile} />
        <Stack.Screen
          name={SceneName.EditProfile}
          options={{
            headerTitle: "Create your profile",
            headerShown: true,
            headerStyleInterpolator: HeaderStyleInterpolators.forUIKit,
          }}
          component={EditProfile}
        />
        <Stack.Screen name={SceneName.Chat} component={Chat} />
      </Stack.Group>
      <Stack.Group>
        <Stack.Screen name={SceneName.OneTimeCode} component={OneTimeCode} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

export default Router;
