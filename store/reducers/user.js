import { LOGIN, SIGNUP, LOGOUT } from "../actions/auth";
import {
  SET_PROFILE,
  SET_DEMOGRAPHIC,
  UPDATE_BIO,
  UPDATE_ACTIVITIES,
  UPDATE_LIVE_LOCATION,
  UPDATE_HANGOUTS,
  UPDATE_SEARCH_HISTORY,
  SET_PUSH_TOKEN,
  SET_IS_HOST,
  UPDATE_NAME_SURNAME,
  SET_LOGGED_AS,
  UPDATE_COINS,
} from "../actions/user";

const initialState = {
  coins: 0,
  token: null,
  userID: null,
  isBlocked: false,
  name: null,
  surname: null,
  email: null,
  userType: "user",
  profileComplete: false,
  profile: {
    ageGroup: null,
    gender: null,
    budget: null,
    diet: null,
    accommodation: null,
    hostGender: null,
    relationship: null,
    industry: null,
    mainLanguage: null,
    otherLanguage: null,
  },
  demographicsComplete: false,
  demographics: {
    relax: null,
    friendsDescribeMe: null,
    notMetYet: null,
    dinningAttitude: null,
    spiritAnimal: null,
    scienceOrArt: null,
    backpack: null,
    drink: null,
    openness: 0,
    extroversion: 0,
  },
  bio: "",
  activities: [],
  locationInfo: {
    liveLocation: null,
    hangouts: null,
  },
  searchHistory: [],
  chats: {},
  rating: 0,
  ranking: null,
};

const userReducer = (state = initialState, action) => {
  const user = action.user;
  switch (action.type) {
    case LOGIN:
      return {
        coins: user.coins,
        isHost: user.isHost,
        token: user.token,
        idToken: user.idToken,
        refreshToken: user.refreshToken,
        userID: user.userID,
        isBlocked: user.isBlocked,
        name: user.name,
        surname: user.surname,
        email: user.email,
        userType: user.userType,
        profileComplete: user.profileComplete,
        profile: user.profile,
        demographicsComplete: user.demographicsComplete,
        demographics: user.demographics,
        bio: user.bio,
        activities: user.activities,
        locationInfo: user.locationInfo,
        searchHistory: user.searchHistory,
        chats: user.chats,
        rating: user.rating,
        ranking: user.ranking,
      };
    case LOGOUT:
      return initialState;
    case SIGNUP:
      return {
        state,
      };
    case SET_IS_HOST:
      return {
        ...state,
        isHost: action.isHost,
      };
    case SET_LOGGED_AS:
      return {
        ...state,
        userType: action.userType,
      };
    case SET_PUSH_TOKEN:
      return {
        ...state,
        token: action.token,
      };
    case SET_PROFILE:
      return {
        ...state,
        profileComplete: user.profileComplete,
        profile: user.profile,
      };
    case SET_DEMOGRAPHIC:
      return {
        ...state,
        demographicsComplete: user.demographicsComplete,
        demographics: user.demographics,
      };
    case UPDATE_BIO:
      return {
        ...state,
        bio: action.bio,
      };
    case UPDATE_ACTIVITIES:
      return {
        ...state,
        state: action.activities,
      };
    case UPDATE_LIVE_LOCATION: {
      var temp = state.locationInfo;
      if (typeof temp == "undefined") {
        temp = {};
      }
      temp.liveLocation = action.liveLocation;
      temp.liveCoords = action.liveCoords;
      return {
        ...state,
        locationInfo: temp,
      };
    }
    case UPDATE_HANGOUTS: {
      var temp = state.locationInfo;
      if (typeof temp == "undefined") {
        temp = {};
      }
      temp.hangouts = action.hangouts;
      return {
        ...state,
        locationInfo: temp,
      };
    }
    case UPDATE_SEARCH_HISTORY: {
      return {
        ...state,
        searchHistory: action.history,
      };
    }
    case UPDATE_NAME_SURNAME: {
      return {
        ...state,
        name: action.name,
        surname: action.surname,
      };
    }
    case UPDATE_COINS: {
      return {
        ...state,
        coins: action.amount,
      };
    }

    default:
      return state;
  }
};

export default userReducer;
