import React, { useState, useEffect } from "react";
import {
  StatusBar,
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import { useSelector, useDispatch } from "react-redux";
import * as authActions from "../store/actions/auth";
import { getChatList, resetChatsList, setAsRead } from "../store/actions/chats";
import * as galleryActions from "../store/actions/gallery";

import Colors from "../constants/Colors";
import MessageBox from "../components/chatListComp/MessageBox";
import { set } from "react-native-reanimated";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const ChatListScreen = (props) => {
  const currentUser = useSelector((state) => state.user);
  const gallery = useSelector((state) => state.gallery);
  const chats = useSelector((state) => state.chats);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [hostImages, setHostImages] = useState([]);
  const [attempts, setAttempts] = useState(0);

  const messageColors = [Colors.primary, Colors.secondary, "white"];

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
      if (
        chats != null &&
        chats.chatList != null &&
        Object.keys(chats.chatList).length == 0
      ) {
        setIsLoading(true);
        dispatch(getChatList(currentUser.userID))
          .then(() => {
            setIsLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setIsLoading(false);
          });
      } else if (chats != null && chats.chatList == null && attempts <= 1) {
        var fetchAttempts = attempts + 1;
        setAttempts(fetchAttempts);
        setIsLoading(true);
        dispatch(getChatList(currentUser.userID))
          .then(() => {
            setIsLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setIsLoading(false);
          });
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  }, [chats]);

  useEffect(() => {
    try {
      if (
        typeof currentUser.chats != "undefined" &&
        gallery.hostProfilePics != null &&
        Object.keys(gallery.hostProfilePics).length == 0
      ) {
        var hostIDs = [];

        if (currentUser.chats) {
          var userChats = currentUser.chats;
          Object.keys(userChats).forEach((key, index) => {
            hostIDs.push(userChats[key].otherPersonID);
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
  }, [gallery, hostImages]);

  const toMessageHandler = (chatDetails, chatID) => {
    try {
      var hostID = chatDetails.otherPersonID;
      var profileImage =
        typeof hostImages[hostID] != "undefined" ? hostImages[hostID] : null;

      if (currentUser && typeof chatID != "undefined" && chatID != null)
        dispatch(setAsRead(currentUser.userID, chatID))
          .then(() => {
            props.navigation.navigate("Chat", {
              chatDetails: chatDetails,
              chatID: chatID,
              profileImage: profileImage,
            });
          })
          .catch((err) => {
            console.log(err);
          });
    } catch (err) {
      console.log(err);
    }
  };

  const goBackHandler = () => {
    try {
      dispatch(resetChatsList()).then(() => {
        if (!isLoading) props.navigation.goBack();
      });
    } catch (err) {
      props.navigation.goBack();
    }
  };

  const messageBoxes = () => {
    var list = [];
    try {
      if (
        chats &&
        chats.chatList != null &&
        Object.keys(chats.chatList).length > 0
      ) {
        var obj = chats.chatList;

        list = [];
        for (var key of Object.keys(obj)) {
          if (obj[key].status != "rejected" && obj[key].status != "blocked")
            if (searchTerm == "") {
              list.push({ key: key, obj: obj[key] });
            } else {
              if (obj[key].otherPersonName.includes(searchTerm)) {
                list.push({ key: key, obj: obj[key] });
              }
            }
        }
        list.sort((a, b) => (a.latestTime > b.latestTime ? 1 : -1));
      }
      return list;
    } catch (err) {
      console.log(err);
      return list;
    }
  };

  const messageContent = () => {
    try {
      return messageBoxes().map(({ key, obj }) => {
        var color = 0;
        if (obj.status == "waiting") color = 2;
        if (obj.status == "new_request") color = 1;
        if (obj.read == true) color = 2;
        var hostID = obj.otherPersonID;
        var profileImage =
          typeof hostImages[hostID] != "undefined" ? hostImages[hostID] : null;
        return (
          <TouchableOpacity
            onPress={() => toMessageHandler(obj, key)}
            key={key}
          >
            <MessageBox
              color={messageColors[color]}
              messageData={obj}
              hostImage={profileImage}
            />
          </TouchableOpacity>
        );
      });
    } catch (err) {
      //console.log(err);
      return (
        <Text style={styles.noMessagesText} key="noMessages">
          No messages yet
        </Text>
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <ImageBackground
        style={styles.mainBackground}
        source={require("../assets/images/backgrounds/blue_bg.png")}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>CHAT LIST</Text>
        </View>
        <ImageBackground
          style={styles.containerBackground}
          source={require("../assets/images/backgrounds/trans_overlay_bg.png")}
        >
          <View style={styles.searchContainer}>
            <Text style={styles.searchText}>Search</Text>
            <ImageBackground
              style={styles.searchBackground}
              source={require("../assets/images/icons/search-bg.png")}
            >
              <TextInput
                style={styles.searchInput}
                onChangeText={(text) => {
                  setSearchTerm(text);
                }}
              />
            </ImageBackground>
          </View>
          <View style={styles.messageBoxContainer}>
            {isLoading ? (
              <ActivityIndicator
                style={styles.spinner}
                size="large"
                color={Colors.primary}
              />
            ) : chats.chatList != null &&
              Object.keys(chats.chatList).length > 0 ? (
              messageContent()
            ) : (
              <Text style={styles.noMessagesText} key="noMessages">
                No messages yet
              </Text>
            )}
          </View>
        </ImageBackground>
        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={styles.backContainer}
            onPress={goBackHandler}
          >
            <Image
              style={styles.backImage}
              source={require("../assets/images/icons/backButton.png")}
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
  },
  headerContainer: {
    width: windowWidth,
    height: windowHeight / 6,
    alignItems: "center",
  },
  headerText: {
    width: "100%",
    color: "white",
    fontFamily: "Bebas",
    fontSize: 35,
    textAlign: "center",
    marginTop: windowHeight / 18,
  },
  containerBackground: {
    width: windowWidth,
    height: windowHeight / 1.4,
    resizeMode: "stretch",
    backgroundColor: "white",
  },
  searchContainer: {
    width: windowWidth,
    height: windowHeight / 13,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  searchBackground: {
    width: windowWidth / 1.8,
    height: windowWidth / 12,
    resizeMode: "stretch",
    overflow: "hidden",
  },
  searchInput: {
    width: "100%",
    height: "100%",
    paddingLeft: "4%",
    borderColor: Colors.primary,
    borderRadius: 5,
    borderWidth: 2,
    color: Colors.primary,
  },
  searchText: {
    color: Colors.primary,
    fontSize: 15,
    marginRight: "2%",
  },
  messageBoxContainer: {},
  footerContainer: {
    flex: 1,
    justifyContent: "center",
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
  noMessagesText: {
    color: Colors.primary,
    fontSize: 15,
    textAlign: "center",
    marginTop: "40%",
  },
  spinner: {
    height: 20,
    margin: 14,
    marginTop: "25%",
  },
});

export default ChatListScreen;
