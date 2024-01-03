import styled, { useTheme } from "styled-components/native";
import { connect, useSelector } from "react-redux";
import { AntDesign, Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import DashedLine from "react-native-dashed-line";
import { rgba } from "polished";
import React, { useEffect, useState } from "react";
import { Spacer } from "../../components/spacer/spacer.component";
import { PaddedContainer, SectionTitle } from "../components/details-screen.component";
import {
  ActionButton,
  ButtonContainer,
} from "../../components/button/process-action-button.component";
import { Text } from "../../components/typography/typography.component";
import {
  setBookingStep,
  setMeetingTime,
} from "../../redux/booking/booking.actions";
import BookingStepper from "../components/booking-stepper.component";
import { CancelButton } from "../../components/button/button.component";
import { View } from "react-native";
import { MapBooking } from "../components/map-booking.component";
import { StackActions, useRoute } from "@react-navigation/native";
import { SafeArea } from "../../components/utils/safearea.component";
import { NavBar } from "./components/nav-bar";

const Container = styled.ScrollView`
  flex: 1;
  //background-color: black;
`;

const PageContentContainer = styled.View`
  flex: 1;
  margin-bottom: 100px;
`;

const SelectionSectionContainer = styled.View`
  position: relative;
  padding: ${({ theme }) => theme.space[3]};
  background-color: ${({ theme }) => theme.colors.ui.quaternary};
  border-radius: ${({ theme }) => theme.sizes[2]};
`;

const IconContainer = styled.View`
  padding: ${({ theme }) => theme.space[2]};
  background-color: white;
  border-radius: 12px;
  border: 2px solid ${({ theme }) => "gray"};
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;

const TravelWaysContainer = styled.View`
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  padding: ${({ theme }) => theme.space[2]};
`;

const VerticalDashed = styled(DashedLine)`
  position: absolute;
  top: 20px;
  left: ${11 + 4 + 2 + 16}px;
  width: 5px;
  height: 90%;
`;

const TotalTimeContainer = styled.View`
  height: 100%;
  position: absolute;
  right: 16px;
  top: 0;
  justify-content: center;
`;

const TotalTimeChip = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: black;
  padding: ${({ theme }) => theme.space[2]};
  border-radius: ${({ theme }) => theme.sizes[2]};
`;

const RadioButtonContainer = styled.TouchableOpacity`
  padding: ${({ theme }) => theme.space[2]};
  border: 2px solid
    ${({ active, theme }) =>
      active ? theme.colors.brand.primary : rgba(theme.colors.ui.primary, 0.5)};
  border-radius: ${({ theme }) => theme.sizes[2]};
  background-color: ${({ active, theme }) =>
    active ? theme.colors.brand.primary : "white"};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: ${({ theme }) => theme.space[2]};
`;


const TravelTimeContainer = styled.View`
  flex: 1;
  align-items: center;
  background-color: #25282b;
  border: 2px solid #25282b;
`

const TravelTime = styled.View`
  flex: 1;
  min-height: 60px;
  padding: 12px;
  background-color: ${({active, theme}) => active ? theme.colors.brand.primary : "black"};
`

const MeetingTimeSelectionScreen = ({
  selectedFacility,
  navigation,
  Del,
  ...restProps
}) => {
  const route=useRoute();
  const [travelWay, setTravelWay] = useState("foot");
  const [additionalTime, setAdditionalTime] = useState(null);
  const [specialistTravelTime, setSpecialistTravelTime] = useState(null);
  const [specialistTravelDistance, setSpecialistTravelDistance] = useState(null);
  const [clientTravelTime, setClientTravelTime] = useState(null);
  const [servicetime, setserviceTime] = useState(null);

  const [clientTravelDistance, setClientTravelDistance] = useState(null);
  const [meetingTime, setMeetingTime] = useState(null)
  const[Apilocc,setApilocc]=useState([]);
  const Apiloc = useSelector(state=>state.locationn)
  useEffect(()=>{
  setserviceTime(route.params.servicee);
  },[route.params])
  useEffect(()=>{

      setApilocc(Apiloc);
  },[Apiloc])
  // setApilocc()
  console.log("OGGGGGGGGGGGGGGGGGGAPIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIILOCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",Apilocc);
  console.log("Dellllll in meetinggggggggg",route.params.Del);
  console.log("servicessssss---------------lklklkklkk------------------------------------------",servicetime);  

  useEffect(() => {
    console.log("finallll moxa sujal",restProps.selectedSpecialist)
    if (clientTravelTime && specialistTravelTime) {
      setMeetingTime(Math.ceil(Math.max(clientTravelTime, specialistTravelTime) + 5))
    }
  }, [clientTravelTime, specialistTravelTime])

  useEffect(() => {
    console.log("Asdasd",restProps)
    restProps.setMeetingTime(
      10
    );
  }, [travelWay, additionalTime]);

  useEffect(() => {
    console.log("Asdasd",restProps)
    if (!restProps.selectedSpecialist) {
      navigation.replace("normalApp");
    }
  }, [restProps.selectedSpecialist])

  useEffect(() => {
    restProps.setMeetingTime(10);
    if (!restProps.route.edit) {
      restProps.setBookingStep(1);
    }
    return () => {
      restProps.setMeetingTime(null);
    };
  }, []);

  const createRadioButton = (
    value,
    label,
    selectedValue,
    handlePress,
    icon
  ) => {
    const active = value === selectedValue;
    return (
      <>
        <RadioButtonContainer
          active={active}
          onPress={() => handlePress(value)}
        >
          {icon && (
            <Ionicons
              name={icon}
              size={20}
              color={active ? "white" : "black"}
            />
          )}
          <Spacer position="left" size="small" />
          <Text
            variant="caption"
            style={{ fontSize: 14, color: active ? "white" : "black" }}
          >
            {value} {label}
          </Text>
        </RadioButtonContainer>
        <Spacer position="left" size="medium" />
      </>
    );
  };

  const theme = useTheme();

  // if (!restProps.selectedFacility || !restProps.selectedSpecialist) {
  //   return null;
  // }

  return (
    <SafeArea>
      <NavBar title={"Time and distance"} white={true}/>
      {/*<BookingStepper pageStep={1} />*/}
      <Container showsVerticalScrollIndicator={false}>
        <PageContentContainer>
          <PaddedContainer>
            {/*<SectionTitle style={{color: "white"}}>Meeting time</SectionTitle>*/}
            <Spacer position="bottom" size="medium" />
            <Text variant="caption" numberOfLines={2} style={{fontSize: 14, fontWeight: "light", color: "black"}}>
              Please try to make it to the appointment location within
            </Text>
            <Spacer position="bottom" size="large" />
            <Spacer position="bottom" size="large" />

          </PaddedContainer>

          <View style={{ height: 325}}>
            <MapBooking
              selectedFacility={selectedFacility}
              searchLocation={restProps.searchLocation}
              specialistLocation={restProps.selectedSpecialist.location.coordinates}
              clientSetters={{distance: setClientTravelDistance, time: setClientTravelTime}}
              specialistSetters={{distance: setSpecialistTravelDistance, time: setSpecialistTravelTime}}
              order={{specialist: restProps.selectedSpecialist}}
              isClient={true}
            />
          </View>


          <Spacer position="bottom" size="large" />
          <Spacer position="bottom" size="large" />


          <PaddedContainer>

            <TravelTimeContainer>
              <View style={{flexDirection: "row", alignItems: "center"}}>
                <TravelTime active={true}>
                  <Text variant="caption" style={{color: "white", fontWeight: "light", textTransform: "uppercase",fontSize: 14, letterSpacing: 2}}>You</Text>
                  <Spacer position={"bottom"} size={"large"}/>
                  <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 8}}>
                    <Text variant="caption" style={{color: "white", fontWeight: "light", fontSize: 14, letterSpacing: 1}}>{clientTravelTime} min</Text>
                    <Entypo name="cross" size={20} color="white" />
                    <Text variant="caption" style={{color: "white", fontWeight: "light", fontSize: 14, letterSpacing: 1}}>{clientTravelDistance} km</Text>
                  </View>
                </TravelTime>
                <TravelTime>
                  <Text variant="caption" style={{color: "white", fontWeight: "light", textTransform: "uppercase", fontSize: 14, letterSpacing: 1}}>Specialist</Text>
                  <Spacer position={"bottom"} size={"large"}/>
                  <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 8}}>
                    <Text variant="caption" style={{color: "white", fontWeight: "light", fontSize: 14, letterSpacing: 1}}>{specialistTravelTime} min</Text>
                    <Entypo name="cross" size={20} color="white" />
                    <Text variant="caption" style={{color: "white", fontWeight: "light", fontSize: 14, letterSpacing: 1}}>{specialistTravelDistance} km</Text>
                  </View>
                </TravelTime>
              </View>
              <TravelTime style={{backgroundColor: "transparent", width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                <Text variant="caption" style={{color: "white", fontWeight: "light",fontSize: 14,}}>You meetup at in at most</Text>
                <Text variant="caption" style={{color: theme.colors.brand.primary, fontWeight: "bold",fontSize: 18,}}>{meetingTime} min</Text>
              </TravelTime>
            </TravelTimeContainer>

            <Spacer position="bottom" size="large"/>

            <CancelButton onPress={() => navigation.dispatch(StackActions.popToTop())} style={{...theme.shadows.default}}>
              <AntDesign name="close" size={18} color="white" />
              <Spacer position="left" size="large" />
              <Text variant="caption"
                    style={{
                      color: "white",
                      fontSize: 14,
                      textTransform: "uppercase",
                      fontWeight: "light",
                      letterSpacing: 2,
                    }}>
                Cancel booking
              </Text>
            </CancelButton>
          </PaddedContainer>
          <Spacer position="bottom" size="large" />

          {/*<SelectionSectionContainer>*/}
          {/*  <Row style={{ justifyContent: "space-between" }}>*/}
          {/*    <Row>*/}
          {/*      <Feather name="target" size={22} />*/}
          {/*      <Spacer position="left" size="medium" />*/}
          {/*      <Text*/}
          {/*        numberOfLines={2}*/}
          {/*        variant="caption"*/}
          {/*        style={{ fontSize: 16 }}*/}
          {/*      >*/}
          {/*        In total approximately*/}
          {/*      </Text>*/}
          {/*    </Row>*/}
          {/*    <RadioButtonContainer active={true}>*/}
          {/*      <Text*/}
          {/*        variant="caption"*/}
          {/*        style={{ fontSize: 14, color: "white" }}*/}
          {/*      >*/}
          {/*        45 minutes*/}
          {/*      </Text>*/}
          {/*    </RadioButtonContainer>*/}
          {/*  </Row>*/}
          {/*</SelectionSectionContainer>*/}
        </PageContentContainer>
      </Container>
      <ButtonContainer
        style={{
          backgroundColor: "white",
        }}
      >
        <ActionButton
          height={50}
          onPress={() => navigation.push("BookingReview", {servicetime,Apilocc,clientTravelTime, specialistTravelTime, clientTravelDistance, specialistTravelDistance,Del:route.params.Del?route.params.Del:false})}
        >
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            Next step
          </Text>
          <TotalTimeContainer>
            <TotalTimeChip>
              <Text variant="caption" style={{ color: "white" }}>
                {meetingTime} min
              </Text>
            </TotalTimeChip>
          </TotalTimeContainer>
        </ActionButton>
      </ButtonContainer>
    </SafeArea>
  );
};

const mapStateToProps = (state) => ({
  selectedFacility: state.booking.facility,
  selectedSpecialist: state.booking.specialist,
  selectedServices: state.booking.services,
  meetingTime: state.booking.meetingTime,
  bookingStep: state.booking.step,
  searchLocation: state.booking.searchLocation
});

const mapDispatchToProps = (dispatch) => ({
  setMeetingTime: (time) => dispatch(setMeetingTime(time)),
  setBookingStep: (step) => dispatch(setBookingStep(step)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MeetingTimeSelectionScreen);
