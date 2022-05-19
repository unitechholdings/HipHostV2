import React, { useState } from "react";
import {
  StatusBar,
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import { useDispatch } from "react-redux";

import Colors from "../constants/Colors";
import CustomButton from "../components/sharedComp/customButton";
import CustomTextBox from "../components/sharedComp/customTextBox";

import * as authActions from "../store/actions/auth";
import { TouchableOpacity } from "react-native-gesture-handler";

const windowHeight = Dimensions.get("window").height;

const LoginScreen = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const loginPressHandler = () => {
    try {
      if (validEmailPassword()) {
        setLoading(true);
        dispatch(authActions.loginUser(email, password))
          .then(() => {
            setLoading(false);
            props.navigation.replace("Landing");
          })
          .catch((err) => {
            setLoading(false);
            if (err.message == "Email address not verified yet") {
              Alert.alert("Could not login", err.message, [
                {
                  text: "Resend verification",
                  onPress: () => resendVerification(),
                },
                { text: "Cancel", style: "cancel" },
              ]);
            } else {
              Alert.alert("Could not login", err.message, [{ text: "Okay" }]);
            }
          });
      } else
        Alert.alert(
          "Invalid email or password",
          "Please check your email and password",
          [{ text: "Okay" }]
        );
    } catch (err) {
      console.log(err);
    }
  };

  const resendVerification = () => {
    if (validEmailPassword()) {
      dispatch(authActions.resendVerificationEmail(email, password))
        .then(() => {
          Alert.alert(
            "Verification sent",
            "Please check your email for the link",
            [{ text: "Okay" }]
          );
        })
        .catch((err) => {
          Alert.alert(
            "Verification not sent",
            "Something went wrong when trying to send, please try again later",
            [{ text: "Okay" }]
          );
        });
    }
  };

  const signupPressHandler = () => {
    props.navigation.navigate("Signup");
  };

  const validEmailPassword = () => {
    var isValid = true;
    var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var emailTest = mailFormat.test(email);
    if (email.trim().length <= 0) isValid = false;
    if (!emailTest) isValid = false;
    if (password.length <= 0) isValid = false;
    return isValid;
  };

  const forgotPasswordHandler = () => {
    props.navigation.navigate("ForgotPass");
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <ImageBackground
        style={styles.mainBackground}
        source={require("../assets/images/backgrounds/login_bg.png")}
      >
        <View style={styles.inputContainer}>
          <View style={styles.iconContainer}>
            <Image
              style={styles.screenIcon}
              source={require("../assets/images/icons/logo.png")}
            />
          </View>

          <Text style={styles.title}>LOGIN</Text>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "position" : "padding"}
          >
            <View style={styles.subInputContainer}>
              <View style={styles.input}>
                <CustomTextBox
                  placeholder="Email"
                  keyType="email-address"
                  textChange={(text) => {
                    setEmail(text);
                  }}
                />
              </View>

              <View style={styles.input}>
                <CustomTextBox
                  style={styles.input}
                  placeholder="Password"
                  secure
                  textChange={(text) => {
                    setPassword(text);
                  }}
                />
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <CustomButton
                title="Login"
                buttonColor={Colors.secondary}
                size="60%"
                onPress={loginPressHandler}
                loading={loading}
              />
            </View>

            <Text style={styles.generalText}>or</Text>
            <View style={styles.buttonContainer}>
              <CustomButton
                title="Sign up"
                buttonColor={Colors.primary}
                size="60%"
                onPress={signupPressHandler}
              />
            </View>
          </KeyboardAvoidingView>
          <View style={styles.forgotContainer}>
            <TouchableOpacity
              onPress={forgotPasswordHandler}
              style={{ borderBottomWidth: 2, borderBottomColor: "white" }}
            >
              <Text style={styles.forgotText}>Forgot Password</Text>
            </TouchableOpacity>
          </View>
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
    resizeMode: "cover",
  },
  inputContainer: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: "10%",
  },
  subInputContainer: {
    width: "100%",
    height: windowHeight / 5,
    justifyContent: "center",
  },
  iconContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: "20%",
  },
  screenIcon: {
    //width: windowHeight / 5,
    height: windowHeight / 5,
    resizeMode: "contain",
  },
  title: {
    textAlign: "center",
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: "10%",
  },
  forgotText: {
    textAlign: "center",
    color: "white",
    fontSize: 15,
  },
  generalText: {
    color: "white",
    fontSize: 15,
    textAlign: "center",
    marginVertical: "5%",
  },
  input: {
    width: "100%",
    height: windowHeight / 12,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  forgotContainer: {
    justifyContent: "center",
    flexDirection: "row",
    marginTop: "5%",
  },
});

export default LoginScreen;
