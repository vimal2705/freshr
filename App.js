import "react-native-gesture-handler";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { ThemeProvider } from "styled-components";
import { DefaultTheme } from "react-native-paper";
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from "react-native-safe-area-context";

import {
  useFonts as useOswald,
  Oswald_400Regular,
} from "@expo-google-fonts/oswald";
import { useFonts as useLato, Lato_400Regular } from "@expo-google-fonts/lato";
import { theme } from "./src/infrastructure/theme";
import Navigation from "./src/infrastructure/navigation";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { Provider } from "react-redux";
import store from "./src/redux/store";
import { AppProvider } from "./src/providers/app-provider";
import { AuthContextProvider } from "./src/providers/auth/auth.context";
import { PreferencesProvider } from "./src/providers/preferences.provider";
import { SpecialistProvider } from "./src/providers/specialist.provider";
import { HostProvider } from "./src/providers/facility.provider";
import { StripeProvider } from "@stripe/stripe-react-native/src/components/StripeProvider";
import PubNub from "pubnub";
import { PubNubProvider } from "pubnub-react";
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import * as Device from "expo-device";
import { ReviewProvider } from "./src/providers/review.provider";

const completeTheme = {
  ...DefaultTheme,
  roundness: 2,
  ...theme,

  colors: {
    ...theme.colors,
    ...DefaultTheme.colors,
    primary: theme.colors.brand.primary,
    accent: theme.colors.ui.primary,
  },
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

export const App = (props) => {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

 

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
      console.log("notificationnnnn",notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  const [oswaldLoaded] = useOswald({
    Oswald_400Regular,
  });
  const [latoLoaded] = useLato({
    Lato_400Regular,
  });
  if (!oswaldLoaded || !latoLoaded) {
    return null;
  }

  const pubnub = new PubNub({
    publishKey: 'pub-c-b7b71e04-ef1a-4413-8dec-4035c0d9cb91',
    subscribeKey: 'sub-c-1fe9d660-01f0-4170-a99a-55d6837f0694',
    uuid: "none"
  })

  return (
    <>
        <StripeProvider publishableKey={'pk_test_51M51K1CnZhSvaL8uSsinEH2rojLwjYlwPxfhdzmSMuIXLPlc67SBAVwCPaRzVN15pyjRevSYqkM8Q35zHXJLarGR008DXBsSYT'}>
          <Provider store={store}>
            <PubNubProvider client={pubnub}>
              <ThemeProvider theme={completeTheme}>
                <BottomSheetModalProvider>
                  <SafeAreaProvider initialMetrics={initialWindowMetrics}>
                    <AuthContextProvider>
                      <PreferencesProvider>
                        <AppProvider>
                          <ReviewProvider>
                          <SpecialistProvider>
                            <HostProvider>
                              <Navigation />
                            </HostProvider>
                          </SpecialistProvider>
                          </ReviewProvider>
                        </AppProvider>
                      </PreferencesProvider>
                    </AuthContextProvider>
                  </SafeAreaProvider>
                </BottomSheetModalProvider>
              </ThemeProvider>
            </PubNubProvider>
          </Provider>
        </StripeProvider>

      {/*<ExpoStatusBar style="auto" />*/}
    </>
  );
};
