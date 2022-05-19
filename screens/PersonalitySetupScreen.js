import React, { useState, useEffect } from "react";
import {
  StatusBar,
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
  StyleSheet,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useSelector, useDispatch } from "react-redux";
import * as userActions from "../store/actions/user";
import * as authActions from "../store/actions/auth";

import Colors from "../constants/Colors";
import data from "../staticData/data";

import CheckBox from "../components/sharedComp/customCheckBox";
import CustomButton from "../components/sharedComp/customButton";
import CustomSlider from "../components/sharedComp/customSlider";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const PersonalitySetupScreen = (props) => {
  const currentUser = useSelector((state) => state.user);
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

  const [currentPage, setPage] = useState(1);
  const editMode = props.navigation.getParam("editMode");
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  const [selectedRelax, setSelectedRelax] = useState();
  const [selectedFriendsDescribe, setSelectedFriendsDescribe] = useState(
    "depends"
  );
  const [selectedNotMetYet, setSelectedNotMetYet] = useState("meh");
  const [selectedDiningAttitude, setSelectedDiningAttitude] = useState(
    "neutral"
  );
  const [selectedAnimal, setSelectedAnimal] = useState();
  const [selectedSocietyOption, setSelectedSocietyOption] = useState();
  const [selectedBackpack, setSelectedBackpack] = useState();
  const [selectedDrink, setSelectedDrink] = useState();

  const [pageOneValid, setPageOneValid] = useState(false);
  const [pageTwoValid, setPageTwoValid] = useState(false);
  const [pageThreeValid, setPageThreeValid] = useState(false);
  const [pageFourValid, setPageFourValid] = useState(false);

  const prevPageHandler = () => {
    if (currentPage > 1) setPage(currentPage - 1);
  };
  const nextPageHandler = () => {
    if (currentPage < 5) setPage(currentPage + 1);
  };

  useEffect(() => {
    try {
      if (editMode && !loaded) {
        if (currentUser && currentUser.demographics) {
          setSelectedFriendsDescribe(
            currentUser.demographics.friendsDescribeMe
          );
          setSelectedRelax(currentUser.demographics.relax);
          setSelectedNotMetYet(currentUser.demographics.notMetYet);
          setSelectedDiningAttitude(currentUser.demographics.dinningAttitude);
          setSelectedAnimal(currentUser.demographics.spiritAnimal);
          setSelectedSocietyOption(currentUser.demographics.scienceOrArt);
          setSelectedBackpack(currentUser.demographics.backpack);
          setSelectedDrink(currentUser.demographics.drink);
          setLoaded(true);
        }
      } else if (!loaded) {
        setLoaded(true);
      }

      switch (currentPage) {
        case 1:
          if (selectedRelax && selectedFriendsDescribe && !pageOneValid)
            setPageOneValid(true);
        case 2:
          if (selectedNotMetYet && selectedDiningAttitude && !pageTwoValid)
            setPageTwoValid(true);
        case 3:
          if (selectedAnimal && selectedSocietyOption && !pageThreeValid)
            setPageThreeValid(true);
        case 4:
          if (selectedBackpack && selectedDrink && !pageFourValid)
            setPageFourValid(true);
        default:
          null;
      }
    } catch (err) {
      console.log(err);
    }
  }, [
    selectedRelax,
    selectedFriendsDescribe,
    selectedNotMetYet,
    selectedDiningAttitude,
    selectedAnimal,
    selectedSocietyOption,
    selectedBackpack,
    selectedDrink,
  ]);

  const goOut = () => {
    props.navigation.goBack();
  };

  const saveHandler = () => {
    try {
      if (!editMode) nextPageHandler();

      setSaving(true);
      dispatch(
        userActions.updateDemographic(
          currentUser.userID,
          selectedRelax,
          selectedFriendsDescribe,
          selectedNotMetYet,
          selectedDiningAttitude,
          selectedAnimal,
          selectedSocietyOption,
          selectedBackpack,
          selectedDrink,
          openness(),
          extroversion()
        )
      )
        .then(() => {
          setTimeout(function () {
            setSaving(false);
            if (
              typeof currentUser.userType != "undefined" &&
              currentUser.userType == "host"
            ) {
              if (editMode) props.navigation.navigate("Profile");
              else props.navigation.navigate("HostDashboard");
            } else {
              if (editMode) props.navigation.navigate("Profile");
              else props.navigation.navigate("Explore");
            }
          }, 2000);
        })
        .catch((err) => {
          setSaving(false);
          Alert.alert("Could not save demographic", err.message, [
            { text: "Okay" },
          ]);
        });
    } catch (err) {
      console.log(err);
      setSaving(false);
      Alert.alert("Could not save demographic", err.message, [
        { text: "Okay" },
      ]);
    }
  };

  const openness = () => {
    let points = 0;
    switch (selectedDiningAttitude) {
      case "try":
        points += 2;
        break;
      case "stick":
        points -= 2;
        break;
    }
    switch (selectedSocietyOption) {
      case "art":
        points += 2;
        break;
      case "science":
        points -= 2;
        break;
    }
    switch (selectedBackpack) {
      case "messy":
        points += 2;
        break;
      case "neat":
        points -= 2;
        break;
    }
    return points;
  };

  const extroversion = () => {
    let points = 0;
    switch (selectedRelax) {
      case "social":
        points += 2;
        break;
      case "home":
        points -= 2;
        break;
    }
    switch (selectedFriendsDescribe) {
      case "lifeOf":
        points += 2;
        break;
      case "lifeTo":
        points -= 2;
        break;
    }
    switch (selectedNotMetYet) {
      case "agree":
        points += 2;
        break;
      case "disagree":
        points -= 2;
        break;
    }
    return points;
  };

  const getKeyByValue = (obj, val) => {
    try {
      if (editMode) {
        var id = -1;
        for (let index = 0; index < obj.length; index++) {
          const element = obj[index];
          if (element.value == val) id = index;
        }
        return id;
      } else return 1;
    } catch (err) {
      console.log(err);
      return 1;
    }
  };

  const getBackgroundImage = () => {
    if (currentPage == 1) {
      if (editMode)
        return require("../assets/images/backgrounds/quiz_bg_white.png");
      else
        return require("../assets/images/backgrounds/personalityPageOne_bg.png");
    } else {
      if (editMode)
        return require("../assets/images/backgrounds/white_headerless_bg.png");
      else return require("../assets/images/backgrounds/blue_bg.png");
    }
  };

  const backButtonImage = () => {
    if (editMode) return require("../assets/images/icons/blue_back_arrow.png");
    else return require("../assets/images/icons/backButton.png");
  };

  const pageOneContent = (
    <ImageBackground
      style={styles.mainBackground}
      source={getBackgroundImage()}
    >
      <StatusBar hidden />

      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>LET'S GET TO KNOW YOU BETTER</Text>
        <Text style={styles.subHeaderText}>
          Honesty ensures we match you with the best possible HipHost’s.
        </Text>
        <Text style={styles.subSubHeaderText}>Let’s go!</Text>
      </View>
      <View style={styles.pageOneMainContainer}>
        <View style={styles.labelContainer}>
          <Text
            style={{
              ...styles.labels,
              color: editMode ? Colors.primary : "white",
            }}
          >
            How do you relax after a long day of site-seeing?
          </Text>
        </View>
        <View style={styles.pageOneImageContainer}>
          <TouchableOpacity onPress={() => setSelectedRelax("social")}>
            <Image
              style={{
                ...styles.pageOneImage,
                borderColor:
                  selectedRelax == "social" ? Colors.secondary : "gold",
              }}
              source={require("../assets/images/inAppImages/social.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedRelax("home")}>
            <Image
              style={{
                ...styles.pageOneImage,
                borderColor:
                  selectedRelax == "home" ? Colors.secondary : "gold",
              }}
              source={require("../assets/images/inAppImages/home.png")}
            />
          </TouchableOpacity>
        </View>
        <Text
          style={{
            ...styles.pageOneImageText,
            color: editMode ? Colors.primary : "white",
          }}
        >
          TAP TO SELECT
        </Text>
        <View style={styles.inputContainer}>
          <View style={styles.labelContainer}>
            <Text
              style={{
                ...styles.labels,
                color: editMode ? Colors.primary : "white",
              }}
            >
              MY FRIENDS WOULD DESCRIBE ME AS:
            </Text>
          </View>
          {loaded ? (
            <View style={styles.slider}>
              <CustomSlider
                data={data.friendsOptions}
                color={editMode ? "white" : Colors.primary}
                val={getKeyByValue(
                  data.friendsOptions,
                  selectedFriendsDescribe
                )}
                onChange={(val) => {
                  setSelectedFriendsDescribe(data.friendsOptions[val].value);
                }}
              />
            </View>
          ) : (
            <View />
          )}
        </View>
      </View>
      {editMode ? (
        <View style={styles.footerContainer}>
          <View style={styles.sideContainer}>
            <TouchableOpacity style={styles.backContainer} onPress={goOut}>
              <Image style={styles.backImage} source={backButtonImage()} />
            </TouchableOpacity>
          </View>
          <View style={styles.middleContainer}>
            <CustomButton
              title="Next >"
              buttonColor={
                pageOneValid ? Colors.secondary : Colors.secondaryInactive
              }
              size="60%"
              onPress={nextPageHandler}
              disabled={!pageOneValid}
            />
          </View>
          <View style={styles.sideContainer} />
        </View>
      ) : (
        <View style={{ ...styles.footerContainer, justifyContent: "center" }}>
          <CustomButton
            title="Next >"
            buttonColor={
              pageOneValid ? Colors.secondary : Colors.secondaryInactive
            }
            size="40%"
            onPress={nextPageHandler}
            disabled={!pageOneValid}
          />
        </View>
      )}
    </ImageBackground>
  );

  const pageTwoContent = (
    <ImageBackground
      style={styles.mainBackground}
      source={getBackgroundImage()}
    >
      <StatusBar hidden />

      <View style={styles.pageTwoImageContainer}>
        <Image
          style={styles.pageTwoImage}
          source={require("../assets/images/inAppImages/question_1.png")}
        />
      </View>
      <View style={styles.pageTwoMainContainer}>
        <View style={styles.inputContainer}>
          <View style={styles.labelContainer}>
            <Text
              style={{
                ...styles.labels,
                color: editMode ? Colors.primary : "white",
              }}
            >
              TO WHAT EXTENT DO YOU AGREE WITH
              <Text style={{ color: "gold" }}> THE ABOVE </Text> STATEMENT?
            </Text>
          </View>
          {loaded ? (
            <View style={styles.slider}>
              <CustomSlider
                data={data.strangersOptions}
                color={editMode ? "white" : Colors.primary}
                val={getKeyByValue(data.strangersOptions, selectedNotMetYet)}
                onChange={(val) => {
                  setSelectedNotMetYet(data.strangersOptions[val].value);
                }}
              />
            </View>
          ) : (
            <View />
          )}
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.labelContainer}>
            <Text
              style={{
                ...styles.labels,
                color: editMode ? Colors.primary : "white",
              }}
            >
              MY ATTITUDE TO DINING LOCAL IN A NEW PLACE?
            </Text>
          </View>
          {loaded ? (
            <View style={styles.slider}>
              <CustomSlider
                data={data.attitudeOptions}
                color={editMode ? "white" : Colors.primary}
                val={getKeyByValue(
                  data.attitudeOptions,
                  selectedDiningAttitude
                )}
                onChange={(val) => {
                  setSelectedDiningAttitude(data.attitudeOptions[val].value);
                }}
              />
            </View>
          ) : (
            <View />
          )}
        </View>
      </View>
      <View style={styles.footerContainer}>
        <View style={styles.sideContainer}>
          <TouchableOpacity
            style={styles.backContainer}
            onPress={prevPageHandler}
          >
            <Image style={styles.backImage} source={backButtonImage()} />
          </TouchableOpacity>
        </View>
        <View style={styles.middleContainer}>
          <CustomButton
            title="Next >"
            buttonColor={
              pageTwoValid ? Colors.secondary : Colors.secondaryInactive
            }
            size="60%"
            onPress={nextPageHandler}
            disabled={!pageTwoValid}
          />
        </View>
        <View style={styles.sideContainer} />
      </View>
    </ImageBackground>
  );

  const pageThreeContent = (
    <ImageBackground
      style={styles.mainBackground}
      source={getBackgroundImage()}
    >
      <StatusBar hidden />
      <View
        style={{
          ...styles.labelContainer,
          paddingVertical: "5%",
          position: "absolute",
          marginTop: "12%",
        }}
      >
        <Text
          style={{
            ...styles.labels,
            color: editMode ? Colors.primary : "white",
          }}
        >
          WHICH OF THESE IS YOUR SPIRIT ANIMAL?
        </Text>
      </View>
      <View style={styles.pageThreeImageContainer}>
        <View style={styles.imageRowContainer}>
          <TouchableOpacity
            style={{
              ...styles.pageThreeImageBlock,
              borderColor: selectedAnimal == "cat" ? Colors.secondary : "gold",
            }}
            onPress={() => {
              setSelectedAnimal("cat");
            }}
          >
            <Image
              style={styles.pageThreeImage}
              source={require("../assets/images/inAppImages/cat.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...styles.pageThreeImageBlock,
              borderColor: selectedAnimal == "dog" ? Colors.secondary : "gold",
            }}
            onPress={() => {
              setSelectedAnimal("dog");
            }}
          >
            <Image
              style={styles.pageThreeImage}
              source={require("../assets/images/inAppImages/dog.png")}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.imageRowContainer}>
          <TouchableOpacity
            style={{
              ...styles.pageThreeImageBlock,
              borderColor:
                selectedAnimal == "gorilla" ? Colors.secondary : "gold",
            }}
            onPress={() => {
              setSelectedAnimal("gorilla");
            }}
          >
            <Image
              style={styles.pageThreeImage}
              source={require("../assets/images/inAppImages/gorilla.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...styles.pageThreeImageBlock,
              borderColor:
                selectedAnimal == "confused" ? Colors.secondary : "gold",
            }}
            onPress={() => {
              setSelectedAnimal("confused");
            }}
          >
            <Image
              style={styles.pageThreeImage}
              source={require("../assets/images/inAppImages/confused.png")}
            />
          </TouchableOpacity>
        </View>
      </View>
      <Text
        style={{
          ...styles.pageOneImageText,
          color: editMode ? Colors.primary : "white",
        }}
      >
        TAP TO SELECT
      </Text>
      <View style={styles.pageThreeMainContainer}>
        <View style={{ ...styles.inputContainer }}>
          <View style={styles.labelContainer}>
            <Text
              style={{
                ...styles.labels,
                color: editMode ? Colors.primary : "white",
              }}
            >
              WHICH IS MORE IMPORTANT IN SOCIETY?
            </Text>
          </View>
          <View style={styles.slider}>
            {data.societyOptions.map((group, key) => {
              return (
                <CheckBox
                  title={group.title}
                  key={key}
                  id={group.id}
                  color={editMode ? Colors.primary : "white"}
                  selected={selectedSocietyOption}
                  onPress={() => {
                    setSelectedSocietyOption(group.id);
                  }}
                />
              );
            })}
          </View>
        </View>
      </View>
      <View style={styles.footerContainer}>
        <View style={styles.sideContainer}>
          <TouchableOpacity
            style={styles.backContainer}
            onPress={prevPageHandler}
          >
            <Image style={styles.backImage} source={backButtonImage()} />
          </TouchableOpacity>
        </View>
        <View style={styles.middleContainer}>
          <CustomButton
            title="Next >"
            buttonColor={
              pageThreeValid ? Colors.secondary : Colors.secondaryInactive
            }
            size="60%"
            onPress={nextPageHandler}
            disabled={!pageThreeValid}
          />
        </View>
        <View style={styles.sideContainer} />
      </View>
    </ImageBackground>
  );

  const pageFourContent = (
    <ImageBackground
      style={styles.mainBackground}
      source={getBackgroundImage()}
    >
      <StatusBar hidden />
      <View
        style={{
          ...styles.labelContainer,
          marginTop: "10%",
          paddingHorizontal: 0,
        }}
      >
        <Text
          style={{
            ...styles.labels,
            color: editMode ? Colors.primary : "white",
          }}
        >
          I'VE BEEN TRAVELING FOR 2 MONTHS.
        </Text>
        <Text
          style={{
            ...styles.labels,
            color: editMode ? Colors.primary : "white",
          }}
        >
          THIS IS WHAT MY BACKPACK LOOKS LIKE:
        </Text>
      </View>
      <View style={styles.pageFourImageContainer}>
        <View style={styles.backpackImageRowContainer}>
          <TouchableOpacity
            style={{
              ...styles.pageFourImageBlock,
              borderColor:
                selectedBackpack == "neat" ? Colors.secondary : "gold",
            }}
            onPress={() => {
              setSelectedBackpack("neat");
            }}
          >
            <Image
              style={styles.pageThreeImage}
              source={require("../assets/images/inAppImages/backpackOne.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...styles.pageFourImageBlock,
              borderColor:
                selectedBackpack == "messy" ? Colors.secondary : "gold",
            }}
            onPress={() => {
              setSelectedBackpack("messy");
            }}
          >
            <Image
              style={styles.pageThreeImage}
              source={require("../assets/images/inAppImages/backpackTwo.png")}
            />
          </TouchableOpacity>
        </View>
      </View>
      <Text
        style={{
          ...styles.pageOneImageText,
          color: editMode ? Colors.primary : "white",
        }}
      >
        TAP TO SELECT
      </Text>
      <View style={styles.pageFourMainContainer}>
        <View style={styles.inputContainer}>
          <View
            style={{
              width: "100%",
              justifyContent: "flex-start",
              marginLeft: "10%",
            }}
          >
            <Text
              style={{
                ...styles.labels,
                textAlign: "left",
                color: editMode ? Colors.primary : "white",
              }}
            >
              WHICH DRINK DESCRIBES YOU THE BEST
            </Text>
          </View>
          <View style={styles.drinksStyle}>
            {data.drinksOptions.map((group, key) => {
              return (
                <CheckBox
                  title={group.title}
                  color={editMode ? Colors.primary : "white"}
                  key={key}
                  id={group.id}
                  selected={selectedDrink}
                  onPress={() => {
                    setSelectedDrink(group.id);
                  }}
                />
              );
            })}
          </View>
        </View>
      </View>
      <View style={styles.footerContainer}>
        <View style={styles.sideContainer}>
          <TouchableOpacity
            style={styles.backContainer}
            onPress={prevPageHandler}
          >
            <Image style={styles.backImage} source={backButtonImage()} />
          </TouchableOpacity>
        </View>
        <View style={styles.middleContainer}>
          <CustomButton
            title={editMode ? "Save" : "Done"}
            buttonColor={
              pageFourValid ? Colors.secondary : Colors.secondaryInactive
            }
            size="60%"
            onPress={saveHandler}
            disabled={!pageFourValid}
            loading={saving}
          />
        </View>
        <View style={styles.sideContainer} />
      </View>
    </ImageBackground>
  );

  const pageFiveContent = (
    <ImageBackground
      style={styles.mainBackground}
      source={require("../assets/images/backgrounds/blue_bg.png")}
    >
      <StatusBar hidden />
      <View style={styles.pageFiveContainer}>
        <View style={styles.pageFiveHeaderContainer}>
          <Image
            style={styles.pageFiveIcon}
            source={require("../assets/images/icons/hiphub_icon.png")}
          />
          <Text style={styles.pageFiveIconText}>ALL DONE!</Text>
        </View>
        <View style={styles.pageFiveTextContainer}>
          <Text style={{ ...styles.pageFiveText, marginBottom: "10%" }}>
            Now it's time to find your HipHost.
          </Text>
          <Text style={styles.pageFiveText}>Pro Tip:</Text>
          <Text style={{ ...styles.pageFiveText, marginBottom: "10%" }}>
            Update your demographics & personality section in the Settings menu
          </Text>
        </View>
        <View style={styles.pageFiveGifContainer}>
          <Image
            style={styles.pageFiveGif}
            source={require("../assets/images/GIFS/loading_white.gif")}
          />
        </View>
      </View>
    </ImageBackground>
  );

  switch (currentPage) {
    case 1:
      return pageOneContent;
    case 2:
      return pageTwoContent;
    case 3:
      return pageThreeContent;
    case 4:
      return pageFourContent;
    case 5:
      return pageFiveContent;
    default:
      return pageOneContent;
  }
};

