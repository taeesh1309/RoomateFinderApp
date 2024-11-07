import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";
import { StatusBar } from "expo-status-bar";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { ThemeContext } from "styled-components/native";
import {
  AddRemoveContainer,
  BottomPadding,
  Container,
  ContinueButton,
  numOfColumns,
  UserPictureContainer,
  UserPictureContent,
  userPictureHeight,
} from "./styles";
import Placeholder from "~images/placeholder.svg";
import AddRemove from "~images/AddRemove.svg";
import { DraggableGrid } from "react-native-draggable-grid";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { pictures, sortByUrl, deleteUrlFromItem, addUrlToItem } from "./utils";
import { useHeaderHeight } from "@react-navigation/elements";
import { SceneName } from "~src/@types/SceneName";
import { useDidMountEffect } from "~services/utils";
import { Input, RadioButtons } from "~components";
import { useNavbarStyle } from "~components/Navbar";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Picker } from "@react-native-picker/picker";
import Text from "~components/Text";

const AddUserPhoto = ({ picture, onDelete, onAdd }) => {
  const themeContext = useContext(ThemeContext);

  const hasPicture = !!picture.url;

  const style = useAnimatedStyle(() => {
    const rotation = withSpring(hasPicture ? `45deg` : `0deg`);
    return { transform: [{ rotateZ: rotation }] };
  });

  return (
    <UserPictureContainer>
      <UserPictureContent
        key={picture?.url}
        {...(picture?.url && { source: { uri: picture?.url } })}
      >
        {!hasPicture && <Placeholder />}
      </UserPictureContent>
      <AddRemoveContainer
        inverted={hasPicture}
        onPress={hasPicture ? onDelete : onAdd}
      >
        <Animated.View style={style}>
          <AddRemove
            fill={hasPicture ? themeContext.colors.primary : "white"}
          />
        </Animated.View>
      </AddRemoveContainer>
    </UserPictureContainer>
  );
};

export interface Positions {
  [id: string]: number;
}

