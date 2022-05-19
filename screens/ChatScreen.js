import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  StatusBar,
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  SafeAreaView,
} from "react-native";

import { useSelector, useDispatch } from "react-redux";
import * as authActions from "../store/actions/auth";
import {
  getChats,
  acceptRequest,
  resetChats,
  sendMessage,
  setChatToken,
  rejectRequest,
  setAsRead,
} from "../store/actions/chats";

import Colors from "../constants/Colors";
import CustomOutlinedButton from "../components/sharedComp/customOutlineButton";
import CustomButton from "../components/sharedComp/customButton";
import NewMessageBox from "../components/chatComp/NewMessageBox";
import BlueMessageBubble from "../components/chatComp/BlueMessageBubble";
import GreyMessageBubble from "../components/chatComp/GreyMessageBubble";
import ChatDoneModal from "../components/chatComp/ChatDoneComp";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const ChatScreen = (props) => {
  const currentUser = useSelector((state) => state.user);
  var currentChats = useSelector((state) => state.chats);
  const chatDetails = props.navigation.getParam("chatDetails");
  const [tokenFetchAttempts, setTokenFetchAttempts] = useState(0);
  const chatID = props.navigation.getParam("chatID");
  const profileImage = props.navigation.getParam("profileImage");
  const scrollRef = useRef();
  const [isLoading, setIsLoading] = useState(true);

  const [showChatDone, setShowChatDone] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    try {
      if (
        typeof currentUser.userID == "undefined" ||
        currentUser.userID == null
      ) {
        dispatch(authActions.autoLoginUser()).catch((err) => {
          if (err.message === "NOT_FOUND") props.navigation.navigate("Login");
        });
      } else {
        if (typeof currentChats.messages[chatID] == "undefined") {
          dispatch(getChats(chatID, currentUser.userID, chatDetails))
            .then(() => {
              setIsLoading(false);
            })
            .catch((err) => {
              console.log(err);
            });
        } else if (isLoading) setIsLoading(false);

        if (
          currentChats &&
          currentChats.token == null &&
          tokenFetchAttempts == 0
        ) {
          dispatch(setChatToken(chatDetails.otherPersonID))
            .then(() => {
              setTokenFetchAttempts(1);
            })
            .catch((err) => {
              setTokenFetchAttempts(1);
              console.log(err);
            });
          setTokenFetchAttempts(1);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }, [currentUser]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardOpen(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardOpen(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const scrollToBottom = (h, ref) => {
    if (ref.current != null) {
      ref.current.scrollTo({ y: h });
    }
  };

  const goBackHandler = () => {
    Keyboard.removeListener("keyboardDidShow");
    Keyboard.removeListener("keyboardDidHide");
    if (currentUser && typeof chatID != "undefined" && chatID != null)
      dispatch(setAsRead(currentUser.userID, chatID))
        .then(() => {
          props.navigation.goBack();
        })
        .catch((err) => {
          props.navigation.goBack();
        });
  };

  const endChatHandler = () => {
    try {
      props.navigation.navigate("EndChat", {
        userID: currentUser.userID,
        hostID: chatDetails.otherPersonID,
        chatID: chatID,
        userType: currentUser.userType,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const chatDoneShowHandler = () => {
    setShowChatDone(true);
  };

  const chatDoneHandler = () => {
    props.navigation.navigate("ChatList");
  };

  const closeModalHandler = () => {
    setShowChatDone(false);
  };

  const messageContent = useCallback(() => {
    try {
      if (!isLoading) {
        var list = [];
        var obj = currentChats.messages[chatID];

        if (typeof obj != "undefined" && obj != null)
          Object.keys(obj)
            .sort((a, b) => {
              return a[1].timestamp - b[1].timestamp;
            })
            .map((index) => {
              var messageObj = obj[index];
              if (messageObj.senderID == currentUser.userID) {
                list.push(
                  <BlueMessageBubble
                    text={messageObj.message}
                    key={messageObj.timestamp}
                  />
                );
              } else {
                list.push(
                  <GreyMessageBubble
                    text={messageObj.message}
                    key={messageObj.timestamp}
                  />
                );
              }
            });
        if (
          typeof currentChats != "undefined" &&
          currentChats.chatList != null &&
          typeof currentChats.chatList[chatID] != "undefined" &&
          currentChats.chatList[chatID] != null
        ) {
          var details = currentChats.chatList[chatID];
          if (details.status == "new_request")
            list.push(acceptDeclineContent());

          // if (details.status == "waiting")
          //   list.push(waitingContent("Still waiting for response"));

          if (details.status == "rejected") {
            list.push(waitingContent("You have been rejected"));
          }
        }

        return list;
      } else
        return (
          <ActivityIndicator
            style={styles.spinner}
            size="large"
            color={Colors.primary}
          />
        );
    } catch (err) {
      return <View />;
    }
  }, [isLoading, currentChats]);

  const acceptDeclineContent = () => {
    return (
      <View style={styles.acceptDeclineContainer} key="acceptDeclineBtn">
        <CustomButton
          title="Accept"
          buttonColor={Colors.secondary}
          size="45%"
          onPress={acceptHandler}
        />
        <CustomButton
          title="Decline"
          buttonColor={Colors.secondary}
          size="45%"
          onPress={declineHandler}
        />
      </View>
    );
  };

  const waitingContent = (text) => {
    return (
      <View style={styles.waitingContainer} key="waitingContainer">
        <Text style={styles.waitingText}>{text}</Text>
      </View>
    );
  };

  const acceptHandler = () => {
    try {
      dispatch(
        acceptRequest(chatDetails.otherPersonID, currentUser.userID, chatID)
      ).catch((err) => {
        console.log(err);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const declineHandler = () => {
    try {
      dispatch(
        rejectRequest(chatDetails.otherPersonID, currentUser.userID, chatID)
      ).catch((err) => {
        console.log(err);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const sendHandler = (message) => {
    try {
      dispatch(sendMessage(currentUser.userID, chatID, message)).catch(
        (err) => {
          console.log(err);
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <ChatDoneModal
        visible={showChatDone}
        close={closeModalHandler}
        userID={currentUser.userID}
        hostID={chatDetails.otherPersonID}
        userType={currentUser.userType}
        chatID={chatID}
        finished={chatDoneHandler}
      />
      <KeyboardAvoidingView behavior="position">
        <ImageBackground
          style={styles.mainBackground}
          source={require("../assets/images/backgrounds/trans_overlay_bg.png")}
        >
          <ImageBackground
            style={styles.headerContainer}
            source={require("../assets/images/backgrounds/blue_bg_header.png")}
          >
            <TouchableOpacity
              style={styles.backContainer}
              onPress={goBackHandler}
            >
              <Image
                style={styles.backImage}
                source={require("../assets/images/icons/backButton.png")}
              />
            </TouchableOpacity>
            <View style={styles.headerCenterContainer}>
              <View style={styles.headerStartContainer}>
                <View style={styles.buttonContainer}>
                  {!isLoading &&
                  typeof chatDetails != "undefined" &&
                  chatDetails != null &&
                  chatDetails.status != "new_request" ? (
                    <CustomOutlinedButton
                      title="End Chat"
                      buttonColor="white"
                      size="100%"
                      onPress={endChatHandler}
                    />
                  ) : (
                    <View />
                  )}
                </View>
              </View>
              <View style={styles.headerMiddleContainer}>
                <View style={styles.profileContainer}>
                  {profileImage ? (
                    <Image
                      style={styles.profileImage}
                      source={{ uri: profileImage }}
                    />
                  ) : (
                    <Image
                      style={styles.profileImage}
                      source={require("../assets/images/inAppImages/profile_placeholder.png")}
                    />
                  )}
                </View>
              </View>
              <View style={styles.headerEndContainer}>
                <View style={styles.buttonContainer}>
                  {!isLoading &&
                  typeof chatDetails != "undefined" &&
                  chatDetails != null &&
                  chatDetails.status != "new_request" ? (
                    <CustomButton
                      title="Done"
                      buttonColor={Colors.secondary}
                      size="100%"
                      onPress={chatDoneShowHandler}
                    />
                  ) : (
                    <View />
                  )}
                </View>
              </View>
            </View>
            <View style={styles.headerNameContainer}>
              <Text style={styles.profileText}>
                {chatDetails ? chatDetails.otherPersonName : ""}
              </Text>
            </View>
          </ImageBackground>
          <View style={styles.mainContainer}>
            <ScrollView
              ref={scrollRef}
              onContentSizeChange={(w, h) => scrollToBottom(h, scrollRef)}
            >
              {messageContent()}
              {/* <View
                style={{ height: keyboardOpen ? windowHeight * 0.5 : 60 }}
              /> */}
            </ScrollView>
          </View>

          <View style={styles.footerContainer}>
            <NewMessageBox
              onSend={(message) => sendHandler(message)}
              messageData={{
                token: currentChats.token,
                chatCount: currentChats.chatCount,
                name: currentUser.name + " " + currentUser.surname,
              }}
            />
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: windowHeight,
    backgroundColor: "white",
  },
  mainBackground: {
    width: windowWidth,
    height: windowHeight,
    resizeMode: "stretch",
    alignItems: "center",
  },
  headerContainer: {
    width: windowWidth,
    height: windowHeight * 0.28,
    resizeMode: "cover",
  },
  headerCenterContainer: {
    width: windowWidth,
    height: "65%",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: "4%",
  },
  headerNameContainer: {
    width: windowWidth,
  },
  backContainer: {
    marginTop: windowHeight / 35,
    marginLeft: windowWidth / 30,
    zIndex: 5,
    position: "absolute",
  },
  backImage: {
    width: windowWidth / 12,
    height: windowWidth / 12,
    resizeMode: "stretch",
  },
  headerStartContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerMiddleContainer: {
    width: windowWidth / 4,
    justifyContent: "center",
    alignItems: "center",
  },
  profileContainer: {
    width: windowWidth / 4,
    height: windowWidth / 4,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: windowWidth / 2,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
  },
  profileText: {
    color: "white",
    fontFamily: "Bebas",
    fontSize: 24,
    textAlign: "center",
  },
  headerEndContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    width: windowWidth / 3.5,
  },
  mainContainer: {
    width: windowWidth,
    marginTop: 10,
    //height: windowHeight * 0.62,
    flex: 1,
  },
  messageBubble: {
    width: windowWidth,
  },
  androidFooter: {},
  footerContainer: {
    //position: "absolute",
    //top: windowHeight - windowHeight * 0.1,
    width: windowWidth,
    height: windowHeight * 0.15,
  },
  acceptDeclineContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: "8%",
  },
  waitingContainer: {
    width: "100%",
  },
  waitingText: {
    textAlign: "center",
    fontSize: 15,
    color: Colors.primary,
  },
  spinner: {
    height: 20,
    margin: 14,
    marginTop: "25%",
  },
});

export default ChatScreen;
