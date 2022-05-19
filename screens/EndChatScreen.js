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
import { endChat, setAsRead } from "../store/actions/chats";
import { end_Chat_data } from "../staticData/data";

import Colors from "../constants/Colors";
import CheckBox from "../components/sharedComp/customCheckBox";
import CustomButton from "../components/sharedComp/customButton";
import CustomTextBox from "../components/sharedComp/blueInputBox";
import { set } from "react-native-reanimated";

const windowWidth = Dimensions.get("window").width;

const EndChatScreen = (props) => {
  const currentUser = useSelector((state) => state.user);
  const [selectedReason, setSelectedReason] = useState(null);
  const [otherReason, setOtherReason] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const userID = props.navigation.getParam("userID");
  const hostID = props.navigation.getParam("hostID");
  const userType = props.navigation.getParam("userType");
  const chatID = props.navigation.getParam("chatID");

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

  useEffect(() => {
    try {
      if (selectedReason != null || otherReason != "") setIsValid(true);
      else setIsValid(false);
    } catch (err) {
      console.log(err);
    }
  }, [otherReason, selectedReason]);

  const goBackHandler = () => {
    props.navigation.goBack();
  };

  const endChatHandler = () => {
    try {
      var reason = selectedReason ? selectedReason : otherReason;

      setLoading(true);
      dispatch(endChat(userID, chatID, hostID, reason))
        .then(() => {
          setLoading(false);
          dispatch(setAsRead(userID, chatID))
            .then(() => {
              props.navigation.navigate("ChatList");
            })
            .catch((err) => {
              console.log(err);
              props.navigation.navigate("ChatList");
            });
        })
        .catch((err) => {
          setLoading(false);
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <ImageBackground
        style={styles.mainBackground}
        source={require("../assets/images/backgrounds/wallet_bg.png")}
      >
        <View style={styles.mainContainer}>
          <View style={styles.headerContainer}>
            <Image
              style={styles.iconImage}
              source={require("../assets/images/icons/end_chat_icon.png")}
            />
            <Text style={styles.headerText}>CHAT ENDED</Text>
          </View>
          <View style={styles.bodyContainer}>
            <Text style={styles.text}>
              Please let us know why you canceled the chat
            </Text>
            <View style={styles.checkboxes}>
              {end_Chat_data.map((group, key) => {
                var content = null;
                userType == "host" && group.id == "tour_operator"
                  ? (content = <View key={key} />)
                  : (content = (
                      <CheckBox
                        title={group.title}
                        key={key}
                        id={group.id}
                        color={Colors.primary}
                        selected={selectedReason}
                        onPress={() => {
                          setSelectedReason(group.id);
                        }}
                      />
                    ));

                return content;
              })}
            </View>
            <Text style={styles.label}>Other</Text>
            <View style={styles.input}>
              <CustomTextBox
                value={otherReason}
                textChange={(text) => {
                  setOtherReason(text.trim());
                }}
              />
            </View>
          </View>
          {selectedReason == "inappropriate" || selectedReason == "a_bot" ? (
            <Text style={styles.label}>
              *Please note, by selecting this option you will no longer be able
              to chat with this person again.
            </Text>
          ) : (
            <View />
          )}
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
              title="Proceed"
              buttonColor={
                isValid ? Colors.secondary : Colors.secondaryInactive
              }
              size="60%"
              disabled={!isValid}
              loading={loading}
              onPress={endChatHandler}
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
    paddingTop: "10%",
    alignItems: "center",
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
    width: windowWidth / 6,
    height: windowWidth / 6,
    resizeMode: "stretch",
  },
  headerText: {
    color: "white",
    fontFamily: "Bebas",
    fontSize: 30,
    textAlign: "center",
  },
  footerContainer: {
    width: windowWidth,
    height: "10%",
    flexDirection: "row",
    alignItems: "center",
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
  checkboxes: {
    width: "100%",
    marginTop: "5%",
  },
  text: {
    marginTop: "15%",
    color: Colors.primary,
  },
  label: {
    color: Colors.primary,
  },
  input: {
    width: "100%",
    height: "10%",
    marginVertical: "1%",
  },
});

export default EndChatScreen;