const EditProfile = ({ route }) => {
  const themeContext = useContext(ThemeContext);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // -----Profile-----
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [pics, setPics] = useState(pictures);
  const [gender, setGender] = useState("");

  const [phone, setPhone] = useState("");
  const [program, setProgram] = useState("");
  const [selectedEthnicity, setSelectedEthnicity] = useState("");

  const [hometown, setHometown] = useState("");
  const [dietary, setDietary] = useState("");
  const [smoking, setSmoking] = useState("");
  const [drinking, setDrinking] = useState("");
  const [budget, setBudget] = useState("");

  // -----Preference-----
  const [genderOfInterest, setGenderOfInterest] = useState("");
  const [selectedEthnicityOfInterest, setSelectedEthnicityOfInterest] =
    useState("");
  const [dietaryOfInterest, setDietaryOfInterest] = useState("");
  const [smokingOfInterest, setSmokingOfInterest] = useState("");
  const [drinkingOfInterest, setDrinkingOfInterest] = useState("");
  const [budgetOfInterest, setBudgetOfInterest] = useState("");

  // ------Hometype-----
  const [hometype, setHometype] = useState("");
  const [moveindate, setMoveindate] = useState(new Date());

  // Swipe gestures need to be disabled when Draggable is active,
  // othewise the user will perform multiple gestures and the behavior
  // will be undesirable
  const [gesturesEnabled, setgesturesEnabled] = useState(true);

  const headerHeight = useHeaderHeight();
  const navbarHeight = useNavbarStyle().height;

  const [userId, setUserId] = useState(route.params?.userId || null); // route.params가 없으면 null

  useEffect(() => {
    if (route.params?.userId) {
      setUserId(route.params.userId);
    }
  }, [route.params?.userId]);

  //get user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userId) {
          const response = await axios.get(
            `http://127.0.0.1:5000/users/${userId}`
          );
          console.log("User data fetched successfully:", response.data.phone);
          setName(response.data.name);
          setBio(response.data.bio);
          setPhone(response.data.phone);
          setProgram(response.data.program);
          setSelectedEthnicity(response.data.selectedEthnicity);
          setHometown(response.data.hometown);
          setBudget(response.data.budget);
          setGender(response.data.gender);
          setGenderOfInterest(response.data.preference.genderOfInterest);
          setDietary(response.data.dietary);
          setSmoking(response.data.smoking);
          setDrinking(response.data.drinking);

          //Preferences
          setSelectedEthnicityOfInterest(
            response.data.preference.selectedEthnicity
          );
          setDietaryOfInterest(response.data.preference.dietary);
          setSmokingOfInterest(response.data.preference.smoking);
          setDrinkingOfInterest(response.data.preference.drinking);
          setBudgetOfInterest(response.data.preference.budget);

          //Hometype
          setHometype(response.data.hometype);
          setMoveindate(new Date(response.data.moveindate));
        }
      } catch (error) {
        console.error("Error fetching or creating user:", error);
      }
    };
    fetchData();
  }, [userId]);

  useDidMountEffect(() => {
    navigation.setOptions({ swipeEnabled: gesturesEnabled });
  }, [gesturesEnabled]);

  const continueButtonDisabled = Boolean(!genderOfInterest || !gender);

  const handleContinue = async () => {
    try {
      const preference = {
        genderOfInterest: genderOfInterest,
        selectedEthnicity: selectedEthnicityOfInterest,
        dietary: dietaryOfInterest,
        smoking: smokingOfInterest,
        drinking: drinkingOfInterest,
        budget: budgetOfInterest,
      };
      const home = {
        hometype: hometype,
        moveindate: moveindate.toISOString(),
      };

      if (!userId) {
        // userId가 없으면 새로 생성
        const response = await axios.post("http://127.0.0.1:5000/users", {
          name: name,
          bio: bio,
          phone: phone,
          program: program,
          selectedEthnicity: selectedEthnicity,
          hometown: hometown,
          budget: budget,
          gender: gender,
          dietary: dietary,
          smoking: smoking,
          drinking: drinking,
          preference: preference,
          home: home,
        });

        const newUserId = response.data.userId;
        setUserId(newUserId); // userId 설정
      } else {
        console.log("test2 : ", moveindate);
        // userId가 있으면 업데이트
        const response = await axios.put(
          `http://127.0.0.1:5000/users/${userId}`,
          {
            name: name,
            bio: bio,
            phone: phone,
            program: program,
            selectedEthnicity: selectedEthnicity,
            hometown: hometown,
            budget: budget,
            gender: gender,
            dietary: dietary,
            smoking: smoking,
            drinking: drinking,
            preference: preference,
            home: home,
          }
        );
        console.log("Profile updated successfully:", response.data);
      }

      // 다음 화면으로 이동
      navigation.navigate(SceneName.Main, { screen: SceneName.Swipe });
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || moveindate;
    console.log("currentDate", currentDate);
    if (currentDate) {
      setMoveindate(new Date(currentDate));
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        style={{ flexGrow: 1 }}
        keyboardVerticalOffset={
          route.name === SceneName.EditProfile ? headerHeight : navbarHeight
        }
        behavior={Platform.OS === "ios" ? "padding" : null}
      >
        <Container
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 15, paddingBottom: 30 }}
          scrollEnabled={gesturesEnabled}
        >
          <StatusBar style={themeContext.dark ? "light" : "dark"} />
          <DraggableGrid
            numColumns={numOfColumns}
            renderItem={(picture) => (
              <View>
                <AddUserPhoto
                  onDelete={() => {
                    const newPics = pics
                      .map(deleteUrlFromItem(picture))
                      .sort(sortByUrl);
                    setPics(newPics);
                  }}
                  onAdd={() => {
                    const newPics = pics
                      .map(addUrlToItem(picture))
                      .sort(sortByUrl);
                    setPics(newPics);
                  }}
                  picture={picture}
                />
              </View>
            )}
            data={pics}
            itemHeight={userPictureHeight}
            style={{ zIndex: 10 }}
            onDragStart={() => setgesturesEnabled(false)}
            onDragRelease={(newPics) => {
              setgesturesEnabled(true);
              setPics(newPics);
            }}
          />
          <Input
            title="Your Name"
            placeholder="Please enter your name"
            value={name}
            onChangeText={setName}
            maxLength={50}
          />
          <Input
            title="Bio"
            placeholder="Please enter your bio"
            value={bio}
            onChangeText={setBio}
            maxLength={500}
            multiline
          />
          <Input
            title="Phone Number"
            placeholder="Please enter your Phone Number"
            value={phone}
            onChangeText={setPhone}
            maxLength={20}
            multiline
          />

          <RadioButtons
            title="Sex"
            data={["Male", "Female"]}
            value={gender}
            onChange={setGender}
          />

          <Input
            title="Program"
            placeholder="Please enter your Program"
            value={program}
            onChangeText={setProgram}
            maxLength={30}
            multiline
          />

          <View>
            <Text fontSize="large" fontWeight="bold">
              Ethnicity:
            </Text>
            <Picker
              selectedValue={selectedEthnicity}
              onValueChange={(itemValue) => setSelectedEthnicity(itemValue)}
            >
              <Picker.Item label="Select an option" value="" />
              <Picker.Item label="Asian" value="asian" />
              <Picker.Item label="Black or African American" value="black" />
              <Picker.Item label="Hispanic or Latino" value="hispanic" />
              <Picker.Item
                label="Middle Eastern or North African"
                value="middle_eastern"
              />
              <Picker.Item label="Mixed Race or Multiracial" value="mixed" />
              <Picker.Item
                label="Native American or Indigenous"
                value="native"
              />
              <Picker.Item label="Pacific Islander" value="pacific_islander" />
              <Picker.Item label="White or Caucasian" value="white" />
            </Picker>
          </View>

          <Input
            title="HomeTown"
            placeholder="Please enter your HomeTown"
            value={hometown}
            onChangeText={setHometown}
            maxLength={30}
            multiline
          />

          <RadioButtons
            title="Dietary"
            data={["No Restrictions", "Vegetarian"]}
            value={dietary}
            onChange={setDietary}
          />
          <RadioButtons
            title="Smoking"
            data={["No", "Yes"]}
            value={smoking}
            onChange={setSmoking}
          />
          <RadioButtons
            title="Drinking"
            data={["No", "Yes"]}
            value={drinking}
            onChange={setDrinking}
          />

          <Input
            title="Budget"
            placeholder="Please enter your Budget (Per Month($))"
            value={budget}
            onChangeText={(text) => {
              const numericText = text.replace(/[^0-9]/g, ""); //Only numbers are allowed
              setBudget(numericText);
            }}
            maxLength={30}
            multiline
            keyboardType="numeric" // use numeric keyboard
          />
          <View
            style={{
              height: 1,
              backgroundColor: "#d3d3d3",
              marginVertical: 20,
            }}
          />
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "red" }}>
            Preference
          </Text>
          <View
            style={{
              height: 1,
              backgroundColor: "#d3d3d3",
              marginVertical: 20,
            }}
          />
          <RadioButtons
            title="Match with"
            data={["Male", "Female"]}
            value={genderOfInterest}
            onChange={setGenderOfInterest}
          />
          <View>
            <Text fontSize="large" fontWeight="bold">
              Ethnicity:
            </Text>
            <Picker
              selectedValue={selectedEthnicityOfInterest}
              onValueChange={(itemValue) =>
                setSelectedEthnicityOfInterest(itemValue)
              }
            >
              <Picker.Item label="Select an option" value="" />
              <Picker.Item label="Asian" value="asian" />
              <Picker.Item label="Black or African American" value="black" />
              <Picker.Item label="Hispanic or Latino" value="hispanic" />
              <Picker.Item
                label="Middle Eastern or North African"
                value="middle_eastern"
              />
              <Picker.Item label="Mixed Race or Multiracial" value="mixed" />
              <Picker.Item
                label="Native American or Indigenous"
                value="native"
              />
              <Picker.Item label="Pacific Islander" value="pacific_islander" />
              <Picker.Item label="White or Caucasian" value="white" />
            </Picker>
          </View>

          <RadioButtons
            title="Dietary"
            data={["No Restrictions", "Vegetarian"]}
            value={dietaryOfInterest}
            onChange={setDietaryOfInterest}
          />
          <RadioButtons
            title="Smoking"
            data={["No", "Yes"]}
            value={smokingOfInterest}
            onChange={setSmokingOfInterest}
          />
          <RadioButtons
            title="Drinking"
            data={["No", "Yes"]}
            value={drinkingOfInterest}
            onChange={setDrinkingOfInterest}
          />

          <Input
            title="Budget"
            placeholder="Please enter Maximum Budget (Per Month($))"
            value={budgetOfInterest}
            onChangeText={(text) => {
              const numericText = text.replace(/[^0-9]/g, ""); //Only numbers are allowed
              setBudgetOfInterest(numericText);
            }}
            maxLength={30}
            multiline
            keyboardType="numeric" // use numeric keyboard
          />

          <View
            style={{
              height: 1,
              backgroundColor: "#d3d3d3",
              marginVertical: 20,
            }}
          />
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "red" }}>
            Hometype
          </Text>
          <View
            style={{
              height: 1,
              backgroundColor: "#d3d3d3",
              marginVertical: 20,
            }}
          />
          <RadioButtons
            title="Room Sharing"
            data={["No", "Yes"]}
            value={hometype}
            onChange={setHometype}
          />
          <View style={{ marginVertical: 10 }} />
          <View style={{ alignItems: "flex-start" }}>
            <Text fontSize="large" fontWeight="bold">
              Move-in Date
            </Text>
            <DateTimePicker
              testID="dateTimePicker"
              value={
                moveindate instanceof Date && !isNaN(moveindate.getTime())
                  ? moveindate
                  : new Date()
              }
              mode="date"
              display="default"
              onChange={onChange}
              style={{ marginVertical: 20 }}
            />
          </View>
        </Container>
        <ContinueButton
          disabled={continueButtonDisabled}
          onPress={handleContinue}
        >
          Continue
        </ContinueButton>
      </KeyboardAvoidingView>
      <BottomPadding
        disabled={continueButtonDisabled}
        style={{ height: insets.bottom }}
      />
    </>
  );
};

export default EditProfile;
