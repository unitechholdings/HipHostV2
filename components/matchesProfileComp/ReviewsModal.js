import React from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Colors from "../../constants/Colors";

import { FontAwesome } from "@expo/vector-icons";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const ReviewsModal = (props) => {
  var host = props.data;

  const startContent = () => {
    var starList = [];

    var rating = 0;

    try {
      if (
        host != "undefined" &&
        host != "undefined" &&
        host.rating != "undefined" &&
        host.rating.total != "undefined"
      ) {
        rating = host.rating.total;
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

  return (
    <Modal animationType="slide" transparent={true} visible={props.visible}>
      <View style={styles.container}>
        <View style={styles.mainContainer}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.closeContainer}
              onPress={props.close}
            >
              <Image
                style={styles.closeImage}
                source={require("../../assets/images/icons/big_close_x.png")}
              />
            </TouchableOpacity>
            <Image
              style={styles.iconImage}
              source={require("../../assets/images/icons/review_icon.png")}
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
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  mainContainer: {
    width: "90%",
    height: "90%",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 10,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  headerContainer: {
    width: "100%",
    height: "30%",
    alignItems: "center",
    justifyContent: "center",
  },
  bodyContainer: {
    width: "100%",
    height: "70%",
    alignItems: "center",
    justifyContent: "center",
  },
  closeContainer: {
    width: "100%",
    marginTop: "10%",
  },
  closeImage: {
    width: windowWidth / 10,
    height: windowWidth / 10,
    marginLeft: "5%",
    resizeMode: "stretch",
  },
  iconImage: {
    width: windowWidth / 4,
    height: windowWidth / 4,
    resizeMode: "stretch",
  },
  headerText: {
    color: Colors.primary,
    fontFamily: "Bebas",
    fontSize: 40,
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
});

export default ReviewsModal;
