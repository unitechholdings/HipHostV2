import React, { useState, useEffect } from "react";
import {
  StatusBar,
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Alert,
  Dimensions,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import * as authActions from "../store/actions/auth";
import {
  setPushToken,
  updateIsHost,
  updateLoggedInAs,
} from "../store/actions/user";
import { getUnreadMessages } from "../store/actions/chats";

import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";

import Colors from "../constants/Colors";
import CustomButton from "../components/sharedComp/customButton";

const windowHeight = Dimensions.get("window").height;

const LandingScreen = (props) => {
  const currentUser = useSelector((state) => state.user);
  const chats = useSelector((state) => state.chats);
  const [attempts, setAttempts] = useState(0);
  const [loadMessageCount, setLoadMessageCount] = useState(false);

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
      } else {
        if (attempts == 0) {
          console.log("typeOfdata: " + typeof currentUser.token);
          console.log("current: " + currentUser.token);
          if (
            typeof currentUser.token == "undefined" ||
            currentUser.token == null
          ) {
            getPushNotificationPermissions(null);
            setAttempts(1);
          } else {
            getPushNotificationPermissions(currentUser.token);
            setAttempts(1);
          }
        }
      }
    } catch (err) {
      console.log(err);
      props.navigation.navigate("Login");
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && typeof currentUser.chats != "undefined") {
      if (
        chats &&
        typeof chats.messageCount != "undefined" &&
        loadMessageCount == false
      ) {
        dispatch(getUnreadMessages(currentUser))
          .then(() => {
            setLoadMessageCount(true);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }, [chats.messageCount]);

  async function getPushNotificationPermissions(currentToken) {
    try {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;

      // only ask if permissions have not already been determined, because
      // iOS won't necessarily prompt the user a second time.
      if (existingStatus !== "granted") {
        // Android remote notification permissions are granted during the app
        // install, so this will only ask on iOS
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }

      // Stop here if the user did not grant permissions
      if (finalStatus !== "granted") {
        return;
      }
      console.log("notification permissions: " + finalStatus);

      // Get the token that uniquely identifies this device
      let experienceId = undefined;
      if (!Constants.manifest) {
        // Absence of the manifest means we're in bare workflow
        experienceId = "@jacques_steyn/hip-host";
      }
      var token = await Notifications.getExpoPushTokenAsync({ experienceId });

      if (typeof token.data != "undefined" && currentToken == null) {
        dispatch(setPushToken(currentUser.userID, token.data))
          .then(() => {})
          .catch((err) => {});
      } else if (
        typeof token.data != "undefined" &&
        currentToken != null &&
        currentToken != token.data
      ) {
        dispatch(setPushToken(currentUser.userID, token.data))
          .then(() => {})
          .catch((err) => {});
      }
    } catch (er) {
      console.log(er);
    }
  }

  const setIsHostHandler = () => {
    setLoggedInAs("host");
    try {
      dispatch(updateIsHost(currentUser.userID))
        .then(() => {})
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const setLoggedInAs = (type) => {
    try {
      dispatch(updateLoggedInAs(type));
    } catch (err) {
      console.log(err);
    }
  };

  const userPressHandler = () => {
    try {
      if (currentUser) {
        setLoggedInAs("user");
        if (
          typeof currentUser.profileComplete == "undefined" ||
          currentUser.profileComplete == false
        ) {
          props.navigation.navigate("ProfileSetup");
        } else if (
          currentUser.demographicsComplete == "undefined" ||
          currentUser.demographicsComplete == false
        ) {
          props.navigation.navigate("PersonalitySetup", { editMode: false });
        } else props.navigation.navigate("Explore");
      } else {
        props.navigation.navigate("Login");
      }
    } catch (err) {
      console.log(err);
      props.navigation.navigate("Login");
    }
  };

  const hostPressHandler = () => {
    try {
      if (currentUser) {
        setIsHostHandler();
        if (
          typeof currentUser.profileComplete == "undefined" ||
          currentUser.profileComplete == false
        )
          props.navigation.navigate("ProfileSetup");
        else if (
          currentUser.demographicsComplete == "undefined" ||
          currentUser.demographicsComplete == false
        )
          props.navigation.navigate("PersonalitySetup", { editMode: false });
        else props.navigation.navigate("HostDashboard");
      } else {
        props.navigation.navigate("Login");
      }
    } catch (err) {
      console.log(err);
      props.navigation.navigate("Login");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <ImageBackground
        style={styles.mainBackground}
        source={require("../assets/images/backgrounds/landing_bg.png")}
      >
        <View style={styles.inputContainer}>
          <View style={styles.buttonContainer}>
            <CustomButton
              title="User"
              buttonColor={Colors.primary}
              size="60%"
              onPress={userPressHandler}
            />
          </View>
          <Text style={{ ...styles.generalText, color: Colors.primary }}>
            Connect and explore
          </Text>
          <View style={styles.buttonContainer}>
            <CustomButton
              title="Host"
              buttonColor={Colors.secondary}
              size="60%"
              onPress={hostPressHandler}
            />
          </View>
          <Text style={{ ...styles.generalText, color: Colors.secondary }}>
            Show off your city
          </Text>
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
  },
  screenIcon: {
    width: windowHeight / 4,
    height: windowHeight / 4,
    resizeMode: "stretch",
  },
  generalText: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
    marginTop: "3%",
    marginBottom: "10%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});

export default LandingScreen;
