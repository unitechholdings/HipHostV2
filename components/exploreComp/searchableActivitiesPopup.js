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

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const SearchablePopup = (props) => {
  const userID = props.userID;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState(
    props.data ? props.data : []
  );
  const [allItems, setAllItems] = useState(data.allActivities);

  const submitHandler = () => {
    if (selectedItems && selectedItems.length > 0 && userID) {
      props.onSelected(selectedItems);
      props.cancel();
    } else {
      props.onSelected(data.allActivities);
      props.cancel();
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
        source={require("../../assets/images/backgrounds/explore_bg.png")}
      >
        <View style={styles.searchContainer}>
          <View style={styles.input}>
            <CustomTextBox
              placeholder="Activities"
              textChange={(text) => setSearchTerm(cleanUpChars(text))}
              image={require("../../assets/images/compBackgrounds/activites_input_bg.png")}
              value={searchTerm}
            />
          </View>
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
          {filteredData().length > 0 ? (
            <FlatList
              data={filteredData()}
              renderItem={({ item }) => (
                <Item item={item} onSelected={() => selectionHandler(item)} />
              )}
              keyExtractor={(item) => item}
              disableScrollViewPanResponder
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyContainerText}>Nothing found</Text>
            </View>
          )}
          {selectedItems.length > 0 ? (
            <View>
              <View style={styles.listHeaderContainer}>
                <Text style={styles.subHeaderText}>SELECTED ACTIVITIES:</Text>
              </View>

              <FlatList
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
          <View style={styles.buttonContainer}>
            <CustomButton
              title="Done"
              buttonColor={Colors.secondary}
              size="60%"
              onPress={submitHandler}
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
  resultContainer: {
    flex: 1,
    maxHeight: windowHeight / 1.4,
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
  footerContainer: {
    width: "100%",
    height: "12%",
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
  },
  backIconContainer: {
    width: windowWidth / 10,
    height: windowWidth / 10,
  },
  backIcon: {
    width: windowWidth / 10,
    height: windowWidth / 10,
    resizeMode: "stretch",
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center",
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
