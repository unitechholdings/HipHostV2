import USER from "../../models/user";
import { AsyncStorage } from "react-native";
import { firebaseAuth } from "../../firebase/firebaseApp";

export const SIGNUP = "SIGNUP";
export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const EXCHANGE_TOKEN = "EXCHANGE_TOKEN";
export const UPDATE_PASSWORD = "UPDATE_PASSWORD";
export const RESET_PASSWORD = "RESET_PASSWORD";

const api_key = "AIzaSyDs3imKVM0lD9t19g185U78Tq16TFjZPmM";

const saveUserId = async (userId, mail, pass) => {
  try {
    await AsyncStorage.setItem("@userId", userId);
    await AsyncStorage.setItem("@mail", mail);
    await AsyncStorage.setItem("@pass", pass);
  } catch (error) {
    throw new Error(error.message);
  }
};

const getUserId = async () => {
  let userId = "";
  let mail = "";
  let pass = "";
  try {
    userId = await AsyncStorage.getItem("@userId");
    mail = await AsyncStorage.getItem("@mail");
    pass = await AsyncStorage.getItem("@pass");

    if (userId != "" && mail != "" && pass != "") {
      var obj = {
        uid: userId,
        mail: mail,
        pass: pass,
      };
      return obj;
    } else return null;
  } catch (error) {
    console.log(error);
    //throw new Error(error.message);
  }
};

const removeSavedInfo = async () => {
  try {
    await AsyncStorage.removeItem("@userId");
    await AsyncStorage.removeItem("@mail");
    await AsyncStorage.removeItem("@pass");
    return true;
  } catch (err) {
    return false;
  }
};

const sendEmailVerification = async (idToken) => {
  try {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=" +
        api_key,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestType: "VERIFY_EMAIL",
          idToken: idToken,
        }),
      }
    );

    if (!response.ok) {
      const resData = await response.json();
      const errorID = resData.error.message;

      var errorMessage = "Email verification could not be sent!";

      if (errorID === "INVALID_ID_TOKEN") {
        errorMessage = "Your credentials are no longer valid";
      } else if (errorID === "USER_NOT_FOUND") {
        errorMessage =
          "Your account may have been deleted prior to sending the mail!";
      }

      return { message: errorMessage, status: "failed" };
    }

    return { message: "", status: "success" };
  } catch (error) {
    console.log(error);
    return { message: error, status: "failed" };
  }
};

export const signupUser = (firstName, lastName, email, password) => {
  return async (dispatch) => {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" +
        api_key,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const resData = await response.json();
      const errorID = resData.error.message;
      var errorMessage = "Something went wrong!";

      if (errorID === "EMAIL_EXISTS") {
        errorMessage = "This email already exists!";
      } else if (errorID === "TOO_MANY_ATTEMPTS_TRY_LATER") {
        errorMessage = "Too many attempts, please try again later!";
      }
      throw new Error(errorMessage);
    }

    const resData = await response.json();
    const idToken = resData.idToken;
    if (typeof idToken != "undefined") {
      const emailVerification = await sendEmailVerification(idToken);
      if (emailVerification.status == "failed") {
        throw new Error("Something went wrong! " + emailVerification.message);
      }
    }

    const secondResponse = await fetch(
      "https://hiphost-v2-131c1.firebaseio.com/users/" +
        resData.localId +
        ".json",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coins: 6,
          isHost: false,
          name: firstName,
          surname: lastName,
          email: email,
          userType: "user",
        }),
      }
    );

    if (!secondResponse.ok) {
      throw new Error(
        "Something went wrong! " + JSON.stringify(secondResponse)
      );
    }

    dispatch({ type: SIGNUP });
  };
};

export const loginUser = (email, password) => {
  return async (dispatch) => {
    const response = await firebaseAuth.signInWithEmailAndPassword(
      email,
      password
    );

    if (response.user) {
      var uid = response.user.uid;
      if (response.user.emailVerified) {
        var userData = await setUserData(uid, email, password);
        if (userData.isBlocked == true)
          throw new Error("Your account has been blocked!");
        dispatch({ type: LOGIN, user: userData });
      } else {
        throw new Error("Email address not verified yet");
      }
    } else throw new Error("Could not retrieve user info");
  };
};

