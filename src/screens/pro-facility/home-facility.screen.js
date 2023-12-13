import { connect } from "react-redux";
import styled, { useTheme } from "styled-components/native";
import { SafeArea } from "../../components/utils/safearea.component";
import { Spacer } from "../../components/spacer/spacer.component";
import { Text } from "../../components/typography/typography.component";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { BackHandler, TouchableOpacity, useWindowDimensions, View } from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { SceneMap, TabView } from "react-native-tab-view";
import {
  PaddedContainer,
  SectionTitle,
} from "../components/details-screen.component";
import ProFacilityCard from "./components/pro-facility-card";
import { rgba } from "polished";
import { Row, Separator } from "../../components/helpers/helpers.component";
import { BookingCard } from "./components/pro-booking-card";
import {
  CTAButton,
  LargeButton,
} from "../../components/button/button.component";
import { CalendarOneLine } from "../pro-specialist/components/calendar.component";
import {
  WelcomeContainer,
  WelcomeMessageContainer,
  WelcomeText,
} from "../components/pro/pro-details-screen.component";
import { ContainerGradient } from "../../components/background/glass-background";
import { LoadingScreen } from "../loading.screen";
import { HostContext } from "../../providers/facility.provider";
import { HostFacilityCard } from "./components/host-facility-card";
import { FacilityScreenHoc } from "./facility-screen-hoc";
import { useNavigation } from "@react-navigation/native";
import { log } from "react-native-reanimated";
const Container = styled.ScrollView`
  flex: 1;
  background-color: white;
`;
const BalanceContainer = styled.View`
  flex: 1;
  padding: 16px;
`;
const TabViewContainer = styled.View`
  min-height: 480px;
  background-color: ${({ theme }) => theme.colors.ui.quaternary};
  border-radius: 10px;
  overflow: hidden;
`;
const TabContainer = styled.ScrollView.attrs((props) => ({
  showsVerticalScrollIndicator: false,
  nestedScrollEnabled: true,
}))`
  flex: 1;
  background-color: white;
  padding-bottom: 16px;
`;
const ManageServiceButtonContainer = styled.TouchableOpacity`
  position: relative;
  padding: 16px;
  border-radius: 15px;
  justify-content: center;
  overflow: hidden;
`;
const HomeFacilityScreen = (props) => {
  const layout = useWindowDimensions();
  const theme = useTheme();
  const [showBookingList, setShowBookingList] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const {error, loadHostData, host, isLoading, history, hostFacilities} = useContext(HostContext)
  const navigation = useNavigation()
  const isToday = (date) => {
    const currentDate = new Date();
    // Assuming date is a string or a Date object
    const createdAt = new Date(date);
    // Compare the dates
    return (
      createdAt.getDate() === currentDate.getDate() &&
      createdAt.getMonth() === currentDate.getMonth() &&
      createdAt.getFullYear() === currentDate.getFullYear()
    );
  };
  const todayOrders = history.filter((order) => isToday(order.createdAt));
  const toggleShowBookingList = () => {
    setShowBookingList(!showBookingList);
  };
  const onDayPress = useCallback((day) => {
    console.log(day);
    setSelectedDay(day.dateString);
    toggleShowBookingList();
  }, []);
//   useEffect(async() => {

//     const { user } = await getUser();
  
   

//     const backAction = () => {
 
//       if( user?.firstName == 'Guest'){
    
//   if (props.navigation.isFocused()) {
//     Alert.alert(
//     "Exit App",
//     "Do you want to exit?",
//     [
//       {
//         text: "No",
//         onPress: () => console.log("Cancel Pressed"),
//         style: "cancel"
//       },
//       { text: "Yes", onPress: () => onLogout() }
//     ],
//     { cancelable: false }
//     );
// }
// else{

//   navigation.goBack()
// }
        
//       }
//       else{

//         console.log("asd");
//         if (props.navigation.isFocused()) {
//           BackHandler.exitApp()

//         }
//         else{
        
//           BackHandler.exitApp()
      
//         props.navigation.goBack()
//         }
//       }
//       return true;
    
//     };

//     const backHandler = BackHandler.addEventListener(
//       'hardwareBackPress',
//       backAction,
//     );

//     return () => backHandler.remove();
//   }, []);



useEffect(()=>{
  const backAction = () => {
      if (props.navigation.isFocused()) {
        BackHandler.exitApp()
      }
      else{
      props.navigation.goBack()
      }
    
    return true;  
  };

  const backHandler = BackHandler.addEventListener(
    'hardwareBackPress',
    backAction,
  );

  return () => backHandler.remove();
}, [])


  useEffect(() => {
    loadHostData();
  }, [])
  if (isLoading || !host || !hostFacilities ) {
    return <LoadingScreen/>
  }
  const renderOpenedFacilities = () => {
    return (
      <TabContainer>
        <Spacer position="top" size="large" />
        <ProFacilityCard navigation={props.navigation} />
        <Spacer position="top" size="medium" />
        <ProFacilityCard navigation={props.navigation} />
      </TabContainer>
    );
  };
  const renderClosedFacilities = () => {
    return (
      <TabContainer>
        <Spacer position="top" size="large" />
        <ProFacilityCard navigation={props.navigation} />
      </TabContainer>
    );
  };
  const renderBookingHistory = () => {
    return (
      <TabContainer>
        <Spacer position="top" size="large" />
        <BookingCard facility={null} navigation={props.navigation} />
        <Spacer position="top" size="medium" />
        {/*<BookingCard facility={null} />*/}
        <Spacer position="top" size="large" />
        <PaddedContainer>
          <TouchableOpacity>
            <Text
              style={{ textDecorationLine: "underline", fontWeight: "bold" }}
            >
              View more &rarr;
            </Text>
          </TouchableOpacity>
        </PaddedContainer>
        <Spacer position="top" size="large" />
      </TabContainer>
    );
  };
  const renderScene = SceneMap({
    bookingHistory: renderBookingHistory,
    openedFacilities: renderOpenedFacilities,
    closedFacilities: renderClosedFacilities,
  });
  const renderCalendarComp = () => {
    return (
      <PaddedContainer>
        <CalendarOneLine />
      </PaddedContainer>
    );
  };
  return (
    <FacilityScreenHoc>
      <Container
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        <PaddedContainer style={{flexDirection: "row", gap: 10, flexWrap: "wrap", marginTop: 10}}>
          <BalanceContainer style={{backgroundColor: "black", borderRadius: 4, borderWidth: 2, borderColor: "#25282B", flex: 1}}>
            <Text
              style={{
                fontSize: 14,
                textTransform: "uppercase",
                color: theme.colors.ui.quaternary,
                letterSpacing: 1,
              }}
            >
              Total booking
            </Text>
            <Spacer position="bottom" size="large" />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{ color: "white", fontSize: 35, fontWeight: "bold" }}
              >
                {history.length}
              </Text>
            </View>
          </BalanceContainer>
          <Spacer position={"left"} size={"large"}/>
          <ManageServiceButtonContainer
            onPress={() =>
              props.navigation.navigate("Facilities")
            }
            style={{backgroundColor: theme.colors.brand.primary, borderRadius: 4}}
          >
            <AntDesign name="setting" size={35} color="white" />
            <Spacer position="bottom" size="large" />
            <Text style={{ color: "white" }}>Manage facilities</Text>
          </ManageServiceButtonContainer>
        </PaddedContainer>
        <Spacer position="bottom" size="large" />
        <TouchableOpacity onPress={()=>{
          navigation.navigate("History")
        }}>
        <PaddedContainer>
          <BalanceContainer style={{backgroundColor: "black", borderRadius: 4, borderWidth: 2, borderColor: "#25282B", flex: 1}}>
            <Text
              style={{
                fontSize: 14,
                textTransform: "uppercase",
                color: theme.colors.ui.quaternary,
                letterSpacing: 1,
              }}
            >
              Today's booking
            </Text>
            <Spacer position="bottom" size="large" />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{ color: "white", fontSize: 35, fontWeight: "bold" }}
              >
                {todayOrders.length}
              </Text>
            </View>
          </BalanceContainer>
        </PaddedContainer>
        </TouchableOpacity>
        {/*<PaddedContainer style={{ marginTop: -90 }}>*/}
        {/*  <View*/}
        {/*    style={{ borderRadius: 30, overflow: "hidden", paddingBottom: 16 }}*/}
        {/*  >*/}
        {/*    {renderCalendar(onDayPress)}*/}
        {/*  </View>*/}
        {/*</PaddedContainer>*/}
        {/*<Spacer position="top" size="large" />*/}
        {/*{renderCalendarComp()}*/}
        {/*<Spacer position="top" size="large" />*/}
        {/*<Spacer position="top" size="large" />*/}
        {/*<PaddedContainer>*/}
        {/*  <Spacer position="top" size="large" />*/}
        {/*  <Spacer position="top" size="large" />*/}
        {/*  <LargeButton variant="primary" onPress={() => props.navigation.navigate("SetLocation")}>*/}
        {/*    <Text variant="caption" style={{ fontSize: 24, color: "white" }}>*/}
        {/*      Add new facility*/}
        {/*    </Text>*/}
        {/*    <Entypo name="chevron-right" size={24} color="white" />*/}
        {/*  </LargeButton>*/}
        {/*  /!*<LargeButton*!/*/}
        {/*  /!*  onPress={() =>*!/*/}
        {/*  /!*    props.navigation.navigate("SubscriptionPlanFacility")*!/*/}
        {/*  /!*  }*!/*/}
        {/*  /!*  variant="primary"*!/*/}
        {/*  /!*>*!/*/}
        {/*  /!*  <Text variant="caption" style={{ fontSize: 24, color: "white" }}>*!/*/}
        {/*  /!*    Manage subscription*!/*/}
        {/*  /!*  </Text>*!/*/}
        {/*  /!*  <Entypo name="chevron-right" size={24} color="white" />*!/*/}
        {/*  /!*</LargeButton>*!/*/}
        {/*  <Spacer position="bottom" size="large" />*/}
        {/*</PaddedContainer>*/}
        {/*<Spacer position="top" size="large" />*/}
        {/*/!*{renderRevenueChart()}*!/*/}
        {/*<FacilityBookingList*/}
        {/*  showModal={showBookingList}*/}
        {/*  toggleShowModal={toggleShowBookingList}*/}
        {/*  navigation={props.navigation}*/}
        {/*  date={selectedDay}*/}
        {/*/>*/}
      </Container>
    </FacilityScreenHoc>
  );
};
const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(HomeFacilityScreen);