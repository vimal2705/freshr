import React, { useState } from "react";
import { connect } from "react-redux";
import styled, { useTheme } from "styled-components/native";

import { SafeArea } from "../../components/utils/safearea.component";
import { facilityCreationSetSeatCapacity } from "../../redux/facilityCreation/facilityCreation.actions";
import Illustration from "../../assets/RollerSkatingDoodle.svg";
import { View } from "react-native";
import { SeatCapacityForm } from "./components/forms.components";
import { PaddedContainer, SectionTitle } from "../components/details-screen.component";
import { Spacer } from "../../components/spacer/spacer.component";
import { Text } from "../../components/typography/typography.component";
import { FacilityScreenHoc } from "./facility-screen-hoc";

const Container = styled.View`
  flex: 1;
`;


const SeatsFacilityScreen = (props) => {
  const theme = useTheme();


  const renderForm = () => {
    return (
      <>
        <Spacer position="bottom" size="medium" />
        <Spacer position="bottom" size="large" />
        <Spacer position="bottom" size="large" />
        <Spacer position="bottom" size="large" />
        <PaddedContainer>
          <SectionTitle style={{color: "black"}}>Set seats number</SectionTitle>
          <Spacer position="bottom" size="medium" />
          <Text variant="caption" style={{ lineHeight: 22, color: "black" }}>
            How many seats do you want to make available here
          </Text>
        </PaddedContainer>
        <Spacer position="bottom" size="large" />
        <SeatCapacityForm
          onSubmit={(values) => {
            props.setFacilitySeatCapacity(values.seats);
            props.navigation.navigate("CreateGalleryFacility")
          }}
          onCancel={() => props.navigation.goBack()}
        />
      </>
    )
  }

  return (
    <FacilityScreenHoc showBackButton={true}>
      <Container>
        {/*<View style={{flex: 0.8, alignItems: "center", justifyContent: "center", backgroundColor: theme.colors.brand.primary}}>*/}
        {/*  <Illustration width={400} height={250} fill={"white"}*/}
        {/*                style={{color: "white", display: "flex", alignItems: "center", justifyContent: "center"}}/>*/}
        {/*</View>*/}
        {renderForm()}
      </Container>
    </FacilityScreenHoc>
  );
};

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({
  setFacilitySeatCapacity: (capacity) => dispatch(facilityCreationSetSeatCapacity(capacity))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SeatsFacilityScreen);
