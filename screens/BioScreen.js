import React, { useState } from "react";
import {
  StatusBar,
  View,
  StyleSheet,
  ImageBackground,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { useDispatch } from "react-redux";
import CustomButton from "../components/sharedComp/customButton";
import Colors from "../constants/Colors";

import * as userActions from "../store/actions/user";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const BioScreen = (props) => {
  const bio = props.navigation.getParam("bio");
  const userID = props.navigation.getParam("userID");
  const [bioText, setBioText] = useState(bio ? bio : "");
  const [isLoading, setIsLoading] = useState(false);

  const textChangeHandler = (text) => {
    try {
      setBioText(text);
    } catch (err) {
      console.log(err);
    }
  };

  const goBackHandler = () => {
    props.navigation.goBack();
  };

  const dispatch = useDispatch();
  const submitHandler = () => {
    try {
      if (bioText && bioText.length > 0 && userID && bioText != bio) {
        setIsLoading(true);
        dispatch(userActions.updateBio(userID, bioText))
          .then(() => {
            setIsLoading(false);
            props.navigation.goBack();
          })
          .catch((err) => {
            setIsLoading(false);
            Alert.alert("Could not save", err.message, [{ text: "Okay" }]);
          });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const cleanUpChars = (text) => {
    if (text.length == 1 && text == " ") return text.trim();
    text = text.replace("  ", " ");
    return text;
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <ImageBackground
        style={styles.mainBackground}
        source={require("../assets/images/backgrounds/trans_overlay_bg.png")}
      >
        <Text style={styles.headerText}>Update your bio</Text>
        <View style={styles.bioContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.bioInput}
              multiline={true}
              maxLength={50}
              value={bioText}
              onChangeText={(text) => textChangeHandler(cleanUpChars(text))}
              placeholder="Type response here..."
              textAlignVertical="top"
            />
          </View>
          <View style={styles.buttonContainer}>
            <CustomButton
              title="Submit"
              buttonColor={Colors.primary}
              size="50%"
              onPress={submitHandler}
              loading={isLoading}
            />
          </View>
        </View>
        <View style={styles.countContainer}>
          <Text style={styles.countText}>{bioText.length}/50</Text>
        </View>
        <View style={styles.backContainer}>
          <TouchableOpacity
            style={styles.backIconContainer}
            onPress={goBackHandler}
          >
            <Image
              style={styles.backIcon}
              source={require("../assets/images/icons/blue_back_arrow.png")}
            />
          </TouchableOpacity>
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
    paddingTop: "10%",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    width: "100%",
    color: Colors.primary,
    fontSize: 30,
    textAlign: "center",
    fontFamily: "Bebas",
    marginBottom: "10%",
    marginTop: windowHeight / 20,
  },
  bioContainer: {
    width: "80%",
    height: windowHeight / 2,
    borderColor: Colors.primary,
    borderWidth: 2,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "white",
  },
  inputContainer: {
    width: "100%",
    height: "80%",
    padding: "10%",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "flex-end",
    paddingRight: "5%",
  },
  bioInput: {
    width: "100%",
    height: "100%",
    color: Colors.primary,
  },
  countContainer: {
    width: "80%",
    height: "25%",
    paddingRight: "5%",
  },
  countText: {
    width: "100%",
    color: Colors.primary,
    fontSize: 15,
    textAlign: "right",
  },
  backContainer: {
    width: "100%",
    height: windowHeight / 10,
    justifyContent: "center",
    paddingLeft: "8%",
    marginBottom:windowHeight / 10
  },
  backIconContainer: {
    width: windowWidth / 8,
    height: windowWidth / 8,
  },
  backIcon: {
    width: windowWidth / 8,
    height: windowWidth / 8,
    resizeMode: "stretch",
  },
});

export default BioScreen;
