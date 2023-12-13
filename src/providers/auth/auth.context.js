import { useTheme } from "styled-components/native";
import { useState, createContext, useContext, useRef, useEffect } from "react";
import axios from "axios";
import { BASE_API_URL } from "../../constants";
import * as Device from 'expo-device';
import * as SecureStore from "expo-secure-store";
import * as Notifications from 'expo-notifications';

import FlashMessage, {
  hideMessage,
  showMessage,
} from "react-native-flash-message";
import {
  flashMessageStyle,
  getError,
  getTokenAndCreateAuthorizationHeader, handleError,
  handleSuccess,
  sendMessage,
} from "../utils";
import { Platform } from "react-native";
import { usePubNub } from "pubnub-react";
import { AppContext } from "../app-provider";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children, navigation }) => {
  const theme = useTheme();
  const flashRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(true);
  const [skipAuth, setSkipAuth] = useState(false);
  const[Guest,setGuest]=useState(false);
  const [user, setUser] = useState(null);
  const [specialist, setSpecialist] = useState(null);
  const [host, setHost] = useState(null);
  const [error, setError] = useState(null);
  const [expoPushToken, setExpoPushToken] = useState(null);
  const changeApp = useContext(AppContext);


  useEffect(() => {
    setError(null);
    registerForPushNotificationsAsync();
    return () => {
      hideMessage();
      setError(null);
    };
  }, []);

  // useEffect(() => {
  //   if (user) {
  //     pubnub.setUUID(`${user.id}`)
  //     console.log('user id', user.id)
  //     console.log('pubnub', pubnub)
  //   }
  // }, [user])

  const onLogout = () => {
    SecureStore.deleteItemAsync("token").then(() => {
      
      setSpecialist(null);
      setHost(null);
      setUser(null);
      changeApp('normal');
    });
  };

  const updateUserInfo = async (data) => {
    try {
      setIsLoading(true);
      const config = await getTokenAndCreateAuthorizationHeader()
      const res = await axios.patch(
        `${BASE_API_URL}/users/updateMe`,
        data,
        {
          ...config,
          transformRequest: (data, headers) => {
            return data;
          }},
      );
      setError(null);
      setUser(res.data.data.user);
      setIsLoading(false);
      handleSuccess(res, setIsLoading, theme);
    } catch (e) {
      console.log(e.request);
      setIsLoading(false);
      handleError(e, setIsLoading, setError, theme)
    }
  }

  const registerForPushNotificationsAsync = async () => {
    let token;
    console.log("Device.isDevice",Device.isDevice);
    if (Device.isDevice) {
      console.log("dd1");
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }
      token =  (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
      setExpoPushToken( token );
    } else {
      console.log('Must use physical device for Push Notifications');
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
  };

  const onOnboarding = () => {
    setHasOnboarded(true);
  };

  const onLogin = (email, password) => {
    setIsLoading(true);
    axios
      .post(`${BASE_API_URL}/users/signin`, { email, password })
      .then((res) => {
        SecureStore.setItemAsync(
          "token",
          res.headers["set-cookie"][0].replace("jwt=", "").split(";")[0]
        ).then(() => {
          setUser(res.data.data.user);

          setIsLoading(false);
          showMessage({
            message: "Welcome back",
            description: res.data.message,
            type: "success",
            backgroundColor: theme.colors.brand.primary,
            ...flashMessageStyle,
            duration: 1000,
          });
        });
      })
      .catch((e) => {
        setIsLoading(false);
        setError(getError(e));
        showMessage({
          message: "Failure",
          description: getError(e).message,
          type: "warning",
          ...flashMessageStyle,
        });
        console.log(e);
      });
  };
  const onLoginasguest = (email, password) => {
    setIsLoading(true);
    axios
      .post(`${BASE_API_URL}/users/signin`, { email:"guest@Gmail.com" , password:"123456"})
      .then((res) => {
        SecureStore.setItemAsync(
          "token",
          res.headers["set-cookie"][0].replace("jwt=", "").split(";")[0]
        ).then(() => {
          setUser(res.data.data.user);

          setIsLoading(false);
          showMessage({
            message: "Welcome back",
            description: res.data.message,
            type: "success",
            backgroundColor: theme.colors.brand.primary,
            ...flashMessageStyle,
            duration: 1000,
          });
        });
      })
      .catch((e) => {
        setIsLoading(false);
        setError(getError(e));
        showMessage({
          message: "Failure",
          description: getError(e).message,
          type: "warning",
          ...flashMessageStyle,
        });
        console.log(e);
      });
  };
  const onRegister = async (data) => {
    console.log("DDDDD EXECUTED",data);
    try {
      setIsLoading(true);
      const newUser = {...data}
      console.log("Sss",newUser);
      let pushToken = expoPushToken;
      if (!pushToken) {
        pushToken = await registerForPushNotificationsAsync()
        console.log("Sss");
      }
      console.log("Sssss");
      console.warn(pushToken);
      newUser.pushToken = pushToken;
      const res = await axios.post(`${BASE_API_URL}/users/signup`, newUser)
      console.log("responseeeeee",res);
      await SecureStore.setItemAsync(
        "token",
        res.headers["set-cookie"][0].replace("jwt=", "").split(";")[0]
      )
      setUser(res.data.data.user);
      console.log("userrrrrrr",user);
      setHasOnboarded(false);
      // showMessage({
      //   message: "Login successfully",
      //   description: res.data.message,
      //   type: "success",
      //   backgroundColor: theme.colors.brand.quaternary,
      //   ...flashMessageStyle,
      //   duration: 2500,
      // });
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      setError(getError(e));
      showMessage({
        message: "Failure",
        description: getError(e).message,
        type: "warning",
        ...flashMessageStyle,
        duration: 3000,
      });
      console.log(e);
    }
  };

  const skipAuthentication = () => {
    setSkipAuth(true);
  };

  const signInAsGuest=()=>{
    setGuest(true);
  }

  const onBecomeHost = async () => {
    try {
      setIsLoading(true);
      const config = await getTokenAndCreateAuthorizationHeader()
      const res = await axios.post(
        `${BASE_API_URL}/users/becomeHost`,
        null,
        config,
      );
      setUser(res.data.data.host.user);
      sendMessage(
        "Updated",
        res.data.message,
        "success",
        1000,
        theme.colors.brand.primary
      );
      setIsLoading(false);
      return res.data.data.host;
    } catch (e) {
      setIsLoading(false);
      console.log(e);
      setError(getError(e));
      sendMessage(
        "Failure",
        getError(e).message,
        "warning",
        2500,
        theme.colors.ui.warning
      );
    }
  }
  const onBecomeSpecialist = async () => {
    try {
      setIsLoading(true);
      const config = await getTokenAndCreateAuthorizationHeader()
      const res = await axios.post(
        `${BASE_API_URL}/users/becomeSpecialist`,
        null,
        config,
      );
      console.log("sssss",res);
      setUser(res.data.data.specialist.user);
      sendMessage(
        "Updated",
        res.data.message,
        "success",
        1000,
        theme.colors.brand.primary
      );
      setIsLoading(false);
      return res.data.data.specialist;
    } catch (e) {
      console.log("SSSsd");
      setIsLoading(false);
      setError(getError(e));
      sendMessage(
        "Failure",
        getError(e).message,
        "warning",
        2500,
        theme.colors.ui.warning
      );
      setIsLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        // isAuthenticated: true,
        isAuthenticated: !!user,
        user,
        isLoading,
        error,
        hasOnboarded,
        skipAuth,
        Guest,
        specialist,
        host,
        setIsLoading,
        skipAuthentication,
        signInAsGuest,
        onLogin,
        onLoginasguest,
        onLogout,
        onRegister,
        onOnboarding,
        onBecomeSpecialist,
        onBecomeHost,
        updateUserInfo
      }}
    >
      <FlashMessage ref={flashRef} />
      {children}
    </AuthContext.Provider>
  );
};
