import React from "react";
import {
  StatusBar,
  View,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  Text,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import * as authActions from "../store/actions/auth";

import Colors from "../constants/Colors";

const SplashScreen = (props) => {
  const dispatch = useDispatch();
  const loginPressHandler = () => {
    dispatch(authActions.autoLoginUser())
      .then(() => {
        props.navigation.replace("Landing");
      })
      .catch((err) => {
        props.navigation.replace("Login");
      });
  };
  loginPressHandler();

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <ImageBackground
        style={styles.mainBackground}
        source={require("../assets/images/backgrounds/splash_bg.png")}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.text}>Trying to log you in...</Text>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainBackground: {
    flex: 1,
    resizeMode: "stretch",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    color: "white",
  },
  text: {
    color: "white",
  },
});

export default SplashScreen;