export const resendVerificationEmail = (email, password) => {
  return async (dispatch) => {
    if (
      typeof firebaseAuth.currentUser == "undefined" ||
      firebaseAuth.currentUser == null
    ) {
      const response = await firebaseAuth.signInWithEmailAndPassword(
        email,
        password
      );
    }

    if (
      typeof firebaseAuth.currentUser != "undefined" &&
      firebaseAuth.currentUser != null
    ) {
      firebaseAuth.currentUser
        .sendEmailVerification()
        .then(() => {
          return true;
        })
        .catch((err) => {
          throw new Error("Could not send verification");
        });
    }
  };
};

export const autoLoginUser = () => {
  return async (dispatch) => {
    const userObj = await getUserId();
    if (typeof userObj.mail != "undefined" && userObj.mail != null) {
      const response = await firebaseAuth.signInWithEmailAndPassword(
        userObj.mail,
        userObj.pass
      );

      if (response.user) {
        var uid = response.user.uid;
        var userData = await setUserData(
          userObj.uid,
          userObj.mail,
          userObj.pass
        );
        if (userData.isBlocked == true) throw new Error("NOT_FOUND");
        dispatch({ type: LOGIN, user: userData });
      } else throw new Error("NOT_FOUND");
    } else throw new Error("NOT_FOUND");
  };
};

const setUserData = async (uid, mail, pass) => {
  try {
    await saveUserId(uid, mail, pass);
  } catch (err) {
    console.log(err);
  }

  const response = await fetch(
    "https://hiphost-v2-131c1.firebaseio.com/users/" + uid + ".json"
  );

  if (!response.ok) {
    return null;
  }

  const resData = await response.json();

  var rating = 0;
  try {
    rating =
      typeof resData.rating.total != "undefined" ? resData.rating.total : 0;
  } catch (err) {
    rating = 0;
  }

  var ranking = null;
  try {
    ranking = typeof resData.ranking != "undefined" ? resData.ranking : null;
  } catch (err) {
    ranking = null;
  }

  var token = null;
  try {
    token = typeof resData.token != "undefined" ? resData.token : null;
  } catch (err) {
    token = null;
  }

  var blocked = false;
  try {
    blocked =
      typeof resData.isBlocked != "undefined" ? resData.isBlocked : false;
  } catch (err) {
    blocked = false;
  }

  const user = new USER(
    resData.coins,
    resData.isHost,
    token,
    null,
    null,
    uid,
    blocked,
    resData.name,
    resData.surname,
    resData.email,
    resData.userType,
    resData.profileComplete,
    resData.profile,
    resData.demographicsComplete,
    resData.demographics,
    resData.bio,
    resData.activities,
    resData.locationInfo,
    resData.searchHistory,
    resData.chats,
    rating,
    ranking
  );

  return user;
};

export const logout = () => {
  return async (dispatch) => {
    await removeSavedInfo();
    dispatch({ type: LOGOUT });
  };
};

export const updatePassword = (userID, password) => {
  return async (dispatch) => {
    if (userID != null && password != null) {
      //get id token first to make sure it is the latest
      const userObj = await getUserId();
      if (typeof userObj != "undefined" && userObj != null) {
        firebaseAuth.currentUser.updatePassword(password).then(function () {
          removeSavedInfo().then(() => {
            dispatch({ type: UPDATE_PASSWORD });
          });
        });
      } else {
        throw new Error(
          "Could not verify, please logout, and log back in and try again"
        );
      }
    }
  };
};

export const resetPassword = (email) => {
  return async (dispatch) => {
    if (email != null) {
      const response = await firebaseAuth.sendPasswordResetEmail(email);
      dispatch({ type: RESET_PASSWORD });
    }
  };
};
