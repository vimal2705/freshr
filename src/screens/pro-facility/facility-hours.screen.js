import { connect } from "react-redux";
import styled, { useTheme } from "styled-components/native";
import DateTimePicker from "@react-native-community/datetimepicker";

import { SafeArea } from "../../components/utils/safearea.component";
import {
  Footer,
  FooterRow,
  PaddedContainer,
  SectionTitle,
} from "../components/details-screen.component";
import { Spacer } from "../../components/spacer/spacer.component";
import { Text } from "../../components/typography/typography.component";
import React, { useEffect, useState } from "react";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { Row, Separator } from "../../components/helpers/helpers.component";
import { HourButton, renderHourButtons, renderTime } from "./components/time-view.helper";
import { rgba } from "polished";
import { facilityCreationSetWorkingHours } from "../../redux/facilityCreation/facilityCreation.actions";
import { ModalButton } from "../../components/button/button.component";
import moment from "moment";
import { renderError } from "./components/pro-facility-form-helper";

const Container = styled.View`
  flex: 1;
`;

const Content = styled.View`
  flex: 1;
`;

const FacilityHoursScreen = (props) => {
  const theme = useTheme();
  const [openingHour, setOpeningHour] = useState(new Date());
  const [closingHour, setClosingHour] = useState(new Date());
  const [showOpeningPicker, setShowOpeningPicker] = useState(false);
  const [showClosingPicker, setShowClosingPicker] = useState(false);
  const [error, setError] = useState(null);

  const updateOpeningHour = (e, selectedValue) => {
    if (selectedValue) {
      setOpeningHour(selectedValue);
    }
    setShowOpeningPicker(!showOpeningPicker);
  };

  const updateClosingHour = (e, selectedValue) => {
    if (selectedValue) {
      setClosingHour(selectedValue);
    }
    setShowClosingPicker(!showClosingPicker);
  };

  const handleSubmit = () => {
    if (moment(openingHour).isAfter(moment(closingHour)) ) {
      setError("Opening can't be after closing time")
    } else if (moment(closingHour).subtract(1, 'h').isBefore(moment(openingHour))) {
      setError("Must be opened for at least an hour");
    } else {
      props.setWorkingHours({openingTime: openingHour, closingTime: closingHour});
      props.navigation.navigate("createFacility");
    }
  }

  useEffect(() => {
      if (moment(openingHour).isAfter(moment(closingHour))) {
        setError("Opening can't be after closing time")
      } else {
        setError("")
      }
    }, [closingHour, openingHour])

  const renderHeader = () => {
    return (
      <>
        <SectionTitle style={{color: "black"}}>Opening hours</SectionTitle>
        <Spacer position="bottom" size="medium" />
        <Text variant="caption" style={{ lineHeight: 22, color: "black" }}>
          At what time is your facility operational
        </Text>
      </>
    );
  };

  const renderTimePicker = (value, updateValue, min = false) => {
    return (
      <DateTimePicker
        testID="dateTimePicker"
        value={value}
        mode="time"
        is24Hour={false}
        onChange={updateValue}
        minimumDate={min ? openingHour : null}
      />
    );
  };

  return (
    <SafeArea>
      <Container>
        {/*<View style={{flex: 0.8, alignItems: "center", justifyContent: "center", backgroundColor: theme.colors.brand.primary}}>*/}
        {/*  <Illustration width={400} height={250} fill={"white"}*/}
        {/*                style={{color: "white", display: "flex", alignItems: "center", justifyContent: "center"}}/>*/}
        {/*</View>*/}
        <Content>
          <PaddedContainer>
            <Spacer position="bottom" size="large" />
            <Spacer position="bottom" size="large" />

            {renderHeader()}
            <Spacer position="bottom" size="large" />
            <Spacer position="bottom" size="large" />
            {!!error && renderError(error)}
            <Spacer position="bottom" size="medium"/>
            {renderHourButtons(openingHour, closingHour, () => setShowOpeningPicker(!showOpeningPicker), () => setShowClosingPicker(!showClosingPicker), theme)}
            {showOpeningPicker &&
              renderTimePicker(openingHour, updateOpeningHour)}
            {showClosingPicker &&
              renderTimePicker(closingHour, updateClosingHour, true)}
            <Spacer position="bottom" size="large" />
            <Spacer position="bottom" size="large" />
          </PaddedContainer>
        </Content>
      </Container>
      <Footer style={{backgroundColor: "white"}}>
        <Separator />
        <FooterRow style={{backgroundColor: theme.colors.brand.white}}>
          <ModalButton onPress={() => props.navigation.goBack()} style={{backgroundColor: "white"}}>
            <AntDesign name="arrowleft" size={16} color="black" />
            <Spacer position="left" size="small" />
            <Text style={{color: "black"}}>Cancel</Text>
          </ModalButton>
          <ModalButton
            variant="primary"
            style={{backgroundColor: theme.colors.brand.secondary}}
            onPress={handleSubmit}
          >
            <Text style={{ color: "white" }}> proceed</Text>
            <Spacer position="left" size="small" />
            <AntDesign name="arrowright" size={16} color="white" />
          </ModalButton>
        </FooterRow>
      </Footer>
    </SafeArea>
  );
};

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({
  setWorkingHours: ({openingTime, closingTime}) => dispatch(facilityCreationSetWorkingHours({openingTime, closingTime}))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FacilityHoursScreen);
