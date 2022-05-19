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
import CustomTextBox from "../../components/exploreComp/customTextBox";
import CustomButton from "../../components/sharedComp/customButton";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const SearchableLocationPopup = (props) => {
  const userID = props.userID;
  const apiKey = "AIzaSyDovEYjU6P1dNXVHY4OFnhUrdZ_vlA2QYQ";
  const [searchTerm, setSearchTerm] = useState("");
  props.data ? props.data : [];
  const [allItems, setAllItems] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  const selectionHandler = (item) => {
    props.onSelected(item);
    props.cancel();
  };

  const cancelHandler = () => {
    setSearchTerm("");
    props.cancel();
  };

  const getHistory = () => {
    var historyData = props.data;
    if (historyData) {
      var list = [];
      for (const [key, obj] of Object.entries(historyData)) {
        if (list.length == 0) {
          if (obj.location != "undefined") list.push(obj.location);
        } else {
          var containsObj = false;
          if (typeof obj.location != "undefined" || obj.location != null) {
            list.forEach((element) => {
              if (element.name != "undefined" && element.name != null)
                if (element.name == obj.location.name) containsObj = true;
            });
          }
          if (!containsObj) list.push(obj.location);
        }
      }
      return list;
    } else return [];
  };

  function Item({ item, onSelected }) {
    return (
      <TouchableOpacity style={styles.item} onPress={onSelected}>
        <Text style={styles.itemTitle}>{item.name}</Text>
      </TouchableOpacity>
    );
  }

  const searchHandler = (text) => {
    setAllItems([]);
    setSearchTerm(text);
  };

  useEffect(() => {
    if (searchTerm == "" && allItems.length == 0) fetchData("");
    if (searchTerm != "") fetchData(searchTerm);
  }, [searchTerm]);

  function fetchData(searchValue) {
    searchValue = searchValue ? searchValue : "A";

    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?types=(cities)&key=${apiKey}&input=${searchValue}&components=country:za&sessiontoken=${userID}`;
    var list = [];

    setLoading(true);
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

                    var locationCoords = queryData.result.geometry.location;

                    locationName = locationName.replace("City of ", "");
                    locationName = locationName.replace("Metropolitan", "");
                    locationName = locationName.replace("Municipality", "");
                    locationName = locationName.replace("Metro", "");
                    locationName = locationName.replace("District", "");
                    locationName = locationName.trim();

                    var temp = allItems;
                    var hasItem = false;
                    temp.forEach((element) => {
                      if (element.name == locationName) hasItem = true;
                    });
                    if (!hasItem) {
                      temp.push({ name: locationName, coords: locationCoords });
                    }
                    setLoading(false);
                    setAllItems(temp);
                  });
                })
                .catch((error) => {
                  setLoading(false);
                  console.log(error);
                });
            });
          } else {
            setLoading(false);
          }
        });
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }

  const cleanUpChars = (text) => {
    if (text.length == 1 && text == " ") return text.trim();
    text = text.replace(/[^A-Za-z //-]/g, "");
    text = text.replace("  ", " ");
    return text;
  };

  return (
    <Modal animationType="slide" transparent={true} visible={props.visible}>
      <ImageBackground
        style={styles.mainBackground}
        source={require("../../assets/images/backgrounds/explore_bg.png")}
      >
        <View style={styles.searchContainer}>
          <View style={styles.input}>
            <CustomTextBox
              placeholder="Destination"
              textChange={(text) => searchHandler(cleanUpChars(text))}
              image={require("../../assets/images/compBackgrounds/destination_input_bg.png")}
              value={searchTerm}
            />
          </View>
        </View>
        <View style={styles.resultContainer}>
          <View style={styles.listHeaderContainer}>
            <Text style={styles.subHeaderText}>CITIES:</Text>
          </View>
          {loading ? (
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
              data={allItems}
              renderItem={({ item, key }) => (
                <Item
                  item={item}
                  onSelected={() => selectionHandler(item)}
                  key={key}
                />
              )}
              keyExtractor={(item) => item.name}
              disableScrollViewPanResponder
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyContainerText}>Nothing found</Text>
            </View>
          )}
          <View style={styles.listHeaderContainer}>
            <Text style={styles.subHeaderText}>RECENTLY SELECTED:</Text>
          </View>
          <FlatList
            data={getHistory()}
            renderItem={({ item, key }) => (
              <Item
                item={item}
                onSelected={() => selectionHandler(item)}
                key={key}
              />
            )}
            keyExtractor={(item) => item.name}
            disableScrollViewPanResponder
          />
          <View style={styles.cancelContainer}>
            <TouchableOpacity onPress={cancelHandler}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
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
    paddingHorizontal: "10%",
    backgroundColor: "white",
  },
  searchContainer: {
    width: "100%",
    height: "5%",
    alignItems: "center",
  },
  input: {
    width: windowWidth / 1.2,
    height: windowWidth / 8,
  },
  inputBox: {
    padding: 10,
  },
  resultContainer: {
    flex: 1,
    maxHeight: windowHeight / 1.2,
    marginTop: "10%",
    backgroundColor: "white",
    borderRadius: 8,
    borderColor: Colors.primary,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
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
    paddingBottom: 15,
    paddingRight: "10%",
    justifyContent: "flex-end",
  },
  cancelText: {
    fontSize: 15,
    color: Colors.primary,
    marginBottom: 10,
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

export default SearchableLocationPopup;
