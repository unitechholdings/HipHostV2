import { db } from "../../firebase/firebaseApp";

export const RESET_STATE = "RESET_STATE";
export const RESET_CHAT_LIST = "RESET_CHAT_LIST";
export const SET_TOKEN = "SET_TOKEN";
export const SET_CHAT_LIST = "GET_CHAT_LIST";
export const GET_CHAT_LIST = "GET_CHAT_LIST";
export const GET_CHATS = "GET_CHATS";
export const SEND_REQUEST = "SEND_REQUEST";
export const ACCEPT_REQUEST = "ACCEPT_REQUEST";
export const REJECT_REQUEST = "REJECT_REQUEST";
export const SEND_MESSAGE = "SEND_MESSAGE";
export const END_CHAT = "END_CHAT";
export const DONE_CHAT = "DONE_CHAT";
export const SET_UNREAD = "SET_UNREAD";
export const SET_AS_READ = "SET_AS_READ";

export const resetChats = () => {
  return async (dispatch) => {
    dispatch({ type: RESET_STATE });
  };
};

export const resetChatsList = () => {
  return async (dispatch) => {
    dispatch({ type: RESET_CHAT_LIST });
  };
};

export const setChatToken = (userID) => {
  return async (dispatch) => {
    if (userID) {
      const response = await fetch(
        "https://hiphost-v2-131c1.firebaseio.com/users/" + userID + ".json"
      );

      if (!response.ok) {
        const errorMessage = "Something went wrong!";

        throw new Error(errorMessage);
      }

      const resData = await response.json();

      var refToken = resData.token;
      var refChatCount =
        typeof resData.chatCount != "undefined" ? resData.chatCount : 0;

      dispatch({ type: SET_TOKEN, token: refToken, chatCount: refChatCount });
    }
  };
};

//using the already collected user
export const setChatList = (chatObj) => {
  return (dispatch) => {
    dispatch({ type: SET_CHAT_LIST, chatList: chatObj });
  };
};

//using the database
export const getChatList = (userID) => {
  return async (dispatch) => {
    if (typeof userID != "undefined" && userID != null) {
      const response = await fetch(
        "https://hiphost-v2-131c1.firebaseio.com/users/" +
          userID +
          "/chats.json"
      );

      if (!response.ok) {
        const errorMessage = "Something went wrong!";

        throw new Error(errorMessage);
      }

      var resData = await response.json();

      if (resData && Object.keys(resData).length > 0) {
        for (var key of Object.keys(resData)) {
          await db.ref("chats/" + key).once("value", function (snapshot) {
            var obj = snapshot.val();
            if (obj != "undefined") {
              var latest = null;
              if (obj && Object.keys(obj).length > 0) {
                for (var objKey of Object.keys(obj)) {
                  if (obj[objKey].senderID != userID)
                    if (latest == null) latest = obj[objKey];
                    else if (latest.timestamp <= obj[objKey].timestamp) {
                      latest = obj[objKey];
                    }
                }
              }

              if (latest != null) {
                resData[key].latestMessage = latest.message;
                resData[key].latestTime = latest.timestamp;
                resData[key].read = latest.read;
              }
            }
            dispatch({
              type: GET_CHAT_LIST,
              chatList: resData,
            });
          });
        }
      } else dispatch({ type: GET_CHAT_LIST, chatList: resData });
    }
  };
};

