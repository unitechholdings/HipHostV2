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
  var TextElement = <Text style={{...styles.labelText, color:props.buttonColor}}>{props.title}</Text>;
  if (props.loading)
    TextElement = (
      <ActivityIndicator style={{...styles.spinner, color:props.buttonColor}} size="small" color="#ffffff" />
    );

  return (
    <TouchableOpacity
      style={{
        ...styles.container,
        borderColor: props.buttonColor,
        borderWidth:1,
        width: props.size,
      }}
      onPress={props.onPress}
      disabled={props.disabled ? props.disabled : false}
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
