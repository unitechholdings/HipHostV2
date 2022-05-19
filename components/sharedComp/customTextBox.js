import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  Keyboard,
} from "react-native";

import Colors from "../../constants/Colors";

const windowHeight = Dimensions.get("window").height;

const CustomTextBox = (props) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={props.placeholder}
        value={props.value}
        onChangeText={props.textChange}
        secureTextEntry={props.secure ? true : false}
        keyboardType={props.keyType ? props.keyType : "default"}
        blurOnSubmit={false}
        onSubmitEditing={() => Keyboard.dismiss()}
      ></TextInput>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: windowHeight / 80,
    paddingHorizontal: 10,
  },
});

export default CustomTextBox;
