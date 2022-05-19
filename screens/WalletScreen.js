import React, { useState, useEffect } from "react";
import {
  StatusBar,
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  Alert,
} from "react-native";
import base64 from "react-native-base64";
import * as InAppPurchases from "expo-in-app-purchases";

import { useSelector, useDispatch } from "react-redux";
import * as authActions from "../store/actions/auth";
import { updateCoins } from "../store/actions/user";

import Colors from "../constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import CustomButton from "../components/sharedComp/customButton";
import PayPalPopup from "../components/walletComp/payPalPopup";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const WalletScreen = (props) => {
  const currentUser = useSelector((state) => state.user);
  const [coinAmount, setCoinAmount] = useState(2);
  const [valueAmount, setValueAmount] = useState(1);
  const [showPayPalPopUp, setShowPayPalPopUp] = useState(false);
  const [approvedURL, setApprovedURL] = useState();
  const [orderID, setOrderID] = useState();
  const [access_token, setAccess_token] = useState();
  const [loadingOrder, setLoadingOrder] = useState(false);

  const Client_ID =
    "AWBDr_xRt2DqEq3KU_k95-s_acPngQ3sjlvhy4hKrffzYdn1okrDx5oWjJlunrhaDnCkM7h7Wn0vn_C3";
  const Secret =
    "EFSCWA4WhXDZlmidnXboFvQpvQ9NO8b2dFE7UxTrpffZr-RTdnzuEbRe05beM2MMbrZzE15LetXFSAOo";

  const dispatch = useDispatch();
  if (!currentUser) {
    dispatch(authActions.autoLoginUser())
      .then(() => {})
      .catch((err) => {
        if (err.message === "NOT_FOUND") props.navigation.navigate("Login");
      });
  }

  const goBackHandler = () => {
    props.navigation.goBack();
  };

  const addAmountHandler = () => {
    if (coinAmount < 10) {
      var amount = coinAmount;
      var value = valueAmount;
      amount = amount + 2;
      value = amount / 2;
      setCoinAmount(amount);
      setValueAmount(value);
    }
  };

  const minusAmountHandler = () => {
    if (coinAmount > 2) {
      var amount = coinAmount;
      var value = valueAmount;
      amount = amount - 2;
      value = amount / 2;
      setCoinAmount(amount);
      setValueAmount(value);
    }
  };

  const getPaymentOrder = (token) => {
    try {
      //==========================Gets the users PayPal order================================
      const url = "https://api.sandbox.paypal.com/v1/payments/payment";

      var passedData = {
        intent: "SALE",
        payer: {
          payment_method: "paypal",
        },
        transactions: [
          {
            amount: {
              total: valueAmount,
              currency: "USD",
            },
          },
        ],
        redirect_urls: {
          return_url: "https://example.com/success",
          cancel_url: "https://example.com/cancel",
        },
      };

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(passedData),
      })
        .then((response) => response.json())
        .then((data) => {
          setLoadingOrder(false);
          setApprovedURL(data.links[1].href);
          setOrderID(data.id);
          setAccess_token(token);
          setShowPayPalPopUp(true);
        })
        .catch((error) => {
          console.error("Error:", error);
          setLoadingOrder(false);
        });
      //=========================================================================
    } catch (err) {
      console.log(err);
      setLoadingOrder(false);
    }
  };

  const getAuthToken = () => {
    try {
      setLoadingOrder(true);
      //==========================Gets the users auth token for PayPal================================
      const url = "https://api.sandbox.paypal.com/v1/oauth2/token";

      fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          authorization: "Basic " + base64.encode(Client_ID + ":" + Secret),
        },
        body: "grant_type=client_credentials",
      })
        .then((response) => response.json())
        .then((data) => {
          if (typeof data.access_token != "undefined") {
            var token = data.access_token;
            getPaymentOrder(token);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          setLoadingOrder(false);
        });
      //=========================================================================
    } catch (err) {
      console.log(err);
      setLoadingOrder(false);
    }
  };

  const closePayPal = () => {
    setApprovedURL();
    setOrderID();
    setAccess_token();
    setShowPayPalPopUp(false);
  };

  async function successTransaction(amount) {
    try {
      var result = await dispatch(
        updateCoins(currentUser.userID, currentUser.coins, amount, "add")
      );
      console.log("success:" + amount);
      //if (Platform.OS == "android") closePayPal();
    } catch (e) {
      console.log(e);
    }
  }

  const selectPlatformPayment = () => {
    //if (Platform.OS == "ios")
    startInAppPurchase();
    //else getAuthToken();
  };

  async function startInAppPurchase() {
    setLoadingOrder(true);
    try {
      const history = await InAppPurchases.connectAsync();
      // if (typeof history == "undefined") {
      //   setLoadingOrder(false);
      //   return;
      // }
    } catch (e) {
      console.log("Already connected to store");
    }

    const productIDsIOS = [
      "ChatCoinsOne",
      "ChatCoinsTwo",
      "ChatCoinsThree",
      "ChatCoinsFour",
      "ChatCoinsFive",
    ];

    const productIDsAndroid = [
      "chat_coins_one",
      "chat_coins_two",
      "chat_coins_three",
      "chat_coins_four",
      "chat_coins_five",
    ];

    const items = Platform.select({
      ios: productIDsIOS,
      android: productIDsAndroid,
    });

    // Set purchase listener
    InAppPurchases.setPurchaseListener(
      ({ responseCode, results, errorCode }) => {
        // Purchase was successful
        if (responseCode === InAppPurchases.IAPResponseCode.OK) {
          results.forEach((purchase) => {
            console.log(results);
            if (!purchase.acknowledged) {
              console.log(`Successfully purchased ${purchase.productId}`);
              // Process transaction here and unlock content...

              dispatch(
                updateCoins(
                  currentUser.userID,
                  currentUser.coins,
                  coinAmount,
                  "add"
                )
              )
                .then(() => {
                  console.log("success:" + coinAmount);
                  //if (Platform.OS == "android") closePayPal();

                  // Then when you're done
                  InAppPurchases.finishTransactionAsync(purchase, true).then(
                    () => {
                      setLoadingOrder(false);
                    }
                  );
                })
                .catch((e) => {
                  console.log(e);
                  setLoadingOrder(false);
                });
            }
          });
        }

        // Else find out what went wrong
        if (responseCode === InAppPurchases.IAPResponseCode.USER_CANCELED) {
          InAppPurchases.disconnectAsync()
            .then(() => {
              Alert.alert("User canceled the transaction", "", [
                { text: "Okay" },
              ]);
              setLoadingOrder(false);
            })
            .catch((e) => {
              setLoadingOrder(false);
            });
        } else if (responseCode === InAppPurchases.IAPResponseCode.DEFERRED) {
          InAppPurchases.disconnectAsync()
            .then(() => {
              Alert.alert(
                "User does not have permissions to buy but requested parental approval",
                "",
                [{ text: "Okay" }]
              );
              setLoadingOrder(false);
            })
            .catch((e) => {
              setLoadingOrder(false);
            });
        } else {
          InAppPurchases.disconnectAsync()
            .then(() => {
              Alert.alert(
                "Something went wrong with the purchase",
                `Received errorCode ${errorCode}`,
                [{ text: "Okay" }]
              );
              setLoadingOrder(false);
            })
            .catch((e) => {
              setLoadingOrder(false);
            });
        }
      }
    );

    // Retrieve product details
    const { responseCode, results } = await InAppPurchases.getProductsAsync(
      items
    );

    if (responseCode === InAppPurchases.IAPResponseCode.OK) {
      var productIDs = null;
      if (Platform.OS == "ios") {
        productIDs = productIDsIOS;
      } else {
        productIDs = productIDsAndroid;
      }

      try {
        if (
          typeof results != "undefined" &&
          results.length == productIDs.length
        ) {
          const productID = productIDs[valueAmount - 1];
          InAppPurchases.purchaseItemAsync(productID);
          InAppPurchases.disconnectAsync()
            .then(() => {
              setLoadingOrder(false);
            })
            .catch((e) => {
              setLoadingOrder(false);
            });
        } else {
          InAppPurchases.disconnectAsync()
            .then(() => {
              Alert.alert("Info", "Purchase was unsuccessful", [
                { text: "Okay" },
              ]);
              setLoadingOrder(false);
            })
            .catch((e) => {
              setLoadingOrder(false);
            });
        }
      } catch (e) {
        InAppPurchases.disconnectAsync()
          .then(() => {
            console.log(`Something went wrong with the purchase.`);
            setLoadingOrder(false);
          })
          .catch((e) => {
            setLoadingOrder(false);
          });
      }
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <ImageBackground
        style={styles.mainBackground}
        source={require("../assets/images/backgrounds/wallet_bg.png")}
      >
        {showPayPalPopUp ? (
          <PayPalPopup
            visible={showPayPalPopUp}
            approvalURL={approvedURL}
            orderID={orderID}
            token={access_token}
            close={closePayPal}
            success={(amount) => successTransaction(amount)}
            amount={coinAmount}
            userID={currentUser.userID}
            userCoins={currentUser.coins}
          />
        ) : null}
        <View style={styles.headerContainer}>
          <Image
            style={styles.headerIcon}
            source={require("../assets/images/icons/wallet_icon1.png")}
          />
          <Text style={styles.headerText}>WALLET</Text>
        </View>
        <View style={styles.bodyContainer}>
          <Text style={styles.labelText}>BALANCE</Text>
          <View style={styles.sectionContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.text}>
                {currentUser && typeof currentUser.coins != "undefined"
                  ? currentUser.coins
                  : 0}{" "}
                CONNECT coin
                {currentUser &&
                typeof currentUser.coins != "undefined" &&
                currentUser.coins > 1
                  ? "s"
                  : ""}
              </Text>
            </View>
            <Text style={styles.text}>2 CONNECT coin = $1.00</Text>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={{ ...styles.labelText, marginTop: windowHeight / 35 }}>
              BUY
            </Text>
            <View style={styles.inputAreaContainer}>
              <View style={styles.inputTextContainer}>
                <Text style={styles.text}>{coinAmount} CONNECT coins</Text>
              </View>
              <View style={styles.plusMinusContainer}>
                <TouchableOpacity
                  onPress={minusAmountHandler}
                  style={styles.minusBox}
                >
                  <AntDesign
                    name="minus"
                    size={24}
                    color={coinAmount > 2 ? Colors.primary : "#a8a7a7"}
                  />
                </TouchableOpacity>
                <View
                  style={{
                    borderColor: "#cccc",
                    borderRightWidth: 1,
                    height: "80%",
                  }}
                />
                <TouchableOpacity
                  onPress={addAmountHandler}
                  style={styles.plusBox}
                >
                  <AntDesign
                    name="plus"
                    size={24}
                    color={coinAmount < 10 ? Colors.primary : "#a8a7a7"}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View
            style={{
              width: "100%",
              alignItems: "center",
              marginTop: windowHeight / 35,
            }}
          >
            <CustomButton
              title="Confirm"
              buttonColor={Colors.secondary}
              // disabled={!isValid}
              size="40%"
              onPress={selectPlatformPayment}
              loading={loadingOrder}
            />
          </View>
        </View>
        <View style={styles.footerContainer}>
          <TouchableOpacity style={styles.backTouch} onPress={goBackHandler}>
            <Image
              style={styles.backImage}
              source={require("../assets/images/icons/blue_back_arrow.png")}
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  mainBackground: {
    width: windowWidth,
    height: windowHeight,
    resizeMode: "stretch",
    paddingTop: "10%",
    alignItems: "center",
  },
  headerContainer: {
    width: "100%",
    height: windowHeight / 5,
    justifyContent: "center",
    alignItems: "center",
  },
  headerIcon: {
    width: windowWidth / 6,
    height: windowWidth / 6,
    resizeMode: "stretch",
    marginBottom: windowHeight / 45,
  },
  headerText: {
    color: "white",
    fontFamily: "Bebas",
    fontSize: 30,
  },
  bodyContainer: {
    width: "100%",
    height: windowHeight / 1.6,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionContainer: {},
  inputContainer: {
    width: windowWidth / 1.5,
    height: windowWidth / 8,
    borderColor: Colors.primary,
    borderRadius: 5,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: windowHeight / 50,
  },
  inputAreaContainer: {
    width: windowWidth / 1.5,
    height: windowWidth / 8,
    flexDirection: "row",
    borderColor: Colors.primary,
    borderRadius: 5,
    borderWidth: 2,

    marginBottom: windowHeight / 50,
  },
  inputTextContainer: {
    width: "70%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  plusMinusContainer: {
    width: "30%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  text: {
    color: Colors.primary,
    fontSize: 15,
    textAlign: "center",
  },
  labelText: {
    color: Colors.primary,
    fontFamily: "Bebas",
    fontSize: 28,
    textAlign: "center",
  },
  footerContainer: {
    width: "100%",
    height: "100%",
  },
  backTouch: {
    width: windowWidth / 8,
    height: windowWidth / 8,
    marginLeft: windowWidth / 10,
  },
  backImage: {
    width: windowWidth / 8,
    height: windowWidth / 8,
    resizeMode: "stretch",
  },
  plusBox: {
    height: "100%",
    width: "60%",
    alignItems: "center",
    justifyContent: "center",
  },
  minusBox: {
    height: "100%",
    width: "60%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default WalletScreen;
