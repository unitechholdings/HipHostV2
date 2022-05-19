import {
  ADD_NEW_IMAGE,
  REMOVE_IMAGE,
  SET_PROFILE_PIC,
  GET_MY_GALLERY,
  GET_HOST_PROFILE,
  GET_MY_PROFILE_PIC,
  GET_HOST_GALLERY,
} from "../actions/gallery";
import { LOGOUT } from "../actions/auth";

const initialState = {
  profilePic: null,
  profilePicKey: null,
  myImages: {},
  hostProfilePics: {},
  hostImages: {},
};

const galleryReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGOUT:
      return initialState;
    case ADD_NEW_IMAGE:
      var temp = state.myImages;
      if (typeof temp == "undefined" || temp == null) temp = {};

      temp = { ...temp, [action.id]: action.image };

      return {
        ...state,
        myImages: temp,
      };

    case REMOVE_IMAGE:
      var temp = state.myImages;
      if (typeof temp == "undefined" || temp == null) temp = {};
      delete temp[action.id];

      var tempProfilePic = state.profilePic;
      var tempProfilePicKey = state.profilePicKey;

      if (action.isProfilePic == true) {
        tempProfilePic = null;
        tempProfilePicKey = null;
      }

      return {
        ...state,
        profilePic: tempProfilePic,
        profilePicKey: tempProfilePicKey,
        myImages: temp,
      };
    case SET_PROFILE_PIC:
      return {
        ...state,
        profilePic: action.image,
        profilePicKey: action.imageID,
      };
    case GET_MY_GALLERY:
      return {
        ...state,
        profilePic: action.profilePic,
        profilePicKey: action.profilePicKey,
        myImages: action.images,
      };

    case GET_MY_PROFILE_PIC:
      return {
        ...state,
        profilePic: action.profilePic,
        profilePicKey: action.profilePicKey,
      };

    case GET_HOST_PROFILE:
      var temp = state.hostProfilePics;
      if (typeof temp == "undefined" || temp == null) temp = {};

      temp = { ...temp, [action.hostID]: action.profilePic };

      return {
        ...state,
        hostProfilePics: temp,
      };

    case GET_HOST_GALLERY:
      var tempImages = state.hostImages;
      if (typeof tempImages == "undefined" || tempImages == null)
        tempImages = {};

      tempImages = { ...tempImages, [action.hostID]: action.images };

      return {
        ...state,
        hostImages: tempImages,
      };

    default:
      return state;
  }
};

export default galleryReducer;
