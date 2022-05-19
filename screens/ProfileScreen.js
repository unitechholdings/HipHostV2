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
import CustomButton from "../components/sharedComp/customButton";
import { AntDesign } from "@expo/vector-icons";

const windowWidth = Dimensions.get("window").width;

const ProfileScreen = (props) => {
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

  const logoutHandler = () => {
    try {
      dispatch(authActions.logout())
        .then(() => {
          props.navigation.navigate("Login");
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const goToMyAccountHandler = () => {
    props.navigation.navigate("MyAccount");
  };

  const goToDemographicHandler = () => {
    props.navigation.navigate("PersonalitySetup", { editMode: true });
  };

  const goToProfileSetupHandler = () => {
    props.navigation.navigate("ProfileSetup", { editMode: true });
  };

  const goToFAQHandler = () => {
    props.navigation.navigate("FAQ");
  };

  const goToWalletHandler = () => {
    props.navigation.navigate("Wallet");
  };

  const goBackHandler = () => {
    props.navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <ImageBackground
        style={styles.mainBackground}
        source={require("../assets/images/backgrounds/my_profile_bg.png")}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.nameText}>
            {currentUser.name + " " + currentUser.surname}
          </Text>
        </View>
        <View style={styles.bodyContainer}>
          <Text style={styles.bodyLabel}>My Profile</Text>
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={goToMyAccountHandler}
          >
            <View style={styles.iconContainer}>
              <Image
                style={styles.iconImage}
                source={require("../assets/images/icons/my_account_icon.png")}
              />
            </View>
            <View style={styles.labelContainer}>
              <Text style={styles.text}>My Account</Text>
            </View>
            <View style={styles.arrowContainer}>
              <AntDesign name="right" size={24} color={Colors.primary} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={goToDemographicHandler}
          >
            <View style={styles.iconContainer}>
              <Image
                style={styles.iconImage}
                source={require("../assets/images/icons/demographics_icon_blue.png")}
              />
            </View>
            <View style={styles.labelContainer}>
              <Text style={styles.text}>Demographics</Text>
            </View>
            <View style={styles.arrowContainer}>
              <AntDesign name="right" size={24} color={Colors.primary} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={goToProfileSetupHandler}
          >
            <View style={styles.iconContainer}>
              <Image
                style={styles.iconImage}
                source={require("../assets/images/icons/social_sharing_icon_blue.png")}
              />
            </View>
            <View style={styles.labelContainer}>
              <Text style={styles.text}>Personality</Text>
            </View>
            <View style={styles.arrowContainer}>
              <AntDesign name="right" size={24} color={Colors.primary} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={goToFAQHandler}
          >
            <View style={styles.iconContainer}>
              <Image
                style={styles.iconImage}
                source={require("../assets/images/icons/faq_icon_blue.png")}
              />
            </View>
            <View style={styles.labelContainer}>
              <Text style={styles.text}>FAQ's</Text>
            </View>
            <View style={styles.arrowContainer}>
              <AntDesign name="right" size={24} color={Colors.primary} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={goToWalletHandler}
          >
            <View style={styles.iconContainer}>
              <Image
                style={styles.iconImage}
                source={require("../assets/images/icons/wallet_icon_inverted.png")}
              />
            </View>
            <View style={styles.labelContainer}>
              <Text style={styles.text}>Wallet</Text>
            </View>
            <View style={styles.arrowContainer}>
              <AntDesign name="right" size={24} color={Colors.primary} />
            </View>
          </TouchableOpacity>
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
              title="Logout"
              buttonColor={Colors.secondary}
              size="60%"
              onPress={logoutHandler}
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
    height: "25%",
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
  nameText: {
    width: "100%",
    color: "white",
    fontFamily: "Bebas",
    fontSize: 35,
    textAlign: "center",
  },
  bodyLabel: {
    width: "100%",
    color: Colors.primary,
    fontFamily: "Bebas",
    fontSize: 25,
    textAlign: "left",
    paddingLeft: "10%",
    marginTop: "5%",
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
  itemContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderBottomWidth: 1,
    paddingHorizontal: "10%",
    paddingVertical: "2%",
  },

  iconContainer: {
    width: windowWidth / 10,
    height: windowWidth / 10,
  },
  iconImage: {
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
  },
  labelContainer: {
    flex: 1,
    paddingLeft: "5%",
  },
  text: {
    color: Colors.primary,
    fontSize: 15,
  },
  arrowContainer: {},
});

export default ProfileScreen;
