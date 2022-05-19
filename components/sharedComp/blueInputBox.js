import React from "react";
import { View, Text, StyleSheet, TextInput, Dimensions } from "react-native";

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
        editable={props.readOnly ? false : true}
        secureTextEntry={props.secure ? true : false}
        keyboardType={props.keyType ? props.keyType : "default"}
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
    height: windowHeight / 16,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderColor: Colors.primary,
    color: Colors.primary,
  },
});

export default CustomTextBox;
