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
} from "react-native";

import Colors from "../../constants/Colors";
import CustomTextBox from "../../components/exploreComp/customTextBox";
import CustomButton from "../../components/sharedComp/customButton";

import data from "../../staticData/data";
import { useDispatch } from "react-redux";
import * as userActions from "../../store/actions/user";

const windowWidth = Dimensions.get("window").width;

const SearchablePopup = (props) => {
  const userID = props.userID;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState(
    props.data ? props.data : []
  );
  const [allItems, setAllItems] = useState(initialVal());

  const [isLoading, setIsLoading] = useState(false);

  function initialVal() {
    if (props.data) {
      var list = data.allActivities;
      selectedItems.forEach((item) => {
        list = list.filter(function (el) {
          return el != item;
        });
      });
      return list;
    } else return data.allActivities;
  }

  const dispatch = useDispatch();
  const submitHandler = () => {
    if (selectedItems && selectedItems.length > 0 && userID) {
      setIsLoading(true);
      dispatch(userActions.updateActivities(userID, selectedItems))
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
    var list = selectedItems;
    list.push(item);
    setSelectedItems(list);
    var filtered = allItems.filter(function (el) {
      return el != item;
    });
    setAllItems(filtered);
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
    setSelectedItems([]);
    setAllItems(data.allActivities);
    props.cancel();
  };

  const filteredData = () => {
    if (searchTerm !== "") {
      var newList = [];
      allItems.forEach((item) => {
        var words = item.split(" ");
        var hasWordCount = 0;
        words.forEach((word) => {
          if (word.includes(searchTerm)) hasWordCount++;
        });
        if (hasWordCount > 0) newList.push(item);
      });
      return newList;
    } else return allItems;
  };

  const doneHandler = () => {
    if (selectedItems && selectedItems.length > 0) {
      props.onSelected(selectedItems);
    }
    props.cancel();
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
    setSearchTerm(text);
  };

  const cleanUpChars = (text) => {
    if (text.length == 1 && text == " ") return text.trim();
    text = text.replace(/[^A-Za-z //-]/g, "");
    text = text.replace("  ", " ");
    return text;
  };

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
              placeholder="Activities"
              textChange={(text) => searchHandler(cleanUpChars(text))}
              image={require("../../assets/images/compBackgrounds/activites_input_bg.png")}
              value={searchTerm}
            />
          </ImageBackground>
        </View>
        <View style={styles.resultContainer}>
          <View style={styles.listMainHeaderContainer}>
            <Text style={styles.mainHeaderText}>
              Select your desired activities:
            </Text>
          </View>
          <View style={styles.listHeaderContainer}>
            <Text style={styles.subHeaderText}>ACTIVITIES:</Text>
          </View>
          <FlatList
            style={{ flex: 1 }}
            data={filteredData()}
            renderItem={({ item }) => (
              <Item item={item} onSelected={() => selectionHandler(item)} />
            )}
            keyExtractor={(item) => item}
            disableScrollViewPanResponder
          />
          <View style={styles.listHeaderContainer}>
            <Text style={styles.subHeaderText}>SELECTED ACTIVITIES:</Text>
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
    marginTop: "10%",
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
});

export default SearchablePopup;
