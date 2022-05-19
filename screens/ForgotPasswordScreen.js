import React, { useState } from "react";
import {
  StatusBar,
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useDispatch } from "react-redux";

import Colors from "../constants/Colors";
import CustomButton from "../components/sharedComp/customButton";
import CustomTextBox from "../components/sharedComp/customTextBox";

import * as authActions from "../store/actions/auth";

const ForgotPasswordScreen = (props) => {
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();
  const submitPressHandler = () => {
    if (validEmail()) {
      dispatch(authActions.resetPassword(email))
        .then(() => {
          Alert.alert(
            "Email sent",
            "A password reset email has been sent to you",
            [{ text: "Okay" }]
          );
        })
        .catch((err) => {
          Alert.alert("Could not reset password", err.message, [
            { text: "Okay" },
          ]);
        });
    } else
      Alert.alert("Invalid email", "Please check your email", [
        { text: "Okay" },
      ]);
  };
  const backPressHandler = () => {
    props.navigation.goBack();
  };

  const validEmail = () => {
    var valid = false;
    var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email.length > 0 && email.match(mailFormat)) valid = true;
    return valid;
  };
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <ImageBackground
        style={styles.mainBackground}
        source={require("../assets/images/backgrounds/blue_bg.png")}
      >
        <View style={styles.inputContainer}>
          <View style={styles.iconContainer}>
            <Image
              style={styles.screenIcon}
              source={require("../assets/images/icons/logo2.png")}
            />
          </View>
          <Text style={styles.title}>RESET PASSWORD</Text>
          <View style={styles.input}>
            <CustomTextBox
              style={styles.input}
              placeholder="Email"
              textChange={(text) => {
                setEmail(text);
              }}
              keyType="email-address"
            />
          </View>
          <View style={styles.buttonContainer}>
            <CustomButton
              title="Reset"
              buttonColor={Colors.secondary}
              size="60%"
              onPress={submitPressHandler}
            />
          </View>
        </View>
        <TouchableOpacity
          style={styles.backButtonContainer}
          onPress={backPressHandler}
        >
          <Image
            style={styles.backButton}
            source={require("../assets/images/icons/backButton.png")}
          />
        </TouchableOpacity>
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
    resizeMode: "cover",
  },
  inputContainer: {
    flex: 1,
    margin: "10%",
  },
  iconContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: "15%",
  },
  screenIcon: {
    width: 140,
    height: 120,
    resizeMode: "stretch",
  },
  title: {
    textAlign: "center",
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: "10%",
  },
  input: {
    //flex: 1,
    height: "20%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  backButtonContainer: {
    width: 50,
    height: 50,
    marginLeft: "5%",
    marginBottom: "5%",
  },
  backButton: {
    resizeMode: "stretch",
    width: 50,
    height: 50,
  },
});

export default ForgotPasswordScreen;
