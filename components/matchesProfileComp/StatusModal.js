import React, { useState, useEffect } from "react";
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

import { useSelector, useDispatch } from "react-redux";
import * as galleryActions from "../../store/actions/gallery";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const StatusModal = (props) => {
  const gallery = useSelector((state) => state.gallery);
  const [imageIndex, setImageIndex] = useState(0);
  const [allImage, setAllImages] = useState([]);

  const hostID = props.data.uid;

  const dispatch = useDispatch();

  if (
    hostID &&
    gallery.hostImages != null &&
    Object.keys(gallery.hostImages).length <= 0
  ) {
    dispatch(galleryActions.getHostGallery(hostID))
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    if (typeof hostID != "undefined" && hostID != null) {
      var images = gallery.hostImages[hostID];
      var imageList = [];

      try {
        if (
          typeof images != "undefined" &&
          images != null &&
          Object.keys(images).length >= 1
        ) {
          Object.keys(images).forEach((key, index) => {
            imageList.push({ key: key, image: images[key] });
          });
        }

        if (imageList.length >= 1) {
          setAllImages(imageList);
        } else {
          setAllImages([]);
          setImageIndex(0);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }, [gallery]);

  const nextHandler = () => {
    setImageIndex(imageIndex + 1);
  };

  const prevHandler = () => {
    setImageIndex(imageIndex - 1);
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
              source={require("../../assets/images/icons/info_s_icon.png")}
            />
            <Text style={styles.headerText}>STATUS</Text>
          </View>
          <View style={styles.bodyContainer}>
            <View style={styles.hostImageContainer}>
              <View style={styles.hostImageSubContainer}>
                <View style={styles.hostChevronContainer}>
                  {allImage && allImage.length >= 1 && imageIndex != 0 ? (
                    <TouchableOpacity onPress={prevHandler}>
                      <Image
                        style={styles.hostChevronImage}
                        source={require("../../assets/images/icons/chevron_left_blue.png")}
                      />
                    </TouchableOpacity>
                  ) : (
                    <View />
                  )}
                </View>
                <View style={styles.hostMainSubContainer}>
                  {allImage && allImage.length >= 1 ? (
                    <TouchableOpacity>
                      <Image
                        style={styles.hostImage}
                        source={{
                          uri: allImage[imageIndex].image,
                        }}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity>
                      <Image
                        style={styles.hostImage}
                        source={require("../../assets/images/inAppImages/profile_placeholder.png")}
                      />
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.hostChevronContainer}>
                  {allImage &&
                  allImage.length >= 1 &&
                  imageIndex < allImage.length - 1 ? (
                    <TouchableOpacity onPress={nextHandler}>
                      <Image
                        style={styles.hostChevronImage}
                        source={require("../../assets/images/icons/chevron_right_blue.png")}
                      />
                    </TouchableOpacity>
                  ) : (
                    <View />
                  )}
                </View>
              </View>
            </View>
            <Text style={styles.labelText}>Typically responds within:</Text>
            <Text style={styles.text}>minutes/hours/days/weeks</Text>
            <View style={styles.lineDivider} />
            <Text style={styles.text}>
              <Text style={styles.labelText}>Status</Text> Gold (+10 positive
              reviews)
            </Text>
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
    marginTop: "10%",
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
  hostImageContainer: {
    width: "100%",
    height: "40%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "14%",
  },

  hostImage: {
    width: windowWidth / 1.8,
    height: windowWidth / 1.8,
    resizeMode: "cover",
    borderColor: Colors.primary,
    borderWidth: 4,
    borderRadius: 20,
  },
  hostImageSubContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  hostMainSubContainer: {
    width: "60%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  hostChevronContainer: {
    width: "20%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  hostChevronImage: {
    width: windowWidth / 16,
    height: windowWidth / 8,
    resizeMode: "stretch",
  },
  labelText: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: "8%",
  },
  text: {
    color: Colors.primary,
    fontSize: 16,
    textAlign: "center",
  },
  lineDivider: {
    width: "60%",
    borderColor: Colors.primary,
    borderBottomWidth: 2,
    marginVertical: "5%",
  },
});

export default StatusModal;