export const getUnreadMessages = (UserOBJ) => {
  return async (dispatch) => {
    if (typeof UserOBJ != "undefined" && UserOBJ != null) {
      var messageCountTemp = 0;

      if (typeof UserOBJ.chats != "undefined" && UserOBJ.chats != null) {
        if (Object.keys(UserOBJ.chats).length >= 1) {
          for (var key of Object.keys(UserOBJ.chats)) {
            await db.ref("chats/" + key).on("value", async function (snapshot) {
              var obj = snapshot.val();
              var localCounter = 0;
              var latest = null;
              if (obj != "undefined") {
                if (obj && Object.keys(obj).length > 0) {
                  for (var objKey of Object.keys(obj)) {
                    if (obj[objKey].senderID != UserOBJ.userID)
                      if (obj[objKey].read == false) {
                        messageCountTemp++;
                        localCounter++;
                      }
                  }
                }
              }
              const response = await fetch(
                "https://hiphost-v2-131c1.firebaseio.com/users/" +
                  UserOBJ.userID +
                  ".json",
                {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    chatCount: localCounter,
                  }),
                }
              );

              if (!response.ok) {
                const resData = await response.json();
                const errorMessage = "Something went wrong!";

                //throw new Error(errorMessage);
              }
              dispatch({
                type: SET_UNREAD,
                messageCount: localCounter,
              });
            });
          }
        }
      }

      dispatch({
        type: SET_UNREAD,
        messageCount: messageCountTemp,
      });
    }
  };
};

export const setAsRead = (userID, chatID) => {
  return async (dispatch) => {
    if (
      typeof userID != "undefined" &&
      userID != null &&
      typeof chatID != "undefined" &&
      chatID != null
    ) {
      var messageCounter = 0;

      const response = await fetch(
        "https://hiphost-v2-131c1.firebaseio.com/chats/" + chatID + "/.json"
      );

      if (!response.ok) {
        const errorMessage = "Something went wrong!";

        throw new Error(errorMessage);
      }

      const resData = await response.json();
      if (resData && Object.keys(resData).length >= 1) {
        for (var key of Object.keys(resData)) {
          var obj = resData[key];
          if (obj != "undefined") {
            if (obj.senderID != userID) {
              if (obj.read == false) {
                messageCounter++;
                const responseForChat = await fetch(
                  "https://hiphost-v2-131c1.firebaseio.com/chats/" +
                    chatID +
                    "/" +
                    key +
                    ".json",
                  {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      read: true,
                    }),
                  }
                );
              }
            }
          }
        }
      }

      dispatch({
        type: SET_AS_READ,
        messageCount: messageCounter,
      });
    }
  };
};

export const getChats = (chatID, userID, chatDetails) => {
  return async (dispatch) => {
    if (typeof chatID != "undefined" && chatID != null) {
      const response = await fetch(
        "https://hiphost-v2-131c1.firebaseio.com/chats/" + chatID + "/.json"
      );

      if (!response.ok) {
        const errorMessage = "Something went wrong!";

        throw new Error(errorMessage);
      }

      var ref = db.ref("chats/" + chatID);

      if (
        window.Global_Chat_Listener.length == 0 ||
        !window.Global_Chat_Listener.includes("chats/" + chatID)
      )
        ref.on(
          "value",
          function (snapshot) {
            var obj = snapshot.val();

            var latest = null;
            for (var key of Object.keys(obj)) {
              if (obj[key].senderID != userID)
                if (latest == null) latest = obj[key];
                else if (latest.timestamp <= obj[key].timestamp) {
                  latest = obj[key];
                }
            }

            if (latest != null) {
              chatDetails.latestMessage = latest.message;
              chatDetails.latestTime = latest.timestamp;
              chatDetails.read = latest.read;
            }

            window.Global_Chat_Listener.push("chats/" + chatID);

            dispatch({
              type: GET_CHATS,
              messages: obj,
              id: chatID,
              newMessage: true,
              newList: chatDetails,
            });
          },
          function (errorObject) {
            console.log("The read failed: " + errorObject.code);
          }
        );

      const resData = await response.json();

      dispatch({
        type: GET_CHATS,
        messages: resData,
        id: chatID,
        newMessage: false,
      });
    }
  };
};

