import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
} from "react-native";

import Colors from "../../constants/Colors";
import { Feather } from "@expo/vector-icons";

import ExpandingTextInput from "../chatComp/ExpandingTextInput";
import { SafeAreaView } from "react-native-safe-area-context";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const NewMessageBox = (props) => {
  const [newMessage, setMessage] = useState("");

  sendPushNotification = async () => {
    const message = {
      to: props.messageData.token,
      title: props.messageData.name,
      body: newMessage,
      sound: "default",
      badge: props.messageData.chatCount + 1,
      data: { data: "goes here" },
      _displayInForeground: true,
    };
    fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    })
      .then((response) => response.json())
      .then(console.log)
      .catch(console.error);
  };

  const sendHandler = () => {
    if (newMessage != "") {
      props.onSend(newMessage);
      Keyboard.dismiss();
      if (props.messageData.token) sendPushNotification();
      setMessage("");
    }
  };
  return (
    <ImageBackground
      style={styles.container}
      source={require("../../assets/images/backgrounds/blue_bg.png")}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentContainer}>
          <ExpandingTextInput
            style={styles.input}
            value={newMessage}
            onChangeText={(text) => {
              setMessage(text);
            }}
          />
        </View>

        <TouchableOpacity style={styles.sendContainer} onPress={sendHandler}>
          <Feather name="send" size={24} color="white" />
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  safeArea: {
    flexDirection: "row",
    marginHorizontal: "4%",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    height: "100%",
  },
  sendContainer: {
    height: "100%",
    width: windowWidth * 0.15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "5%",
  },
  contentContainer: {
    width: "80%",
    height: "100%",
    justifyContent: "center",
  },
  input: {
    width: "100%",
    height: "100%",
    minHeight: 40,
    color: Colors.primary,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "white",
    padding: "4%",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
    marginTop: Platform.OS == "android" ? "10%" : 0,
  },
});

export default NewMessageBox;
