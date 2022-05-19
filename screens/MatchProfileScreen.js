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

import Colors from "../constants/Colors";
import CustomButton from "../components/sharedComp/customButton";
import LocationModal from "../components/matchesProfileComp/LocationModal";
import ActivitiesModal from "../components/matchesProfileComp/ActivitiesModal";
import ReviewsModal from "../components/matchesProfileComp/ReviewsModal";
import StatusModal from "../components/matchesProfileComp/StatusModal";

import { useSelector, useDispatch } from "react-redux";
import * as authActions from "../store/actions/auth";
import { sendRequest } from "../store/actions/chats";
import { updateCoins } from "../store/actions/user";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const MatchProfileScreen = (props) => {
  const currentUser = useSelector((state) => state.user);

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showActivitiesModal, setShowActivitiesModal] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  const hostObj = props.navigation.getParam("host");
  const hostProfilePic = props.navigation.getParam("profilePic");

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

  const goBackHandler = () => {
    props.navigation.goBack();
  };
  const goToExplorerHandler = () => {
    props.navigation.navigate("Explore");
  };
  const goBackToMatchHandler = () => {
    props.navigation.navigate("Matches");
  };
  const goToChatHandler = () => {
    try {
      dispatch(sendRequest(currentUser, hostObj))
        .then(() => {
          dispatch(
            updateCoins(currentUser.userID, currentUser.coins, 1, "remove")
          )
            .then(() => {
              sendPushNotification().catch((err) => {
                console.log(err);
              });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
      setShowChatModal(true);
    } catch (err) {
      console.log(err);
    }
  };

  const closeModalHandler = () => {
    setShowLocationModal(false);
    setShowActivitiesModal(false);
    setShowReviewsModal(false);
    setShowStatusModal(false);
  };

  const sendPushNotification = async () => {
    if (typeof hostObj != "undefined" && hostObj != null) {
      if (typeof hostObj.token != "undefined" && hostObj.token != null) {
        const chatCount =
          typeof hostObj.chatCount != "undefined" ? hostObj.chatCount + 1 : 1;
        const message = {
          to: hostObj.token,
          title: "New invite",
          body: "From " + currentUser.name + " " + currentUser.surname,
          sound: "default",
          badge: chatCount,
          data: { data: "goes here" },
          _displayInForeground: true,
        };
        fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Accept-encoding": "gzip, deflate",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(message),
        })
          .then((response) => response.json())
          .then(console.log)
          .catch(console.error);
      }
    }
  };

  const bioContent = () => {
    if (hostObj.bio) {
      return (
        <View style={styles.aboutContainer}>
          <Text style={styles.aboutTextHeader}>About</Text>
          <Text style={styles.aboutText}>{hostObj.bio}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.aboutContainer}>
          <Text />
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.headerImageContainer}>
        <ImageBackground
          style={styles.headerImage}
          source={require("../assets/images/covers/capetown.png")}
        >
          <Text style={styles.headerUsernameLabel}>
            {hostObj.name + " " + hostObj.surname}
          </Text>
          <Text style={styles.headerLocationLabel}>
            Cape Town, South Africa
          </Text>
        </ImageBackground>
      </View>
      <ImageBackground
        style={styles.mainBackground}
        source={require("../assets/images/backgrounds/white_headerless_bg.png")}
      >
        <LocationModal
          visible={showLocationModal}
          close={closeModalHandler}
          data={hostObj}
        />
        <ActivitiesModal
          visible={showActivitiesModal}
          close={closeModalHandler}
          data={hostObj}
        />
        <ReviewsModal
          visible={showReviewsModal}
          close={closeModalHandler}
          data={hostObj}
        />
        <StatusModal
          visible={showStatusModal}
          close={closeModalHandler}
          data={hostObj}
        />
        <Modal animationType="slide" transparent={true} visible={showChatModal}>
          <ImageBackground
            style={styles.chatModalBackground}
            source={require("../assets/images/backgrounds/host_connect_bg.png")}
          >
            <View style={styles.modalIconContainer}>
              <Image
                style={styles.modalIcon}
                source={require("../assets/images/icons/connect_icon.png")}
              />
            </View>
            <Text style={styles.modalHeaderText}>NICELY DONE!</Text>
            <Text style={styles.modalText}>
              We've contacted your HipHost! You will receive a notification as
              soon as they accept your request to chat.
            </Text>
            <View style={styles.modalButtonContainer}>
              <CustomButton
                title="Connect with Others"
                buttonColor={Colors.secondary}
                size="80%"
                onPress={goBackToMatchHandler}
              />
              <CustomButton
                title="Back to Home"
                buttonColor={Colors.primary}
                size="70%"
                onPress={goToExplorerHandler}
              />
            </View>
          </ImageBackground>
        </Modal>

        <View style={styles.backButtonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={goBackHandler}>
            <Image
              style={styles.backButtonImage}
              source={require("../assets/images/icons/backButton.png")}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.mainContainer}>
          <View style={styles.leftContainer}>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => setShowLocationModal(true)}
            >
              <Image
                style={styles.iconImage}
                source={require("../assets/images/icons/location_icon.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => setShowActivitiesModal(true)}
            >
              <Image
                style={styles.iconImage}
                source={require("../assets/images/icons/activities_icon.png")}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.middleContainer}>
            {bioContent()}

            <View style={styles.profileImageContainer}>
              {hostProfilePic ? (
                <Image
                  style={styles.hostImage}
                  source={{ uri: hostProfilePic }}
                />
              ) : (
                <Image
                  style={styles.hostImage}
                  source={require("../assets/images/inAppImages/profile_placeholder.png")}
                />
              )}
            </View>
            <View style={styles.footerContainer}>
              <CustomButton
                title="Chat to Host"
                buttonColor={Colors.secondary}
                size="100%"
                onPress={goToChatHandler}
              />
            </View>
          </View>
          <View style={styles.rightContainer}>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => setShowStatusModal(true)}
            >
              <Image
                style={styles.iconImage}
                source={require("../assets/images/icons/info_s_icon.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => setShowReviewsModal(true)}
            >
              <Image
                style={styles.iconImage}
                source={require("../assets/images/icons/review_icon.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: windowWidth,
  },
  headerImageContainer: {
    width: windowWidth,
    height: windowHeight / 3.9,
  },
  headerImage: {
    width: windowWidth,
    height: "100%",
    resizeMode: "stretch",
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonContainer: {
    width: "100%",
    height: "20%",
    marginTop: "4%",
    marginLeft: "3%",
  },
  backButton: {
    width: windowWidth / 9,
    height: windowWidth / 9,
  },
  backButtonImage: {
    width: windowWidth / 9,
    height: windowWidth / 9,
    resizeMode: "stretch",
  },
  headerUsernameLabel: {
    color: "white",
    fontFamily: "Bebas",
    fontSize: 40,
    textAlign: "center",
  },
  headerLocationLabel: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
  },
  mainBackground: {
    width: windowWidth,
    height: windowHeight,
    marginTop: (windowHeight / 3.8) * -1,
    resizeMode: "stretch",
  },
  mainContainer: {
    flex: 1,
    flexDirection: "row",
  },
  leftContainer: {
    width: windowWidth / 4,
    height: "100%",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingVertical: "5%",
  },
  middleContainer: {
    width: windowWidth / 2,
    height: "100%",
  },
  rightContainer: {
    width: windowWidth / 4,
    height: "100%",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingVertical: "5%",
  },
  iconContainer: {
    width: windowWidth / 5,
    height: windowWidth / 5,
  },
  iconImage: {
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
  },
  aboutContainer: {
    flex: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  profileImageContainer: {
    width: windowWidth / 2,
    height: windowWidth / 2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: Colors.primary,
    borderRadius: 20,
    overflow: "hidden",
  },
  footerContainer: {
    flex: 1.9,
    paddingTop: "10%",
  },
  hostImage: {
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
  },
  aboutTextHeader: {
    color: Colors.primary,
    fontSize: 30,
    fontFamily: "Bebas",
    textAlign: "center",
  },
  aboutText: {
    color: Colors.primary,
    fontSize: 15,
    textAlign: "center",
  },
  chatModalBackground: {
    width: windowWidth,
    height: windowHeight,
    resizeMode: "stretch",
    padding: "10%",
  },
  modalIconContainer: {
    width: "100%",
    alignItems: "center",
  },
  modalIcon: {
    width: windowWidth / 3,
    height: windowHeight / 5,
    resizeMode: "stretch",
  },
  modalHeaderText: {
    color: Colors.primary,
    fontSize: 40,
    fontFamily: "Bebas",
    textAlign: "center",
    marginVertical: "5%",
  },
  modalText: {
    color: Colors.primary,
    fontSize: 15,
    textAlign: "center",
  },
  modalButtonContainer: {
    width: "100%",
    height: "25%",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginTop: "10%",
  },
});

export default MatchProfileScreen;
