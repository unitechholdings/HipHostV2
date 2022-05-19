import USER from "../../models/user";

export const SET_PUSH_TOKEN = "SET_PUSH_TOKEN";
export const SET_IS_HOST = "SET_IS_HOST";
export const SET_LOGGED_AS = "SET_LOGGED_AS";
export const SET_PROFILE = "SET_PROFILE";
export const SET_DEMOGRAPHIC = "SET_DEMOGRAPHIC";
export const UPDATE_BIO = "UPDATE_BIO";
export const UPDATE_ACTIVITIES = "UPDATE_ACTIVITIES";
export const UPDATE_LIVE_LOCATION = "UPDATE_LIVE_LOCATION";
export const UPDATE_HANGOUTS = "UPDATE_HANGOUTS";
export const UPDATE_SEARCH_HISTORY = "UPDATE_SEARCH_HISTORY";
export const UPDATE_NAME_SURNAME = "UPDATE_NAME_SURNAME";
export const UPDATE_COINS = "UPDATE_COINS";

export const setPushToken = (userID, token) => {
  return async (dispatch) => {
    if (typeof userID != "" && userID != null) {
      const response = await fetch(
        "https://hiphost-v2-131c1.firebaseio.com/users/" + userID + ".json",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token,
          }),
        }
      );

      if (!response.ok) {
        const resData = await response.json();
        const errorMessage = "Something went wrong!";

        throw new Error(errorMessage);
      }

      dispatch({ type: SET_PUSH_TOKEN, token: token });
    }
  };
};

export const updateIsHost = (userID) => {
  return async (dispatch) => {
    if (typeof userID != "" && userID != null) {
      const response = await fetch(
        "https://hiphost-v2-131c1.firebaseio.com/users/" + userID + ".json",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isHost: true,
          }),
        }
      );

      if (!response.ok) {
        const errorMessage = "Something went wrong!";

        throw new Error(errorMessage);
      }

      dispatch({ type: SET_IS_HOST, isHost: true });
    }
  };
};

export const updateLoggedInAs = (userType) => {
  return (dispatch) => {
    dispatch({ type: SET_LOGGED_AS, userType: userType });
  };
};

export const updateProfile = (
  userID,
  selectedAgeGroup,
  selectedGender,
  selectedBudget,
  selectedDiet,
  selectedAccommodation,
  selectedHostGender,
  selectedRelationship,
  selectedIndustry,
  selectedLangOne,
  selectedLangTwo
) => {
  return async (dispatch) => {
    if (typeof userID != "" && userID != null) {
      const profileObj = {
        profileComplete: true,
        profile: {
          ageGroup: selectedAgeGroup,
          gender: selectedGender,
          budget: selectedBudget,
          diet: selectedDiet,
          accommodation: selectedAccommodation,
          hostGender: selectedHostGender,
          relationship: selectedRelationship,
          industry: selectedIndustry,
          mainLanguage: selectedLangOne,
          otherLanguage: selectedLangTwo,
        },
      };
      const response = await fetch(
        "https://hiphost-v2-131c1.firebaseio.com/users/" + userID + ".json",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            profileComplete: profileObj.profileComplete,
            profile: profileObj.profile,
          }),
        }
      );

      if (!response.ok) {
        const resData = await response.json();
        const errorMessage = "Something went wrong!";

        throw new Error(errorMessage);
      }

      const resData = await response.json();

      dispatch({ type: SET_PROFILE, user: profileObj });
    }
  };
};

export const updateDemographic = (
  userID,
  selectedRelax,
  selectedFriendsDescribe,
  selectedNotMetYet,
  selectedDrinkingAttitude,
  selectedAnimal,
  selectedSocietyOption,
  selectedBackpack,
  selectedDrink,
  openness,
  extroversion
) => {
  return async (dispatch) => {
    if (typeof userID != "" && userID != null) {
      const demographicObj = {
        demographicsComplete: true,
        demographics: {
          relax: selectedRelax,
          friendsDescribeMe: selectedFriendsDescribe,
          notMetYet: selectedNotMetYet,
          dinningAttitude: selectedDrinkingAttitude,
          spiritAnimal: selectedAnimal,
          scienceOrArt: selectedSocietyOption,
          backpack: selectedBackpack,
          drink: selectedDrink,
          openness: openness,
          extroversion: extroversion,
        },
      };
      const response = await fetch(
        "https://hiphost-v2-131c1.firebaseio.com/users/" + userID + ".json",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            demographicsComplete: demographicObj.demographicsComplete,
            demographics: demographicObj.demographics,
          }),
        }
      );

      if (!response.ok) {
        const resData = await response.json();
        const errorMessage = "Something went wrong!";

        throw new Error(errorMessage);
      }

      dispatch({ type: SET_DEMOGRAPHIC, user: demographicObj });
    }
  };
};

