import { Platform, StatusBar, View } from "react-native";
import { useContext, useEffect, useRef,useCallback } from "react";
import { connect } from "react-redux";
import { NavigationContainer,useFocusEffect, useLinking } from "@react-navigation/native";
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

const Navigation = (props) => {
  const navigationRef = useRef();
  const { isAuthenticated, hasOnboarded, skipAuth } = useContext(AuthContext);
  const {currentApp} = useContext(AppContext);
  //  const {getInitialState}=useLinking(navigationRef)
  const linking = {
    prefixes: ['freshr://','https://freshr.ca'],
    config: {
      initialRouteName: 'normalApp',
      screens: {
        FacilityDetails: 'FacilityDetails/:id',
        SpecialistDetails:'SpecialistDetails/:id',
        Home:'Home/:id/:data/:spid'

        },
      },
    };
  useEffect(() => {
    console.log(currentApp)
    Platform.OS === "android" && StatusBar.setTranslucent(true);
    StatusBar.setBarStyle("dark-content");
    StatusBar.setBackgroundColor("white");
    return () => {
      StatusBar.setBarStyle("default");
    };
  }, []);

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

  const pickApp = () => {
    if (skipAuth) {
      return _pickApp()
    } else if (isAuthenticated) {
      return hasOnboarded ? _pickApp() : <OnboardingNavigator/>
    } else {
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