const styles = StyleSheet.create({
  mainBackground: {
    flex: 1,
    resizeMode: "cover",
    //paddingHorizontal: "5%",
    backgroundColor: "white",
  },
  headerContainer: {
    width: "100%",
    height: "25%",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    width: "100%",
    color: "white",
    fontFamily: "Bebas",
    fontSize: 25,
    textAlign: "center",
  },
  subHeaderText: {
    width: "70%",
    color: "white",
    fontSize: 15,
    textAlign: "center",
    marginTop: windowHeight / 60,
  },
  subSubHeaderText: {
    width: "70%",
    color: "white",
    fontSize: 15,
    textAlign: "center",
  },
  pageOneMainContainer: {
    width: "100%",
    height: "65%",
    paddingHorizontal: "5%",
  },
  labelContainer: {
    width: "100%",
    minHeight: 70,
    paddingHorizontal: "12%",
    alignItems: "center",
    justifyContent: "center",
  },
  labels: {
    width: "100%",
    color: "white",
    fontFamily: "Bebas",
    fontSize: 22,
    textAlign: "center",
    flexWrap: "wrap",
  },
  pageOneImageContainer: {
    width: "100%",
    flexDirection: "row",
    marginTop: "5%",
    justifyContent: "space-between",
  },
  pageOneImage: {
    width: windowWidth / 2 - 30,
    height: windowWidth / 3,
    resizeMode: "cover",
    borderRadius: 10,
    borderWidth: 3,
  },
  pageOneImageText: {
    width: "100%",
    color: "white",
    fontSize: 15,
    textAlign: "center",
    marginTop: "5%",
  },
  pageTwoMainContainer: {
    width: "100%",
    height: "65%",
    paddingHorizontal: "5%",
  },
  pageTwoImageContainer: {
    width: "100%",
    height: "25%",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingTop: windowHeight / 30,
  },
  pageTwoImage: {
    width: windowWidth / 1.5,
    height: "85%",
    resizeMode: "stretch",
    borderColor: "gold",
    borderWidth: 3,
    borderRadius: 10,
  },
  pageThreeImageContainer: {
    width: "100%",
    height: "30%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: "5%",
    marginTop: windowHeight / 8,
  },
  imageRowContainer: {
    width: "80%",
    flexDirection: "row",
    paddingVertical: "2%",
    justifyContent: "space-evenly",
  },
  backpackImageRowContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  pageThreeImageBlock: {
    width: windowHeight / 8,
    height: windowHeight / 8,
    borderWidth: 5,
    borderRadius: windowWidth,
    overflow: "hidden",
  },
  pageFourMainContainer: {
    width: "100%",
    height: "54%",
  },
  pageFourImageContainer: {
    width: "100%",
    height: windowHeight / 6,
    justifyContent: "center",
    alignItems: "center",
  },

  pageFourImageBlock: {
    width: windowHeight / 8,
    height: windowHeight / 6,
    backgroundColor: "white",
    borderWidth: 5,
    borderRadius: 10,
    overflow: "hidden",
  },
  pageThreeImage: {
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
  },
  pageThreeMainContainer: {
    width: "100%",
    height: "40%",
    paddingHorizontal: "5%",
  },
  inputContainer: {
    width: "100%",
    marginTop: windowHeight / 30,
  },
  slider: {
    width: "100%",
    marginTop: "5%",
  },
  drinksStyle: {
    width: "60%",
    marginTop: "5%",
    marginLeft: "10%",
  },
  footerContainer: {
    width: windowWidth,
    height: windowHeight / 8,
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    marginTop: windowHeight - windowHeight / 8,
  },
  sideContainer: {
    width: "20%",
    alignItems: "center",
  },
  middleContainer: {
    width: "60%",
    alignItems: "center",
  },
  backContainer: {
    width: windowWidth / 10,
    height: windowWidth / 10,
  },
  backImage: {
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
  },

  pageFiveContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  pageFiveHeaderContainer: {
    width: "100%",
    height: "30%",
    justifyContent: "center",
    alignItems: "center",
  },
  pageFiveIconText: {
    width: "100%",
    color: "white",
    textAlign: "center",
    fontSize: 25,
    fontFamily: "Bebas",
    marginTop: "4%",
  },
  pageFiveTextContainer: {
    width: "100%",
    height: "20%",
    justifyContent: "center",
    alignItems: "center",
  },
  pageFiveText: {
    width: "100%",
    color: "white",
    textAlign: "center",
    fontSize: 15,
  },
  pageFiveGifContainer: {
    width: "100%",
    height: "30%",
    justifyContent: "center",
    alignItems: "center",
  },
  pageFiveIcon: {
    width: windowHeight / 8,
    height: windowHeight / 6,
    resizeMode: "stretch",
  },
  pageFiveGif: {
    width: windowHeight / 4,
    height: windowHeight / 4,
  },
});

export default PersonalitySetupScreen;
