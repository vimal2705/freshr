import { connect } from "react-redux";
import styled, { useTheme } from "styled-components/native";
import { Linking, View } from "react-native";
import { Spacer } from "../../components/spacer/spacer.component";
import { Text } from "../../components/typography/typography.component";
import { SafeArea } from "../../components/utils/safearea.component";
import { SectionTitle } from "../components/details-screen.component";
import { Separator } from "../../components/helpers/helpers.component";
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import {
  LogoutButton,
  ProfileButton,
  Avatar,
  Singupbutton,
} from "../components/profile.helper.component";
import { AuthContext } from "../../providers/auth/auth.context";
import { useContext } from "react";
import { LoadingScreen } from "../loading.screen";
import { AppContext } from "../../providers/app-provider";
import { useNavigation } from "@react-navigation/native";
const Container = styled.ScrollView`
  flex: 1;
  padding: ${({ theme }) => theme.space[3]};
`;
const Header = styled.View`
  align-items: center;
`;
const ProfileScreen = (props) => {
  const navigation = useNavigation();
  const theme = useTheme();
  const { changeApp }= useContext(AppContext);
  const {isLoading, user, onLogout} = useContext(AuthContext)
  console.log("userrrr", user);
  const coverImage =
    "https://st2.depositphotos.com/1009634/7235/v/950/depositphotos_72350117-stock-illustration-no-user-profile-picture-hand.jpg";
  const name = "John doe";
  const email = "johndoe@mail.com";
  const renderHeader = () => {
    return (
      <Header>
        {/*<Spacer position="bottom" size="large" />*/}
        {/*<Avatar source={{ uri: coverImage }} />*/}
        {/*<Spacer position="bottom" size="medium" />*/}
        {/*<Text*/}
        {/*  variant="label"*/}
        {/*  style={{*/}
        {/*    fontSize: 18,*/}
        {/*    fontWeight: "bold",*/}
        {/*    color: "white,*/}
        {/*  }}*/}
        {/*>*/}
        {/*  {name}*/}
        {/*</Text>*/}
        {/*<Spacer position="bottom" size="medium" />*/}
        {/*<Text*/}
        {/*  variant="label"*/}
        {/*  style={{*/}
        {/*    fontSize: 18,*/}
        {/*    fontWeight: "bold",*/}
        {/*    color: "white,*/}
        {/*  }}*/}
        {/*>*/}
        {/*  {email}*/}
        {/*</Text>*/}
        <Spacer position="bottom" size="large" />
        <Spacer position="bottom" size="large" />
      </Header>
    );
  };
  if (isLoading) {
    return <LoadingScreen/>
  }
  const handleFeedbackPress = async () => {
    // // Specify the email address you want to send the mail to
    const emailAddress = 'sujalpatel1502@gmail.com';
    // // Create the mailto link
    const mailtoLink = `mailto:${emailAddress}`;
    // // Use Linking.openURL to open the mail client with the specified email address
    try {
      await Linking.openURL(mailtoLink);
    } catch (error) {
      console.error('Error opening mail client:', error);
    }
    console.log("hellloooooooo");
  };
  return (
    <SafeArea>
      <Container showsVerticalScrollIndicator={false}>
        {renderHeader()}
        {user.firstName == "Guest"?  <></> :
        <Spacer position="bottom" size="large" />}
           {user.firstName == "Guest"?  <></> :
       <SectionTitle variant="label" style={{color: "black"}}>Account settings</SectionTitle>}
       {user.firstName == "Guest"?  <></> :
        <Spacer position="bottom" size="large" />}
             {user.firstName == "Guest"?  <></> :
        <View>
          <ProfileButton
            onPress={() => navigation.navigate('EditUserProfileScreen')}
            icon={
              <MaterialCommunityIcons
                name="account-circle-outline"
                size={28}
                color={"black"}
              />
            }
            label="Personal information"
          />
          {/*<ProfileButton*/}
          {/*  icon={*/}
          {/*    <MaterialIcons*/}
          {/*      name="payments"*/}
          {/*      size={28}*/}
          {/*      color={"white}*/}
          {/*    />*/}
          {/*  }*/}
          {/*  label="Payment methods"*/}
          {/*/>*/}
          {/*<Separator />*/}
        </View>

}

<View>
          <ProfileButton
            onPress={() => navigation.navigate('instruction', {type: 'client'})}
            icon={
              <MaterialCommunityIcons
                name="account-circle-outline"
                size={28}
                color={"black"}
              />
            }
            label="How to use?"
          />
          {/*<ProfileButton*/}
          {/*  icon={*/}
          {/*    <MaterialIcons*/}
          {/*      name="payments"*/}
          {/*      size={28}*/}
          {/*      color={"white}*/}
          {/*    />*/}
          {/*  }*/}
          {/*  label="Payment methods"*/}
          {/*/>*/}
          {/*<Separator />*/}
        </View>
        <Spacer position="bottom" size="large" />
        <Spacer position="bottom" size="medium" />
        <Spacer position="bottom" size="large" />
       {   user.firstName == "Guest" ? <></>:<SectionTitle variant="label">Pro</SectionTitle>}
        <Spacer position="bottom" size="large" />
      {  user.firstName == "Guest"?  <Spacer position="bottom" size="small" /> :
        <View>
          {user && user.isHost && <ProfileButton
            icon={
              <AntDesign
                name="swap"
                size={28}
                color={"black"}
              />
            }
            onPress={() => {
              changeApp('host')
              navigation.navigate('facilityApp')
            }
              // props.navigation.reset({
              //   index: 0,
              //   routes: [{ name: "ProAppFacility" }],
              // })
            }
            label="Switch to host account"
          />}
          {user && !user.isHost && <ProfileButton
            icon={
              <AntDesign
                name="swap"
                size={28}
                color={"black"}
              />
            }
            onPress={() => props.navigation.navigate("HostVerification")}
            label="Become a host"
          />}
          {user && user.isSpecialist &&<ProfileButton
            icon={
              <AntDesign
                name="swap"
                size={28}
                color={"black"}
              />
            }
            onPress={() =>{
              changeApp('specialist')
              navigation.navigate('facilityApp')
              // props.navigation.reset({
              //   index: 0,
              //   routes: [{ name: "ProAppSpecialist" }],
              // })
            }
            }
            label="Switch service provider account"
          />}
          {user && !user.isSpecialist && <ProfileButton
            icon={
              <AntDesign
                name="swap"
                size={28}
                color={"black"}
              />
            }
            onPress={() => props.navigation.navigate("SpecialistVerification")}
            label="Become a specialist"
          />}
          <Separator />
        </View>
}
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
            onPress={()=>handleFeedbackPress()}
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
        <Spacer position="bottom" size="large" />
        <SectionTitle variant="label">Legal</SectionTitle>
        <Spacer position="bottom" size="large" />
        <View>
          <ProfileButton
            icon={
              <MaterialIcons
                name="chrome-reader-mode"
                size={28}
                color={"black"}
              />
            }
            label="Terms of service"
          />
          <Separator />
        </View>
        <Spacer position="bottom" size="large" />
        <Spacer position="bottom" size="large" />
    {    user.firstName == "Guest"?  <><Singupbutton 
    onPress={()=>{changeApp('normal');
    onLogout();}}> 
   <Ionicons
            name="log-in-outline"
            size={28}
            color={theme.colors.brand.secondary}
          />
    <Spacer position="left" size="medium" />  
          <Text variant="label" style={{ fontSize: 14, fontWeight: "bold", color: "white" }}>
            Sign Up
          </Text>
     </Singupbutton></> : <LogoutButton onPress ={() => {
          console.log("donee");
          changeApp('normal')
          onLogout()}}>
          <Ionicons
            name="log-in-outline"
            size={28}
            color={theme.colors.brand.secondary}
          />
          <Spacer position="left" size="medium" />
          <Text variant="label" style={{ fontSize: 14, fontWeight: "bold", color: "white" }}>
            Log out
          </Text>
        </LogoutButton>
}
<Spacer position="bottom" size="large" />
<Spacer position="bottom" size="large" />
      </Container>
    </SafeArea>
  );
};
export default connect(null, null)(ProfileScreen);