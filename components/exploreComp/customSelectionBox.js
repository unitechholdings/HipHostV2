import React from "react";
import {
  View,
  ImageBackground,
  StyleSheet,
  TextInput,
  Keyboard,
  Text,
  TouchableWithoutFeedback,
} from "react-native";

import Colors from "../../constants/Colors";

const CustomSelectionBox = (props) => {
  return (
    <View style={styles.container}>
      <ImageBackground style={styles.bgContainer} source={props.image}>
        <TouchableWithoutFeedback onPress={props.onPress}>
          <View style={styles.input}>
            {props.value != null && props.value.length > 0 ? (
              <Text style={styles.inputText}>{props.value}</Text>
            ) : (
              <Text style={styles.inputTextPlaceholder}>
                {props.placeholder}
              </Text>
            )}
          </View>
        </TouchableWithoutFeedback>
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
    justifyContent: "center",
    paddingLeft: "4%",
    paddingBottom: "1%",
  },
  inputText: {
    paddingLeft: 50,
    color: Colors.primary,
  },
  inputTextPlaceholder: {
    paddingLeft: 50,
    color: "#a8a7a7",
  },
});

export default CustomSelectionBox;
