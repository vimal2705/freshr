import styled, { useTheme } from "styled-components/native";
import { connect } from "react-redux";
import { Formik } from "formik";

import { SafeArea } from "../../components/utils/safearea.component";
import React, { useContext, useRef, useState } from "react";
import { Spacer } from "../../components/spacer/spacer.component";
import { Text } from "../../components/typography/typography.component";
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from "react-native";
import { ActionButton } from "./components/helpers.component";
import { TextInput } from "react-native-paper";
import * as yup from "yup";
import {
  renderAuthFormFooter,
  renderAuthFormNav,
  renderEmailInput,
  renderNameInput,
  renderLNameInput,
  renderPasswordInput,
} from "./components/form.component";
import { AuthContext } from "../../providers/auth/auth.context";
import { MessageBox } from "../../components/MessageBox/message-box.component";
import { LoadingScreen } from "../loading.screen";
import FlashMessage from "react-native-flash-message";

const Container = styled.View`
  flex: 1;
  background-color: white;
  position: relative;
`;

export const FormInput = styled(TextInput).attrs((props) => ({
  mode: "outlined",
  color: 'black',
  numberOfLines: 1,
  textAlign: { undefined },
  theme: {
    colors:
    {
      primary: props.theme.colors.brand.primary,
      text: 'black',
      placeholder: 'gray',
      underlineColor: props.theme.colors.brand.primary
    }
  }
}))`
  width: 100%;
  font-size: 14px;
  background-color: white;
  height: 50px;
  font-weight: bold;
`;
const SignUpScreen = (props) => {
  const flashRef = useRef();
  const theme = useTheme();
  const { onRegister, error, isLoading, skipAuthentication } =
    useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  if (isLoading) {
    return <LoadingScreen />;
  }

  const renderForm = () => {
    return (
      <View
        style={{
          position: "relative",
          flex: 1,
          backgroundColor: "white",
        }}
      >
        <ScrollView style={{ paddingHorizontal: 20 }}>
          <Spacer position="top" size="large" />
          <Spacer position="top" size="large" />
          <Spacer position="top" size="large" />
          <Text variant="caption" style={{ fontSize: 26 }}>
            Create an Account
          </Text>
         
         
          <Spacer position="top" size="large" />
          {/*{error && <MessageBox message={error.message} status="failure" />}*/}

          <Spacer position="top" size="large" />
          <Spacer position="top" size="large" />
          <Formik
            initialValues={{
              email: "",
              firstName:"",
              lastName:"",
              password: "",
              confirmPassword: "",
            }}
            onSubmit={(values) => {
              console.log("EXECUTEDDDDDDDDDDD");
              console.log(JSON.stringify(values));

              onRegister(values);
            }}
            validationSchema={yup.object().shape({
              email: yup.string().email().required(),
          firstName: yup
              .string()
              .matches(/^[a-zA-Z\s-]+$/, 'Invalid first name. Only letters, spaces, and hyphens are allowed.')
              .required('First name is required'),
              lastName: yup .string()
              .matches(/^[a-zA-Z\s-]+$/, 'Invalid first name. Only letters, spaces, and hyphens are allowed.')
              .required('Last name is required'),
       
              password: yup
                .string()
                .min(6)
                .max(10, "Password should not exceed 10 chars.")
                .required(),
              confirmPassword: yup
                .string()
                .required("Please confirm your password")
                .oneOf([yup.ref("password"), null], "Passwords must match"),
            })}
          >
            {({
              values,
              handleChange,
              errors,
              setFieldTouched,
              touched,
              isValid,
              handleSubmit,
            }) => (
              
              <View>
                
                
                {renderNameInput({
                  values,
                  handleChange,
                  errors,
                  setFieldTouched,
                  touched,
                  theme,
                  value: "firstName",
                  message: "FirstName",
                })}
                      <Spacer position="bottom" size="large" />
                      {renderLNameInput({
                  values,
                  handleChange,
                  errors,
                  setFieldTouched,
                  touched,
                  theme,
                  value: "LastName",
                  message: "LastName",
                })}
                <Spacer position="bottom" size="large" />
                {renderEmailInput({
                  values,
                  handleChange,
                  errors,
                  setFieldTouched,
                  touched,
                  theme,
                })}
                      <Spacer position="bottom" size="large" />
                {renderPasswordInput({
                  values,
                  handleChange,
                  errors,
                  setFieldTouched,
                  touched,
                  showPassword,
                  setShowPassword,
                  theme,
                  value: "password",
                  message: "Please enter password",
                })}
                <Spacer position="bottom" size="large" />
                {renderPasswordInput({
                  values,
                  handleChange,
                  errors,
                  setFieldTouched,
                  touched,
                  showPassword: showConfirmPassword,
                  setShowPassword: setShowConfirmPassword,
                  theme,
                  value: "confirmPassword",
                  message: "Please confirm password",
                })}
                {/* <Spacer position="bottom" size="large" />
                <Spacer position="bottom" size="large" />
                <Spacer position="top" size="large" />
                <Spacer position="top" size="large" /> */}
                <View
                  style={{
                    alignItems: "center",
                  }}
                >
                  <View style={{}}>
          {renderAuthFormFooter({
            message: "Already have an account",
            messageLink: "Sign in here",
            navigation: props.navigation,
            navigationLink: "signin",
            theme,
          })}
        </View>
                  
                  <ActionButton onPress={(e) => handleSubmit(e)}>
                    <Text style={{ color: "white", fontSize: 16 }}>
                      create account
                    </Text>
                  </ActionButton>
                </View>
              </View>
            )}
          </Formik>
          <Spacer position="top" size="large" />
        </ScrollView >
        {/* <View style={{ flex: 1, justifyContent: "flex-end" }}>
          {renderAuthFormFooter({
            message: "Already have an account",
            messageLink: "Sign in here",
            navigation: props.navigation,
            navigationLink: "signin",
            theme,
          })}
        </View> */}
      </View>
    );
  };

  return (
    <>
      <FlashMessage ref={flashRef} />

      <SafeArea>
        <Container>
          {renderAuthFormNav({
            navigation: props.navigation,
            skipAuthentication,
            theme,
          })}
          {renderForm()}
        </Container>
      </SafeArea>
    </>
  );
};

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(SignUpScreen);
