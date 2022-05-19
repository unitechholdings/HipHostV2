import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";

import Colors from "../../constants/Colors";

const windowHeight = Dimensions.get("window").height;

const SearchablePopup = (props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState();

  const selectionHandler = (item) => {
    setSelectedItem(item);
  };

  useEffect(() => {
    if (selectedItem) {
      props.onSelected(selectedItem.title);
      setSearchTerm("");
      props.cancel();
    }
  }, [selectedItem]);

  const filteredData = () => {
    if (searchTerm !== "") {
      var newList = [];
      props.data.forEach((item) => {
        var words = item.title.split(" ");
        var hasWordCount = 0;
        words.forEach((word) => {
          word = word.toLowerCase();
          var term = searchTerm.toLowerCase();
          if (word.includes(term)) hasWordCount++;
        });
        if (hasWordCount > 0) newList.push(item);
      });
      return newList;
    } else return props.data;
  };

  const cancelSelection = () => {
    setSearchTerm("");
    props.cancel();
  };

  function Item({ item, onSelected }) {
    return (
      <TouchableOpacity style={styles.item} onPress={onSelected}>
        <Text style={styles.itemTitle}>{item.title}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <Modal animationType="slide" transparent={false} visible={props.visible}>
      <ImageBackground
        style={styles.mainBackground}
        source={require("../../assets/images/backgrounds/blue_bg.png")}
      >
        <View style={styles.searchContainer}>
          <ImageBackground
            style={styles.searchBoxBG}
            source={require("../../assets/images/icons/search-bg.png")}
          >
            <TextInput
              style={styles.inputBox}
              onChangeText={(text) => setSearchTerm(text.trim())}
              placeholder="Search"
              autoFocus={true}
              value={searchTerm}
            />
          </ImageBackground>
        </View>
        <View style={styles.resultContainer}>
          <FlatList
            data={filteredData()}
            renderItem={({ item }) => (
              <Item item={item} onSelected={() => selectionHandler(item)} />
            )}
            keyExtractor={(item) => item.id}
            disableScrollViewPanResponder
          />
          <View style={styles.cancelContainer}>
            <TouchableOpacity onPress={cancelSelection}>
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
    padding: "10%",
  },
  searchContainer: {
    borderColor: Colors.primary,
    borderWidth: 2,
    borderRadius: 8,
    height: windowHeight / 18,
    maxHeight: 40,
    overflow: "hidden",
  },
  searchBoxBG: {
    flex: 1,
    resizeMode: "stretch",
  },
  inputBox: {
    color: Colors.primary,
    flex: 1,
    paddingLeft: "5%",
  },
  resultContainer: {
    marginTop: "10%",
    backgroundColor: "white",
    borderRadius: 8,
    borderColor: Colors.primary,
    minHeight: "30%",
    maxHeight: windowHeight / 1.3,
  },
  item: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderColor: "#ccc",
    borderBottomWidth: 1,
  },
  itemTitle: {
    color: "#ccc",
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
});

export default SearchablePopup;
