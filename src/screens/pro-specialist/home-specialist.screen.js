import { connect } from "react-redux";
import styled, { useTheme } from "styled-components/native";
import { AntDesign, Feather } from "@expo/vector-icons";
import { Spacer } from "../../components/spacer/spacer.component";
import { Text } from "../../components/typography/typography.component";
import { PaddedContainer } from "../components/details-screen.component";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  BackHandler,
  useWindowDimensions,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { SpecialistContext } from "../../providers/specialist.provider";
import { LoadingScreen } from "../loading.screen";
import { SpecialistScreenHoc } from "./specialist-screen-hoc";
import socketServices from "../normal-app/components/Socket";
import { AppContext } from "../../providers/app-provider";

const Container = styled.View`
  flex: 1;
  position: relative
`;

const MainSection = styled.View`
  flex: 1;
  position: relative;
  height: 400px;
`;

const MainSectionGradient = styled(LinearGradient)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const BalanceContainer = styled.View`
  flex: 1;
  padding: 16px;
`;

const ManageServiceButtonContainer = styled.TouchableOpacity`
  position: relative;
  padding: 16px;
  border-radius: 15px;
  justify-content: center;
  overflow: hidden;
`;

const GlassBackground = styled(BlurView)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 15px;
`;

const HeaderSectionContainer = styled.View`
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;
`;




const HomeSpecialistScreen = (props) => {
  const theme = useTheme();
  const layout = useWindowDimensions();
  /*
    Context provider loading information
   */
  const {isLoading, specialist, todayProfit, totalProfit, specialistServices, loadSpecialistData } = useContext(SpecialistContext)
  // console.log("specialistttttt=[=][=][=][=][=p[]=p[][p[=][]=[[]=[[]",specialistServices);

  const {onLogout} = useContext(AppContext)
//   useEffect(() => {
//     socketServices.initializeSocket();
// socketServices.on('Send_complete_code',(dataa)=>{
//       console.log("donejobbbbbbbbbb",(dataa));
//     loadSpecialistData();
//     })
//   }, [])


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
const order3="closeeeeeee";
useEffect(()=>{
  socketServices.initializeSocket();
  socketServices.on('Send_complete_payment',(dataa)=>{
    console.log("payyyyyyyyyyy",dataa);
    loadSpecialistData();
  })
  socketServices.on('Send_complete_Busy',(dataa)=>{
    console.log("finally done",dataa);
    loadSpecialistData();

    // setTimeout(()=>{
    //   try {
    //     socketServices.emit('Review_Cancel', {
    //       order3,
    //     })
    //     console.log("orderssssssssssdoneeeeeeeeeeeeeeeeeeeeee");
    //   }
    //   catch {
    //     console.log("nooooooooooooooooorderssssssssssdoneeeeeeeeeeeeeeeeeeeeee");
    //   }
    // },5000)
    
  })
},[])
  useEffect(() => {
    loadSpecialistData();
  }, [])

  console.log("loadingggggggggg", isLoading);

  if (isLoading || !specialist || !specialistServices ) {
    return <LoadingScreen/>
  }



  const renderMainSection = () => {
    return (
      <MainSection>

        <PaddedContainer>
          <Spacer position="top" size="large" />
          <Spacer position="top" size="large" />
          <HeaderSectionContainer>
            <BalanceContainer style={{backgroundColor: specialist?.isOnline ? "black" : "transparent", borderRadius: 4}}>
              <GlassBackground intensity={40} />

              <Text
                style={{
                  fontSize: 14,
                  textTransform: "uppercase",
                  color: theme.colors.ui.quaternary,
                  letterSpacing: 1,
                }}
              >
                Total profit
              </Text>
              <Spacer position="bottom" size="large" />
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{ color: "white", fontSize: 35, fontWeight: "bold" }}
                >
                  $ {totalProfit.toFixed(2)}
                </Text>
              </View>
            </BalanceContainer>
            <Spacer position="left" size="large" />
            <ManageServiceButtonContainer
              onPress={() =>
                props.navigation.navigate("SpecialistServiceManagement")
              }
              style={{backgroundColor: specialist?.isOnline ? theme.colors.brand.primary : "transparent", borderRadius: 4}}
            >
              <GlassBackground intensity={40} />
              <AntDesign name="setting" size={35} color="white" />
              <Spacer position="bottom" size="large" />
              <Text style={{ color: "white" }}>Manage services</Text>
            </ManageServiceButtonContainer>
          </HeaderSectionContainer>
        </PaddedContainer>
        <Spacer position="top" size="large"/>
        <PaddedContainer style={{flexDirection: "row"}}>
          <BalanceContainer style={{backgroundColor: specialist?.isOnline ? "black" : "transparent", borderRadius: 4, borderWidth: 2, borderColor: "#25282b"}}>

            <Text
              style={{
                fontSize: 14,
                textTransform: "uppercase",
                color: theme.colors.ui.quaternary,
                letterSpacing: 1,
              }}
            >
              Today's profit
            </Text>
            <Spacer position="bottom" size="large" />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{ color: "white", fontSize: 35, fontWeight: "bold" }}
              >
                $ {todayProfit.toFixed(2)}
              </Text>
            </View>
          </BalanceContainer>
        </PaddedContainer>
      </MainSection>
    );
  };
  console.log("specialist scrennnnnnnnnnnnnnnnnnnnnnn oggggggggggggg");

  return (
    <SpecialistScreenHoc>
      <View style={{flex: 1, backgroundColor: "black"}}>
        <MainSectionGradient
          colors={
            specialist?.isOnline
              ? [ theme.colors.brand.primary, "white", theme.colors.brand.white]
              : ["black", theme.colors.ui.primary]
          }
        />

        <Container showsVerticalScrollIndicator={false}>
          {renderMainSection()}
          {/*{renderHeader()}*/}
          {/*<Spacer position="top" size="large" />*/}
          {/*<Spacer position="top" size="large" />*/}
          {/*<Spacer position="top" size="large" />*/}
          {/*{renderTabView()}*/}
          {/*<Spacer position="top" size="large" />*/}
          {/*<PaddedContainer>{renderViewMoreButton()}</PaddedContainer>*/}
          {/*<Spacer position="top" size="large" />*/}
          {/*<Spacer position="top" size="large" />*/}
          {/*<Spacer position="top" size="large" />*/}
          {/*{renderCTAButtons()}*/}
        </Container>
        {/*<RequestModal*/}
        {/*  isVisible={showOrder}*/}
        {/*  closeRequest={() => setShowOrder(false)}*/}
        {/*/>*/}
        {/*<ProActivityModal expand={() => setShowOrder(true)} />*/}
        {/*{currentOrder &&  <Modal isVisible={true}><OrderCard order={currentOrder} key={currentOrder.id}/></Modal>}*/}
        {/*{ongoingOrder &&  <Modal isVisible={true}><OrderCard order={ongoingOrder} key={ongoingOrder.id}/></Modal>}*/}
      </View>
    </SpecialistScreenHoc>
  );
};

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeSpecialistScreen);

