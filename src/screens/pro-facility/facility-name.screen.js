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
import { facilityCreationSetName } from "../../redux/facilityCreation/facilityCreation.actions";
import Illustration from '../../assets/SleekDoodle.svg';
import { FacilityNameForm } from "./components/forms.components";
import { FacilityScreenHoc } from "./facility-screen-hoc";

const Container = styled.View`
  flex: 1;
`;


const FacilityNameScreen = (props) => {
  const theme = useTheme();

  const renderForm = () => (
    <>
      <Spacer position="bottom" size="medium" />
      <Spacer position="bottom" size="large" />
      <PaddedContainer>
        <SectionTitle style={{color: "black"}}>Name</SectionTitle>
        <Spacer position="bottom" size="medium" />
        <Text variant="caption" style={{ lineHeight: 22, color: "black" }}>
          What is the name of your facility
        </Text>
        <Spacer position="bottom" size="medium" />
        <Spacer position="bottom" size="large" />
      </PaddedContainer>
      <FacilityNameForm
        onSubmit={(values) => {
          props.setFacilityName(values.name);
          props.navigation.navigate("SetFacilityDescription");
        }}
        onCancel={() => props.navigation.goBack()}
      />
    </>
  );
  return (
    <FacilityScreenHoc showBackButton={true}>
      <Container>
        {/*<View style={{flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: theme.colors.brand.primary}}>*/}
        {/*  /!*<Illustration width={"95%"} height={"100%"} fill={"white"}*!/*/}
        {/*  /!*              style={{color: "white", display: "flex", alignItems: "center", justifyContent: "center"}}/>*!/*/}
        {/*</View>*/}
        {renderForm()}
      </Container>
    </FacilityScreenHoc>
  );
};

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({
  setFacilityName: (name) => dispatch(facilityCreationSetName(name))
});

export default connect(mapStateToProps, mapDispatchToProps)(FacilityNameScreen);
