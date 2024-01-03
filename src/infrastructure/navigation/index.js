import { Alert, Linking, Platform, StatusBar, View } from "react-native";
import { useContext, useEffect, useRef,useCallback, useState } from "react";
import { connect } from "react-redux";
import { NavigationContainer,useFocusEffect, useLinking, useNavigation } from "@react-navigation/native";
import { setServices } from "../../redux/services/services.action";
import { AccountNavigator } from "./account.navigator";
import { OnboardingNavigator } from "./onboarding.navigator";
import { AuthContext } from "../../providers/auth/auth.context";
import { FacilityNavigator } from "./host.navigator";
import { SpecialistNavigator } from "./specialist.navigator";
import { AppContext } from "../../providers/app-provider";
import { AppNavigator} from "./app.navigator";
import socketServices from "../../screens/normal-app/components/Socket";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Navigation = (props) => {
  // const navigation=useNavigation();
  // useEffect(()=>{
  //     const getUrl=async()=>{
  //       const initialUrl= await Linking.getInitialURL();
  //       if(initialUrl !== null){
  //         return;
  //       }
  //       if(initialUrl.includes('FacilityDetails')){
  //           Alert.alert(initialUrl);
  //           // RootNavigation.navigate('FacilityDetails');
            
  //       }
  //     }

  //     getUrl();
  // },)
  // const navigation=useNavigation();
 
  const navigationRef = useRef();
  const { isAuthenticated, hasOnboarded, skipAuth,setuserfromstorage } = useContext(AuthContext);
  const[authdata,setauthdata]=useState();
  const {currentApp} = useContext(AppContext);
  // const Navigation=useNavigation();
  //  const {getInitialState}=useLinking(navigationRef)
  useEffect(() => {
    const handleDeepLink = (event) => {
      if (event.url.includes('FacilityDetails')) {
        Alert.alert(event.url);
        // Handle deep link here
      }
    };
    // Assuming you have a 'FacilityDetails' screen in your navigation setup
// if (getInitialURL.includes('FacilityDetails')) {
//   Navigation.navigate('FacilityDetails');
// }


  
    Linking.addEventListener('url', handleDeepLink);
  
    // Clean up event listener
    return () => {
      Linking.removeEventListener('url', handleDeepLink);
    };
  }, []);
  const linking = {
    prefixes: ['https://wan.qps.mybluehost.me/','freshr://'],
    // https://wan.qps.mybluehost.me/
    config: {
      initialRouteName: 'normalApp',
      screens: {
        FacilityDetails: 'FacilityDetails/:id',
        SpecialistDetails:'SpecialistDetails/:id',
        Home:'Home/:id/:data/:spid'

        },
      },
    };

    const needThisFUnction = async ()=>{
      const keyy= await AsyncStorage.getAllKeys();
      console.log("keysssss",keyy);
    }
    useEffect(()=>{
      needThisFUnction()
    },[])
  useEffect(() => {
    console.log(currentApp)
    Platform.OS === "android" && StatusBar.setTranslucent(true);
    StatusBar.setBarStyle("dark-content");
    StatusBar.setBackgroundColor("white");
    return () => {
      StatusBar.setBarStyle("default");
    };
  }, []);
  const olduser = async () =>{
    await setuserfromstorage()
  }
  useEffect(()=>{
    olduser()
  }, [])
  const _pickApp = () => {
    switch(currentApp) {
      case 'normal' :
        return <AppNavigator linking={linking} />
      case 'host':
        return <FacilityNavigator/>
      case 'specialist':
        return <SpecialistNavigator/>
    }
  }
  // const fetchauthdata=async()=>{
  //   const jsondata=await AsyncStorage.getItem("authh");
  //   const value=JSON.parse(jsondata);
  //   setauthdata(value);
  //   console.log("AUTHHHHHHHHHH-=-=-=-=--=-",value);
  // }
  // useEffect(()=>{
  //   fetchauthdata();
  // },[])
  const pickApp = () => {
    if (skipAuth) {
      // console.log("skippeddddauth");
      return _pickApp()
    }
    //  else if (authdata=="true" || isAuthenticated) {
      else if(isAuthenticated){
      // console.log("skippeddddddsdd");
      return hasOnboarded ? _pickApp() : <OnboardingNavigator/>
    } else {
      // console.log("nothing skippedddddd");
      return <AccountNavigator/>
    }
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={{ colors: { background: "transparent" } }}
      linking={linking}
    >
      {pickApp()}
    </NavigationContainer>
  );
};
const mapDispatchToProps = (dispatch) => ({
  setServices: (services) => dispatch(setServices(services)),
});

export default connect(null, mapDispatchToProps)(Navigation);
