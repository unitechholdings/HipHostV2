import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useDispatch } from "react-redux";
import * as galleryActions from "../../store/actions/gallery";

import Colors from "../../constants/Colors";
import { Feather, AntDesign } from "@expo/vector-icons";

import * as ImagePicker from "expo-image-picker";

const windowWidth = Dimensions.get("window").width;

const ImgPicker = (props) => {
  const userID = props.userID;
  const [myImage, setMyImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const verifyPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Insufficient permissions",
        "You will need to grant camera permissions before being able to use this part of the app.",
        [{ text: "Okay" }]
      );
      return false;
    }
    return true;
  };

  const takeImageHandler = async () => {
    const hasPermissions = await verifyPermissions();
    if (!hasPermissions) {
      return;
    }

    const image = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 16],
      quality: 0.6,
      base64: true,
    });
    if (image.cancelled == false) setMyImage(image);
  };

  const galleryImageHandler = async () => {
    const hasPermissions = await verifyPermissions();
    if (!hasPermissions) {
      return;
    }
    const image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 16],
      quality: 0.6,
      base64: true,
    });

    if (image.cancelled == false) setMyImage(image);
  };

  const keepImageHandler = () => {
    if (userID && myImage) {
      setLoading(true);
      dispatch(galleryActions.addNewImage(userID, myImage.base64))
        .then(() => {
          setLoading(false);
          closePicker();
        })
        .catch((err) => {
          setLoading(false);
        });
    }
  };

  const discardImageHandler = () => {
    setMyImage(null);
  };

  const closePicker = () => {
    setMyImage(null);
    props.onClose();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={props.visible}>
      <View style={styles.container}>
        <View style={styles.mainContainer}>
          <TouchableOpacity style={styles.closeContainer} onPress={closePicker}>
            <AntDesign name="closecircleo" size={26} color={Colors.primary} />
          </TouchableOpacity>
          <View style={styles.imageContainer}>
            {myImage == null ? (
              <Text>No image selected yet</Text>
            ) : (
              <Image style={styles.takenImage} source={{ uri: myImage.uri }} />
            )}
          </View>
          {myImage == null ? (
            <View style={styles.btnContainer}>
              <TouchableOpacity
                style={{
                  ...styles.btn,
                  borderColor: "#ccc",
                  borderRightWidth: 2,
                }}
                onPress={galleryImageHandler}
              >
                <Feather name="image" size={30} color={Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn} onPress={takeImageHandler}>
                <Feather name="camera" size={30} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.btnContainer}>
              <TouchableOpacity
                style={{
                  ...styles.btn,
                  borderColor: "#ccc",
                  borderRightWidth: 2,
                }}
                onPress={discardImageHandler}
              >
                <AntDesign name="close" size={30} color={Colors.primary} />
              </TouchableOpacity>
              {loading ? (
                <View style={styles.btn}>
                  <ActivityIndicator
                    style={styles.spinner}
                    size="small"
                    color={Colors.primary}
                  />
                </View>
              ) : (
                <TouchableOpacity style={styles.btn} onPress={keepImageHandler}>
                  <AntDesign name="check" size={30} color={Colors.primary} />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  mainContainer: {
    width: windowWidth / 1.4,
    height: windowWidth / 1.2,
    backgroundColor: "white",
    borderRadius: 10,
    padding: "10%",
    elevation: 8,
  },
  closeContainer: {
    width: windowWidth / 10,
    height: windowWidth / 10,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    marginTop: "1%",
    marginLeft: "1%",
  },
  imageContainer: {
    width: windowWidth / 2,
    height: windowWidth / 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ccc",
    borderRadius: 5,
    overflow: "hidden",
  },
  btnContainer: {
    width: "100%",
    height: "30%",
    flexDirection: "row",
    alignItems: "flex-end",
  },
  btn: {
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  takenImage: {
    width: windowWidth / 2,
    height: windowWidth / 2,
    resizeMode: "stretch",
  },
  spinner: {
    height: 20,
    margin: 14,
  },
});

export default ImgPicker;
