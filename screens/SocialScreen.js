import React, { useState, useEffect } from "react";
import {
  StatusBar,
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";

import { useSelector, useDispatch } from "react-redux";
import * as authActions from "../store/actions/auth";
import * as galleryActions from "../store/actions/gallery";

import Colors from "../constants/Colors";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import ImagePicker from "../components/sharedComp/ImagePicker";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const windowWidthFont = windowWidth / 8;

const SocialScreen = (props) => {
  const currentUser = useSelector((state) => state.user);
  const gallery = useSelector((state) => state.gallery);
  const [imageIndex, setImageIndex] = useState(0);
  const [allImage, setAllImages] = useState([]);
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);

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

  try {
    if (
      currentUser &&
      gallery.myImages != null &&
      Object.keys(gallery.myImages).length <= 0
    ) {
      dispatch(galleryActions.getMyGallery(currentUser.userID))
        .then(() => {})
        .catch((err) => {
          console.log(err);
        });
    }
  } catch (err) {
    console.log(err);
  }

  useEffect(() => {
    var images = gallery.myImages;
    var imageList = [];
    try {
      if (images != null && Object.keys(images).length >= 1) {
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
  }, [gallery]);

  const removeImageHandler = () => {
    try {
      if (allImage.length >= 1 && allImage[imageIndex].key != "undefined") {
        var imageID = allImage[imageIndex].key;
        setImageIndex(0);
        var isProfilePic =
          gallery &&
          gallery.profilePicKey != null &&
          allImage[imageIndex].key == gallery.profilePicKey
            ? true
            : false;
        dispatch(
          galleryActions.removeImage(currentUser.userID, imageID, isProfilePic)
        ).catch((err) => {
          console.log(err);
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const setProfilePicHandler = () => {
    try {
      setLoading(true);
      if (allImage.length >= 1 && allImage[imageIndex].key != "undefined") {
        var imageID = allImage[imageIndex].key;
        var image = allImage[imageIndex].image;
        dispatch(
          galleryActions.setProfilePic(currentUser.userID, imageID, image)
        ).then(() => {setLoading(false);})
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
    
  };

  const goBackHandler = () => {
    props.navigation.goBack();
  };

  const walletHandler = () => {
    props.navigation.navigate("Wallet");
  };

  const nextHandler = () => {
    setImageIndex(imageIndex + 1);
  };

  const prevHandler = () => {
    setImageIndex(imageIndex - 1);
  };

  const cameraPopupHandler = () => {
    setShowCamera(!showCamera);
  };

  const startContent = () => {
    var starList = [];

    var rating = 0;

    try {
      if (
        currentUser != "undefined" &&
        currentUser.rating != "undefined" &&
        currentUser.rating != null
      ) {
        rating = currentUser.rating;
      }
    } catch (err) {
      rating = 0;
    }
    for (let index = 0; index < 5; index++) {
      starList.push(
        <View style={styles.star} key={index}>
          {rating >= index + 1 ? (
            <FontAwesome name="star" size={24} color={Colors.primary} />
          ) : (
            <FontAwesome name="star-o" size={24} color={Colors.primary} />
          )}
        </View>
      );
    }

    return starList;
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <ImageBackground
        style={styles.mainBackground}
        source={require("../assets/images/backgrounds/my_account_bg.png")}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButtonContainer}
            onPress={goBackHandler}
          >
            <Image
              style={styles.backButtonImage}
              source={require("../assets/images/icons/backButton.png")}
            />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>Social</Text>
            <Text style={styles.headerNameText}>
              {currentUser ? currentUser.name + " " + currentUser.surname : ""}
            </Text>
          </View>
        </View>
        <ImagePicker
          visible={showCamera}
          onClose={cameraPopupHandler}
          userID={currentUser.userID}
        />
        <View style={styles.bodyContainer}>
          <View style={styles.hostImageContainer}>
            <Text style={styles.titleText}>Travel Album</Text>
            <View style={styles.hostImageSubContainer}>
              <View style={styles.hostChevronContainer}>
                {allImage && allImage.length >= 1 && imageIndex != 0 ? (
                  <TouchableOpacity onPress={prevHandler}>
                    <Image
                      style={styles.hostChevronImage}
                      source={require("../assets/images/icons/chevron_left_blue.png")}
                    />
                  </TouchableOpacity>
                ) : (
                  <View />
                )}
              </View>
              <View style={styles.hostMainSubContainer}>
                {allImage && allImage.length >= 1 ? (
                  <View style={styles.hostMinImageContainer}>
                    <TouchableOpacity
                      style={styles.hostPlusImage}
                      onPress={removeImageHandler}
                    >
                      <AntDesign name="minus" size={24} color="white" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View />
                )}
                <View style={styles.hostPlusImageContainer}>
                  <TouchableOpacity
                    style={styles.hostPlusImage}
                    onPress={cameraPopupHandler}
                  >
                    <AntDesign name="plus" size={24} color="white" />
                  </TouchableOpacity>
                </View>
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
                      source={require("../assets/images/inAppImages/profile_placeholder.png")}
                    />
                  </TouchableOpacity>
                )}
                {allImage && allImage.length >= 1 ? (
                  <View style={styles.hostProfImageContainer}>
                    
                    <TouchableOpacity
                      style={styles.hostPlusImage}
                      onPress={setProfilePicHandler}
                    >
                      {loading?(<ActivityIndicator size="small" color="white"/>):
                      gallery &&
                      gallery.profilePicKey != null &&
                      allImage[imageIndex].key == gallery.profilePicKey ? (
                        <AntDesign name="star" size={24} color="white" />
                      ) : (
                        <AntDesign name="staro" size={24} color="white" />
                      )}
                    </TouchableOpacity>

                  </View>
                ) : (
                  <View />
                )}
              </View>
              <View style={styles.hostChevronContainer}>
                {allImage &&
                allImage.length >= 1 &&
                imageIndex < allImage.length - 1 ? (
                  <TouchableOpacity onPress={nextHandler}>
                    <Image
                      style={styles.hostChevronImage}
                      source={require("../assets/images/icons/chevron_right_blue.png")}
                    />
                  </TouchableOpacity>
                ) : (
                  <View />
                )}
              </View>
            </View>
          </View>
        </View>
        <View style={styles.footerContainer}>
          <View style={styles.ratingContainer}>
            <Text style={styles.footerLabels}>User rating:</Text>
            <View style={styles.starContainer}>{startContent()}</View>
          </View>
          <View style={styles.walletContainer}>
            <TouchableOpacity
              style={styles.walletTouch}
              onPress={walletHandler}
            >
              <Image
                style={styles.walletImage}
                source={require("../assets/images/icons/wallet_icon.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  mainBackground: {
    flex: 1,
    resizeMode: "stretch",
    alignItems: "center",
  },
  headerContainer: {
    width: "100%",
    height: windowHeight / 4,
  },
  backButtonContainer: {
    width: windowWidth / 9,
    height: windowWidth / 9,
    marginTop: "4%",
    marginLeft: "3%",
    position: "absolute",
    zIndex: 99,
  },
  backButtonImage: {
    width: windowWidth / 9,
    height: windowWidth / 9,
    resizeMode: "stretch",
  },
  headerTextContainer: {
    width: "100%",
    height: windowHeight / 4,
    justifyContent: "center",
  },
  headerText: {
    color: "white",
    fontFamily: "Bebas",
    fontSize: windowWidthFont,
    textAlign: "center",
  },
  headerNameText: {
    color: "white",
    fontSize: windowWidthFont / 3,
    textAlign: "center",
  },
  bodyContainer: {
    width: "100%",
    height: "55%",
    justifyContent: "center",
  },
  titleText: {
    color: Colors.primary,
    fontFamily: "Bebas",
    fontSize: 20,
    textAlign: "center",
    marginBottom: "5%",
  },
  hostImageContainer: {
    width: "100%",
    height: "40%",
    justifyContent: "center",
    alignItems: "center",
  },

  hostImage: {
    width: windowWidth / 1.8,
    height: windowWidth / 1.8,
    resizeMode: "cover",
    borderColor: Colors.primary,
    borderWidth: 4,
    borderRadius: 20,
  },
  hostPlusImageContainer: {
    width: windowWidth / 1.8,
    height: windowWidth / 10,
    marginBottom: (windowWidth / 15) * -1,
    marginRight: (windowWidth / 15) * -1,
    alignItems: "flex-end",
    zIndex: 1,
  },
  hostMinImageContainer: {
    width: windowWidth / 1.8,
    height: windowWidth / 10,
    marginBottom: (windowWidth / 10) * -1,
    marginLeft: (windowWidth / 12) * -1,
    alignItems: "flex-start",
    zIndex: 1,
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
  hostPlusImage: {
    width: windowWidth / 10,
    height: windowWidth / 10,
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    borderRadius: windowWidth / 5,
    justifyContent: "center",
    alignItems: "center",
    
  },
  footerContainer: {
    width: "100%",
    height: "25%",
    flexDirection: "row",
    marginTop: "10%",
  },
  ratingContainer: {
    width: "50%",
  },
  walletContainer: {
    width: "50%",
    alignItems: "center",
  },
  walletTouch: {
    width: windowWidth / 5,
    height: windowWidth / 5,
  },

  footerLabels: {
    width: "100%",
    color: Colors.primary,
    fontSize: 15,
    textAlign: "center",
  },
  footerRankLabel: {
    width: "100%",
    color: Colors.primary,
    fontSize: 35,
    textAlign: "center",
  },
  starContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: "14%",
    marginTop: "5%",
  },
  starImage: {
    width: windowWidth / 18,
    height: windowWidth / 18,
  },
  walletImage: {
    width: windowWidth / 5,
    height: windowWidth / 5,
  },
  hostProfImageContainer: {
    width: windowWidth / 1.8,
    height: windowWidth / 10,
    marginTop: (windowWidth / 15) * -1,
    marginRight: (windowWidth / 15) * -1,
    alignItems: "flex-end",
    zIndex: 1,
  },
});

export default SocialScreen;