export const sendRequest = (userObj, senderObj) => {
  var senderID = userObj.userID;
  var userID = senderObj.uid;

  return async (dispatch) => {
    const response = await fetch(
      "https://hiphost-v2-131c1.firebaseio.com/users/" +
        senderID +
        "/chats.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otherPersonID: userID,
          otherPersonName: senderObj.name + " " + senderObj.surname,
          status: "waiting",
        }),
      }
    );

    if (!response.ok) {
      const errorMessage = "Something went wrong!";
      throw new Error(errorMessage);
    }

    if (response.ok) {
      const resData = await response.json();
      var createdID = resData.name;
      const responseToUser = await fetch(
        "https://hiphost-v2-131c1.firebaseio.com/users/" +
          userID +
          "/chats/" +
          createdID +
          ".json",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            otherPersonID: senderID,
            otherPersonName: userObj.name + " " + userObj.surname,
            status: "new_request",
          }),
        }
      );

      const responseForChat = await fetch(
        "https://hiphost-v2-131c1.firebaseio.com/chats/" + createdID + ".json",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            senderID: senderID,
            message: "Would you like to chat?",
            timestamp: new Date().getTime(),
            read: false,
          }),
        }
      );

      if (!responseToUser.ok || !createdID || !responseForChat.ok) {
        const errorMessage = "Something went wrong!";
        throw new Error(errorMessage);
      }
    }

    const chatOBJ = {
      active: "waiting",
      chatID: createdID,
    };

    dispatch({ type: SEND_REQUEST, chat: chatOBJ });
  };
};

export const acceptRequest = (userID, senderID, chatID) => {
  return async (dispatch) => {
    const response = await fetch(
      "https://hiphost-v2-131c1.firebaseio.com/users/" +
        userID +
        "/chats/" +
        chatID +
        ".json",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "accepted",
        }),
      }
    );

    if (!response.ok) {
      const errorMessage = "Something went wrong!";
      throw new Error(errorMessage);
    }

    const responseToUser = await fetch(
      "https://hiphost-v2-131c1.firebaseio.com/users/" +
        senderID +
        "/chats/" +
        chatID +
        ".json",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "accepted",
        }),
      }
    );

    const messageOBJ = {
      senderID: senderID,
      message: "I have accepted your request, lets chat",
      timestamp: new Date().getTime(),
      read: false,
    };

    const responseForChat = await fetch(
      "https://hiphost-v2-131c1.firebaseio.com/chats/" + chatID + ".json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageOBJ),
      }
    );

    if (!responseToUser.ok || !responseForChat.ok) {
      const errorMessage = "Something went wrong!";
      throw new Error(errorMessage);
    }

    if (responseForChat.ok) {
      const resData = await responseForChat.json();
      var createdID = resData.name;
      dispatch({
        type: ACCEPT_REQUEST,
        message: messageOBJ,
        status: "accepted",
        messageID: createdID,
        chatID: chatID,
      });
    }
  };
};

export const rejectRequest = (userID, senderID, chatID) => {
  return async (dispatch) => {
    const response = await fetch(
      "https://hiphost-v2-131c1.firebaseio.com/users/" +
        senderID +
        "/chats/" +
        chatID +
        ".json",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "blocked",
        }),
      }
    );

    if (!response.ok) {
      const errorMessage = "Something went wrong!";
      throw new Error(errorMessage);
    }

    const responseToUser = await fetch(
      "https://hiphost-v2-131c1.firebaseio.com/users/" +
        userID +
        "/chats/" +
        chatID +
        ".json",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "rejected",
        }),
      }
    );

    const chatOBJ = {
      status: "rejected",
    };

    if (!responseToUser.ok) {
      const errorMessage = "Something went wrong!";
      throw new Error(errorMessage);
    }

    dispatch({ type: REJECT_REQUEST, chat: chatOBJ });
  };
};

export const sendMessage = (senderID, chatID, message) => {
  return async (dispatch) => {
    const messageOBJ = {
      senderID: senderID,
      message: message,
      timestamp: new Date().getTime(),
      read: false,
    };

    const responseForChat = await fetch(
      "https://hiphost-v2-131c1.firebaseio.com/chats/" + chatID + ".json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageOBJ),
      }
    );

    if (responseForChat.ok) {
      const resData = await responseForChat.json();
      var createdID = resData.name;
      dispatch({
        type: SEND_MESSAGE,
        message: messageOBJ,
        messageID: createdID,
      });
    }

    if (!responseForChat.ok) {
      const errorMessage = "Something went wrong!";
      throw new Error(errorMessage);
    }
  };
};

