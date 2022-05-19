import React, { useState } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Colors from "../../constants/Colors";
import CustomButton from "../../components/sharedComp/customButton";

import { doneChat } from "../../store/actions/chats";
import { useDispatch } from "react-redux";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const WalletPopup = (props) => {
  const dispatch = useDispatch();

  return (
    <Modal animationType="slide" transparent={true} visible={props.visible}>
      <View style={styles.container}>
        <View style={styles.mainContainer}>
          <View style={styles.bodyContainer}>
            <Text style={styles.headerText}>WAIT A MINUTE</Text>
            <Image
              style={styles.icon}
              source={require("../../assets/images/icons/wallet_icon1.png")}
            />
            <View>
              <Text style={styles.text}>
                You have {props.coins} free Connect Coins left.
              </Text>
              <Text style={styles.text}>
                Top up your Connect Coins by visiting the
              </Text>
              <Text style={styles.text}>
                <Text style={styles.textBold}>Wallet</Text> tab in your{" "}
                <Text style={styles.textBold}>Profile</Text>
              </Text>
            </View>
            <Text style={styles.text}>
              <Text style={styles.textBold}>1 CONNECT COIN</Text> per chat
            </Text>
            <Text style={styles.text}>
              <Text style={styles.textBold}>2 CONNECT COINS</Text> = $1.00
            </Text>
            <View style={styles.btnContainer}>
              <CustomButton
                title="Top Up"
                buttonColor="gold"
                size="40%"
                onPress={props.toWallet}
              />
            </View>
            {props.coins && props.coins > 0 ? (
              <View style={styles.btnContainer}>
                <CustomButton
                  title="Continue"
                  buttonColor={Colors.secondary}
                  size="40%"
                  onPress={props.toMatches}
                />
              </View>
            ) : (
              <View />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "rgba(255,255,255,0.5)",
  },
  mainContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(69, 190, 174,0.8)",
  },
  bodyContainer: {
    width: "100%",
    height: "80%",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingTop: windowHeight / 15,
  },
  headerText: {
    color: "white",
    fontFamily: "Bebas",
    fontSize: 30,
  },
  icon: {
    width: windowHeight / 8,
    height: windowHeight / 8,
    resizeMode: "stretch",
  },
  text: {
    color: "white",
    fontSize: 15,
    textAlign: "center",
  },
  textBold: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
  btnContainer: {
    width: "100%",
    alignItems: "center",
  },
});

export default WalletPopup;
