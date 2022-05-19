import React from "react";
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import Colors from "../../constants/Colors";

const customButton = (props) => {
  var TextElement = <Text style={styles.labelText}>{props.title}</Text>;
  if (props.loading)
    TextElement = (
      <ActivityIndicator style={styles.spinner} size="small" color="#ffffff" />
    );

  var isDisabled = true;
  if (props.disabled) {
    isDisabled = props.disabled;
  } else if (props.loading && props.loading == true) {
    isDisabled = true;
  } else isDisabled = false;

  return (
    <TouchableOpacity
      style={{
        ...styles.container,
        backgroundColor: props.buttonColor,
        width: props.size,
      }}
      onPress={props.onPress}
      disabled={isDisabled}
    >
      {TextElement}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  labelText: {
    color: "white",
    fontSize: 15,
    margin: 10,
  },
  spinner: {
    height: 20,
    margin: 14,
  },
});

export default customButton;
