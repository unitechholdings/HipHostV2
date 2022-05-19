import React, { useState } from "react";
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
import AnswerModal from "../components/faqComp/AnswerModal";

import { traveler_faq_data, general_faq_data } from "../staticData/data";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const FAQScreen = (props) => {
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [activeAnswer, setActiveAnswer] = useState({});
  const goBackHandler = () => {
    props.navigation.goBack();
  };

  const answerHandler = (data) => {
    setActiveAnswer(data);
    setShowAnswerModal(true);
  };

  const closeModalHandler = () => {
    setActiveAnswer({});
    setShowAnswerModal(false);
  };

  const dropdownContent = (data, unq_key) => {
    if (typeof data != undefined && data != null && data.length >= 1) {
      var questionList = [];
      data.map((context, key) => {
        var qKey = key + 1 + unq_key;
        questionList.push(
          <TouchableOpacity
            key={qKey}
            style={styles.textContainer}
            onPress={() => answerHandler(context)}
          >
            <Text style={styles.text}>{context.question}</Text>
          </TouchableOpacity>
        );
      });
      return questionList;
    }
    return <View />;
  };

  return (
    <ImageBackground
      style={styles.mainBackground}
      source={require("../assets/images/backgrounds/faq_bg.png")}
    >
      <View style={styles.mainContainer}>
        <View style={styles.headerContainer}>
          <Image
            style={styles.iconImage}
            source={require("../assets/images/icons/faq_icon.png")}
          />
          <Text style={styles.headerText}>FAQ'S</Text>
        </View>
        <View style={styles.bodyContainer}>
          <Text style={styles.labelText}>GENERAL</Text>
          {dropdownContent(general_faq_data, "general")}
          <Text style={styles.labelText}>TRAVELERS</Text>
          {dropdownContent(traveler_faq_data, "travelers")}
        </View>
        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={styles.backIconContainer}
            onPress={goBackHandler}
          >
            <Image
              style={styles.backIcon}
              source={require("../assets/images/icons/blue_back_arrow.png")}
            />
          </TouchableOpacity>
        </View>
      </View>
      <AnswerModal
        visible={showAnswerModal}
        close={closeModalHandler}
        data={activeAnswer}
      />
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
    height: "74%",
    alignItems: "flex-start",
    paddingTop: "5%",
  },
  iconImage: {
    width: windowWidth / 7,
    height: windowWidth / 7,
    resizeMode: "stretch",
  },
  headerText: {
    color: "white",
    fontFamily: "Bebas",
    fontSize: 40,
    textAlign: "center",
  },
  labelText: {
    color: Colors.primary,
    fontSize: 20,
    fontFamily: "Bebas",
    marginTop: "6%",
    marginBottom: "2%",
  },
  textContainer: {
    width: "100%",
    flexDirection: "row",
  },
  number: {
    width: "5%",
    color: Colors.primary,
    fontSize: 12,
    textAlign: "left",
  },
  text: {
    flex: 1,
    color: Colors.primary,
    fontSize: 12,
    textAlign: "left",
    paddingBottom: "2%",
  },
  footerContainer: {
    width: "100%",
    height: "10%",
    justifyContent: "center",
    alignItems: "center",
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

export default FAQScreen;