export const endChat = (userID, chatID, hostID, reason) => {
  return async (dispatch) => {
    if (
      typeof userID != "undefined" &&
      userID != null &&
      typeof chatID != "undefined" &&
      chatID != null &&
      hostID != "undefined" &&
      hostID != null &&
      reason != "undefined"
    ) {
      const timestamp = new Date().getTime();

      //update your end chat database object
      const responseUserChat = await fetch(
        "https://hiphost-v2-131c1.firebaseio.com/users/" +
          userID +
          "/endedChats/" +
          chatID +
          ".json",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            otherPersonID: hostID,
            endedChat: userID,
            reason: reason,
            timestamp: timestamp,
          }),
        }
      );

      //update host end chat database object
      const responseHostChat = await fetch(
        "https://hiphost-v2-131c1.firebaseio.com/users/" +
          hostID +
          "/endedChats/" +
          chatID +
          ".json",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            otherPersonID: userID,
            endedChat: userID,
            reason: reason,
            timestamp: timestamp,
          }),
        }
      );

      if (responseUserChat.ok && responseHostChat.ok) {
        const responseUserDelete = await fetch(
          "https://hiphost-v2-131c1.firebaseio.com/users/" +
            userID +
            "/chats/" +
            chatID +
            ".json",
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const responseHostDelete = await fetch(
          "https://hiphost-v2-131c1.firebaseio.com/users/" +
            hostID +
            "/chats/" +
            chatID +
            ".json",
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (responseUserDelete.ok && responseHostDelete.ok) {
          dispatch({
            type: END_CHAT,
            chatID: chatID,
          });
        } else throw new Error("Unable to delete chat objects");
      } else throw new Error("Unable to create ended chat objects");
    }
  };
};

export const doneChat = (
  userID,
  chatID,
  hostID,
  questionOne,
  questionTwo,
  rating,
  userType
) => {
  return async (dispatch) => {
    if (
      typeof userID != "undefined" &&
      userID != null &&
      typeof chatID != "undefined" &&
      chatID != null &&
      hostID != "undefined" &&
      hostID != null &&
      userType != "undefined" &&
      userType != null
    ) {
      if (typeof rating == "undefined" || rating == null) rating = 0;
      const timestamp = new Date().getTime();

      var userObj = {
        otherPersonID: hostID,
        endedChat: userID,
        timestamp: timestamp,
      };

      var hostObj = {
        otherPersonID: userID,
        endedChat: userID,
        timestamp: timestamp,
      };

      if (userType == "host") {
        userObj.of_assistance = questionOne;
        userObj.enjoyed_conversation = questionTwo;
      } else {
        hostObj.helpful = questionOne;
        hostObj.good_insight = questionTwo;
      }

      //update your end chat database object
      const responseUserChat = await fetch(
        "https://hiphost-v2-131c1.firebaseio.com/users/" +
          userID +
          "/endedChats/" +
          chatID +
          ".json",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userObj),
        }
      );

      //update host end chat database object
      const responseHostChat = await fetch(
        "https://hiphost-v2-131c1.firebaseio.com/users/" +
          hostID +
          "/endedChats/" +
          chatID +
          ".json",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(hostObj),
        }
      );

      //host rating of chat
      const responseUserRating = await fetch(
        "https://hiphost-v2-131c1.firebaseio.com/users/" +
          hostID +
          "/rating/" +
          userID +
          ".json",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rating: rating }),
        }
      );

      if (responseUserChat.ok && responseHostChat.ok) {
        const responseUserDelete = await fetch(
          "https://hiphost-v2-131c1.firebaseio.com/users/" +
            userID +
            "/chats/" +
            chatID +
            ".json",
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const responseHostDelete = await fetch(
          "https://hiphost-v2-131c1.firebaseio.com/users/" +
            hostID +
            "/chats/" +
            chatID +
            ".json",
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (responseUserDelete.ok && responseHostDelete.ok) {
          dispatch({
            type: DONE_CHAT,
            chatID: chatID,
          });
        } else throw new Error("Unable to delete chat objects");
      } else throw new Error("Unable to create ended chat objects");
    }
  };
};
