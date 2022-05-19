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
import { updateNameSurname } from "../store/actions/user";

import Colors from "../constants/Colors";
import CustomButton from "../components/sharedComp/customButton";
import CustomTextBox from "../components/sharedComp/blueInputBox";
import CustomButtonOutline from "../components/sharedComp/customOutlineButton";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const MyAccountScreen = (props) => {
  const currentUser = useSelector((state) => state.user);

  const dispatch = useDispatch();
  useEffect(() => {
    try {
      if (
        typeof currentUser.userID == "undefined" ||
        currentUser.userID == null
      ) {
        dispatch(authActions.autoLoginUser())
          .then(() => {})
          .catch((err) => {
            if (err.message === "NOT_FOUND") props.navigation.navigate("Login");
          });
      }
    } catch (err) {
      console.log(err);
    }
  }, [currentUser]);

  const [name, setName] = useState(currentUser ? currentUser.name : "");
  const [surname, setSurname] = useState(
    currentUser ? currentUser.surname : ""
  );
  const [email, setEmail] = useState(currentUser ? currentUser.email : "");
  const [password, setPassword] = useState("*******");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [changed, setChanged] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [numberOfChanges, setNumberOfChanges] = useState(0);
  const [numberOfChangesDone, setNumberOfChangesDone] = useState(0);
  const [saving, setSaving] = useState(false);

  const goBackHandler = () => {
    props.navigation.goBack();
  };

  const validateEmail = (mail) => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return true;
    }
    setErrorMessage("Invalid email address!");
    return false;
  };

  const validatePassword = (newPass, newConfirm) => {
    if (newPass != null && newConfirm != null && newPass.length >= 6) {
      if (newPass == currentUser.password) {
        setErrorMessage("Password is the same as the old password");
        return false;
      }
      if (newPass == newConfirm) {
        return true;
      } else {
        setErrorMessage("Password and confirm password does not match");
        return false;
      }
    } else {
      setErrorMessage("Password invalid, needs more than 5 characters");
      return false;
    }
  };

  const saveHandler = () => {
    setErrorMessage("");

    if (isValid && changed && confirmPassword.length >= 1) {
      //The password has changed
      console.log("password changed");
      var validPass = validatePassword(password, confirmPassword);
      if (validPass) {
        setNumberOfChanges(numberOfChanges + 1);
        setSaving(true);
        dispatch(authActions.updatePassword(currentUser.userID, password))
          .then(() => {
            setNumberOfChangesDone(numberOfChangesDone + 1);
          })
          .catch((err) => {
            setNumberOfChangesDone(numberOfChangesDone + 1);
            console.log(err);
          });
      }
    }

    if (isValid && changed && email != currentUser.email) {
      //email has changed
      console.log("email changed");
      var validEmail = validateEmail(email.trim());
      if (validEmail) {
        setNumberOfChanges(numberOfChanges + 1);
        setSaving(true);
      }
    }

    if (
      isValid &&
      changed &&
      (name != currentUser.name || surname != currentUser.surname)
    ) {
      console.log("name changed");
      setNumberOfChanges(numberOfChanges + 1);
      setSaving(true);
      dispatch(
        updateNameSurname(currentUser.userID, name.trim(), surname.trim())
      )
        .then(() => {
          setNumberOfChangesDone(numberOfChangesDone + 1);
        })
        .catch((err) => {
          setNumberOfChangesDone(numberOfChangesDone + 1);
          console.log(err);
        });
    }
  };

  useEffect(() => {
    if (numberOfChanges == numberOfChangesDone && saving == true) {
      setSaving(false);
      setIsValid(false);
    }
  }, [numberOfChanges, numberOfChangesDone]);

  useEffect(() => {
    if (
      name != currentUser.name ||
      surname != currentUser.surname ||
      email != currentUser.email ||
      password != "*******"
    ) {
      setChanged(true);
    } else {
      setChanged(false);
    }
    if (name != "" && surname != "" && email != "") {
      setIsValid(true);
    } else setIsValid(false);
  }, [name, surname, email, password, confirmPassword]);

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
        source={require("../assets/images/backgrounds/my_account_bg.png")}
      >
        <View style={styles.headerContainer}>
          <Image
            style={styles.headerIcon}
            source={require("../assets/images/icons/my_account_img.png")}
          />
          <Text style={styles.headerText}>My Account</Text>
        </View>
        <View style={styles.bodyContainer}>
          <Text style={styles.bodyLabel}>Login Details</Text>
          <View style={styles.input}>
            <CustomTextBox
              placeholder="First Name"
              value={name}
              textChange={(text) => {
                setName(cleanUpChars(text));
              }}
            />
          </View>
          <View style={styles.input}>
            <CustomTextBox
              placeholder="Last Name"
              value={surname}
              textChange={(text) => {
                setSurname(cleanUpChars(text));
              }}
            />
          </View>
          <View style={styles.input}>
            <CustomTextBox
              placeholder="Email"
              value={email}
              readOnly={true}
              textChange={(text) => {
                setEmail(text);
              }}
            />
          </View>
          <View style={styles.input}>
            <CustomTextBox
              placeholder="Password"
              value={password}
              secure={true}
              textChange={(text) => {
                setPassword(text);
              }}
            />
          </View>
          {password != "*******" ? (
            <View style={styles.input}>
              <CustomTextBox
                placeholder="Confirm Password"
                value={confirmPassword}
                secure={true}
                textChange={(text) => {
                  setConfirmPassword(text);
                }}
              />
            </View>
          ) : (
            <View />
          )}
          {errorMessage.length >= 1 ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>* {errorMessage} *</Text>
            </View>
          ) : (
            <View />
          )}
          {/* <View style={styles.deleteContainer}>
            <Text style={styles.deleteLabel}>Delete Account</Text>
            <CustomButtonOutline
              title="Proceed"
              buttonColor={Colors.secondary}
              size="40%"
            />
          </View> */}
        </View>
        <View style={styles.footerContainer}>
          <View style={styles.sideContainer}>
            <TouchableOpacity
              style={styles.backContainer}
              onPress={goBackHandler}
            >
              <Image
                style={styles.backImage}
                source={require("../assets/images/icons/blue_back_arrow.png")}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.middleContainer}>
            <CustomButton
              title="Save Changes"
              buttonColor={
                isValid && changed ? Colors.secondary : Colors.secondaryInactive
              }
              size="60%"
              disabled={!isValid}
              onPress={saveHandler}
              loading={saving}
            />
          </View>
          <View style={styles.sideContainer} />
        </View>
      </ImageBackground>
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
    alignItems: "center",
  },
  headerContainer: {
    width: "100%",
    height: windowHeight / 3.8,
    justifyContent: "center",
    alignItems: "center",
  },
  bodyContainer: {
    width: "100%",
    height: "55%",
  },
  footerContainer: {
    width: "100%",
    height: "20%",
    flexDirection: "row",
    alignItems: "center",
  },
  bodyLabel: {
    width: "100%",
    color: Colors.primary,
    fontFamily: "Bebas",
    fontSize: 25,
    textAlign: "left",
    paddingLeft: "10%",
  },
  headerIcon: {
    width: windowWidth / 6,
    height: windowWidth / 6,
    resizeMode: "stretch",
  },
  input: {
    width: "100%",
    height: windowHeight / 16,
    paddingHorizontal: "10%",
    marginVertical: "1%",
  },
  headerText: {
    color: "white",
    fontFamily: "Bebas",
    fontSize: 30,
  },
  deleteContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginTop: "5%",
  },
  deleteLabel: {
    width: "50%",
    color: Colors.primary,
    fontFamily: "Bebas",
    fontSize: 25,
    textAlign: "left",
    paddingLeft: "10%",
  },
  sideContainer: {
    width: "20%",
    alignItems: "center",
  },
  middleContainer: {
    width: "60%",
    alignItems: "center",
  },
  backContainer: {
    width: windowWidth / 10,
    height: windowWidth / 10,
  },
  backImage: {
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
  },
  errorContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: "5%",
    paddingHorizontal: "10%",
  },
  errorText: {
    width: "100%",
    color: Colors.primary,
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
  },
});

export default MyAccountScreen;
