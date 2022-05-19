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
  ActivityIndicator
} from "react-native";

import { useSelector, useDispatch } from "react-redux";
import * as authActions from "../store/actions/auth";
import * as galleryActions from "../store/actions/gallery";

import Colors from "../constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import ImagePicker from "../components/sharedComp/ImagePicker";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const HostSocialScreen = (props) => {
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
  }, [currentUser]);

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

  //used to set profile pic if it is the first image loaded
  useEffect(() => {
    if (gallery.profilePicKey == null && allImage.length == 1) {
      setProfilePicHandler();
    }
  }, [allImage]);

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

  const nextHandler = () => {
    setImageIndex(imageIndex + 1);
  };

  const prevHandler = () => {
    setImageIndex(imageIndex - 1);
  };

  const cameraPopupHandler = () => {
    setShowCamera(!showCamera);
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <ImageBackground
        style={styles.mainBackground}
        source={require("../assets/images/backgrounds/trans_overlay_bg.png")}
      >
        <View style={styles.headerContainer}>
          <View style={styles.headerIconContainer}>
            <Image
              style={styles.HeaderIcon}
              source={require("../assets/images/icons/info_s_icon.png")}
            />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>STATUS</Text>
          </View>
        </View>
        <ImagePicker
          visible={showCamera}
          onClose={cameraPopupHandler}
          userID={currentUser.userID}
        />
        <View style={styles.bodyContainer}>
          <View style={styles.hostImageContainer}>
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
                     style={styles.hostFavImage}
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
            <View style={styles.ResponseContainer}>
              <Text style={styles.labelTextMain}>Typically responds within:</Text>
              <Text style={styles.text}>minutes/hours/days/weeks</Text>
              <View style={styles.lineDivider} />
              <Text style={styles.text}>
                <Text style={styles.labelText}>Status</Text> Gold (+10 positive
                reviews)
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={styles.backContainer}
            onPress={goBackHandler}
          >
            <Image
              style={styles.backImage}
              source={require("../assets/images/icons/pink_back_icon.png")}
            />
          </TouchableOpacity>
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
    height: "25%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  headerTextContainer: {
    width: "100%",
  },
  headerIconContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  HeaderIcon: {
    width: windowWidth / 5,
    height: windowWidth / 5,
    resizeMode: "stretch",
  },
  headerText: {
    color: Colors.primary,
    fontFamily: "Bebas",
    fontSize: 30,
    textAlign: "center",
  },
  bodyContainer: {
    width: "100%",
    height: "55%",
    justifyContent: "center",
  },
  hostImageContainer: {
    width: "100%",
    height: "40%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "10%",
    
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
  hostFavImage: {
    width: windowWidth / 10,
    height: windowWidth / 10,
    minHeight:windowWidth / 10,
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
  backContainer: {
    width: windowWidth / 10,
    height: windowWidth / 10,
    marginLeft: "10%",
  },
  backImage: {
    width: windowWidth / 10,
    height: windowWidth / 10,
    resizeMode: "stretch",
  },
  hostProfImageContainer: {
    width: windowWidth / 1.8,
    height: windowWidth / 10,
    marginTop: (windowWidth / 15) * -1,
    marginRight: (windowWidth / 15) * -1,
    alignItems: "flex-end",
    zIndex: 1,
  },
  labelText: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: "8%",
  },
  labelTextMain: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
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
  ResponseContainer:{
    marginTop: windowHeight/20,
  }
});

export default HostSocialScreen;
