import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  Dimensions,
  StyleSheet,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";

import Colors from "../../constants/Colors";

import data from "../../staticData/data";
import CustomButton from "../sharedComp/customButton";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const payPalPopup = (props) => {
  const approvalUrl = props.approvalURL;
  const orderID = props.orderID;
  const token = props.token;
  const amount = props.amount;

  const [showPay, setShowPay] = useState(false);
  const [payerID, setPayerID] = useState();
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [loadingWebView, setLoadingWebView] = useState(true);

  const navigationChanged = (navState) => {
    if (navState && navState.url) {
      var url = navState.url;
      if (url.indexOf("success") != -1) {
        console.log("success");
        var params = getParams(navState.url);
        if (params && typeof params.PayerID != "undefined") {
          setPayerID(params.PayerID);
          setShowPay(true);
        }
        //props.close();
      } else if (url.indexOf("cancel") != -1) {
        console.log("cancel");
        props.close();
      }
    }
  };

  const getParams = (url) => {
    var params = {};
    var vars = url.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      params[pair[0]] = decodeURIComponent(pair[1]);
    }
    return params;
  };

  const placeOrder = () => {
    try {
      //==========================Gets the users PayPal order================================
      setLoadingPayment(true);
      const url =
        "https://api.sandbox.paypal.com/v1/payments/payment/" +
        orderID +
        "/execute";

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ payer_id: payerID }),
      })
        .then((response) => response.json())
        .then((data) => {
          setLoadingPayment(false);
          if (typeof data.state != "undefined") {
            if (data.state == "approved") props.success(amount);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          setLoadingPayment(false);
        });
      //=========================================================================
    } catch (err) {
      console.log(err);
      setLoadingPayment(false);
    }
  };

  const goBackHandler = () => {
    props.close();
  };

  const loadDoneHandler = () => {
    if (loadingWebView) {
      setLoadingWebView(false);
    }
  };

  return (
    <Modal animationType="slide" transparent={false} visible={props.visible}>
      {showPay ? (
        <ImageBackground
          style={styles.mainBackground}
          source={require("../../assets/images/backgrounds/trans_overlay_bg.png")}
        >
          <View style={styles.mainContainer}>
            <Text style={styles.text}>Finalize ${amount} payment</Text>
            <CustomButton
              title="Pay now"
              buttonColor={Colors.secondary}
              // disabled={!isValid}
              size="40%"
              onPress={placeOrder}
              loading={loadingPayment}
            />
          </View>
          <View style={styles.footerContainer}>
            <TouchableOpacity style={styles.backTouch} onPress={goBackHandler}>
              <Image
                style={styles.backImage}
                source={require("../../assets/images/icons/blue_back_arrow.png")}
              />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      ) : (
        <View style={styles.webViewContainer}>
          {loadingWebView ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                style={styles.spinner}
                size="large"
                color="#ffffff"
              />
              <Text style={{ color: "white" }}>Loading PayPal</Text>
            </View>
          ) : null}
          <WebView
            source={{ uri: approvalUrl }}
            onNavigationStateChange={(navState) => navigationChanged(navState)}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={false}
            style={{ marginTop: 20 }}
            onLoadEnd={loadDoneHandler}
          />
        </View>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  mainBackground: {
    flex: 1,
    backgroundColor: "white",
  },
  text: {
    color: Colors.primary,
    fontSize: 20,
    marginBottom: "10%",
  },
  mainContainer: {
    width: "100%",
    height: "90%",
    justifyContent: "center",
    alignItems: "center",
  },
  footerContainer: {
    width: "100%",
    marginBottom: "30%",
    justifyContent: "center",
  },
  backTouch: {
    width: windowWidth / 8,
    height: windowWidth / 8,
    marginLeft: windowWidth / 10,
  },
  webViewContainer: {
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    width: windowWidth,
    height: windowHeight,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
    zIndex: 10,
  },
  spinner: {
    height: 20,
    margin: 14,
  },
  backImage: {
    width: windowWidth / 8,
    height: windowWidth / 8,
    resizeMode: "stretch",
  },
});

export default payPalPopup;
