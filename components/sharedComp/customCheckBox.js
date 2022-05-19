import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
  Linking,
} from "react-native";

import Colors from "../../constants/Colors";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const CustomCheckBox = (props) => {
  const [isActive, setIsActive] = useState(false);
  return (
    <View style={{ ...styles.container, minWidth: props.columns }}>
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={props.onPress}>
        <View style={styles.checkContainer}>
          <View
            style={{
              ...styles.box,
              borderColor: props.color,
              backgroundColor:
                props.selected && props.id === props.selected
                  ? props.color == Colors.primary
                    ? Colors.primary
                    : "white"
                  : "transparent",
            }}
          ></View>
          <View style={styles.titleContainer}>
            <Text
              style={{
                ...styles.title,
                color: props.color,
                textDecorationLine: props.underline ? "underline" : "none",
              }}
              onPress={() =>
                props.link ? Linking.openURL(props.link) : () => {}
              }
            >
              {props.title}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: "5%",
    marginRight: "5%",
    minWidth: "25%",
  },
  checkContainer: {
    flexDirection: "row",
  },
  box: {
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 5,
    width: windowWidth / 15,
    height: windowWidth / 15,
  },
  titleContainer: {
    paddingLeft: 10,
    alignContent: "center",
  },
  title: {
    color: "white",
  },
});

export default CustomCheckBox;
