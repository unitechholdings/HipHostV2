import React, { useState, useEffect } from "react";
import {
  StatusBar,
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
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
import SearchablePopup from "../components/profileComp/searchablePopup";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const windowFontSize = windowWidth / 20;

const ProfileSetupScreen = (props) => {
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

  const [showIndustry, setShowIndustry] = useState(false);
  const [showFirstLang, setShowFirstLang] = useState(false);
  const [showSecondLang, setShowSecondLang] = useState(false);

  const [selectedAgeGroup, setSelectedAgeGroup] = useState();
  const [selectedGender, setSelectedGender] = useState();
  const [selectedBudget, setSelectedBudget] = useState();
  const [selectedDiet, setSelectedDiet] = useState();
  const [selectedAccommodation, setSelectedAccommodation] = useState();
  const [selectedHostGender, setSelectedHostGender] = useState();
  const [selectedRelationship, setSelectedRelationship] = useState();
  const [selectedIndustry, setSelectedIndustry] = useState();
  const [selectedLangOne, setSelectedLangOne] = useState();
  const [selectedLangTwo, setSelectedLangTwo] = useState();
  const [agreeToTerms, setAgreeToTerms] = useState();

  const [pageOneValid, setPageOneValid] = useState(false);
  const [pageTwoValid, setPageTwoValid] = useState(false);
  const [pageThreeValid, setPageThreeValid] = useState(false);

  const prevPageHandler = () => {
    if (currentPage > 1) setPage(currentPage - 1);
  };
  const nextPageHandler = () => {
    if (currentPage < 3) setPage(currentPage + 1);
  };

  useEffect(() => {
    try {
      if (editMode && !loaded) {
        if (currentUser && currentUser.profile) {
          setSelectedAgeGroup(currentUser.profile.ageGroup);
          setSelectedGender(currentUser.profile.gender);
          setSelectedBudget(currentUser.profile.budget);
          setSelectedDiet(currentUser.profile.diet);
          setSelectedAccommodation(currentUser.profile.accommodation);
          setSelectedHostGender(currentUser.profile.hostGender);
          setSelectedRelationship(currentUser.profile.relationship);
          setSelectedIndustry(currentUser.profile.industry);
          setSelectedLangOne(currentUser.profile.mainLanguage);
          setSelectedLangTwo(currentUser.profile.secondLanguage);
          setLoaded(true);
        }
      } else if (!loaded) {
        setLoaded(true);
      }
    } catch (err) {
      console.log(err);
    }

    switch (currentPage) {
      case 1:
        if (selectedAgeGroup && selectedGender) setPageOneValid(true);
      case 2:
        if (selectedBudget && selectedDiet && selectedAccommodation)
          setPageTwoValid(true);
      case 3:
        if (
          selectedHostGender &&
          selectedRelationship &&
          selectedIndustry &&
          selectedLangOne
        ) {
          if (editMode) setPageThreeValid(true);
          if (agreeToTerms) setPageThreeValid(true);
        }

      default:
        null;
    }
  }, [
    selectedAgeGroup,
    selectedGender,
    selectedBudget,
    selectedDiet,
    selectedAccommodation,
    selectedHostGender,
    selectedRelationship,
    selectedIndustry,
    selectedLangOne,
    selectedLangTwo,
    agreeToTerms,
  ]);

  const saveHandler = () => {
    try {
      if (
        !currentUser.demographicsComplete ||
        currentUser.demographicsComplete === false
      ) {
        setPage(4);
      }
      setSaving(true);
      dispatch(
        userActions.updateProfile(
          currentUser.userID,
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
        )
      )
        .then(() => {
          setSaving(false);
          if (
            !currentUser.demographicsComplete ||
            currentUser.demographicsComplete === false
          )
            props.navigation.navigate("PersonalitySetup", { editMode: false });
          else props.navigation.navigate("Explore");
        })
        .catch((err) => {
          setSaving(false);
          Alert.alert("Could not save profile", err.message, [
            { text: "Okay" },
          ]);
        });
    } catch (err) {
      console.log(err);
      setSaving(false);
      Alert.alert("Could not save profile", err.message, [{ text: "Okay" }]);
    }
  };

  const getBackgroundImage = () => {
    if (currentPage == 1) {
      if (editMode)
        return require("../assets/images/backgrounds/grey_bg_header.png");
      else return require("../assets/images/backgrounds/profilePageOne_bg.png");
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

  const goOut = () => {
    props.navigation.goBack();
  };

  const pageOneContent = (
    <ImageBackground
      style={styles.mainBackground}
      source={getBackgroundImage()}
    >
      <StatusBar hidden />
      <View style={styles.mainContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.iconContainer}>
            <Image
              style={styles.icon}
              source={require("../assets/images/icons/pen_icon.png")}
            />
          </View>

          <Text style={styles.headerTitle}>
            Hey! Details are used to help you make the best match possible. We
            don't judge and neither should you. Everybody love everybody. Let's
            get started :
          </Text>
        </View>

        <Text
          style={{
            ...styles.labels,
            color: editMode ? Colors.primary : "white",
          }}
        >
          AGE:
        </Text>
        <View style={styles.checkContainer}>
          {data.ageGroups.map((group, key) => {
            return (
              <CheckBox
                title={group.title}
                key={key}
                color={editMode ? Colors.primary : "white"}
                id={group.id}
                selected={selectedAgeGroup}
                onPress={() => {
                  setSelectedAgeGroup(group.id);
                }}
                columns={windowWidth / 4}
              />
            );
          })}
        </View>

        <Text
          style={{
            ...styles.labels,
            color: editMode ? Colors.primary : "white",
          }}
        >
          I IDENTIFY AS:
        </Text>
        <View style={styles.checkContainer}>
          {data.genders.map((group, key) => {
            return (
              <CheckBox
                title={group.title}
                key={key}
                color={editMode ? Colors.primary : "white"}
                id={group.id}
                selected={selectedGender}
                onPress={() => {
                  setSelectedGender(group.id);
                }}
                columns={windowWidth / 4}
              />
            );
          })}
        </View>
      </View>
      {editMode ? (
        <View style={styles.footer}>
          <View style={styles.backMainContainer}>
            <TouchableOpacity
              style={styles.backButtonContainer}
              onPress={goOut}
            >
              <Image style={styles.backButton} source={backButtonImage()} />
            </TouchableOpacity>
          </View>
          <CustomButton
            title="Next >"
            buttonColor={
              pageTwoValid ? Colors.secondary : Colors.secondaryInactive
            }
            size="50%"
            onPress={nextPageHandler}
            disabled={!pageTwoValid}
          />
        </View>
      ) : (
        <View style={{ ...styles.footer, justifyContent: "center" }}>
          <CustomButton
            title="Next >"
            buttonColor={
              pageOneValid ? Colors.secondary : Colors.secondaryInactive
            }
            size="50%"
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
      <View style={styles.mainContainer}>
        <Text
          style={{
            ...styles.labels,
            color: editMode ? Colors.primary : "white",
          }}
        >
          DAILY BUDGET WHEN YOU TRAVEL:
        </Text>
        <View style={styles.checkContainer}>
          {data.budgets.map((group, key) => {
            return (
              <CheckBox
                title={group.title}
                key={key}
                color={editMode ? Colors.primary : "white"}
                id={group.id}
                selected={selectedBudget}
                onPress={() => {
                  setSelectedBudget(group.id);
                }}
              />
            );
          })}
        </View>

        <Text
          style={{
            ...styles.labels,
            color: editMode ? Colors.primary : "white",
          }}
        >
          DIETARY REQUIREMENTS:
        </Text>
        <View style={styles.checkContainer}>
          {data.diets.map((group, key) => {
            return (
              <CheckBox
                title={group.title}
                key={key}
                color={editMode ? Colors.primary : "white"}
                id={group.id}
                selected={selectedDiet}
                onPress={() => {
                  setSelectedDiet(group.id);
                }}
                columns={"45%"}
              />
            );
          })}
        </View>

        <Text
          style={{
            ...styles.labels,
            color: editMode ? Colors.primary : "white",
          }}
        >
          WHERE DO YOU PREFER TO STAY:
        </Text>
        <View style={styles.checkContainer}>
          {data.accommodations.map((group, key) => {
            return (
              <CheckBox
                title={group.title}
                key={key}
                color={editMode ? Colors.primary : "white"}
                id={group.id}
                selected={selectedAccommodation}
                onPress={() => {
                  setSelectedAccommodation(group.id);
                }}
                columns="45%"
              />
            );
          })}
        </View>
      </View>
      <View style={styles.footer}>
        <View style={styles.backMainContainer}>
          <TouchableOpacity
            style={styles.backButtonContainer}
            onPress={prevPageHandler}
          >
            <Image style={styles.backButton} source={backButtonImage()} />
          </TouchableOpacity>
        </View>
        <CustomButton
          title="Next >"
          buttonColor={
            pageTwoValid ? Colors.secondary : Colors.secondaryInactive
          }
          size="50%"
          onPress={nextPageHandler}
          disabled={!pageTwoValid}
        />
      </View>
    </ImageBackground>
  );
  const pageThreeContent = (
    <ImageBackground
      style={styles.mainBackground}
      source={getBackgroundImage()}
    >
      <StatusBar hidden />
      <View style={styles.mainContainer}>
        <Text
          style={{
            ...styles.labels,
            color: editMode ? Colors.primary : "white",
          }}
        >
          WHICH INDUSTRY ARE YOU IN?
        </Text>
        <View style={styles.dropdownContainer}>
          <ImageBackground
            style={{
              ...styles.searchBoxBG,
              borderWidth: editMode ? 2 : 0,
            }}
            source={require("../assets/images/icons/dropdown-bg.png")}
          >
            <TextInput
              style={styles.inputBox}
              onTouchStart={() => {
                setShowIndustry(true);
              }}
              placeholder="Search"
              keyboardType={null}
              value={selectedIndustry ? selectedIndustry : ""}
            />
          </ImageBackground>
        </View>
        <SearchablePopup
          data={data.industries}
          visible={showIndustry}
          cancel={() => {
            setShowIndustry(false);
          }}
          onSelected={(selected) => {
            setSelectedIndustry(selected);
          }}
        />

        <Text
          style={{
            ...styles.labels,
            color: editMode ? Colors.primary : "white",
          }}
        >
          WHO WOULD YOU PREFER TO BE HOSTED BY:
        </Text>
        <View style={styles.checkContainer}>
          {data.hostGenders.map((group, key) => {
            return (
              <CheckBox
                title={group.title}
                key={key}
                color={editMode ? Colors.primary : "white"}
                id={group.id}
                selected={selectedHostGender}
                onPress={() => {
                  setSelectedHostGender(group.id);
                }}
              />
            );
          })}
        </View>

        <Text
          style={{
            ...styles.labels,
            color: editMode ? Colors.primary : "white",
          }}
        >
          RELATIONSHIP STATUS:
        </Text>
        <View style={styles.checkContainer}>
          {data.relationshipStatuses.map((group, key) => {
            return (
              <CheckBox
                title={group.title}
                key={key}
                color={editMode ? Colors.primary : "white"}
                id={group.id}
                selected={selectedRelationship}
                onPress={() => {
                  setSelectedRelationship(group.id);
                }}
                columns="45%"
              />
            );
          })}
        </View>

        <Text
          style={{
            ...styles.labels,
            color: editMode ? Colors.primary : "white",
          }}
        >
          LANGUAGE: CHOOSE ALL THAT APPLY:
        </Text>
        <View style={styles.langContainer}>
          <View style={{ ...styles.checkLangContainer, marginRight: "4%" }}>
            <ImageBackground
              style={{
                ...styles.searchBoxBG,
                borderWidth: editMode ? 2 : 0,
              }}
              source={require("../assets/images/icons/dropdown-short-bg.png")}
            >
              <TextInput
                style={styles.inputBox}
                onTouchStart={() => {
                  setShowFirstLang(true);
                }}
                placeholder="Search"
                keyboardType={null}
                value={selectedLangOne ? selectedLangOne : ""}
              />
            </ImageBackground>
          </View>
          <SearchablePopup
            data={data.languages}
            visible={showFirstLang}
            cancel={() => {
              setShowFirstLang(false);
            }}
            onSelected={(selected) => {
              setSelectedLangOne(selected);
            }}
          />
          <View style={styles.checkLangContainer}>
            <ImageBackground
              style={{
                ...styles.searchBoxBG,
                borderWidth: editMode ? 2 : 0,
              }}
              source={require("../assets/images/icons/dropdown-short-bg.png")}
            >
              <TextInput
                style={styles.inputBox}
                onTouchStart={() => {
                  setShowSecondLang(true);
                }}
                placeholder="Search"
                keyboardType={null}
                value={selectedLangTwo ? selectedLangTwo : ""}
              />
            </ImageBackground>
          </View>
          <SearchablePopup
            data={data.languages}
            visible={showSecondLang}
            cancel={() => {
              setShowSecondLang(false);
            }}
            onSelected={(selected) => {
              setSelectedLangTwo(selected);
            }}
          />
        </View>
        {editMode ? (
          <View />
        ) : (
          <View style={{ ...styles.checkContainer, marginVertical: windowHeight/20 }}>
            <CheckBox
              title={"Agree to Terms and Conditions"}
              id={"T&C"}
              color="white"
              selected={agreeToTerms}
              onPress={() => {
                setAgreeToTerms("T&C");
              }}
              columns="45%"
              underline={true}
              link="https://hiphost.co.za/termandconditions/"
            />
          </View>
        )}
      </View>
      <View style={styles.footer}>
        <View style={styles.backMainContainer}>
          <TouchableOpacity
            style={styles.backButtonContainer}
            onPress={prevPageHandler}
          >
            <Image style={styles.backButton} source={backButtonImage()} />
          </TouchableOpacity>
        </View>
        <CustomButton
          title={editMode ? "Save" : "Done"}
          buttonColor={
            pageThreeValid ? Colors.secondary : Colors.secondaryInactive
          }
          size="50%"
          onPress={saveHandler}
          disabled={!pageThreeValid}
          loading={saving}
        />
      </View>
    </ImageBackground>
  );

  const pageSaver = (
    <ImageBackground
      style={styles.mainBackground}
      source={require("../assets/images/GIFS/cinemagraph.gif")}
    ></ImageBackground>
  );

  switch (currentPage) {
    case 1:
      return pageOneContent;
    case 2:
      return pageTwoContent;
    case 3:
      return pageThreeContent;
    case 4:
      return pageSaver;
    default:
      return pageOneContent;
  }
};

const styles = StyleSheet.create({
  mainBackground: {
    flex: 1,
    resizeMode: "cover",
    paddingHorizontal: "5%",
    backgroundColor: "white",
  },
  mainContainer: {
    height: "90%",
  },
  headerContainer: {
    width: "100%",
    height: windowHeight / 3,
    justifyContent: "center",
    paddingBottom: windowHeight / 18,
  },
  iconContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
  },
  icon: {
    width: windowWidth / 12,
    height: windowWidth / 12,
    marginTop: "5%",
    marginBottom: "3%",
  },
  headerTitle: {
    color: "white",
    fontSize: windowFontSize / 1.5,
    textAlign: "center",
    marginBottom: "20%",
  },
  labels: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: windowHeight / 18,
    marginBottom: "2%",
  },
  checkContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
  },
  dropdownContainer: {
    flexDirection: "row",
    width: "100%",
    height: windowHeight / 18,
    maxHeight: 40,
  },
  checkLangContainer: {
    flexDirection: "row",
    width: "48%",
    height: windowHeight / 18,
    maxHeight: 40,
  },
  searchBoxBG: {
    flex: 1,
    resizeMode: "stretch",
    borderRadius: 10,
    overflow: "hidden",
    borderColor: Colors.primary,
  },

  inputBox: {
    color: Colors.primary,
    flex: 1,
    paddingLeft: "5%",
  },
  langContainer: {
    flexDirection: "row",
    height: windowHeight / 18,
    maxHeight: 40,
  },
  footer: {
    height: "6%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  backMainContainer: {
    width: "100%",
    height: "6%",
    justifyContent: "center",
    alignItems: "flex-start",
    position: "absolute",
  },
  backButtonContainer: {
    width: windowWidth / 9,
    height: windowWidth / 9,
    marginRight: "6%",
  },
  backButton: {
    resizeMode: "stretch",
    width: windowWidth / 9,
    height: windowWidth / 9,
  },
});

export default ProfileSetupScreen;
