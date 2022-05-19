import React, { useState, useEffect } from "react";
import { LogBox, Platform } from "react-native";
import StackNavigator from "./navigation/AppNavigator";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import ReduxThunk from "redux-thunk";
import { useFonts } from "@use-expo/font";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { AppLoading } from "expo";
import FirebaseApp from "./firebase/firebaseApp";

import userReducer from "./store/reducers/user";
import chatsReducer from "./store/reducers/chats";
import galleryReducer from "./store/reducers/gallery";

window.Global_Chat_Listener = [];

const rootReducer = combineReducers({
  user: userReducer,
  chats: chatsReducer,
  gallery: galleryReducer,
});

LogBox.ignoreAllLogs(true);

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  // if (Platform.OS === "ios") {
  //   useEffect(() => {
  //     async function asyncTasks() {
  //       try {
  //         await SplashScreen.preventAutoHideAsync();
  //       } catch (e) {
  //         console.warn(e);
  //       }
  //       await loadResourcesAsync();
  //       setLoadingComplete(true);
  //     }

  //     asyncTasks();
  //   }, []);

  //   if (!isLoadingComplete) {
  //     return null;
  //   } else {
  //     return (
  //       <Provider store={store}>
  //         <StackNavigator />
  //       </Provider>
  //     );
  //   }

  //   async function loadResourcesAsync() {
  //     await Promise.all([
  //       Font.loadAsync({
  //         Amulhed: require("./assets/fonts/Amulhed.otf"),
  //         Bebas: require("./assets/fonts/BebasNeue.otf"),
  //       }),
  //     ]);

  //     await SplashScreen.hideAsync();
  //   }
  // } else {
  let [fontsLoaded] = useFonts({
    Amulhed: require("./assets/fonts/Amulhed.otf"),
    Bebas: require("./assets/fonts/BebasNeue.otf"),
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <Provider store={store}>
        <StackNavigator />
      </Provider>
    );
  }
  //}

  //standalone code
  // let [fontsLoaded] = useFonts({
  //   Amulhed: require("./assets/fonts/Amulhed.otf"),
  //   Bebas: require("./assets/fonts/BebasNeue.otf"),
  // });
  // if (!fontsLoaded) {
  //   return <AppLoading />;
  // } else {
  //   return (
  //     <Provider store={store}>
  //       <StackNavigator />
  //     </Provider>
  //   );
  // }
}
