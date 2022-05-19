import React, { useState } from "react";
import { View, StyleSheet, Modal, Platform, Button, Text } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import Colors from "../../constants/Colors";

const CustomDatePicker = (props) => {
  const [myDate, setMyDate] = useState(new Date());

  const getFormattedDate = (date) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  const submitDate = () => {
    if (Platform.OS === "ios") {
      var d = new Date();
      d.setDate(d.getDate() - 1);
      if (new Date(myDate) >= d) {
        props.submit(getFormattedDate(myDate));
      }
    }
  };

  const androidDateSelected = (event, date) => {
    if (event.type == "dismissed") {
      props.cancel();
    } else if (event.type == "set") {
      var d = new Date();
      d.setDate(d.getDate() - 1);
      if (new Date(date) >= d) {
        props.submit(getFormattedDate(date));
      }
    }
  };

  const pickerContent = () => {
    if (Platform.OS === "ios") {
      return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={props.visible}
          style={styles.container}
        >
          <View style={styles.subContainer}>
            <DateTimePicker
              testID="dateTimePicker"
              value={myDate}
              mode="date"
              display="spinner"
              onChange={(event, date) => setMyDate(date)}
              minimumDate={new Date()}
            />
            <View style={styles.buttonContainer}>
              <Button
                title="Cancel"
                color={Colors.primary}
                onPress={props.cancel}
              />

              <Button title="OK" color={Colors.primary} onPress={submitDate} />
            </View>
          </View>
        </Modal>
      );
    } else
      return (
        <DateTimePicker
          testID="dateTimePicker"
          value={myDate ? myDate : new Date()}
          mode="date"
          display="spinner"
          onChange={(event, date) => androidDateSelected(event, date)}
          minimumDate={new Date()}
        />
      );
  };

  return pickerContent();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subContainer: {
    backgroundColor: "white",
    borderRadius: 5,
    marginHorizontal: "5%",
    marginTop: "30%",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingVertical: "5%",
  },
});

export default CustomDatePicker;
