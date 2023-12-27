import { connect } from "react-redux";
import styled, {useTheme} from "styled-components/native";
import { SafeArea } from "../../components/utils/safearea.component";
import {
  HeaderContainer,
  PaddedContainer,
  PageTitle,
  SectionTitle,
} from "../components/details-screen.component";
import { Spacer } from "../../components/spacer/spacer.component";
import { Linking, View } from "react-native";
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
import React, { useContext } from "react";
import { AppContext } from "../../providers/app-provider";
import { AuthContext } from "../../providers/auth/auth.context";
import { useNavigation } from "@react-navigation/native";
import { FacilityScreenHoc } from "./facility-screen-hoc";

const Container = styled.ScrollView`
  flex: 1;
`;

const FacilityMenuScreen = (props) => {
  const navigation = useNavigation();
  const {changeApp} = useContext(AppContext)
  const theme = useTheme();
  const {isLoading, user, onLogout} = useContext(AuthContext)
  const handleFeedbackPress = async () => {
    const feedbackFormUrl = 'https://forms.gle/Trh7EeJgAhE3roiX8';
  
    try {
      await Linking.openURL(feedbackFormUrl);
    } catch (error) {
      console.error('Error opening URL:', error);
    }
  };
  const handleSupportPress = async () => {

    const emailAddress = 'support.fac@freshr.me';
    
    const mailtoLink = `mailto:${emailAddress}`;
    
    try {
      await Linking.openURL(mailtoLink);
    } catch (error) {
      console.error('Error opening mail client:', error);
    }
    console.log("hellloooooooo");
  };

  const renderHeader = () => {
    return (
      <HeaderContainer>
        <Spacer position="top" size="large" />
        <Spacer position="top" size="large" />
        <PageTitle style={{color: "black"}}>Menu</PageTitle>
      </HeaderContainer>
    );
  };

  const renderButtons = () => {
    return (
      <>
        <View>
          <ProfileButton
            onPress={() => navigation.navigate('EditUserProfileScreenHost')}
            icon={
              <MaterialCommunityIcons
                name="account-circle-outline"
                size={28}
                color="black"
              />
            }
            label="Personal information"
          />
          <ProfileButton
            onPress={() => navigation.navigate('instruction', {type: 'host', back: true, shouldGoBack: true})}
            icon={
              <MaterialCommunityIcons
                name="video-box"
                size={28}
                color="black"
              />
            }
            label="Tutorial"
          />
          <Separator />
        </View>
        <Spacer position="bottom" size="large" />
        <Spacer position="bottom" size="medium" />
        <SectionTitle variant="label">Accounts</SectionTitle>
        <Spacer position="bottom" size="large" />
        <View>
          <ProfileButton
            icon={<AntDesign name="swap" size={28} color="black" />}
            onPress={async () =>{
              await changeApp('normal')
               navigation.navigate('normalApp')
            } 
              // props.navigation.reset({
              //   index: 0,
              //   routes: [{ name: "ProAppFacility" }],
              // })
            }
            label="Switch to customer's account"
          />
          {user && user.isSpecialist &&<ProfileButton
            icon={
              <AntDesign
                name="swap"
                size={28}
                color={theme.colors.brand.primary}
              />
            }
            onPress={async () =>{
              await changeApp('specialist')
              navigation.navigate('specialistApp')
              // props.navigation.reset({
              //   index: 0,
              //   routes: [{ name: "ProAppSpecialist" }],
              // })
            }
            }
            label="Switch to service provider account"
          />}
          {user && !user.isSpecialist && <ProfileButton
            icon={
              <AntDesign
                name="swap"
                size={28}
                color={theme.colors.ui.primary}
              />
            }
            onPress={() => props.navigation.navigate("SpecialistVerificationHost")}
            label="specialist"
          />}
          <Separator />
        </View>
        <Spacer position="bottom" size="large" />
        <Spacer position="bottom" size="medium" />
        <SectionTitle variant="label">Support</SectionTitle>
        <Spacer position="bottom" size="large" />
        <ProfileButton
            icon={
              <AntDesign
                name="customerservice"
                size={28}
                color={"black"}
              />
            }
            onPress={()=>handleSupportPress()}
            label="Support"
          />
        <ProfileButton
            icon={
              <MaterialIcons
                name="feedback"
                size={28}
                color={"black"}
              />
            }
            onPress={()=>handleFeedbackPress()}
            label="Feedback"
          />
        <Spacer position="bottom" size="large" />
        <Spacer position="bottom" size="medium" />
        <Spacer position="bottom" size="large" />
        <Spacer position="bottom" size="medium" />
        <SectionTitle variant="label">Legal</SectionTitle>
        <Spacer position="bottom" size="large" />
        <View>
          <ProfileButton
            icon={
              <MaterialIcons
                name="chrome-reader-mode"
                size={28}
                color="black"
              />
            }
            label="Terms of service"
          />
          <Separator />
        </View>
        <Spacer position="bottom" size="large" />
        <Spacer position="bottom" size="medium" />
        <SectionTitle variant="label">Info</SectionTitle>
        <Spacer position="bottom" size="large" />
        <View>
          <ProfileButton
            icon={<Feather name="help-circle" size={24} color="black" />}
            label="Help"
          />
          <ProfileButton
            icon={<Entypo name="list" size={28} color="black" />}
            label="FAQ"
          />
          <Separator />
        </View>
        <Spacer position="bottom" size="large" />
        <Spacer position="bottom" size="large" />
        <LogoutButton onPress={() => {changeApp('normal')
          onLogout()}}>
          <Ionicons name="log-out-sharp" size={28} color={theme.colors.brand.secondary} />
          <Spacer position="left" size="medium" />
          <Text variant="label" style={{ fontSize: 14, fontWeight: "bold", color: "white" }}>
            Log out
          </Text>
        </LogoutButton>
        <Spacer position="bottom" size="large" />
      </>
    );
  };

  return (
    <FacilityScreenHoc showBackButton={true}>
      <Container showsVerticalScrollIndicator={false}>
        {renderHeader()}
        <Spacer position="bottom" size="large" />
        <PaddedContainer>{renderButtons()}</PaddedContainer>
      </Container>
    </FacilityScreenHoc>
  );
};

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(FacilityMenuScreen);
