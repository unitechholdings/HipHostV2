import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  Modal,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";

import Colors from "../../constants/Colors";
import CustomTextBox from "../../components/hostComp/customTextBox";
import CustomButton from "../../components/sharedComp/customButton";

import { useDispatch } from "react-redux";
import * as userActions from "../../store/actions/user";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const SearchablePopup = (props) => {
  const apiKey = "AIzaSyDovEYjU6P1dNXVHY4OFnhUrdZ_vlA2QYQ";
  const userID = props.userID;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState(
    props.data ? props.data : []
  );
  const [allItems, setAllItems] = useState([]);
  const [location, setLocation] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingLocations, setLoadingLocations] = useState(false);

  const dispatch = useDispatch();
  const submitHandler = () => {
    if (selectedItems && selectedItems.length > 0 && userID) {
      setIsLoading(true);
      dispatch(userActions.updateHangouts(userID, selectedItems))
        .then(() => {
          setIsLoading(false);
          props.onSelected(selectedItems);
          props.cancel();
        })
        .catch((err) => {
          setIsLoading(false);
          Alert.alert("Could not save", err.message, [{ text: "Okay" }]);
        });
    }
  };

  const selectionHandler = (item) => {
    console.log(selectedItems.length);
    if (selectedItems.length <= 3) {
      var list = selectedItems;
      if (!list.includes(item)) list.push(item);

      setSelectedItems(list);
      var filtered = allItems.filter(function (el) {
        return el != item;
      });
      setAllItems(filtered);
    }
  };

  const unSelectionHandler = (item) => {
    var list = allItems;
    list.push(item);
    setAllItems(list);
    var filtered = selectedItems.filter(function (el) {
      return el != item;
    });
    setSelectedItems(filtered);
  };

  const cancelHandler = () => {
    //setAllItems([]);
    setSearchTerm("");
    props.cancel();
  };

  const doneHandler = () => {
    if (selectedItems && selectedItems.length > 0) {
      props.onSelected(selectedItems);
    }
    props.cancel();
  };

  const cleanUpChars = (text) => {
    if (text.length == 1 && text == " ") return text.trim();
    text = text.replace(/[^A-Za-z //-]/g, "");
    text = text.replace("  ", " ");
    return text;
  };

  function Item({ item, onSelected }) {
    return (
      <TouchableOpacity style={styles.item} onPress={onSelected}>
        <Text style={styles.itemTitle}>{item}</Text>
      </TouchableOpacity>
    );
  }

  function SelectedItems({ item, onSelected }) {
    return (
      <TouchableOpacity style={styles.itemRemove} onPress={onSelected}>
        <Text style={styles.itemTitle}>{item}</Text>
        <Image
          style={styles.removeImage}
          source={require("../../assets/images/icons/big_close_x.png")}
        />
      </TouchableOpacity>
    );
  }

  const searchHandler = (text) => {
    setAllItems([]);
    setSearchTerm(text);
  };

  useEffect(() => {
    if (searchTerm == "" && allItems.length == 0) fetchData(null);

    if (searchTerm != "" && allItems.length == 0) fetchData(searchTerm);
  }, [searchTerm]);

  function fetchData(searchValue) {
    //setAllItems([])
    searchValue = searchValue ? searchValue : "A";

    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?types=(cities)&key=${apiKey}&input=${searchValue}&components=country:za&sessiontoken=${userID}`;
    var list = [];

    setLoadingLocations(true);
    fetch(url)
      .then((res) => {
        res.json().then((queryData) => {
          var predictions = queryData.predictions;
          if (predictions.length > 0) {
            predictions.forEach((element) => {
              const placeDetailUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${element.place_id}&key=${apiKey}`;
              fetch(placeDetailUrl)
                .then((res) => {
                  res.json().then((queryData) => {
                    var obj = queryData.result.address_components;
                    var locationName =
                      obj[0].long_name + ", " + obj[1].long_name;
                    locationName = locationName.replace("City of ", "");
                    locationName = locationName.replace("Metropolitan", "");
                    locationName = locationName.replace("Municipality", "");
                    locationName = locationName.replace("Metro", "");
                    locationName = locationName.replace("District", "");
                    locationName = locationName.trim();

                    var temp = allItems;
                    if (!temp.includes(locationName)) temp.push(locationName);
                    setAllItems(temp);
                    setLoadingLocations(false);
                  });
                })
                .catch((error) => {
                  console.log(error);
                  setLoadingLocations(false);
                });
            });
          } else {
            setLoadingLocations(false);
          }
        });
      })
      .catch((error) => {
        console.log(error);
        setLoadingLocations(false);
      });
  }

  return (
    <Modal animationType="slide" transparent={false} visible={props.visible}>
      <ImageBackground
        style={styles.mainBackground}
        source={require("../../assets/images/backgrounds/trans_overlay_bg.png")}
      >
        <View style={styles.searchContainer}>
          <ImageBackground
            style={styles.searchBoxBG}
            source={require("../../assets/images/icons/search-bg.png")}
          >
            <CustomTextBox
              placeholder="Location"
              textChange={(text) => searchHandler(cleanUpChars(text))}
              image={require("../../assets/images/compBackgrounds/destination_input_bg.png")}
              value={searchTerm}
            />
          </ImageBackground>
        </View>
        <View style={styles.resultContainer}>
          <View style={styles.listHeaderContainer}>
            <Text style={styles.subHeaderText}>LOCATIONS:</Text>
          </View>
          {loadingLocations ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="small" color={Colors.primary} />
            </View>
          ) : allItems.length > 0 ? (
            <FlatList
              style={{ flex: 1 }}
              data={allItems}
              renderItem={({ item, key }) => (
                <Item
                  item={item}
                  onSelected={() => selectionHandler(item)}
                  key={key}
                />
              )}
              keyExtractor={(item) => item}
              disableScrollViewPanResponder
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyContainerText}>Nothing found</Text>
            </View>
          )}
          {selectedItems.length >= 1 ? (
            <View style={{ flex: 1 }}>
              <View style={styles.listHeaderContainer}>
                <Text style={styles.subHeaderText}>SELECTED LOCATIONS:</Text>
              </View>
              <FlatList
                style={{ flex: 1 }}
                data={selectedItems}
                renderItem={({ item }) => (
                  <SelectedItems
                    item={item}
                    onSelected={() => unSelectionHandler(item)}
                  />
                )}
                keyExtractor={(item) => item}
                disableScrollViewPanResponder
              />
            </View>
          ) : (
            <View />
          )}
          <View style={styles.cancelContainer}>
            <TouchableOpacity onPress={cancelHandler}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={styles.backIconContainer}
            onPress={cancelHandler}
          >
            <Image
              style={styles.backIcon}
              source={require("../../assets/images/icons/pink_back_icon.png")}
            />
          </TouchableOpacity>
          <View style={styles.buttonContainer}>
            <CustomButton
              title="Submit"
              buttonColor={Colors.secondary}
              size="60%"
              onPress={submitHandler}
              loading={isLoading}
            />
          </View>
        </View>
      </ImageBackground>
    </Modal>
  );
};

