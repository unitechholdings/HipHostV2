import React from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from "react-native";

import Colors from "../constants/Colors";
import CustomButton from "../components/sharedComp/customOutlineButton";

import data from "../staticData/data";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const RulebookScreen = (props) => {
  const goBackHandler = () => {
    props.navigation.goBack();
  };

  return (
    <ImageBackground
      style={styles.mainBackground}
      source={require("../assets/images/backgrounds/trans_overlay_bg.png")}
    >
      <View style={styles.mainContainer}>
        <View style={styles.headerContainer}>
          <Image
            style={styles.iconImage}
            source={require("../assets/images/icons/rulebook.png")}
          />
          <Text style={styles.headerText}>RULEBOOK</Text>
        </View>
        <View style={styles.bodyContainer}>
          <Text style={styles.labelText}>As a host I will...</Text>

          <View style={styles.textContainer}>
            <Text style={styles.number}>1.</Text>
            <Text style={styles.text}>
              Treat my traveler with respect and kindness.
            </Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.number}>2.</Text>
            <Text style={styles.text}>
              Always meet a new traveler in a HipHost
            </Text>
          </View>
          <View style={styles.emptyTextContainer}>
            <Text style={styles.number}></Text>
            <Text style={styles.text}>specified location.</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.number}>3.</Text>
            <Text style={styles.text}>
              Proudly show my country/city to my travelers.
            </Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.number}>4.</Text>
            <Text style={styles.text}>
              {" "}
              Ask my traveler if he/she feels comfortable
            </Text>
          </View>
          <View style={styles.emptyTextContainer}>
            <Text style={styles.number}></Text>
            <Text style={styles.text}>
              participating before embarking on an activity.
            </Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.number}>5.</Text>
            <Text style={styles.text}>Ask questions of my traveler.</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.number}>6.</Text>
            <Text style={styles.text}>
              Be on time when meeting with a traveler.
            </Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.number}>7.</Text>
            <Text style={styles.text}>
              Make the experience about the traveler..not{" "}
            </Text>
          </View>
          <View style={styles.emptyTextContainer}>
            <Text style={styles.number}></Text>
            <Text style={styles.text}>myself.</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.number}>8.</Text>
            <Text style={styles.text}>
              Never offer illegal drugs to my travelers.
            </Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.number}>9.</Text>
            <Text style={styles.text}>
              Never show up intoxicated to a Hangout with a{" "}
            </Text>
          </View>
          <View style={styles.emptyTextContainer}>
            <Text style={styles.number}></Text>
            <Text style={styles.text}>traveler.</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.number}>10.</Text>
            <Text style={styles.text}>
              Be an ambassador for myself, my country,{" "}
            </Text>
          </View>
          <View style={styles.emptyTextContainer}>
            <Text style={styles.number}></Text>
            <Text style={styles.text}>and HipHost.</Text>
          </View>
        </View>
        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={styles.backIconContainer}
            onPress={goBackHandler}
          >
            <Image
              style={styles.backIcon}
              source={require("../assets/images/icons/pink_back_icon.png")}
            />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  mainBackground: {
    flex: 1,
    resizeMode: "stretch",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  mainContainer: {
    width: "90%",
    height: "90%",
  },
  headerContainer: {
    width: "100%",
    height: "20%",
    alignItems: "center",
    justifyContent: "center",
  },
  bodyContainer: {
    width: "100%",
    height: "70%",
    alignItems: "flex-start",
  },
  iconImage: {
    width: windowWidth / 5,
    height: windowWidth / 5,
    resizeMode: "stretch",
  },
  headerText: {
    color: Colors.primary,
    fontFamily: "Bebas",
    fontSize: 40,
    textAlign: "center",
  },
  labelText: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: "bold",
    marginTop: "8%",
    marginBottom: "5%",
  },
  textContainer: {
    width: "100%",
    flexDirection: "row",
    paddingTop: "2%",
  },
  emptyTextContainer: {
    width: "100%",
    flexDirection: "row",
  },
  number: {
    width: "5%",
    color: Colors.primary,
    fontSize: 12,
    textAlign: "left",
  },
  text: {
    flex: 1,
    color: Colors.primary,
    fontSize: windowWidth / 32,
    textAlign: "left",
  },
  footerContainer: {
    width: "100%",
    height: "10%",
    justifyContent: "center",
  },
  backIconContainer: {
    width: windowWidth / 10,
    height: windowWidth / 10,
  },
  backIcon: {
    width: windowWidth / 10,
    height: windowWidth / 10,
    resizeMode: "stretch",
  },
});

export default RulebookScreen;
