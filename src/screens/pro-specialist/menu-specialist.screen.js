import styled, { useTheme } from "styled-components/native";
import { connect } from "react-redux";
import { SafeArea } from "../../components/utils/safearea.component";
import {
  HeaderContainer,
  PaddedContainer,
  PageTitle,
  SectionTitle,
} from "../components/details-screen.component";
import { Spacer } from "../../components/spacer/spacer.component";
import { View } from "react-native";
import {
  LogoutButton,
  ProfileButton,
} from "../components/profile.helper.component";
import {
  AntDesign,
  Entypo,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Separator } from "../../components/helpers/helpers.component";
import { Text } from "../../components/typography/typography.component";
import { NavButton, TopNavContainer } from "./components/top-nav.component";
import React, { useContext, useEffect, useState } from "react";
import { renderConfirmModal } from "./components/modal.component";
import { SwitchInput } from "./components/switch-component";
import { toggleBottomNavBackground } from "./utils";
import { AppContext } from "../../providers/app-provider";
import { SpecialistScreenHoc } from "./specialist-screen-hoc";
import { AuthContext } from "../../providers/auth/auth.context";
import { SpecialistContext } from "../../providers/specialist.provider";

const Container = styled.ScrollView`
  flex: 1;
`;

const MenuSpecialistScreen = (props) => {
  const theme = useTheme();

  const {changeApp} = useContext(AppContext)
  const [available, setAvailable] = useState(false);
  const [showAvailableConfirmation, setShowAvailableConfirmation] =
    useState(false);
  const [showUnavailableConfirmation, setShowUnavailableConfirmation] =
    useState(false);
  const {isLoading, user, onLogout} = useContext(AuthContext)
  const {specialist} =useContext(SpecialistContext)

  useEffect(() => {
    toggleBottomNavBackground(available, props.navigation, theme);
  }, [available]);

  const renderHeader = () => {
    return (
      <HeaderContainer>
        <Spacer position="top" size="large" />
        <PageTitle style={{color: specialist?.isOnline?"black" : specialist?.isOnline?"black" : "white"}}>Menu</PageTitle>
      </HeaderContainer>
    );
  };
  const renderButtons = () => {
    return (
      <>
        <View>
          <ProfileButton
            icon={
              <MaterialCommunityIcons
                name="account-circle-outline"
                size={28}
                color={specialist?.isOnline?"black" : specialist?.isOnline?"black" : "white"}
              />
            }
            style={{color: specialist?.isOnline?"black" : specialist?.isOnline?"black" : "white"}}
            onPress={() => props.navigation.navigate("Profile")}
            label="Personal information"
          />
          {/*<ProfileButton*/}
          {/*  icon={*/}
          {/*    <MaterialIcons*/}
          {/*      name="payments"*/}
          {/*      size={28}*/}
          {/*      color={theme.colors.ui.primary}*/}
          {/*    />*/}
          {/*  }*/}
          {/*  label="Payment methods"*/}
          {/*/>*/}
          {/*<ProfileButton*/}
          {/*  icon={*/}
          {/*    <MaterialIcons*/}
          {/*      name="payments"*/}
          {/*      size={28}*/}
          {/*      color={theme.colors.ui.primary}*/}
          {/*    />*/}
          {/*  }*/}
          {/*  label="Subscription plan"*/}
          {/*/>*/}
          <Separator />
        </View>
        <Spacer position="bottom" size="large" />
        <Spacer position="bottom" size="medium" />
        {/* <SectionTitle variant="label">Accounts</SectionTitle> */}
        <Text style={{color:specialist?.isOnline?"black" : "white",fontSize:16,fontWeight:'bold'}}>Info</Text>

        <Spacer position="bottom" size="large" />
        <View>
          <ProfileButton
            icon={
              <AntDesign
                name="swap"
                size={28}
                color={specialist?.isOnline?"black" : "white"}
              />
            }
            onPress={() =>
              changeApp('normal')
              // props.navigation.reset({
              //   index: 0,
              //   routes: [{ name: "app" }],
              // })
            }
            style={{color: specialist?.isOnline?"black" : "white"}}
            label="Switch to customer's account"
          />
          {user && user.isHost && <ProfileButton
            icon={
              <AntDesign
                name="swap"
                size={28}
                color={specialist?.isOnline?"black" : "white"}
              />
            }
            onPress={() =>
              changeApp('host')
              // props.navigation.reset({
              //   index: 0,
              //   routes: [{ name: "ProAppFacility" }],
              // })
            }
            style={{color: specialist?.isOnline?"black" : "white"}}
            label="Switch to host account"
          />}
          {user && !user.isHost && <ProfileButton
            icon={
              <AntDesign
                name="swap"
                size={28}
                color={specialist?.isOnline?"black" : "white"}
              />
            }
            style={{color: specialist?.isOnline?"black" : "white"}}
            onPress={() => props.navigation.navigate("HostVerificationSpecialist")}
            label="Become a host"
          />}
          <Separator />
        </View>
        <Spacer position="bottom" size="large" />
        <Spacer position="bottom" size="medium" />
        {/* <SectionTitle variant="label">Legal</SectionTitle> */}
        <Text style={{color:specialist?.isOnline?"black" : "white",fontSize:16,fontWeight:'bold'}}>Legal</Text>
        <Spacer position="bottom" size="large" />
        <View>
          <ProfileButton
          onPress={() =>{
            navigation.navigate("termsScreen")
          }}
            icon={
              <MaterialIcons
                name="chrome-reader-mode"
                size={28}
                color={specialist?.isOnline?"black" : "white"}
              />
            }
            style={{color: specialist?.isOnline?"black" : "white"}}
            label="Terms of service"
          />
          <Separator />
        </View>
        <Spacer position="bottom" size="large" />
        <Spacer position="bottom" size="medium" />
        {/* <SectionTitle variant="label">Info</SectionTitle> */}
        <Text style={{color:specialist?.isOnline?"black" : "white",fontSize:16,fontWeight:'bold'}}>Info</Text>

        <Spacer position="bottom" size="large" />
        <View>
          <ProfileButton
            icon={
              <Feather
                name="help-circle"
                size={24}
                color={specialist?.isOnline?"black" : "white"}
              />
            }
            style={{color: specialist?.isOnline?"black" : "white"}}
            label="Help"
          />
          <ProfileButton
            icon={
              <Entypo name="list" size={28} color={specialist?.isOnline?"black" : "white"} />
            }
            style={{color: specialist?.isOnline?"black" : "white"}}
            label="FAQ"
          />
          <Separator />
        </View>
        <Spacer position="bottom" size="large" />
        <Spacer position="bottom" size="large" />
        <LogoutButton onPress={() => {
          changeApp('normal')
          onLogout();
        }}>
          <Ionicons
            name="log-out-sharp"
            size={28}
            color={theme.colors.brand.secondary}
          />
          <Spacer position="left" size="medium" />
          <Text variant="label" style={{ fontSize: 14, fontWeight: "bold", color:"white" }}>
            Log out
          </Text>
        </LogoutButton>
        <Spacer position="bottom" size="large" />
      </>
    );
  };


  return (
    <SpecialistScreenHoc showBackButton={true}>
    
      <Container showsVerticalScrollIndicator={false}>
        {renderHeader()}
        <Spacer position="bottom" size="large" />
        <PaddedContainer>{renderButtons()}</PaddedContainer>
      </Container>
    </SpecialistScreenHoc>
  );
};

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MenuSpecialistScreen);