import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from "react-native";

import { useSelector, useDispatch } from "react-redux";
import * as authActions from "../store/actions/auth";

import Colors from "../constants/Colors";
import CustomButton from "../components/sharedComp/customOutlineButton";
import SearchablePopup from "../components/hostComp/searchableActivitiesPopup";

import data from "../staticData/data";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const HostActivitiesScreen = (props) => {
  const currentUser = useSelector((state) => state.user);
  const [showActivities, setShowActivities] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState();

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

  const goBackHandler = () => {
    props.navigation.goBack();
  };

  var activitiesContent = () => {
    try {
      if (currentUser.activities.length == 0)
        return <Text style={styles.text}>Nothing selected yet</Text>;
      else {
        var list = [];
        currentUser.activities.map((item, key) => {
          list.push(
            <Text key={key} style={styles.text}>
              {item}
            </Text>
          );
        });
        return list;
      }
    } catch (err) {
      console.log(err);
      return [];
    }
  };

  const saveHandler = (selected) => {
    setSelectedActivities(selected);
  };

  return (
    <ImageBackground
      style={styles.mainBackground}
      source={require("../assets/images/backgrounds/trans_overlay_bg.png")}
    >
      <SearchablePopup
        data={currentUser.activities}
        visible={showActivities}
        cancel={() => {
          setShowActivities(false);
        }}
        onSelected={(selected) => {
          saveHandler(selected);
        }}
        userID={currentUser.userID}
      />
      <View style={styles.mainContainer}>
        <View style={styles.headerContainer}>
          <Image
            style={styles.iconImage}
            source={require("../assets/images/icons/activities_icon.png")}
          />
          <Text style={styles.headerText}>ACTIVITIES</Text>
        </View>
        <View style={styles.bodyContainer}>
          <Text style={styles.labelText}>The activities I'm into:</Text>
          {activitiesContent()}
          <View style={styles.buttonContainer}>
            <CustomButton
              title="Edit"
              buttonColor={Colors.secondary}
              size="40%"
              onPress={() => {
                setShowActivities(true);
              }}
            />
          </View>
        </View>
        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={styles.backIconContainer}
            onPress={goBackHandler}
          >
            <Image
              style={styles.backIcon}
              source={require("../assets/images/icons/pink_back_icon.png")}
            />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  mainBackground: {
    flex: 1,
    resizeMode: "stretch",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
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
    alignItems: "center",
    justifyContent: "center",
  },
  iconImage: {
    width: windowWidth / 5,
    height: windowWidth / 5,
    resizeMode: "stretch",
  },
  headerText: {
    color: Colors.primary,
    fontFamily: "Bebas",
    fontSize: 40,
    textAlign: "center",
  },
  labelText: {
    color: Colors.primary,
    fontSize: 20,
    textAlign: "center",
    marginVertical: "8%",
  },
  text: {
    color: Colors.primary,
    fontSize: 15,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    height: "20%",
    alignItems: "center",
    marginTop: "5%",
  },
  footerContainer: {
    width: "100%",
    height: "10%",
    justifyContent: "center",
  },
  backIconContainer: {
    width: windowWidth / 10,
    height: windowWidth / 10,
  },
  backIcon: {
    width: windowWidth / 10,
    height: windowWidth / 10,
    resizeMode: "stretch",
  },
});

export default HostActivitiesScreen;
