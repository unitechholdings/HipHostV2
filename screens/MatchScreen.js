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

import { useSelector, useDispatch } from "react-redux";
import * as authActions from "../store/actions/auth";
import * as galleryActions from "../store/actions/gallery";

import { FontAwesome } from "@expo/vector-icons";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const MatchScreen = (props) => {
  const currentUser = useSelector((state) => state.user);
  const gallery = useSelector((state) => state.gallery);

  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [allHosts, setAllHosts] = useState([]);
  const [hostIndex, setHostIndex] = useState(0);
  const [hostImages, setHostImages] = useState([]);

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

  //this function will run on screen focus
  useEffect(() => {
    if (allHosts.length == 0) getMatches();
  }, [props.navigation]);

  useEffect(() => {
    try {
      if (
        allHosts.length >= 1 &&
        gallery.hostProfilePics != null &&
        Object.keys(gallery.hostProfilePics).length == 0
      ) {
        var hostIDs = [];

        if (allHosts && allHosts.length >= 1) {
          allHosts.forEach((host) => {
            hostIDs.push(host.uid);
          });
        }

        if (hostIDs.length >= 1) {
          hostIDs.forEach((hostID) => {
            if (typeof gallery.hostProfilePics[hostID] == "undefined")
              dispatch(galleryActions.getHostProfile(hostID))
                .then(() => {})
                .catch((err) => {
                  console.log(err);
                });
          });
        }
      }
      if (
        gallery.hostProfilePics != null &&
        Object.keys(gallery.hostProfilePics).length >= 1
      ) {
        var imageObj = gallery.hostProfilePics;
        Object.keys(imageObj).forEach((key, index) => {
          var temp = hostImages;
          temp[key] = imageObj[key];
          setHostImages(temp);
        });
      }
    } catch (err) {
      console.log(err);
    }
  }, [gallery, hostImages, allHosts]);

  const goBackHandler = () => {
    props.navigation.goBack();
  };

  const goToProfileHandler = () => {
    try {
      if (allHosts[hostIndex]) {
        var profileImage = hasProfilePic()
          ? hostImages[allHosts[hostIndex].uid]
          : null;
        props.navigation.navigate("MatchProfile", {
          host: allHosts[hostIndex],
          profilePic: profileImage,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const compareDistances = (a, b) => {
    if (a.distance < b.distance) {
      return -1;
    }
    if (a.distance > b.distance) {
      return 1;
    }
    return 0;
  };

  const compareMatchingRatings = (a, b) => {
    if (a.personalityMatch.total > b.personalityMatch.total) {
      return -1;
    }
    if (a.personalityMatch.total < b.personalityMatch.total) {
      return 1;
    }
    return 0;
  };

  const compareUserRatings = (a, b) => {
    let aur = 0;
    let bur = 0;
    if (a.rating !== "undefined" && a.rating != null) {
      aur =
        typeof a.rating.total == "undefined" || a.rating.total == null
          ? 0
          : a.rating.total;
    } else {
      aur = 0;
    }
    if (b.rating !== "undefined" && b.rating != null) {
      bur =
        typeof b.rating.total == "undefined" || b.rating.total == null
          ? 0
          : b.rating.total;
    } else {
      bur = 0;
    }

    if (aur < bur) {
      return 1;
    }
    if (aur > bur) {
      return -1;
    }
    return 0;
  };

  // const sortByStatus = () => {
  //   this.hostIndex = 0
  //   this.allHosts.sort(this.compareTimes)
  //   this.showSort = false
  // }

  const sortByDistance = () => {
    setHostIndex(0);
    allHosts.sort(compareDistances);
    setModalVisible(false);
  };

  const sortByMatchingRatings = () => {
    setHostIndex(0);
    allHosts.sort(compareMatchingRatings);
    setModalVisible(false);
  };

  const sortByUserRatings = () => {
    setHostIndex(0);
    allHosts.sort(compareUserRatings);
    setModalVisible(false);
  };

  const getMatches = () => {
    try {
      //==========================Gets all the related hosts from the cloud function================================
      const url =
        "https://us-central1-hiphost-v2-131c1.cloudfunctions.net/getMatchingHosts";

      const searchLocations = props.navigation.getParam("location");
      const searchActivities = props.navigation.getParam("activities");

      var passedData = {
        UserData: currentUser,
        SearchLocation: searchLocations,
        SearchActivities: searchActivities,
      };

      fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passedData),
      })
        .then((response) => response.json())
        .then((data) => {
          setAllHosts(data.allHosts);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error:", error);
          setIsLoading(false);
        });
      //=========================================================================
    } catch (err) {
      console.log(err);
    }
  };

  const nextHandler = () => {
    setHostIndex(hostIndex + 1);
  };

  const prevHandler = () => {
    setHostIndex(hostIndex - 1);
  };

  const hasProfilePic = () => {
    try {
      if (
        typeof allHosts[hostIndex] &&
        allHosts[hostIndex] != null &&
        typeof allHosts[hostIndex].uid != "undefined" &&
        allHosts[hostIndex].uid != null
      ) {
        var hostID = allHosts[hostIndex].uid;
        if (
          typeof hostImages[hostID] != "undefined" &&
          hostImages[hostID] != null
        ) {
          return true;
        }
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const loadingScreen = (
    <View style={styles.gifContainer}>
      <Image
        style={styles.gif}
        source={require("../assets/images/GIFS/wheel.gif")}
      />
    </View>
  );

  const noHostsScreen = (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.headerImageContainer}>
        <ImageBackground
          style={styles.headerImage}
          source={require("../assets/images/covers/capetown.png")}
        >
          <Text style={styles.headerProvinceLabel}>Cape Town</Text>
          <Text style={styles.headerCountryLabel}>South Africa</Text>
        </ImageBackground>
      </View>
      <ImageBackground
        style={styles.mainBackground}
        source={require("../assets/images/backgrounds/white_headerless_bg.png")}
      >
        <View style={styles.backButtonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={goBackHandler}>
            <Image
              style={styles.backButtonImage}
              source={require("../assets/images/icons/backButton.png")}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.mainContainer}>
          <View style={styles.hostImageContainer}>
            <Text>No hosts have been found</Text>
          </View>
          <View style={styles.footerContainer} />
        </View>
      </ImageBackground>
    </View>
  );

  const startContent = () => {
    var starList = [];

    var rating = 0;

    try {
      if (
        allHosts.length >= 1 &&
        allHosts[hostIndex] != "undefined" &&
        allHosts[hostIndex].rating != "undefined" &&
        allHosts[hostIndex].rating.total != "undefined"
      ) {
        rating = allHosts[hostIndex].rating.total;
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

  const getHostLocation = (hostLocation) => {
    if (typeof hostLocation != "undefined" && hostLocation != null) {
      var location = hostLocation.liveLocation;
      var locationArr = location.split(",");
      if (locationArr.length > 1) {
        return locationArr[1];
      } else return locationArr[0];
    } else return null;
  };

  const HostScreen = (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.headerImageContainer}>
        <ImageBackground
          style={styles.headerImage}
          source={require("../assets/images/covers/capetown.png")}
        >
          <Text style={styles.headerProvinceLabel}>Cape Town</Text>
          <Text style={styles.headerCountryLabel}>South Africa</Text>
        </ImageBackground>
      </View>
      <ImageBackground
        style={styles.mainBackground}
        source={require("../assets/images/backgrounds/white_headerless_bg.png")}
      >
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback
            onPress={() => setModalVisible(false)}
            style={styles.modal}
          />
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.modalTextContainer}
              onPress={sortByDistance}
            >
              <Text style={styles.modalText}>Status</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalTextContainer}
              onPress={sortByDistance}
            >
              <Text style={styles.modalText}>Location</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalTextContainer}
              onPress={sortByMatchingRatings}
            >
              <Text style={styles.modalText}>Match Rating</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalTextContainer}
              onPress={sortByUserRatings}
            >
              <Text style={styles.modalText}>User Rating</Text>
            </TouchableOpacity>
          </View>
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
          <View style={styles.sortContainer}>
            <TouchableOpacity
              style={styles.sortTouch}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.sortText}>Sort by</Text>
              <Image
                style={styles.sortImage}
                source={require("../assets/images/icons/host_menu_icon.png")}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.hostImageContainer}>
            <View style={styles.hostImageSubContainer}>
              <View style={styles.hostChevronContainer}>
                {allHosts && allHosts.length >= 1 && hostIndex != 0 ? (
                  <TouchableOpacity onPress={prevHandler}>
                    <Image
                      style={styles.hostChevronImage}
                      source={require("../assets/images/icons/chevron_left_blue.png")}
                    />
                  </TouchableOpacity>
                ) : (
                  <View />
                )}
              </View>
              <View style={styles.hostMainSubContainer}>
                <View style={styles.hostStartImageContainer}>
                  <View style={styles.hostStartImage}>
                    <FontAwesome name="star" size={24} color="white" />
                  </View>
                </View>
                <TouchableOpacity onPress={goToProfileHandler}>
                  {hasProfilePic() ? (
                    <Image
                      style={styles.hostImage}
                      source={{ uri: hostImages[allHosts[hostIndex].uid] }}
                    />
                  ) : (
                    <Image
                      style={styles.hostImage}
                      source={require("../assets/images/inAppImages/profile_placeholder.png")}
                    />
                  )}
                </TouchableOpacity>
              </View>
              <View style={styles.hostChevronContainer}>
                {allHosts &&
                allHosts.length >= 1 &&
                hostIndex < allHosts.length - 1 ? (
                  <TouchableOpacity onPress={nextHandler}>
                    <Image
                      style={styles.hostChevronImage}
                      source={require("../assets/images/icons/chevron_right_blue.png")}
                    />
                  </TouchableOpacity>
                ) : (
                  <View />
                )}
              </View>
            </View>

            <Text style={styles.hostNameText}>
              {typeof allHosts[hostIndex] != "undefined" &&
              typeof allHosts[hostIndex] != "undefined"
                ? allHosts[hostIndex].name + " " + allHosts[hostIndex].surname
                : ""}
            </Text>
            {/* <Text style={styles.hostLocationText}>
              {typeof allHosts[hostIndex] != "undefined" &&
              typeof allHosts[hostIndex] != "undefined"
                ? "(" + getHostLocation(allHosts[hostIndex].locationInfo) + " )"
                : ""}
            </Text> */}
            <Text style={styles.hostTapText}>(Tap pic to view profile)</Text>
          </View>
          <View style={styles.footerContainer}>
            <View style={styles.ratingContainer}>
              <Text style={styles.footerLabels}>User rating:</Text>
              <View style={styles.starContainer}>{startContent()}</View>
            </View>
            <View style={styles.rankingContainer}>
              <Text style={styles.footerLabels}>Match rating:</Text>
              <Text style={styles.footerRankLabel}>
                {typeof allHosts[hostIndex] != "undefined"
                  ? allHosts[hostIndex].personalityMatch.total
                  : 0}
                %
              </Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );

  return isLoading
    ? loadingScreen
    : allHosts.length > 0
    ? HostScreen
    : noHostsScreen;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gifContainer: {
    flex: 1,
  },
  gif: {
    width: windowWidth,
    height: windowHeight,
    resizeMode: "stretch",
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
  headerProvinceLabel: {
    color: "white",
    fontFamily: "Bebas",
    fontSize: 40,
    textAlign: "center",
  },
  headerCountryLabel: {
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
    width: "100%",
    height: "100%",
  },
  sortContainer: {
    width: "100%",
    height: "15%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  sortTouch: {},
  sortText: {
    color: Colors.secondary,
    marginRight: "2%",
  },
  sortImage: {
    width: windowWidth / 5,
    height: windowWidth / 5,
    resizeMode: "stretch",
    marginRight: "5%",
  },
  hostImageContainer: {
    width: "100%",
    height: "40%",
    justifyContent: "center",
    alignItems: "center",
  },

  hostImage: {
    width: windowWidth / 1.8,
    height: windowWidth / 1.8,
    resizeMode: "cover",
    borderColor: Colors.primary,
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
  hostImageSubContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  hostMainSubContainer: {
    width: "60%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  hostChevronContainer: {
    width: "20%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  hostChevronImage: {
    width: windowWidth / 16,
    height: windowWidth / 8,
    resizeMode: "stretch",
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
  hostNameText: {
    width: "100%",
    color: Colors.primary,
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
  },
  hostLocationText: {
    width: "100%",
    color: Colors.primary,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  hostTapText: {
    width: "100%",
    color: Colors.primary,
    fontSize: 15,
    textAlign: "center",
  },
  footerContainer: {
    width: "100%",
    height: "25%",
    flexDirection: "row",
    marginTop: "10%",
  },
  ratingContainer: {
    width: "50%",
  },
  rankingContainer: {
    width: "50%",
  },
  footerLabels: {
    width: "100%",
    color: Colors.primary,
    fontSize: 15,
    textAlign: "center",
  },
  footerRankLabel: {
    width: "100%",
    color: Colors.primary,
    fontSize: 35,
    textAlign: "center",
  },
  starContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: "8%",
    marginTop: "8%",
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
    position: "absolute",
    width: windowWidth / 1.8,
    marginLeft: windowWidth / 2 - windowWidth / 1.8 / 2,
    marginTop: windowHeight / 3,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
  },
  modalTextContainer: {
    width: "100%",
    borderColor: Colors.primary,
    borderBottomWidth: 1,
    paddingVertical: "5%",
  },
  modalText: {
    width: "100%",
    color: Colors.primary,
    fontSize: 25,
    textAlign: "center",
  },
});

export default MatchScreen;
