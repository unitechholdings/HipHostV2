export const ADD_NEW_IMAGE = "ADD_NEW_IMAGE";
export const REMOVE_IMAGE = "REMOVE_IMAGE";
export const SET_PROFILE_PIC = "SET_PROFILE_PIC";
export const GET_MY_PROFILE_PIC = "GET_MY_PROFILE_PIC";
export const GET_MY_GALLERY = "GET_MY_GALLERY";
export const GET_HOST_GALLERY = "GET_HOST_GALLERY";
export const GET_HOST_PROFILE = "GET_HOST_PROFILE";

export const addNewImage = (userID, image) => {
  return async (dispatch) => {
    if (userID && image) {
      const response = await fetch(
        "https://hiphost-v2-131c1.firebaseio.com/socialGallery/" +
          userID +
          ".json",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(`data:image;base64,${image}`),
        }
      );

      if (!response.ok) {
        const errorMessage = "Something went wrong!";

        throw new Error(errorMessage);
      }

      if (response.ok) {
        const resData = await response.json();
        var id = resData.name;

        dispatch({
          type: ADD_NEW_IMAGE,
          id: id,
          image: `data:image;base64,${image}`,
        });
      }
    }
  };
};

export const removeImage = (userID, imageID, isProfilePic) => {
  return async (dispatch) => {
    if (userID && imageID && typeof isProfilePic != "undefined") {
      const response = await fetch(
        "https://hiphost-v2-131c1.firebaseio.com/socialGallery/" +
          userID +
          "/" +
          imageID +
          ".json",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (isProfilePic == true) {
        const ProfileResponse = await fetch(
          "https://hiphost-v2-131c1.firebaseio.com/users/" + userID + ".json",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              profilePic: null,
              profilePicKey: null,
            }),
          }
        );
      }

      if (!response.ok) {
        const resData = await response.json();
        const errorMessage = "Something went wrong!";

        throw new Error(errorMessage);
      }

      dispatch({ type: REMOVE_IMAGE, id: imageID, isProfilePic: isProfilePic });
    }
  };
};

export const setProfilePic = (userID, imageID, image) => {
  return async (dispatch) => {
    if (userID && imageID && image) {
      const response = await fetch(
        "https://hiphost-v2-131c1.firebaseio.com/users/" + userID + ".json",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            profilePic: image,
            profilePicKey: imageID,
          }),
        }
      );

      if (!response.ok) {
        const errorMessage = "Something went wrong!";

        throw new Error(errorMessage);
      }

      dispatch({ type: SET_PROFILE_PIC, imageID: imageID, image: image });
    }
  };
};

export const getMyProfile = (userID) => {
  return async (dispatch) => {
    if (userID) {
      const responseProfile = await fetch(
        "https://hiphost-v2-131c1.firebaseio.com/users/" + userID + "/.json"
      );

      if (!responseProfile.ok) {
        const errorMessage = "Something went wrong!";

        throw new Error(errorMessage);
      }

      responseProfile.json().then((resProfileData) => {
        var profilePic =
          typeof resProfileData.profilePic != "undefined"
            ? resProfileData.profilePic
            : null;
        var profilePicKey =
          typeof resProfileData.profilePicKey != "undefined"
            ? resProfileData.profilePicKey
            : null;
        dispatch({
          type: GET_MY_PROFILE_PIC,
          profilePicKey: profilePicKey,
          profilePic: profilePic,
        });
      });
    }
  };
};

export const getMyGallery = (userID) => {
  return async (dispatch) => {
    if (userID) {
      const response = await fetch(
        "https://hiphost-v2-131c1.firebaseio.com/socialGallery/" +
          userID +
          "/.json"
      );

      if (!response.ok) {
        const errorMessage = "Something went wrong!";

        throw new Error(errorMessage);
      }

      const responseProfile = await fetch(
        "https://hiphost-v2-131c1.firebaseio.com/users/" + userID + "/.json"
      );

      if (!responseProfile.ok) {
        const errorMessage = "Something went wrong!";

        throw new Error(errorMessage);
      }

      response.json().then((resData) => {
        responseProfile.json().then((resProfileData) => {
          var profilePic =
            typeof resProfileData.profilePic != "undefined"
              ? resProfileData.profilePic
              : null;
          var profilePicKey =
            typeof resProfileData.profilePicKey != "undefined"
              ? resProfileData.profilePicKey
              : null;
          dispatch({
            type: GET_MY_GALLERY,
            images: resData,
            profilePicKey: profilePicKey,
            profilePic: profilePic,
          });
        });
      });
    }
  };
};

export const getHostProfile = (HostID) => {
  return async (dispatch) => {
    if (HostID) {
      const response = await fetch(
        "https://hiphost-v2-131c1.firebaseio.com/users/" + HostID + "/.json"
      );

      if (!response.ok) {
        const errorMessage = "Something went wrong!";

        throw new Error(errorMessage);
      }

      response.json().then((resProfileData) => {
        var profilePic =
          typeof resProfileData.profilePic != "undefined"
            ? resProfileData.profilePic
            : null;
        dispatch({
          type: GET_HOST_PROFILE,
          hostID: HostID,
          profilePic: profilePic,
        });
      });
    }
  };
};

export const getHostGallery = (hostID) => {
  return async (dispatch) => {
    if (hostID) {
      const response = await fetch(
        "https://hiphost-v2-131c1.firebaseio.com/socialGallery/" +
          hostID +
          "/.json"
      );

      if (!response.ok) {
        const errorMessage = "Something went wrong!";

        throw new Error(errorMessage);
      }

      const responseProfile = await fetch(
        "https://hiphost-v2-131c1.firebaseio.com/users/" + hostID + "/.json"
      );

      if (!responseProfile.ok) {
        const errorMessage = "Something went wrong!";

        throw new Error(errorMessage);
      }

      response.json().then((resData) => {
        responseProfile.json().then((resProfileData) => {
          var profilePic =
            typeof resProfileData.profilePic != "undefined"
              ? resProfileData.profilePic
              : null;
          dispatch({
            type: GET_HOST_GALLERY,
            images: resData,
            hostID: hostID,
            profilePic: profilePic,
          });
        });
      });
    }
  };
};