export const updateBio = (userID, bioText) => {
  return async (dispatch) => {
    if (typeof userID != "" && userID != null) {
      const response = await fetch(
        "https://hiphost-v2-131c1.firebaseio.com/users/" + userID + ".json",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bio: bioText,
          }),
        }
      );

      if (!response.ok) {
        const resData = await response.json();
        const errorMessage = "Something went wrong!";

        throw new Error(errorMessage);
      }

      dispatch({ type: UPDATE_BIO, bio: bioText });
    }
  };
};

export const updateActivities = (userID, selectedActivities) => {
  return async (dispatch) => {
    if (typeof userID != "" && userID != null) {
      const response = await fetch(
        "https://hiphost-v2-131c1.firebaseio.com/users/" + userID + ".json",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            activities: selectedActivities,
          }),
        }
      );

      if (!response.ok) {
        const resData = await response.json();
        const errorMessage = "Something went wrong!";

        throw new Error(errorMessage);
      }

      dispatch({ type: UPDATE_ACTIVITIES, activities: selectedActivities });
    }
  };
};

export const updateLiveLocation = (userID, selectedLocation) => {
  return async (dispatch) => {
    if (typeof userID != "" && userID != null) {
      const response = await fetch(
        "https://hiphost-v2-131c1.firebaseio.com/users/" +
          userID +
          "/locationInfo.json",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            liveLocation: selectedLocation.name,
            liveCoords: selectedLocation.coords,
            shortName: selectedLocation.shortName,
          }),
        }
      );

      if (!response.ok) {
        const resData = await response.json();
        const errorMessage = "Something went wrong!";

        throw new Error(errorMessage);
      }

      dispatch({
        type: UPDATE_LIVE_LOCATION,
        liveLocation: selectedLocation.name,
        liveCoords: selectedLocation.coords,
      });
    }
  };
};

export const updateHangouts = (userID, selectedLocations) => {
  return async (dispatch) => {
    if (typeof userID != "" && userID != null) {
      const response = await fetch(
        "https://hiphost-v2-131c1.firebaseio.com/users/" +
          userID +
          "/locationInfo.json",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            hangouts: selectedLocations,
          }),
        }
      );

      if (!response.ok) {
        const resData = await response.json();
        const errorMessage = "Something went wrong!";

        throw new Error(errorMessage);
      }

      dispatch({ type: UPDATE_HANGOUTS, hangouts: selectedLocations });
    }
  };
};

export const updateSearchHistory = (userID, history, newHistoryOBJ) => {
  return async (dispatch) => {
    if (typeof userID != "undefined" && userID != null) {
      var oldestID = null;
      var oldest = null;
      if (history && Object.keys(history).length >= 5) {
        for (const [id, obj] of Object.entries(history)) {
          if (oldest == null || obj.timestamp >= oldest) {
            oldestID = id;
            oldest = obj.timestamp;
          }
        }
      }

      var response = null;
      var newOBJ = {
        timestamp: newHistoryOBJ.timestamp,
        location: newHistoryOBJ.location,
        activities: newHistoryOBJ.activities,
      };
      if (oldestID) {
        response = await fetch(
          "https://hiphost-v2-131c1.firebaseio.com/users/" +
            userID +
            "/searchHistory/" +
            oldestID +
            ".json",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newOBJ),
          }
        );
        history[oldestID] = newOBJ;
      } else {
        response = await fetch(
          "https://hiphost-v2-131c1.firebaseio.com/users/" +
            userID +
            "/searchHistory.json",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newOBJ),
          }
        );

        if (response.ok) {
          response.json().then((result) => {
            var id = result.name;
            history = { ...history, [id]: newOBJ };
          });
        }
      }

      if (!response.ok) {
        const resData = await response.json();
        const errorMessage = "Something went wrong!";

        throw new Error(errorMessage);
      }

      dispatch({ type: UPDATE_SEARCH_HISTORY, history: history });
    }
  };
};

export const updateNameSurname = (userID, name, surname) => {
  return async (dispatch) => {
    if (userID != "undefined" && userID != null && name && surname) {
      const response = await fetch(
        "https://hiphost-v2-131c1.firebaseio.com/users/" + userID + ".json",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            surname: surname,
          }),
        }
      );

      if (!response.ok) {
        const errorMessage = "Something went wrong!";

        throw new Error(errorMessage);
      }

      dispatch({ type: UPDATE_NAME_SURNAME, name: name, surname: surname });
    }
  };
};

//type : add or remove coins from current user
export const updateCoins = (userID, currentAmount, amount, type) => {
  return async (dispatch) => {
    if (
      typeof userID != "undefined" &&
      userID != null &&
      currentAmount &&
      amount &&
      type &&
      (type == "add" || type == "remove")
    ) {
      var newAmount = currentAmount;
      if (type == "add") {
        newAmount = newAmount + amount;
      } else {
        newAmount = newAmount - amount;
      }

      const response = await fetch(
        "https://hiphost-v2-131c1.firebaseio.com/users/" + userID + ".json",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            coins: newAmount,
          }),
        }
      );

      if (!response.ok) {
        const errorMessage = "Something went wrong!";

        throw new Error(errorMessage);
      }

      dispatch({ type: UPDATE_COINS, amount: newAmount });
    }
  };
};
