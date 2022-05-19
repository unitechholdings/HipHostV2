import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import LandingScreen from "../screens/LandingScreen";
import ProfileSetupScreen from "../screens/ProfileSetupScreen";
import SplashScreen from "../screens/SplashScreen";
import ExploreScreen from "../screens/ExploreScreen";
import PersonalitySetupScreen from "../screens/PersonalitySetupScreen";
import MatchScreen from "../screens/MatchScreen";
import MatchProfileScreen from "../screens/MatchProfileScreen";
import HostDashboardScreen from "../screens/HostDashboardScreen";
import BioScreen from "../screens/BioScreen";
import HostLocationScreen from "../screens/HostLocationScreen";
import HostActivitiesScreen from "../screens/HostActivitiesScreen";
import ChatListScreen from "../screens/ChatListScreen";
import ChatScreen from "../screens/ChatScreen";
import ProfileScreen from "../screens/ProfileScreen";
import MyAccountScreen from "../screens/MyAccountScreen";
import SocialScreen from "../screens/SocialScreen";
import RulebookScreen from "../screens/RulebookScreen";
import FAQScreen from "../screens/FAQScreen";
import EndChatScreen from "../screens/EndChatScreen";
import HostsSocialScreen from "../screens/HostSocialScreen";
import HostReviewScreen from "../screens/HostReviewScreen";
import WalletScreen from "../screens/WalletScreen";

export const paths = {
  //shared screens
  Splash: SplashScreen,
  Login: LoginScreen,
  Signup: SignupScreen,
  ForgotPass: ForgotPasswordScreen,
  Landing: LandingScreen,
  ProfileSetup: ProfileSetupScreen,
  PersonalitySetup: PersonalitySetupScreen,
  ChatList: ChatListScreen,
  Chat: ChatScreen,
  Profile: ProfileScreen,
  MyAccount: MyAccountScreen,
  FAQ: FAQScreen,
  EndChat: EndChatScreen,
  Wallet: WalletScreen,
  ////////////////////////////////////////

  //host screens

  HostDashboard: HostDashboardScreen,
  Bio: BioScreen,
  HostLocation: HostLocationScreen,
  HostActivities: HostActivitiesScreen,
  Rulebook: RulebookScreen,
  HostSocial: HostsSocialScreen,
  HostReview: HostReviewScreen,
  ///////////////////////////////////////

  //user screens
  Explore: ExploreScreen,
  Matches: MatchScreen,
  MatchProfile: MatchProfileScreen,
  UserSocial: SocialScreen,
  ///////////////////////////////////////
};

const StackNavigator = createStackNavigator(paths, {
  initialRouteName: "Splash",
  headerMode: "none",
  navigationOptions: {
    headerVisible: false,
  },
});

export default createAppContainer(StackNavigator);
