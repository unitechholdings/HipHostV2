import {
  GET_CHAT_LIST,
  GET_CHATS,
  SEND_REQUEST,
  RESET_STATE,
  SEND_MESSAGE,
  ACCEPT_REQUEST,
  SET_TOKEN,
  SET_CHAT_LIST,
  END_CHAT,
  DONE_CHAT,
  SET_UNREAD,
  SET_AS_READ,
  RESET_CHAT_LIST,
} from "../actions/chats";
import { LOGOUT } from "../actions/auth";

const initialState = {
  token: null,
  chatCount: 0,
  messages: {},
  chatList: {},
  messageCount: 0,
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGOUT:
      return initialState;
    case RESET_STATE:
      return {
        ...state,
        messages: {},
      };
    case RESET_CHAT_LIST:
      return {
        ...state,
        chatList: {},
      };
    case SET_TOKEN:
      return {
        ...state,
        token: action.token,
        chatCount: action.chatCount,
      };
    case SET_CHAT_LIST:
      return {
        ...state,
        chatList: action.chatList,
      };
    case GET_CHAT_LIST:
      var temp = action.chatList;
      if (typeof temp == "undefined" || temp == null) temp = {};

      return {
        ...state,
        chatList: temp,
      };
    case GET_CHATS:
      var temp = state.messages;
      if (typeof temp == "undefined" || temp == null) temp = {};
      temp = { ...temp, [action.id]: action.messages };

      var tempList = state.chatList;
      if (typeof tempList == "undefined" || tempList == null) tempList = {};
      if (typeof action.newList != "undefined" && action.newList != null)
        tempList = { ...tempList, [action.id]: action.newList };

      return {
        ...state,
        messages: temp,
        chatList: tempList,
      };
    case SEND_REQUEST:
      return {
        ...state,
        active: action.chat,
        chatList: {},
      };
    case ACCEPT_REQUEST:
      var tempMessages = state.messages;
      tempMessages = { ...tempMessages, [action.messageID]: action.message };
      var tempChatList = state.chatList;
      if (typeof tempChatList[action.chatID] != "undefined")
        tempChatList[action.chatID].status = "accepted";

      return {
        ...state,
        messages: tempMessages,
        chatList: tempChatList,
      };
    case SEND_MESSAGE:
      var temp = state.messages;
      if (typeof temp == "undefined") {
        temp = {};
      }
      temp = { ...temp, [action.messageID]: action.message };
      return {
        ...state,
        messages: temp,
      };

    case END_CHAT:
      return {
        ...state,
        chatList: {},
      };
    case DONE_CHAT:
      return {
        ...state,
        chatList: {},
      };
    case SET_UNREAD:
      return {
        ...state,
        messageCount: action.messageCount,
      };

    case SET_AS_READ:
      var temp = state.messageCount - action.messageCount;
      return {
        ...state,
        messageCount: temp,
      };

    default:
      return state;
  }
};

export default chatReducer;
