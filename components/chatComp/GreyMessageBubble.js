import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import Colors from "../../constants/Colors";
import { AntDesign } from "@expo/vector-icons";

const windowWidth = Dimensions.get("window").width;

const MessageBubble = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.bubbleContainer}>
        <View style={styles.arrowContainer}>
          <Image
            style={styles.arrow}
            source={require("../../assets/images/compBackgrounds/grey_bubble_arrow.png")}
          />
        </View>
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>{props.text}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: windowWidth,
    marginVertical: "4%",
  },
  bubbleContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-start",
    marginLeft: "2%",
  },
  messageContainer: {
    width: "60%",
    backgroundColor: "#dee0e0",
    padding: "2%",
    borderRadius: 5,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
  },
  arrow: {},
  messageText: {
    color: "black",
  },
  arrowContainer: {
    elevation: 9,
  },
});

export default MessageBubble;
