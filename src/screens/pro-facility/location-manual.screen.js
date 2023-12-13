import styled, {useTheme} from "styled-components/native";
import { connect } from "react-redux";

import {
  Footer, FooterRow,
  HeaderContainer,
  PaddedContainer,
  PageTitle,
} from "../components/details-screen.component";
import { Spacer } from "../../components/spacer/spacer.component";
import React, { useState } from "react";
import { TextInput } from "react-native-paper";
import { View } from "react-native";
import { Formik } from 'formik';
import * as yup from "yup";
import { Separator } from "../../components/helpers/helpers.component";
import { ModalButton } from "../../components/button/button.component";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { Text } from "../../components/typography/typography.component";
import { facilityCreationSetAddress } from "../../redux/facilityCreation/facilityCreation.actions";
import { ErrorContainer, renderError } from "./components/pro-facility-form-helper";


const Container = styled.View`
  flex: 1;
  background-color: black;
`;

export const FormInput = styled(TextInput).attrs((props) => ({
  mode: "outlined",
  color: 'black',
  multiline: false,
  textAlign: { undefined },
  theme: {
    colors:
      { primary: props.theme.colors.brand.primary,
        text: 'black',
        placeholder: 'black',
        underlineColor: props.theme.colors.brand.primary
      }
  }
}))`
  width: 100%;
  font-size: 14px;
  background-color: white;
  font-weight: bold;
`;

const LocationManualScreen = ({ initValue, close, coords, setFacilityLocation, navigation}) => {
  const theme = useTheme();

  const renderHeader = () => {
    return (
      <HeaderContainer style={{backgroundColor: "white"}}>
        <Spacer position="top" size="large" />
        <Spacer position="top" size="large" />
        <PageTitle style={{color: "black"}}>Address</PageTitle>
      </HeaderContainer>
    );
  };

  const renderForm = () => {
    return (
      <View style={{flex: 1, backgroundColor: theme.colors.brand.white}}>
        <Formik
          initialValues={{
            address: initValue.address1,
            city: initValue.locality,
            state: initValue.state,
            aptSuite: '',
            country: initValue.country,
            postcode: initValue.postcode,
          }}
          validationSchema={yup.object().shape({
            address: yup.string().required('Address must have a street'),
            city: yup.string().required('City must be provided'),
            aptSuite: yup.string(),
            state: yup.string(),
            postcode: yup.string().required('Post code must be provided'),
            country: yup.string().required('country must be provided'),
          })}
          onSubmit={values => {
            console.log('trying to update it');
            setFacilityLocation({ ...values, coords})
            navigation.navigate("SetFacilityName")
          }}
          style={{flex: 1}}
        >
          {({ handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched }) => (
            <View style={{flex: 1}}>
              <PaddedContainer style={{flex: 1}}>
                <FormInput
                  value={values.address}
                  label="Street"
                  onBlur={handleBlur('address')}
                  numberOfLines={1}
                  style={{backgroundColor: 'white', color: 'black'}}
                  color={'black'}
                  underlineColor={theme.colors.brand.primary}
                  onChangeText={handleChange('address')}
                />
                {touched.address && errors.address && renderError(errors.address)}
                <Spacer position="bottom" size="large" />
                <FormInput
                  value={values.aptSuite}
                  label="Apartment, suite, (optional)"
                  onBlur={handleBlur('aptSuite')}
                  numberOfLines={1}
                  style={{backgroundColor: 'white', color: 'black'}}
                  color={'black'}
                  underlineColor={theme.colors.brand.primary}
                  onChangeText={handleChange('aptSuite')}
                />
                {touched.aptSuite && errors.aptSuite && renderError(errors.aptSuite)}
                <Spacer position="bottom" size="large" />
                <FormInput
                  value={values.city}
                  label="City"
                  onBlur={handleBlur('city')}
                  numberOfLines={1}
                  style={{backgroundColor: 'white', color: 'black'}}
                  color={'black'}
                  underlineColor={theme.colors.brand.primary}
                  onChangeText={handleChange('city')}
                />
                {touched.city && errors.city && renderError(errors.city)}
                <Spacer position="bottom" size="large" />
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{flex: 1}}>
                    <FormInput
                      value={values.state}
                      label="State/Province"
                      onBlur={handleBlur('state')}
                      numberOfLines={1}
                      style={{backgroundColor: 'white', color: 'black'}}
                      color={'black'}
                      underlineColor={theme.colors.brand.primary}
                      onChangeText={handleChange('state')}
                    />
                    {touched.state && errors.state && renderError(errors.state)}
                  </View>
                  <Spacer position="left" size="medium" />
                  <View style={{flex: 1}}>
                    <FormInput
                      value={values.postcode}
                      label="Postal code"
                      onBlur={handleBlur('postcode')}
                      numberOfLines={1}
                      style={{backgroundColor: 'white', color: 'black'}}
                      color={'black'}
                      underlineColor={theme.colors.brand.primary}
                      onChangeText={handleChange('postcode')}
                    />
                    {touched.postcode && errors.postcode && renderError(errors.postcode)}
                  </View>
                </View>
                <Spacer position="bottom" size="large" />
                <FormInput
                  value={values.country}
                  label="Country/Region"
                  onBlur={handleBlur('country')}
                  numberOfLines={1}
                  style={{backgroundColor: 'white', color: 'black'}}
                  color={'black'}
                  underlineColor={theme.colors.brand.primary}
                  onChangeText={handleChange('country')}
                />
                {touched.country && errors.country && renderError(errors.country)}
              </PaddedContainer>
              <Footer style={{backgroundColor: "white"}}>
                <Separator />
                <FooterRow style={{backgroundColor: theme.colors.brand.white}}>
                  <ModalButton onPress={() => close()} style={{backgroundColor: "white"}}>
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
            </View>
           )}
        </Formik>
      </View>
    );
  };
  return (
    <View style={{flex: 1}}>
      <Container>
        {renderHeader()}
        {renderForm()}
      </Container>
    </View>
  );
};

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({
  setFacilityLocation: (location) => dispatch(facilityCreationSetAddress(location))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LocationManualScreen);
