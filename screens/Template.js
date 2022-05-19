import React, { useState, useEffect } from "react";
import {
  StatusBar,
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import { useSelector, useDispatch } from "react-redux";
import * as authActions from "../store/actions/auth";

import Colors from "../constants/Colors";

const windowWidth = Dimensions.get("window").width;

const TemplateScreen = (props) => {
  const currentUser = useSelector((state) => state.user);

  const dispatch = useDispatch();
  if (typeof currentUser.userID == "undefined" || currentUser.userID == null) {
    dispatch(authActions.autoLoginUser())
      .then(() => {})
      .catch((err) => {
        if (err.message === "NOT_FOUND") props.navigation.navigate("Login");
      });
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <ImageBackground
        style={styles.mainBackground}
        source={require("../assets/images/backgrounds/trans_overlay_bg.png")}
      ></ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  mainBackground: {
    flex: 1,
    resizeMode: "stretch",
    paddingTop: "10%",
    alignItems: "center",
  },
});

export default TemplateScreen;