const styles = StyleSheet.create({
  mainBackground: {
    flex: 1,
    resizeMode: "cover",
    paddingTop: "10%",
    backgroundColor: "white",
  },
  searchContainer: {
    height: windowWidth / 8,
    overflow: "hidden",
    alignItems: "center",
  },
  searchBoxBG: {
    width: windowWidth / 1.1,
  },
  inputBox: {
    padding: 10,
  },
  resultContainer: {
    flex: 1,
    maxHeight: windowHeight / 1.2,
    marginTop: "6%",
    backgroundColor: "white",
    borderRadius: 8,
    borderColor: Colors.primary,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    marginHorizontal: "10%",
  },
  listMainHeaderContainer: {
    width: "100%",
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  mainHeaderText: {
    width: "100%",
    color: Colors.primary,
  },
  listHeaderContainer: {
    width: "100%",
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  subHeaderText: {
    width: "100%",
    color: "white",
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderColor: "#a8a7a7",
    borderBottomWidth: 1,
  },
  itemRemove: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderColor: "#a8a7a7",
    borderBottomWidth: 1,
    justifyContent: "space-between",
  },
  removeImage: {
    width: windowWidth / 20,
    height: windowWidth / 20,
    resizeMode: "stretch",
  },
  itemTitle: {
    color: "#a8a7a7",
  },
  cancelContainer: {
    width: "100%",
    flexDirection: "row",
    paddingTop: 15,
    paddingRight: "10%",
    justifyContent: "flex-end",
  },
  cancelText: {
    fontSize: 15,
    color: Colors.primary,
    marginBottom: 10,
  },
  footerContainer: {
    width: "100%",
    height: "10%",
    flexDirection: "row",
    alignItems: "center",
  },
  backIconContainer: {
    width: windowWidth / 10,
    height: windowWidth / 10,
    marginLeft: "5%",
  },
  backIcon: {
    width: windowWidth / 10,
    height: windowWidth / 10,
    resizeMode: "stretch",
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center",
    marginRight: "6%",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainerText: {
    color: "#a8a7a7",
  },
});

export default SearchablePopup;
