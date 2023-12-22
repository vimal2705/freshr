import { createStackNavigator } from "@react-navigation/stack";
import SetLocationScreen from "../../screens/onboarding/set-location.screen";
import {
  SetGenderScreen,
  SetProGenderScreen,
} from "../../screens/onboarding/set-gender-screen";
import Instruction from "../../screens/onboarding/instruction";

const Stack = createStackNavigator();

export const OnboardingNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerBackTitle: "",
      }}
    >
      {/*<Stack.Screen name="addPhone" component={AddPhoneScreen} />*/}
      <Stack.Screen name="setSearchLocation" component={SetLocationScreen} />
      <Stack.Screen name="setSearchGender" component={SetGenderScreen} />
      <Stack.Screen name="setSearchProGender" component={SetProGenderScreen} />
      <Stack.Screen name="instruction" component={Instruction} />

    </Stack.Navigator>
  );
};
