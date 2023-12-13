import styled, { useTheme } from "styled-components/native";
import { connect } from "react-redux";
import { SafeArea } from "../../components/utils/safearea.component";
import { Gradient } from "./components/helpers.component";
import React, { useContext, useEffect, useRef } from "react";
import { View } from "react-native";
import { PaddedContainer } from "../components/details-screen.component";
import { Spacer } from "../../components/spacer/spacer.component";
import { Text } from "../../components/typography/typography.component";
import { AuthContext } from "../../providers/auth/auth.context";
import Logo from "../../assets/Logo_C_FB.svg";
import { NavButton } from "../../components/button/button.component";
import { LogoContainer } from "../../components/logo/logo";
import { facilityCreationSetName } from "../../redux/facilityCreation/facilityCreation.actions";
import FlashMessage from "react-native-flash-message";
import { showUnimplementedModal } from "../../components/utils/unimplemented.feature";
import { useNavigation } from "@react-navigation/native";


const WelcomeScreen = (props) => {
  const navigation=useNavigation();
  const theme = useTheme();
  const flashRef = useRef();
  const { skipAuthentication,signInAsGuest ,onLoginasguest } = useContext(AuthContext);
  const SignInGuest=()=>{
    onLoginasguest()
  }

  return (
    <>
      <FlashMessage ref={flashRef} />

      <SafeArea style={{backgroundColor: "black"}}>

        <View
          style={{
            flex: 1,
            flexDirection: "column-reverse",
            position: "relative",
            backgroundColor:"#FFFFFF",
          }}
        >
          <LogoContainer>
            <Logo width={300} height={200} fill={theme.colors.brand.secondary}/>
            <View style={{ marginBottom: 50 }} />
          </LogoContainer>
          <PaddedContainer>
            <NavButton
              style={{ backgroundColor: theme.colors.brand.primary }}
              onPress={() => props.navigation.navigate("select-auth")}
            >
              <Text variant="caption" style={{ color: "white", fontSize: 14 }}>
                Sign up / sign in
              </Text>
            </NavButton>
            <Spacer position="bottom" size="large" />
            <NavButton
              style={{
                backgroundColor: theme.colors.brand.secondary,
              }}
              // onPress={skipAuthentication}
              onPress={() =>SignInGuest() }
            >
              {/*<GlassBackground />*/}
              <Text
                variant="caption"
                style={{ color: "white", fontSize: 14 }}
              >
                Proceed without
              </Text>
            </NavButton>
            <Spacer position="bottom" size="large" />
            <Spacer position="bottom" size="large" />
            <Spacer position="bottom" size="large" />
          </PaddedContainer>
        </View>
      </SafeArea>
    </>

  );
};

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeScreen);
