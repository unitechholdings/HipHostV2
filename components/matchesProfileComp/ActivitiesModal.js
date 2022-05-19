import React from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Colors from "../../constants/Colors";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const ActivitiesModal = (props) => {

  var ActivitiesContent = () => {
    if (!props.data.activities || props.data.activities.length == 0)
      return <Text style={styles.text}>Nothing selected yet</Text>;
    else {
      var list = [];
      props.data.activities.map((item, key) => {
        list.push(
          <Text key={key} style={styles.text}>
            {item}
          </Text>
        );
      });
      return list;
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={props.visible}>
      <View style={styles.container}>
        <View style={styles.mainContainer}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.closeContainer}
              onPress={props.close}
            >
              <Image
                style={styles.closeImage}
                source={require("../../assets/images/icons/big_close_x.png")}
              />
            </TouchableOpacity>
            <Image
              style={styles.iconImage}
              source={require("../../assets/images/icons/activities_icon.png")}
            />
            <Text style={styles.headerText}>ACTIVITIES</Text>
          </View>
          <View style={styles.bodyContainer}>
            <Text style={styles.labelText}>The activities I'm into:</Text>
            {
              ActivitiesContent()
            }
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
    width: "90%",
    height: "90%",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 10,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  headerContainer: {
    width: "100%",
    height: "30%",
    alignItems: "center",
    justifyContent: "center",
  },
  bodyContainer: {
    width: "100%",
    height: "70%",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  closeContainer: {
    width: "100%",
    marginTop:"10%"
  },
  closeImage: {
    width: windowWidth / 10,
    height: windowWidth / 10,
    marginLeft: "5%",
    resizeMode: "stretch",
  },
  iconImage: {
    width: windowWidth / 4,
    height: windowWidth / 4,
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
});

export default ActivitiesModal;
