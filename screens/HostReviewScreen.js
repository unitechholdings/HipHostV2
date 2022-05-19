import React from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from "react-native";
import Colors from "../constants/Colors";

import { FontAwesome } from "@expo/vector-icons";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const HostReviewScreen = (props) => {
  var user = props.navigation.getParam("userData");

  const startContent = () => {
    var starList = [];

    var rating = 0;

    try {
      if (
        user != "undefined" &&
        user != "undefined" &&
        user.rating != "undefined"
      ) {
        rating = user.rating;
      }
    } catch (err) {
      rating = 0;
    }
    for (let index = 0; index < 5; index++) {
      starList.push(
        <View style={styles.star} key={index}>
          {rating >= index + 1 ? (
            <FontAwesome name="star" size={24} color={Colors.primary} />
          ) : (
            <FontAwesome name="star-o" size={24} color={Colors.primary} />
          )}
        </View>
      );
    }

    return starList;
  };

  const goBackHandler = () => {
    props.navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.mainContainer}
        source={require("../assets/images/backgrounds/trans_overlay_bg.png")}
      >
        <View style={styles.headerContainer}>
          <Image
            style={styles.iconImage}
            source={require("../assets/images/icons/review_icon.png")}
          />
          <Text style={styles.headerText}>REVIEWS</Text>
        </View>
        <View style={styles.bodyContainer}>
          <View style={styles.topContainer}>
            <Text style={styles.text}>
              This HipHost has a total quality rating of
            </Text>
            <View style={styles.starContainer}>{startContent()}</View>
            <Text style={styles.text}>as rated by other users</Text>
          </View>
          <View style={styles.bottomContainer}>
            <Text style={styles.text}>This HipHost has been rated</Text>
            <Text style={styles.subText}>95%</Text>
            <Text style={styles.text}>helpful by other users</Text>
          </View>
        </View>
        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={styles.backContainer}
            onPress={goBackHandler}
          >
            <Image
              style={styles.backImage}
              source={require("../assets/images/icons/pink_back_icon.png")}
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
  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerContainer: {
    width: "100%",
    height: "30%",
    alignItems: "center",
    justifyContent: "center",
  },
  bodyContainer: {
    width: "100%",
    height: "55%",
    alignItems: "center",
    justifyContent: "center",
  },
  iconImage: {
    width: windowWidth / 4,
    height: windowWidth / 4,
    resizeMode: "stretch",
  },
  headerText: {
    color: Colors.primary,
    fontFamily: "Bebas",
    fontSize: 35,
    textAlign: "center",
  },
  topContainer: {
    width: "80%",
    height: "50%",
    alignItems: "center",
    justifyContent: "center",
  },

  bottomContainer: {
    width: "80%",
    height: "50%",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  text: {
    color: Colors.primary,
    fontSize: 20,
    textAlign: "center",
    marginVertical: "8%",
  },
  subText: {
    color: Colors.primary,
    fontSize: 30,
    textAlign: "center",
  },
  starContainer: {
    width: "70%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: "8%",
  },
  starImage: {
    width: windowWidth / 14,
    height: windowWidth / 14,
  },
  footerContainer: {
    width: "100%",
    height: "15%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  backContainer: {
    width: windowWidth / 10,
    height: windowWidth / 10,
    marginLeft: "10%",
  },
  backImage: {
    width: windowWidth / 10,
    height: windowWidth / 10,
    resizeMode: "stretch",
  },
});

export default HostReviewScreen;
