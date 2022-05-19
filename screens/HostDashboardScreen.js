import React, { useState, useEffect } from "react";
import {
  StatusBar,
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import * as userActions from "../store/actions/user";
import * as authActions from "../store/actions/auth";
import * as galleryActions from "../store/actions/gallery";

import Colors from "../constants/Colors";
import CustomButton from "../components/sharedComp/customButton";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const ExploreScreen = (props) => {
  const currentUser = useSelector((state) => state.user);
  const chats = useSelector((state) => state.chats);
  const gallery = useSelector((state) => state.gallery);
  const [profilePic, setProfilePic] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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

      if (
        currentUser &&
        gallery.myImages != null &&
        Object.keys(gallery.myImages).length <= 0
      ) {
        dispatch(galleryActions.getMyGallery(currentUser.userID))
          .then(() => {})
          .catch((err) => {
            console.log(err);
          });
      }
    } catch (err) {
      console.log(err);
    }
  }, [currentUser]);

  const getMessageCount = () => {
    if (
      chats &&
      typeof chats.messageCount != "undefined" &&
      chats.messageCount != null
    ) {
      return chats.messageCount;
    } else return 0;
  };

  useEffect(() => {
    var image = gallery.profilePic;
    if (typeof image != "undefined" && image != null) {
      setProfilePic(image);
    } else {
      setProfilePic(null);
    }
  }, [gallery]);

  const menuPressHandler = (menuItem) => {
    setModalVisible(false);
    if (menuItem == "location") props.navigation.navigate("HostLocation");
    if (menuItem == "activities") props.navigation.navigate("HostActivities");
    if (menuItem == "rulebook") props.navigation.navigate("Rulebook");
    if (menuItem == "reviews")
      props.navigation.navigate("HostReview", { userData: currentUser });
  };

  const goToBioHandler = () => {
    props.navigation.navigate("Bio", {
      bio: currentUser.bio,
      userID: currentUser.userID,
    });
  };

  const goToChatHandler = () => {
    props.navigation.navigate("ChatList");
  };

  const goToProfileHandler = () => {
    props.navigation.navigate("Profile");
  };

  const goToSocialHandler = () => {
    props.navigation.navigate("HostSocial");
  };

  const starContent = () => {
    var starList = [];

    for (let index = 0; index < 5; index++) {
      starList.push(
        <TouchableWithoutFeedback
          style={styles.star}
          key={index}
          onPress={goToSocialHandler}
        >
          {currentUser.rating >= index + 1 ? (
            <FontAwesome name="star" size={24} color={Colors.primary} />
          ) : (
            <FontAwesome name="star-o" size={24} color={Colors.primary} />
          )}
        </TouchableWithoutFeedback>
      );
    }

    return starList;
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <ImageBackground
        style={styles.mainBackground}
        source={require("../assets/images/backgrounds/trans_overlay_bg.png")}
      >
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.modal}>
            <View style={styles.modalContainer}>
              <TouchableOpacity
                style={styles.modalTextContainer}
                onPress={() => menuPressHandler("location")}
              >
                <Image
                  style={styles.modalImage}
                  source={require("../assets/images/icons/location_icon.png")}
                />
                <Text style={styles.modalText}>Location</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalTextContainer}
                onPress={() => menuPressHandler("activities")}
              >
                <Image
                  style={styles.modalImage}
                  source={require("../assets/images/icons/activities_icon.png")}
                />
                <Text style={styles.modalText}>Activities</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalTextContainer}
                onPress={() => menuPressHandler("reviews")}
              >
                <Image
                  style={styles.modalImage}
                  source={require("../assets/images/icons/review_icon.png")}
                />
                <Text style={styles.modalText}>Reviews</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalTextContainer}
                onPress={() => menuPressHandler("rulebook")}
              >
                <Image
                  style={styles.modalImage}
                  source={require("../assets/images/icons/rulebook.png")}
                />
                <Text style={styles.modalText}>Rulebook</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalCancelContainer}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View style={styles.bodyContainer}>
          <View style={styles.mainBodyContainer}>
            <TouchableOpacity
              style={styles.leftSideContainer}
              onPress={goToBioHandler}
            >
              <Image
                style={styles.sideIconImage}
                source={require("../assets/images/icons/edit_blue_icon.png")}
              />
            </TouchableOpacity>
            <View style={styles.middleContainer}>
              <Text style={styles.headerText}>WELCOME</Text>
              <Text style={styles.text}>
                {currentUser.name} {currentUser.surname}
              </Text>
              <View style={styles.hostStartImageContainer}>
                <View style={styles.hostStartImage}>
                  <FontAwesome name="star" size={24} color="white" />
                </View>
              </View>
              {profilePic ? (
                <Image style={styles.hostImage} source={{ uri: profilePic }} />
              ) : (
                <Image
                  style={styles.hostImage}
                  source={require("../assets/images/inAppImages/profile_placeholder.png")}
                />
              )}
            </View>
            <TouchableOpacity
              style={styles.rightSideContainer}
              onPress={() => setModalVisible(true)}
            >
              <Image
                style={styles.sideIconImage}
                source={require("../assets/images/icons/host_menu_icon_blue.png")}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.subBodyContainer}>
            <View style={styles.subBodyContentContainer}>
              <Text style={styles.labelHeader}>User Rating:</Text>
              <View style={styles.starContainer}>{starContent()}</View>
            </View>
            <View style={styles.subBodyContentContainer}>
              <Text style={styles.labelHeader}>Ranking:</Text>
              {currentUser &&
              typeof currentUser.ranking != "undefined" &&
              currentUser.ranking != null ? (
                <Text style={styles.rankingSubText}>
                  <Text style={styles.rankingText}>
                    #{currentUser.ranking.rank}
                  </Text>{" "}
                  IN {currentUser.ranking.city}
                </Text>
              ) : (
                <Text style={styles.rankingSubText}>Not ranked</Text>
              )}
            </View>
          </View>
        </View>
        <View style={styles.footerContainer}>
          <ImageBackground
            style={styles.footerBGContainer}
            source={require("../assets/images/backgrounds/host_dashboard_footer.png")}
          >
            <View style={styles.btnContainer}>
              <TouchableOpacity
                style={styles.imageContainer}
                onPress={goToProfileHandler}
              >
                <Image
                  style={styles.btnImage}
                  source={require("../assets/images/icons/profile_icon.png")}
                />
              </TouchableOpacity>
              <Text style={styles.btnText}>Profile</Text>
            </View>
            <View style={styles.btnContainer}>
              <TouchableOpacity
                style={styles.imageContainer}
                onPress={goToChatHandler}
              >
                {getMessageCount() >= 1 ? (
                  <TouchableOpacity
                    style={styles.messageCountContainer}
                    onPress={goToChatHandler}
                  >
                    <View style={styles.messageCountImage}>
                      <Text style={styles.messageCountText}>
                        {getMessageCount()}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View />
                )}

                <Image
                  style={{
                    ...styles.btnImage,
                    width: windowWidth / 4,
                    height: windowWidth / 4,
                  }}
                  source={require("../assets/images/icons/chat_icon.png")}
                />
              </TouchableOpacity>
              <Text style={styles.btnText}>Chat</Text>
            </View>
            <View style={styles.btnContainer}>
              <TouchableOpacity
                style={styles.imageContainer}
                onPress={goToSocialHandler}
              >
                <Image
                  style={styles.btnImage}
                  source={require("../assets/images/icons/status_icon.png")}
                />
              </TouchableOpacity>

              <Text style={styles.btnText}>Status</Text>
            </View>
          </ImageBackground>
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
  },
  bodyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  footerContainer: {
    width: "100%",
    height: windowHeight / 4,
    minHeight: 188,
    justifyContent: "flex-end",
  },
  footerBGContainer: {
    flex: 1,
    flexDirection: "row",
    resizeMode: "stretch",
    zIndex: 99,
    paddingBottom: windowHeight / 60,
  },
  btnContainer: {
    width: windowWidth / 3,
    justifyContent: "flex-end",
  },
  imageContainer: {
    width: windowWidth / 3,
    padding: "5%",
    flexDirection: "row",
    justifyContent: "center",
  },
  btnImage: {
    width: windowWidth / 5,
    height: windowWidth / 5,
    resizeMode: "stretch",
  },
  btnText: {
    marginTop: "5%",
    textAlign: "center",
    color: "white",
    paddingBottom: "10%",
  },
  mainBodyContainer: {
    width: "100%",
    height: "70%",
    flexDirection: "row",
  },
  leftSideContainer: {
    width: "25%",
    height: "100%",

    paddingTop: "5%",
    alignItems: "flex-end",
  },
  rightSideContainer: {
    width: "25%",
    height: "100%",

    paddingTop: "5%",
    alignItems: "flex-start",
  },
  middleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  subBodyContainer: {
    width: "100%",
    height: "30%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  hostImage: {
    width: windowWidth / 1.8,
    height: windowWidth / 1.8,
    resizeMode: "cover",
    borderColor: "gold",
    borderWidth: 4,
    borderRadius: 20,
  },
  hostStartImageContainer: {
    width: windowWidth / 1.8,
    height: windowWidth / 10,
    marginBottom: (windowWidth / 15) * -1,
    marginRight: (windowWidth / 15) * -1,
    alignItems: "flex-end",
    zIndex: 1,
  },
  hostStartImage: {
    width: windowWidth / 10,
    height: windowWidth / 10,
    backgroundColor: "rgb(68,187,205)",
    borderColor: "rgb(68,187,205)",
    borderRadius: windowWidth / 5,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    color: Colors.primary,
    fontSize: 40,
    textAlign: "center",
    fontFamily: "Bebas",
  },
  text: {
    color: Colors.primary,
    fontSize: 25,
    textAlign: "center",
    fontFamily: "Bebas",
    marginBottom: "10%",
  },
  sideIconImage: {
    width: windowWidth / 5,
    height: windowWidth / 5,
  },
  subBodyContentContainer: {
    width: "50%",
    height: "100%",
    alignItems: "center",
  },
  labelHeader: {
    color: Colors.primary,
    fontSize: 20,
    textAlign: "center",
  },
  rankingText: {
    color: Colors.primary,
    fontSize: 30,
    textAlign: "center",
    marginBottom: "10%",
    fontFamily: "Bebas",
  },
  rankingSubText: {
    color: Colors.primary,
    fontSize: 20,
    textAlign: "center",
    marginBottom: "10%",
    fontFamily: "Bebas",
  },
  starContainer: {
    width: "70%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "3%",
  },
  starImage: {
    width: windowWidth / 18,
    height: windowWidth / 18,
  },
  modal: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255,0.6)",
  },
  modalContainer: {
    width: windowWidth / 1.8,
    backgroundColor: "white",
    borderRadius: 10,
    paddingTop: "5%",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  modalTextContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: "5%",
  },
  modalCancelContainer: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    borderColor: Colors.primary,
    borderTopWidth: 1,
  },
  modalText: {
    width: "60%",
    color: Colors.primary,
    fontSize: 25,
    textAlign: "center",
  },
  modalCancelText: {
    width: "60%",
    color: Colors.primary,
    fontSize: 25,
    textAlign: "center",
    marginVertical: "5%",
  },
  modalImage: {
    width: windowWidth / 8,
    height: windowWidth / 8,
    resizeMode: "stretch",
  },
  messageCountContainer: {
    width: windowWidth / 4,
    height: windowWidth / 4,
    marginTop: "5%",
    position: "absolute",
    zIndex: 99,
  },
  messageCountImage: {
    width: windowWidth / 15,
    height: windowWidth / 15,
    backgroundColor: Colors.secondary,
    borderRadius: windowWidth / 2,

    justifyContent: "center",
    alignItems: "center",
  },
  messageCountText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ExploreScreen;
