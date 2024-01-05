import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "styled-components";
import { createStackNavigator } from "@react-navigation/stack";

import HomeSpecialistScreen from "../../screens/pro-specialist/home-specialist.screen";
import InboxSpecialistScreen from "../../screens/pro-specialist/inbox-specialist.screen";
import SpecialistProfileSocialScreen from "../../screens/pro-specialist/specialist-profile-social.screen";
import ServicesManagementScreen from "../../screens/pro-specialist/services-management.screen";
import ServiceDetailsScreen from "../../screens/pro-specialist/service-details.screen";
import MenuSpecialistScreen from "../../screens/pro-specialist/menu-specialist.screen";
import EditProfileScreen from "../../screens/pro-specialist/edit-profile.screen";
import SpecialistStoryScreen from "../../screens/pro-specialist/specialist-story.screen";
import CreateServiceScreen from "../../screens/pro-specialist/create-service.screen";
import { getStyledScreenOptions, PRO_TAB_ICON } from "./utils";
import ChatScreen from "../../screens/normal-app/chat.screen";
import { SpecialistVerificationScreen } from "../../screens/normal-app/specialist-verification.screen";
import {
  HostVerificationCompletedScreen,
  SpecialistVerificationCompletedScreen,
} from "../../screens/normal-app/specialist-verification-completed.screen";
import { HostVerificationScreen } from "../../screens/normal-app/host-verification-screen";
import HistorySpecialistScreen from "../../screens/pro-specialist/history-specialist.screen";
import ReservedSpecialist from "../../screens/pro-specialist/reserved-specialist.screen";
import facilityDetailsScreen from "../../screens/normal-app/facility-details.screen";
import reviewScreen from "../../screens/normal-app/review.screen";
import { useSelector } from "react-redux";
import Payment from "../../screens/pro-specialist/components/Payment";
import Instruction from "../../screens/onboarding/instruction";


const HomStack = createStackNavigator();

const StackNavigator = () => {
  return (
    <HomStack.Navigator
      screenOptions={{
        headerShown: false,
        headerBackTitle: "",
      }}
    >
      <HomStack.Screen name="HomePage" component={HomeSpecialistScreen} />
    </HomStack.Navigator>
  );
};

const ProTabService = createBottomTabNavigator();
export const ProAppServiceTabNavigator = () => {
  const theme = useTheme();
  return (
    <ProTabService.Navigator
      screenOptions={getStyledScreenOptions(PRO_TAB_ICON, theme,)}
    >
      <ProTabService.Screen name="Overview" component={StackNavigator} />
      <ProTabService.Screen
        name="History"
        component={HistorySpecialistScreen}
      />
       <ProTabService.Screen
        name="Reserve"
        component={ReservedSpecialist}
      />
      <ProTabService.Screen name="Inbox" component={InboxSpecialistScreen} />
      {/*<ProTabService.Screen name="Menu" component={MenuSpecialistScreen} />*/}
      <ProTabService.Screen
        name="Profile"
        component={SpecialistProfileSocialScreen}
      />
      {/* <ProTabService.Screen
        name="payment"
        component={Payment}
      /> */}
    </ProTabService.Navigator>
  );
};


const Stack = createStackNavigator();
export const SpecialistNavigator = () => {
  const Orderdata = useSelector(state => state.chat.order)
  console.log('Orderdata ==> ',Orderdata);
  return <Stack.Navigator screenOptions={{
    headerShown: false,
    headerBackTitle: "",
  }}>
    <Stack.Screen name={"specialistApp"} component={ProAppServiceTabNavigator}/>
    <Stack.Screen
      name="SpecialistServiceManagement"
      component={ServicesManagementScreen}
    />
    <Stack.Screen
      name="FacilityDetails"
      component={facilityDetailsScreen}
    />
<Stack.Screen
        name="Reviews"
        options={{
          headerShown: true,
          headerTitle: "",
        }}
        component={reviewScreen}
      />
    <Stack.Screen
      name="SpecialistServiceDetails"
      component={ServiceDetailsScreen}
    />
    <Stack.Screen
      name="SpecialistCreateService"
      component={CreateServiceScreen}
    />
    <Stack.Screen
      name="Chat"
      // options={({ route }) => ({
      //   headerShown: true,
      //   headerTitle: route.params.receiver.name,
      // })}
      
    >
      {props => <ChatScreen {...props} state={Orderdata}  />}
    </Stack.Screen>
    
    <Stack.Screen
      name="SpecialistMenu"
      component={MenuSpecialistScreen}
    />
    <Stack.Screen
      name="SpecialistEditProfile"
      component={EditProfileScreen}
    />
    <Stack.Screen
      name="SpecialistStory"
      component={SpecialistStoryScreen}
    />
    <Stack.Screen
      name="Payment"
      component={Payment}
    />

<Stack.Screen
      name="instruction"
      component={Instruction}
    />
    <Stack.Screen
      name="HostVerificationSpecialist"
      options={({ route }) => ({
        headerShown: true,
        headerTitle: 'Become a host',
      })}
      component={HostVerificationScreen}
    />
    <Stack.Screen
      name="HostVerificationCompletedScreenSpecialist"
      options={({ route }) => ({
        headerShown: false,
        headerTitle: 'New Host',
      })}
      component={HostVerificationCompletedScreen}
    />
  </Stack.Navigator>
}


