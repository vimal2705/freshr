import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../../screens/normal-app/home.screen";
import SearchScreen from "../../screens/normal-app/search.screen";
import FacilityDetailsScreen from "../../screens/normal-app/facility-details.screen";
import SpecialistDetailsScreen from "../../screens/normal-app/specialist-details.screen";
import MeetingTimeSelectionScreen from "../../screens/normal-app/meeting-time.screen";
import BookingReviewScreen from "../../screens/normal-app/booking-review.screen";
import BookingCompletedScreen from "../../screens/normal-app/booking-completed.screen";
import ReviewScreen from "../../screens/normal-app/review.screen";
import OrderReviewScreen from "../../screens/normal-app/order-review.screen";
import ChatScreen from "../../screens/normal-app/chat.screen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "styled-components";
import FavoritesScreen from "../../screens/normal-app/favorites.screen";
import OrdersScreen from "../../screens/normal-app/orders.screen";
import InboxScreen from "../../screens/normal-app/inbox.screen";
import ProfileScreen from "../../screens/normal-app/profile.screen";
import specialiststories from "../../screens/normal-app/specialiststories";
import SpecialistStoryScreen from "../../screens/pro-specialist/specialist-story.screen";
import { getStyledScreenOptions, TAB_ICON } from "./utils";
import { SpecialistVerificationScreen } from "../../screens/normal-app/specialist-verification.screen";

import {
  HostVerificationCompletedScreen,
  SpecialistVerificationCompletedScreen,
} from "../../screens/normal-app/specialist-verification-completed.screen";
import { HostVerificationScreen } from "../../screens/normal-app/host-verification-screen";
import OrderCheckoutScreen from "../../screens/normal-app/order-checkout.screen";
import { EditAccountScreen } from "../../screens/normal-app/edit-account.screen";
import { useContext, useEffect } from "react";
import { AppContext } from "../../providers/app-provider";
import Saloon from "../../screens/normal-app/Saloon";
import Delivery from "../../screens/normal-app/Delivery";
import serviceCardComponent from "../../screens/components/service-card.component";
import Instruction from "../../screens/onboarding/instruction";

const HomeStack = createStackNavigator();

const HomeNavigator = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
        headerBackTitle: "",
      }}
    >
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="Search" component={SearchScreen} />
    </HomeStack.Navigator>
  );
};

const Tab = createBottomTabNavigator();
export const TabNavigator = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator screenOptions={getStyledScreenOptions(TAB_ICON, theme)}>
      <Tab.Screen name="Explore" component={HomeNavigator} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Inbox" component={InboxScreen} />
      <Tab.Screen name="Account" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const Stack = createStackNavigator();
export const AppNavigator = (props) => {
  const {fetchMessages}=useContext(AppContext)
 
  useEffect(()=>{
    fetchMessages()
  },[])
 
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerBackTitle: "",
      }}
    >
      <Stack.Screen name="normalApp" component={TabNavigator}/>
      <Stack.Screen
        name="FacilityDetails"
        // options={{ headerShown: true, headerTitle: "" }}
        component={FacilityDetailsScreen}
      />
      <Stack.Screen
        name="SpecialistDetails"
        // options={{ headerShown: true, headerTitle: "" }}
        component={SpecialistDetailsScreen}
      />
      <Stack.Screen
        name="ServiceCard"
        // options={{ headerShown: true, headerTitle: "" }}
        component={serviceCardComponent}
      />
      <Stack.Screen
        name="MeetingTimeSelection"
        options={{ headerShown: false, headerTitle: "Pick meeting time" }}
        component={MeetingTimeSelectionScreen}
      />
      <Stack.Screen
        name="BookingReview"
        options={{
          headerShown: false,
          headerTitle: "Review booking",
        }}
        component={BookingReviewScreen}
      />
      <Stack.Screen
        name="OrderCheckout"
        component={OrderCheckoutScreen}
      />
      <Stack.Screen
        name="OrderCompleted"
        component={BookingCompletedScreen}
      />
      <Stack.Screen
        name="Reviews"
        options={{
          headerShown: true,
          headerTitle: "",
        }}
        component={ReviewScreen}
      />
      <Stack.Screen
        name="OrderSummary"
        options={{
          headerShown: true,
          headerTitle: "Order summary",
        }}
        component={OrderReviewScreen}
      />
      <Stack.Screen
        name="Chat"
        // options={({ route }) => ({
        //   headerShown: false,
        //   headerTitle: route.params.receiver.name,

        // })}
        component={ChatScreen}
      />
      <Stack.Screen
        name="SpecialistVerification"
        options={({ route }) => ({
          headerShown: true,
          headerTitle: 'Become a specialist',
        })}
        component={SpecialistVerificationScreen}
      />
        <Stack.Screen
      name="SpecialistStory"
      component={specialiststories}
    />
      <Stack.Screen
        name="SpecialistVerificationCompletedScreen"
        options={({ route }) => ({
          headerShown: false,
          headerTitle: 'New specialist',
        })}
        component={SpecialistVerificationCompletedScreen}
      />

      <Stack.Screen
        name="EditUserProfileScreen"
        options={({ route }) => ({
          headerShown: false,
          headerTitle: '',
        })}
        component={EditAccountScreen}
      />
      <Stack.Screen
        name="HostVerification"
        options={({ route }) => ({
          headerShown: true,
          headerTitle: 'Become a host',
        })}
        component={HostVerificationScreen}
      />
      <Stack.Screen
        name="HostVerificationCompletedScreen"
        options={({ route }) => ({
          headerShown: false,
          headerTitle: 'New Host',
        })}
        component={HostVerificationCompletedScreen}
      />
      <Stack.Screen
       name="newHome" component={HomeScreen}
      />
      <Stack.Screen
       name="saloon" component={Saloon}
      />
     <Stack.Screen
        name="instruction"
        component={Instruction}
      />
    </Stack.Navigator>
  )
}


