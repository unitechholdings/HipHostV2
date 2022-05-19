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
  Modal,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import { useDispatch } from "react-redux";

import Colors from "../constants/Colors";
import CustomButton from "../components/sharedComp/customButton";
import CustomTextBox from "../components/sharedComp/customTextBox";

import * as authActions from "../store/actions/auth";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const SignupScreen = (props) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const signupPressHandler = () => {
    setLoading(true);
    if (validPassword() && validEmail()) {
      if (firstName.trim().length > 0 && lastName.trim().length > 0) {
        dispatch(authActions.signupUser(firstName, lastName, email, password))
          .then(() => {
            setLoading(false);
            setShowModal(true);
            //props.navigation.goBack();
          })
          .catch((err) => {
            setLoading(false);
            Alert.alert("Could not signup", err.message, [{ text: "Okay" }]);
          });
      } else {
        setLoading(false);
        Alert.alert("Invalid fields", "All fields are required", [
          { text: "Okay" },
        ]);
      }
    } else {
      setLoading(false);
      Alert.alert(
        "Invalid email or password",
        "Please check your email and password",
        [{ text: "Okay" }]
      );
    }
  };
  const backPressHandler = () => {
    props.navigation.goBack();
  };
  const validPassword = () => {
    var valid = false;
    if (password.length >= 6 && password === confirmedPassword) valid = true;
    return valid;
  };
  const validEmail = () => {
    var valid = false;
    var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var emailTest = mailFormat.test(email);
    if (email.trim().length > 0 && emailTest) valid = true;
    return valid;
  };

  const continueHandler = () => {
    setShowModal(false);
    props.navigation.goBack();
  };

  const cleanUpChars = (text) => {
    if (text.length == 1 && text == " ") return text.trim();
    text = text.replace(/[^A-Za-z //-]/g, "");
    text = text.replace("  ", " ");
    return text;
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <ImageBackground
        style={styles.mainBackground}
        source={require("../assets/images/backgrounds/blue_bg.png")}
      >
        <Modal animationType="slide" transparent={true} visible={showModal}>
          <View style={styles.modalMainContainer}>
            <View style={styles.modalContainer}>
              <View style={styles.modalIconContainer}>
                <Image
                  style={styles.modalIcon}
                  source={require("../assets/images/icons/happy_hiphost.png")}
                />
              </View>
              <Text style={styles.modalText}>
                Thanks! You've received a verification email. Please click the
                link on your email to verify the address and complete your
                registration.
              </Text>
              <View style={styles.buttonContainer}>
                <CustomButton
                  title="Continue"
                  buttonColor={Colors.secondary}
                  size="60%"
                  onPress={continueHandler}
                />
              </View>
            </View>
          </View>
        </Modal>
        <View style={styles.inputContainer}>
          <View style={styles.iconContainer}>
            <Image
              style={styles.screenIcon}
              source={require("../assets/images/icons/logo2.png")}
            />
          </View>
          <Text style={styles.title}>SIGN UP</Text>
          <KeyboardAvoidingView behavior="position" style={{ height: "60%" }}>
            <View style={styles.input}>
              <CustomTextBox
                style={styles.input}
                placeholder="First Name"
                textChange={(text) => {
                  setFirstName(cleanUpChars(text));
                }}
                value={firstName}
              />
            </View>
            <View style={styles.input}>
              <CustomTextBox
                style={styles.input}
                placeholder="Last Name"
                textChange={(text) => {
                  setLastName(cleanUpChars(text));
                }}
                value={lastName}
              />
            </View>
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
            <View style={styles.input}>
              <CustomTextBox
                style={styles.input}
                placeholder="Password"
                textChange={(text) => {
                  setPassword(text);
                }}
                secure
              />
            </View>
            <View style={styles.input}>
              <CustomTextBox
                style={styles.input}
                placeholder="Confirm Password"
                textChange={(text) => {
                  setConfirmedPassword(text);
                }}
                secure
              />
            </View>
            <View style={styles.buttonContainer}>
              <CustomButton
                title="Join now"
                buttonColor={Colors.secondary}
                size="60%"
                onPress={signupPressHandler}
                loading={loading}
              />
            </View>
          </KeyboardAvoidingView>
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
    //flex: 1,
    marginHorizontal: "10%",
    justifyContent: "center",
  },
  iconContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: windowHeight / 20,
  },
  screenIcon: {
    //width: windowHeight / 5,
    height: windowHeight / 8,
    resizeMode: "contain",
  },
  title: {
    textAlign: "center",
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: "10%",
  },
  input: {
    height: 50,
    marginBottom: "5%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  backButtonContainer: {
    width: 50,
    height: 50,
    marginLeft: "5%",
    marginBottom: windowHeight / 10,
  },
  backButton: {
    resizeMode: "stretch",
    width: windowWidth / 8.5,
    height: windowWidth / 8.5,
  },
  modalMainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    height: "50%",
    justifyContent: "space-evenly",
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    paddingHorizontal: "10%",
    borderRadius: 10,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
  },
  modalText: {
    color: Colors.primary,
    textAlign: "center",
  },
  modalIconContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  modalIcon: {
    width: windowWidth / 4.5,
    height: windowWidth / 3.5,
    resizeMode: "stretch",
  },
});

export default SignupScreen;
