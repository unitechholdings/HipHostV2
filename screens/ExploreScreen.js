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
import * as userActions from "../store/actions/user";

import Colors from "../constants/Colors";
import CustomButton from "../components/sharedComp/customButton";
import CustomSelection from "../components/exploreComp/customSelectionBox";
import SearchableLocationPopup from "../components/exploreComp/searcableLocationPopup";
import SearchableActivityPopup from "../components/exploreComp/searchableActivitiesPopup";
import DatePicker from "../components/exploreComp/customDatePicker";

import WalletPopup from "../components/exploreComp/WalletPopup";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const ExploreScreen = (props) => {
  const currentUser = useSelector((state) => state.user);
  const chats = useSelector((state) => state.chats);
  const [showLocation, setShowLocation] = useState(false);
  const [location, setLocation] = useState();
  const [showActivities, setShowActivities] = useState(false);
  const [activities, setActivities] = useState();
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showWalletPopup, setShowWalletPopup] = useState(false);

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

  const goToMatches = () => {
    setShowWalletPopup(false);

    var loc = location;
    var act = activities;

    setLocation();

    props.navigation.navigate("Matches", {
      location: loc,
      activities: act,
    });
  };

  const toWalletHandler = () => {
    setShowWalletPopup(false);
    props.navigation.navigate("Wallet");
  };

  const goHandler = () => {
    if (location && activities) {
      try {
        var date = new Date();
        var obj = {
          timestamp: date,
          location: location,
          activities: activities,
        };

        setLoading(true);
        dispatch(
          userActions.updateSearchHistory(
            currentUser.userID,
            currentUser.searchHistory,
            obj
          )
        )
          .then(() => {
            setLoading(false);
            setIsValid(false);
            if (
              currentUser &&
              typeof currentUser.coins != "undefined" &&
              currentUser.coins <= 2
            ) {
              setShowWalletPopup(true);
            } else {
              goToMatches();
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    } else setIsValid(false);
  };

  const goToChatHandler = () => {
    props.navigation.navigate("ChatList");
  };

  const goToProfileHandler = () => {
    props.navigation.navigate("Profile");
  };

  const goToSocialHandler = () => {
    props.navigation.navigate("UserSocial");
  };

  const cancelDatePick = () => {
    setShowDatePicker(false);
  };

  const submitDate = (date) => {
    setShowDatePicker(false);
    setSelectedDate(date);
  };

  const showDatePickHandler = () => {
    setShowDatePicker(true);
  };

  useEffect(() => {
    if (location && activities) setIsValid(true);
  }, [location, activities, isValid]);

  const getMessageCount = () => {
    if (
      chats &&
      typeof chats.messageCount != "undefined" &&
      chats.messageCount != null
    ) {
      return chats.messageCount;
    } else return 0;
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <ImageBackground
        style={styles.mainBackground}
        source={require("../assets/images/backgrounds/explore_bg.png")}
      >
        <ImageBackground style={styles.overlayBackground}>
          <SearchableLocationPopup
            data={currentUser.searchHistory ? currentUser.searchHistory : []}
            visible={showLocation}
            cancel={() => {
              setShowLocation(false);
            }}
            onSelected={(selected) => {
              setLocation(selected);
            }}
            userID={currentUser.userID}
          />

          <SearchableActivityPopup
            data={[]}
            visible={showActivities}
            cancel={() => {
              setShowActivities(false);
            }}
            onSelected={(selected) => {
              setActivities(selected);
            }}
            userID={currentUser.userID}
          />

          {showDatePicker && !showActivities && !showLocation ? (
            <DatePicker
              visible={showDatePicker}
              submit={(date) => submitDate(date)}
              date={selectedDate}
              cancel={cancelDatePick}
            />
          ) : (
            <View />
          )}

          <WalletPopup
            visible={showWalletPopup}
            toMatches={goToMatches}
            toWallet={toWalletHandler}
            coins={
              currentUser && typeof currentUser.coins != "undefined"
                ? currentUser.coins
                : 0
            }
          />

          <View style={styles.iconMainContainer}>
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>Explore</Text>
              <Text style={styles.iconSubText}>together</Text>
            </View>
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.input}>
              <CustomSelection
                placeholder="Destination"
                value={typeof location != "undefined" ? location.name : ""}
                onPress={() => {
                  setShowLocation(true);
                }}
                image={require("../assets/images/compBackgrounds/destination_input_bg.png")}
              />
            </View>
            <View style={styles.input}>
              <CustomSelection
                placeholder="Dates"
                value={typeof selectedDate ? selectedDate : ""}
                onPress={showDatePickHandler}
                image={require("../assets/images/compBackgrounds/dates_input_bg.png")}
              />
            </View>
            <View style={styles.input}>
              <CustomSelection
                placeholder="Activities"
                onPress={() => {
                  setShowActivities(true);
                }}
                value={
                  activities ? activities.length + " selected activities" : ""
                }
                image={require("../assets/images/compBackgrounds/activites_input_bg.png")}
              />
            </View>
          </View>
          <View style={styles.goContainer}>
            <View style={styles.goBtn}>
              <CustomButton
                title="GO"
                buttonColor={
                  isValid ? Colors.secondary : Colors.secondaryInactive
                }
                disabled={!isValid}
                size="40%"
                onPress={goHandler}
                loading={loading}
              />
            </View>
          </View>
          <View style={styles.footerContainer}>
            <ImageBackground
              style={styles.footerBGContainer}
              source={require("../assets/images/backgrounds/explore_footer.png")}
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
                    source={require("../assets/images/icons/social_icon.png")}
                  />
                </TouchableOpacity>

                <Text style={styles.btnText}>Social</Text>
              </View>
            </ImageBackground>
          </View>
        </ImageBackground>
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
    resizeMode: "stretch",
  },
  overlayBackground: {
    flex: 1,
    resizeMode: "stretch",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  iconMainContainer: {
    height: "20%",
    marginHorizontal: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    fontSize: 80,
    color: "white",
    fontFamily: "Amulhed",
  },
  iconSubText: {
    fontSize: 50,
    color: "white",
    fontFamily: "Amulhed",
    position: "absolute",
    marginTop: 65,
    marginLeft: 90,
  },
  inputContainer: {
    flex: 1,
    padding: "8%",
    zIndex: 99
  },
  input: {
    width: "100%",
    height: "20%",
    minHeight: 45,
    marginBottom: "10%",
   
  },
  goContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    
  },
  goBtn: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2
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
    paddingBottom: windowHeight / 40,
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
    paddingBottom: "5%",
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
