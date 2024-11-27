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
import { UserContext } from "~views/UserContext";
import { useMatches } from "~views/MatchesContext";
import { useDispatch } from "react-redux";
import { Actions } from "~store/reducers";

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
  const { setMatches } = useMatches();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // -----Profile-----
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [age, setAge] = useState("");

  const [pics, setPics] = useState(pictures);
  const [gender, setGender] = useState("");

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
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
  const [ageOfInterest, setAgeOfInterest] = useState("");

  const [budgetOfInterest, setBudgetOfInterest] = useState("");

  // ------Hometype-----
  const [apartmenttype, setApartmenttype] = useState("");
  const [moveindate, setMoveindate] = useState(new Date());

  // Swipe gestures need to be disabled when Draggable is active,
  // othewise the user will perform multiple gestures and the behavior
  // will be undesirable
  const [gesturesEnabled, setgesturesEnabled] = useState(true);

  const headerHeight = useHeaderHeight();
  const navbarHeight = useNavbarStyle().height;

  const { userId, setUserId } = useContext(UserContext);
  const dispatch = useDispatch();

  useEffect(() => {
    if (route.params?.userId && !userId) {
      setUserId(route.params.userId);
    }
  }, [route.params?.userId]);

  //get user data
  useEffect(() => {
    // let isMounted = true; // 마운트 상태를 추적하는 변수
    const controller = new AbortController(); // AbortController 생성
    const signal = controller.signal;

    const fetchData = async () => {
      try {
        if (userId) {
          const response = await axios.get(
            `http://127.0.0.1:5000/firebase/users/${userId}`,
            { signal }
          );

          setName(response.data.name);
          setBio(response.data.bio);
          setPhone(response.data.phone);
          setEmail(response.data.email);
          setProgram(response.data.program);
          setSelectedEthnicity(response.data.selectedEthnicity);
          setHometown(response.data.hometown);
          setBudget(response.data.budget);
          setGender(response.data.gender);

          setDietary(response.data.dietary);
          setSmoking(response.data.smoking);
          setDrinking(response.data.drinking);
          setAge(response.data.age);

          //Preferences
          setSelectedEthnicityOfInterest(
            response.data.preference.selectedEthnicityOfInterest
          );
          setGenderOfInterest(response.data.preference.genderOfInterest);
          setDietaryOfInterest(response.data.preference.dietary);
          setSmokingOfInterest(response.data.preference.smoking);
          setDrinkingOfInterest(response.data.preference.drinking);
          setAgeOfInterest(response.data.preference.ageOfInterest);
          // setBudgetOfInterest(response.data.preference.budget);

          //Hometype
          setApartmenttype(response.data.home.apartment_type);
          setMoveindate(new Date(response.data.home.move_in_date));
          // }
        }
      } catch (error) {
        // if (isMounted) {
        console.error("Error fetching user data:", error);
        // }
      }
    };
    fetchData();
    return () => {
      // isMounted = false; // 컴포넌트가 언마운트될 때 마운트 상태를 false로 설정
      controller.abort();
    };
  }, [userId]);

  useDidMountEffect(() => {
    navigation.setOptions({ swipeEnabled: gesturesEnabled });
  }, [gesturesEnabled]);

  const continueButtonDisabled = Boolean(
    !gender ||
      !genderOfInterest ||
      !selectedEthnicityOfInterest ||
      !dietaryOfInterest ||
      !smokingOfInterest ||
      !drinkingOfInterest ||
      !ageOfInterest
  );

  const handleContinue = async () => {
    try {
      const preference = {
        genderOfInterest: genderOfInterest,
        selectedEthnicityOfInterest: selectedEthnicityOfInterest,
        dietary: dietaryOfInterest,
        smoking: smokingOfInterest,
        drinking: drinkingOfInterest,
        ageOfInterest: ageOfInterest,
        // budget: budgetOfInterest,
      };
      const home = {
        apartment_type: apartmenttype,
        move_in_date: moveindate,
      };

      if (!userId) {
        // userId가 없으면 새로 생성
        const response = await axios.post(
          "http://127.0.0.1:5000/firebase/users",
          {
            name: name,
            bio: bio,
            phone: phone,
            email: email,
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
            age: age,
          }
        );

        const newUserId = response.data.userId;
        setUserId(newUserId); // userId 설정
      } else {
        // userId가 있으면 업데이트
        const response = await axios.put(
          `http://127.0.0.1:5000/firebase/users/${userId}`,
          {
            name: name,
            bio: bio,
            phone: phone,
            email: email,
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
            age: age,
          }
        );
      }

      let matches = [];
      function transformResponseData(response) {
        return response.matches.map((match, index) => ({
          age: match.Age,
          createdAt: new Date().toISOString(), // Use current timestamp
          description: `I am a ${match.Age} year old`,
          id: (index + 1).toString(), // Assign a unique ID based on index
          name: match.Name.trim(),
          pictures:
            match.Gender == "Female"
              ? [
                  "https://images.unsplash.com/photo-1621820499272-1e2c427647b5?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80",
                ]
              : [
                  "https://plus.unsplash.com/premium_photo-1664476788423-7899ac87bd7f?q=80&w=2944&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                ], // Placeholder image
          ethnicity: match.Ethnicity,
          Dietary: match["Dietary Preference"],
          smoker: match.Smoker,
          drinker: match.Drinker,
          expectedRent: match["Expected Rent"],
          bedroomPreference: match["Bedroom Preference"],
        }));
      }

      try {
        const response = await axios.post(
          "http://127.0.0.1:5000/model/find_roommates",
          {
            Gender: genderOfInterest,
            Age: ageOfInterest,
            Ethnicity: selectedEthnicityOfInterest,
            Smoker: smokingOfInterest,
            Drinker: drinkingOfInterest,
            "Dietary Preference": dietaryOfInterest === "Vegetarian" 
            ? "Veg" 
            : dietaryOfInterest === "Non-Vegetarian" 
            ? "Non-Veg" 
            : "No Preference"

          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (
          typeof response.data === "string" &&
          response.data.includes("NaN")
        ) {
          response.data = JSON.parse(response.data.replace(/\bNaN\b/g, "null"));
        }

        if (response.data.status === "success") {
          matches = response.data.matches;

          // Transform the response data
          const transformedUsers = transformResponseData({ matches });

          dispatch(
            Actions.users.list.success({
              users: transformedUsers,
              nextPage: 1,
              hasMore: true,
            })
          );
        } else {
          console.error("Error:", response.data.message);
          // return [];
        }
      } catch (error) {
        console.error(
          "API call failed:",
          error.response?.data?.message || error.message
        );
        // return [];
      }

      // 다음 화면으로 이동

      navigation.navigate(SceneName.Main, {
        screen: SceneName.Swipe,
      });
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || moveindate;

    if (currentDate) {
      const dateOnly = new Date(currentDate);
      dateOnly.setHours(0, 0, 0, 0);
      setMoveindate(dateOnly);
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
            title="Age"
            placeholder="Please enter your age"
            value={age}
            onChangeText={(text) => {
              const numericText = text.replace(/[^0-9]/g, ""); //Only numbers are allowed
              setAge(numericText);
            }}
            maxLength={3}
            multiline
            keyboardType="numeric" // use numeric keyboard
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
            title="Email"
            placeholder="Please enter your email"
            value={email}
            onChangeText={(text) => {
              const emailText = text.replace(/[^a-zA-Z0-9@._-]/g, ""); // Only email-appropriate characters are allowed
              setEmail(emailText);
            }}
            maxLength={50}
            keyboardType="email-address" // use email keyboard
            autoCapitalize="none"
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
              {/* New values from the dataset */}
              <Picker.Item label="South Indian" value="South Indian" />
              <Picker.Item label="Hindu" value="Hindu" />
              <Picker.Item label="North Indian" value="North Indian" />
              <Picker.Item label="Muslim" value="Muslim" />
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
            data={["Veg", "Non-Veg"]}
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
            placeholder="Please enter your Budget per month in USD"
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
              backgroundColor: "maroon",
              marginVertical: 20,
            }}
          />
          <Text
            fontSize="h3"
            fontWeight="bold"
            style={{ color: "black", textAlign: "center" }}
          >
            Roommate Preference
          </Text>
          <View
            style={{
              height: 1,
              backgroundColor: "maroon",
              marginVertical: 20,
            }}
          />
          <RadioButtons
            title="Match with"
            data={["Male", "Female"]}
            value={genderOfInterest}
            onChange={setGenderOfInterest}
          />
          <Container style={{ marginVertical: 10 }} />
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
              <Picker.Item label="No Preference" value="No Preference" />
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
              {/* New values from the dataset */}
              <Picker.Item label="South Indian" value="South Indian" />
              <Picker.Item label="Hindu" value="Hindu" />
              <Picker.Item label="North Indian" value="North Indian" />
              <Picker.Item label="Muslim" value="Muslim" />
            </Picker>
          </View>

            <RadioButtons
            title="Dietary Preference"
            data={["Veg", "Non-Veg", "None"]}
            value={dietaryOfInterest}
            onChange={setDietaryOfInterest}
            />
            <RadioButtons
            title="Smoker"
            data={["No", "Yes", "Maybe"]}
            value={smokingOfInterest}
            onChange={setSmokingOfInterest}
            />
            <RadioButtons
            title="Drinker"
            data={["No", "Yes", "Maybe"]}
            value={drinkingOfInterest}
            onChange={setDrinkingOfInterest}
            />
            <Input
            title="Age"
            placeholder="Please enter your roommate's preferred age"
            value={ageOfInterest}
            onChangeText={(text) => {
              const numericText = text.replace(/[^0-9]/g, ""); //Only numbers are allowed
              setAgeOfInterest(numericText);
            }}
            maxLength={3}
            multiline
            keyboardType="numeric" // use numeric keyboard
          />

          {/* <Input
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
          /> */}
          {/* {userId && ( */}
          {/* <> */}
          <View
            style={{
              height: 1,
              backgroundColor: "maroon",
              marginVertical: 20,
            }}
          />
          <Text
            fontSize="h3"
            fontWeight="bold"
            style={{ color: "black", textAlign: "center" }}
          >
            Hometype
          </Text>
          <View
            style={{
              height: 1,
              backgroundColor: "maroon",
              marginVertical: 20,
            }}
          />
          <RadioButtons
            title="Apartment Type (number of bed)"
            data={["Studio", "1", "2+"]}
            value={apartmenttype}
            onChange={setApartmenttype}
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
              style={{ marginVertical: 20, alignSelf: "center" }}
            />
          </View>
          {/* </> */}
          {/* )} */}
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
