import React, { useState, useEffect } from "react";
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
import CustomOutlinedButton from "../../components/sharedComp/customOutlineButton";
import CustomButton from "../../components/sharedComp/customButton";
import { FontAwesome } from "@expo/vector-icons";

import { doneChat, setAsRead } from "../../store/actions/chats";
import { useDispatch } from "react-redux";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const ChatDoneScreen = (props) => {
  const dispatch = useDispatch();
  const [starCount, setStarCount] = useState(0);
  const [qOne, setQ_One] = useState(null);
  const [qTwo, setQ_Two] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const startContent = () => {
    var starList = [];
    for (let index = 0; index < 5; index++) {
      starList.push(
        <TouchableOpacity
          style={styles.star}
          onPress={() => setStarCount(index + 1)}
          key={index}
        >
          {starCount >= index + 1 ? (
            <FontAwesome name="star" size={24} color="white" />
          ) : (
            <FontAwesome name="star-o" size={24} color="white" />
          )}
        </TouchableOpacity>
      );
    }

    return starList;
  };

  const goBackHandler = () => {
    props.close();
  };

  const hostContent = () => {
    return (
      <View style={styles.MainSection}>
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>
            Do you think you were of assistance?
          </Text>
          <View style={styles.answerContainer}>
            <CustomOutlinedButton
              title="Yes"
              buttonColor={qOne && qOne == "yes" ? Colors.secondary : "white"}
              size="35%"
              onPress={() => {
                setQ_One("yes");
              }}
            />
            <CustomOutlinedButton
              title="No"
              buttonColor={qOne && qOne == "no" ? Colors.secondary : "white"}
              size="35%"
              onPress={() => {
                setQ_One("no");
              }}
            />
          </View>
        </View>
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>
            Did you enjoy your conversation with this user?
          </Text>
          <View style={styles.answerContainer}>
            <CustomOutlinedButton
              title="Yes"
              buttonColor={qTwo && qTwo == "yes" ? Colors.secondary : "white"}
              size="35%"
              onPress={() => {
                setQ_Two("yes");
              }}
            />
            <CustomOutlinedButton
              title="No"
              buttonColor={qTwo && qTwo == "no" ? Colors.secondary : "white"}
              size="35%"
              onPress={() => {
                setQ_Two("no");
              }}
            />
          </View>
        </View>
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>Rate your chat with the user</Text>
          <View style={styles.starContainer}>{startContent()}</View>
        </View>
      </View>
    );
  };

  const userContent = () => {
    return (
      <View style={styles.MainSection}>
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>Was the HIPHOST helpful?</Text>
          <View style={styles.answerContainer}>
            <CustomOutlinedButton
              title="Yes"
              buttonColor={qOne && qOne == "yes" ? Colors.secondary : "white"}
              size="35%"
              onPress={() => {
                setQ_One("yes");
              }}
            />
            <CustomOutlinedButton
              title="No"
              buttonColor={qOne && qOne == "no" ? Colors.secondary : "white"}
              size="35%"
              onPress={() => {
                setQ_One("no");
              }}
            />
          </View>
        </View>
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>
            Did our matchability rating give good insight?
          </Text>
          <View style={styles.answerContainer}>
            <CustomOutlinedButton
              title="Yes"
              buttonColor={qTwo && qTwo == "yes" ? Colors.secondary : "white"}
              size="35%"
              onPress={() => {
                setQ_Two("yes");
              }}
            />
            <CustomOutlinedButton
              title="No"
              buttonColor={qTwo && qTwo == "no" ? Colors.secondary : "white"}
              size="35%"
              onPress={() => {
                setQ_Two("no");
              }}
            />
          </View>
        </View>
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>
            Rate your chat with this hiphost
          </Text>
          <View style={styles.starContainer}>{startContent()}</View>
        </View>
      </View>
    );
  };

  useEffect(() => {
    if (qOne != null && qTwo != null) setIsValid(true);
    else setIsValid(false);
  }, [qOne, qTwo]);

  const doneHandler = () => {
    setLoading(true);

    dispatch(
      doneChat(
        props.userID,
        props.chatID,
        props.hostID,
        qOne,
        qTwo,
        starCount,
        props.userType
      )
    )
      .then(() => {
        setLoading(false);
        updateRating();
        dispatch(setAsRead(props.userID, props.chatID))
          .then(() => {
            props.finished();
          })
          .catch((err) => {
            console.log(err);
            props.finished();
          });
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const updateRating = () => {
    //==========================Updates the HOST rating from the cloud function================================
    const url =
      "https://us-central1-hiphost-v2-131c1.cloudfunctions.net/updateRating";

    if (props.hostID != "undefined" && props.hostID != null) {
      var passedData = {
        hostID: props.hostID,
      };

      fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passedData),
      }).catch((error) => {
        console.error("Error:", error);
      });
    }
    //=========================================================================
  };

  return (
    <Modal animationType="slide" transparent={true} visible={props.visible}>
      <View style={styles.container}>
        <View style={styles.mainContainer}>
          <View style={styles.bodyContainer}>
            {props.userType == "host" ? hostContent() : userContent()}
          </View>
          <View style={styles.footerContainer}>
            <View style={styles.sideContainer}>
              <TouchableOpacity
                style={styles.backContainer}
                onPress={goBackHandler}
              >
                <Image
                  style={styles.backImage}
                  source={require("../../assets/images/icons/backButton.png")}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.middleContainer}>
              <CustomButton
                title="Done"
                buttonColor={
                  isValid ? Colors.secondary : Colors.secondaryInactive
                }
                size="60%"
                disabled={!isValid}
                loading={loading}
                onPress={doneHandler}
              />
            </View>
            <View style={styles.sideContainer} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  mainContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(69, 190, 174,0.8)",
  },
  bodyContainer: {
    width: "100%",
    height: "80%",
    justifyContent: "space-evenly",
  },
  MainSection: {
    width: "100%",
    height: "100%",
    justifyContent: "space-evenly",
  },
  footerContainer: {
    width: "100%",
    height: "20%",
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
  questionContainer: {
    width: "100%",
  },
  questionText: {
    width: "100%",
    fontFamily: "Bebas",
    color: "white",
    textAlign: "center",
    fontSize: 20,
    marginBottom: "5%",
  },
  answerContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  starContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  star: {
    marginHorizontal: "2%",
  },
  footerContainer: {
    width: windowWidth,
    height: "10%",
    flexDirection: "row",
    alignItems: "center",
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
});

export default ChatDoneScreen;
