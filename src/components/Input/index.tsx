import React from "react";
import { TextInputProps, View, Text as RNText } from "react-native";
import { CancelIcon, CancelTouchArea, Content, TextInput } from "./styles";
import Text from "~components/Text";

interface SearchProps extends TextInputProps {
  title: string;
  errorMessage?: string; // New prop for error messages
}

const Input: React.FC<SearchProps> = ({ title, errorMessage, ...props }) => {
  return (
    <View style={{ marginTop: 15 }}>
      {/* Title */}
      <Text fontWeight="bold" fontSize="large">
        {title}
      </Text>

      {/* Input Field */}
      <Content>
        <TextInput {...props} />
        {!!props.value && (
          <CancelTouchArea onPress={() => props.onChangeText?.("")}>
            <CancelIcon />
          </CancelTouchArea>
        )}
      </Content>

      {/* Error Message */}
      {errorMessage && (
        <RNText style={{ color: "red", fontSize: 12, marginTop: 5 }}>
          {errorMessage}
        </RNText>
      )}
    </View>
  );
};

export default Input;
