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
import Colors from "../constants/Colors";
import CustomButton from "../components/sharedComp/customOutlineButton";
import SearchableHangoutPopup from "../components/hostComp/searchableHangoutPopup";
import SearchableLocationPopup from "../components/hostComp/searchableLocationPopup";

import { useSelector, useDispatch } from "react-redux";
import * as authActions from "../store/actions/auth";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const HostLocationScreen = (props) => {
  const currentUser = useSelector((state) => state.user);
  const [showLocation, setShowLocation] = useState(false);
  const [showHangout, setShowHangout] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState();
  const [selectedHangout, setSelectedHangout] = useState();

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

  const saveLocationHandler = (selected) => {
    setSelectedLocation(selected);
  };

  const saveHangoutHandler = (selected) => {
    setSelectedHangout(selected);
  };

  var LocationContent = () => {
    try {
      if (!currentUser.locationInfo.liveLocation)
        return <Text style={styles.text}>Nothing selected yet</Text>;
      else {
        var loc = currentUser.locationInfo.liveLocation;
        return <Text style={styles.text}>{loc}</Text>;
      }
    } catch (err) {
      console.log(err);
      return <Text style={styles.text}>Nothing selected yet</Text>;
    }
  };

  var HangoutContent = () => {
    try {
      if (!currentUser.locationInfo.hangouts)
        return <Text style={styles.text}>Nothing selected yet</Text>;
      else {
        var list = [];
        currentUser.locationInfo.hangouts.map((item, key) => {
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
    }
  };

  return (
    <ImageBackground
      style={styles.container}
      source={require("../assets/images/backgrounds/trans_overlay_bg.png")}
    >
      <SearchableLocationPopup
        data={
          currentUser.locationInfo.liveLocation
            ? [
                {
                  name: currentUser.locationInfo.liveLocation,
                  coords: currentUser.locationInfo.liveCoords,
                },
              ]
            : []
        }
        visible={showLocation}
        cancel={() => {
          setShowLocation(false);
        }}
        onSelected={(selected) => {
          saveLocationHandler(selected);
        }}
        userID={currentUser.userID}
      />
      <SearchableHangoutPopup
        data={currentUser.locationInfo.hangouts}
        visible={showHangout}
        cancel={() => {
          setShowHangout(false);
        }}
        onSelected={(selected) => {
          saveHangoutHandler(selected);
        }}
        userID={currentUser.userID}
      />
      <View style={styles.headerContainer}>
        <Image
          style={styles.iconImage}
          source={require("../assets/images/icons/location_icon.png")}
        />
        <Text style={styles.headerText}>LOCATION</Text>
      </View>
      <View style={styles.bodyContainer}>
        <View style={styles.liveContainer}>
          <Text style={styles.labelText}>I live in:</Text>
          {LocationContent()}
          <View style={styles.buttonContainer}>
            <CustomButton
              title="Edit"
              buttonColor={Colors.secondary}
              size="40%"
              onPress={() => {
                setShowLocation(true);
              }}
            />
          </View>
        </View>
        <View style={styles.hangoutContainer}>
          <Text style={styles.labelText}>I hangout in:</Text>
          {HangoutContent()}
          <View style={styles.buttonContainer}>
            <CustomButton
              title="Edit"
              buttonColor={Colors.secondary}
              size="40%"
              onPress={() => {
                setShowHangout(true);
              }}
            />
          </View>
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
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: "cover",
    paddingTop: "10%",
    paddingHorizontal: "10%",
    backgroundColor: "white",
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
  liveContainer: {
    width: "90%",
    height: "50%",
    alignItems: "center",
    justifyContent: "center",
    borderColor: Colors.primary,
    borderBottomWidth: 1,
  },
  hangoutContainer: {
    width: "90%",
    height: "50%",
    alignItems: "center",
    justifyContent: "flex-start",
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
    marginLeft: "5%",
  },
  backIcon: {
    width: windowWidth / 10,
    height: windowWidth / 10,
    resizeMode: "stretch",
  },
});

export default HostLocationScreen;
