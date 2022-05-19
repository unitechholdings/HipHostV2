import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";

import Colors from "../../constants/Colors";

const labelPos = ["flex-start", "center", "flex-end"];

const CustomSlider = (props) => {
  const [finalVal, setFinalVal] = useState(props.val != null ? props.val : 1);
  const passedColor = props.color ? props.color : "white";

  const roundFirst = (val) => {
    val = Math.round(val);
    setFinalVal(val);
  };

  useEffect(() => {
    if (finalVal == 0 || finalVal == 1 || finalVal == 2) {
      props.onChange(finalVal);
    }
  }, [finalVal]);

  return (
    <View
      style={{
        ...styles.container,
        width: props.size,
      }}
    >
      <View
        style={{
          ...styles.sliderContainer,
        }}
      >
        <Slider
          style={{ width: "95%", height: 25 }}
          minimumValue={0}
          maximumValue={2}
          minimumTrackTintColor={Colors.primary}
          maximumTrackTintColor={Colors.primary}
          thumbTintColor={Colors.primary}
          step={1}
          value={finalVal}
          onValueChange={(val) => roundFirst(val)}
        />
      </View>
      <View style={styles.labelsContainer}>
        {props.data.map((obj, key) => {
          return (
            <View
              key={key}
              style={{
                ...styles.labelContainer,
                alignItems: labelPos[key],
              }}
            >
              <Text
                style={{
                  ...styles.labelText,
                  color: passedColor == "white" ? Colors.primary : "white",
                }}
              >
                {obj.title}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  sliderContainer: {
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 20,
  },
  labelsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },

  labelContainer: {
    flex: 1,
    marginTop: "2%",
  },

  labelText: {
    width: "70%",
    color: "white",
    fontSize: 12,
    textAlign: "center",
  },
});

export default CustomSlider;
