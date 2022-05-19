import React from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import Colors from "../../constants/Colors";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const AnswerModal = (props) => {
  const removeNumber = () => {
    var val = props.data.question;
    if (val != null && val.length >= 1) {
      val = val.slice(3, val.length);
      return val;
    }
    return "";
  };
  return (
    <Modal animationType="slide" transparent={true} visible={props.visible}>
      <View style={styles.container}>
        <View style={styles.mainContainer}>
          <ScrollView>
            <View style={styles.bodyContainer}>
              <Text style={styles.questionText}>{removeNumber()}</Text>
              <Text style={styles.answerText}>{props.data.answer}</Text>
            </View>
          </ScrollView>

          <View style={styles.footerContainer}>
            <TouchableOpacity style={styles.backTouch} onPress={props.close}>
              <Image
                source={require("../../assets/images/icons/backButton.png")}
                style={styles.backIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  mainContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(69, 190, 174,0.8)",
  },
  headerContainer: {
    width: "100%",
    height: "30%",
    alignItems: "center",
    justifyContent: "center",
  },
  bodyContainer: {
    width: "100%",
    height: "85%",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: "12%",
    paddingTop: "10%",
  },
  footerContainer: {
    width: "100%",
    height: "15%",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  backTouch: {
    width: windowWidth / 8,
    height: windowWidth / 8,
    resizeMode: "stretch",
    marginLeft: "5%",
  },
  backIcon: {
    width: windowWidth / 8,
    height: windowWidth / 8,
    resizeMode: "stretch",
  },

  questionText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "10%",
  },
  answerText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});

export default AnswerModal;
