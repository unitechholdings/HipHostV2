import React from "react";
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  Dimensions,
} from "react-native";

import Colors from "../../constants/Colors";

const windowWidth = Dimensions.get("window").width;

const CustomSwiper = (props) => {
  var TextElement = <Text style={styles.labelText}>{props.title}</Text>;
  if (props.loading)
    TextElement = (
      <ActivityIndicator style={styles.spinner} size="small" color="#ffffff" />
    );

  return (
    <Modal animationType="slide" visible={true}>
      <View
        style={{
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "80%",
            height: "80%",
            alignItems: "center",
            backgroundColor: "grey",
          }}
        >
          <ScrollView
            onScroll={(event) => console.log(event.nativeEvent.contentOffset)}
          >
            <View
              style={{
                width: "100%",
                height: windowWidth * 2,
                backgroundColor: "blue",
                alignItems: "center",
              }}
            >
              <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    elevation: 8,
  },
});

export default CustomSwiper;
