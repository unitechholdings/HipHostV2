import React from "react";
import {
  View,
  ImageBackground,
  StyleSheet,
  TextInput,
  Keyboard,
} from "react-native";

import Colors from "../../constants/Colors";

const CustomTextBox = (props) => {
  return (
    <View style={styles.container}>
      <ImageBackground style={styles.bgContainer} source={props.image}>
        <TextInput
          style={styles.input}
          placeholder={props.placeholder}
          onChangeText={props.textChange}
          secureTextEntry={props.secure ? true : false}
          value={props.value}
          onTouchStart={props.onFocus}
          onFocus={props.dismiss ? Keyboard.dismiss() : null}
        />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  bgContainer: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 8,
  },
  input: {
    width: "100%",
    height: "100%",
    paddingLeft: "18%",
    color: Colors.primary,
    alignItems: "center",
    paddingBottom: 5,
  },
});

export default CustomTextBox;
