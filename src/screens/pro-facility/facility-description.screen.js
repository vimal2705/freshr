import { connect } from "react-redux";
import styled, { useTheme } from "styled-components/native";
import { SafeArea } from "../../components/utils/safearea.component";
import { Spacer } from "../../components/spacer/spacer.component";
import {
  PaddedContainer,
  SectionTitle,
} from "../components/details-screen.component";
import { Text } from "../../components/typography/typography.component";
import React, { useState } from "react";
import { View } from "react-native";
import { facilityCreationSetDescription } from "../../redux/facilityCreation/facilityCreation.actions";
import Illustration from "../../assets/RunningDoodle.svg";
import { FacilityDescriptionForm } from "./components/forms.components";
import { FacilityScreenHoc } from "./facility-screen-hoc";

const Container = styled.View`
  flex: 1;
`;


const FacilityDescriptionScreen = (props) => {
  const theme = useTheme();

  const renderForm = () => (
    <>
      <Spacer position="bottom" size="medium" />
      <Spacer position="bottom" size="large" />
      <PaddedContainer>
        <SectionTitle style={{color: "black"}}>Description</SectionTitle>
        <Spacer position="bottom" size="medium" />
        <Text variant="caption" style={{ lineHeight: 22, color: "black" }}>
          How do you describe your facility
        </Text>
        <Spacer position="bottom" size="medium" />
        <Spacer position="bottom" size="large" />
      </PaddedContainer>
      <FacilityDescriptionForm
        onSubmit={(values) => {
          props.setFacilityDescription(values.description)
          props.navigation.navigate("SetSeatsNumber")
        }}
        onCancel={() => props.navigation.goBack()}
      />
    </>
  );

  return (
    <FacilityScreenHoc showBackButton={true}>
      <Container>
        {/*<View style={{flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: theme.colors.brand.primary}}>*/}
        {/*  <Illustration width={"95%"} height={"100%"} fill={"white"}*/}
        {/*                style={{color: "white", display: "flex", alignItems: "center", justifyContent: "center"}}/>*/}
        {/*</View>*/}
        {renderForm()}
      </Container>
    </FacilityScreenHoc>
  );
};

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({
  setFacilityDescription: (description) => dispatch(facilityCreationSetDescription(description))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FacilityDescriptionScreen);
