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
var passedBackColor = "white";
var textColor = Colors.primary;

const MessageBox = (props) => {
  var passedBackColor = props.color;
  var textColor = Colors.primary;
  var messageObj = props.messageData;

  //set ascent color based on passed background color
  if (passedBackColor != "white") textColor = "white";
  else textColor = Colors.primary;
  //////////////////////////////////////////////////

  const getTime = () => {
    if (typeof messageObj.latestTime != "undefined") {
      var d = new Date(messageObj.latestTime);
      var hr = d.getHours();
      var min = d.getMinutes();
      if (min < 10) {
        min = "0" + min;
      }
      var amPm = "am";
      if (hr > 12) {
        hr -= 12;
        amPm = "pm";
      }
      return hr + ":" + min + amPm;
    } else return "";
  };

  const getMessage = () => {
    if (typeof messageObj.latestMessage != "undefined") {
      var message = messageObj.latestMessage;
      if (message.length >= 25) {
        message = message.substring(0, 25) + "...";
      }
      return message;
    }

    return "";
  };

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: passedBackColor,
        borderColor: textColor,
      }}
    >
      <View style={styles.profilePicContainer}>
        {props.hostImage ? (
          <Image style={styles.profilePic} source={{ uri: props.hostImage }} />
        ) : (
          <Image
            style={styles.profilePic}
            source={require("../../assets/images/inAppImages/profile_placeholder.png")}
          />
        )}
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.nameContainer}>
          <Text style={{ ...styles.nameText, color: textColor }}>
            {messageObj.otherPersonName}
          </Text>
        </View>
        <View style={styles.messageContainer}>
          <Text style={{ ...styles.messageText, color: textColor }}>
            {getMessage()}
          </Text>
        </View>
      </View>
      <View style={styles.timeContainer}>
        <View style={styles.nameContainer}>
          <Text style={{ ...styles.timeText, color: textColor }}>
            {getTime()}
          </Text>
        </View>
        <View style={styles.messageContainer}>
          <View style={styles.checkContainer}>
            <AntDesign name="check" size={12} color={textColor} />
            <AntDesign name="check" size={12} color={textColor} />
          </View>
        </View>
      </View>
      <View style={styles.arrowContainer}>
        <AntDesign name="right" size={24} color={textColor} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: windowWidth,
    height: 80,
    backgroundColor: passedBackColor,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 2,
    borderColor: Colors.primary,
  },
  profilePicContainer: {
    borderRadius: windowWidth / 2,
    borderColor: Colors.primary,
    borderWidth: 3,
    overflow: "hidden",
    marginLeft: "5%",
  },
  contentContainer: {
    width: "50%",
    paddingLeft: "5%",
  },
  timeContainer: {
    width: "20%",
    alignItems: "flex-end",
  },
  arrowContainer: {
    width: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  profilePic: {
    width: windowWidth / 8,
    height: windowWidth / 8,
  },
  nameContainer: {},
  nameText: {
    color: textColor,
    fontSize: 12,
  },
  messageContainer: {
    marginTop: "2%",
  },
  messageText: {
    color: textColor,
    fontSize: 10,
  },
  timeText: {
    color: textColor,
    fontSize: 12,
    marginBottom: "5%",
  },
  checkContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
});

export default MessageBox;
