import { connect } from "react-redux";
import { SafeArea } from "../../components/utils/safearea.component";
import { PaddedContainer } from "../components/details-screen.component";
import { AppButton, AppButtonImage } from "./components/helpers.component";
import { Spacer } from "../../components/spacer/spacer.component";
import { Text } from "../../components/typography/typography.component";
import { NavBar } from "../normal-app/components/nav-bar";
import {NavBarWhite} from "../normal-app/components/nav-bar-white"
import { View } from "react-native";


const SelectAuthMethodScreen = (props) => {
  const renderAppButtons = () => {
    return (
      <PaddedContainer style={{marginTop: 32}}>
       <View style={{
                  height:"85%",
                  width:"100%",
                  justifyContent:"flex-end",
                  alignItems: "center",
                }}>
        <AppButton
          elevation={2}
          style={{width:"96%"}}
          onPress={() => props.navigation.navigate("signup")}
        >
          <Text variant="caption" style={{ fontSize: 14, color: "white" }}>
            Sign in with email / phone
          </Text>
        </AppButton>
        </View>
       
        {/*<Spacer position="top" size="large" />*/}
        {/*<AppButton elevation={2}>*/}
        {/*  <AppButtonImage source={require("../../assets/apple.png")} />*/}
        {/*  <Spacer position="left" size="medium" />*/}
        {/*  <Text variant="caption" style={{ fontSize: 14, color: "white"}}>*/}
        {/*    Continue with apple*/}
        {/*  </Text>*/}
        {/*</AppButton>*/}
        {/*<Spacer position="top" size="large" />*/}
        {/*<AppButton elevation={2}>*/}
        {/*  <AppButtonImage source={require("../../assets/google-color.png")} />*/}
        {/*  <Spacer position="left" size="medium" />*/}
        {/*  <Text variant="caption" style={{ fontSize: 14, color: "white" }}>*/}
        {/*    Continue with google*/}
        {/*  </Text>*/}
        {/*</AppButton>*/}
        {/*<Spacer position="top" size="large" />*/}
        {/*<AppButton elevation={2}>*/}
        {/*  <AppButtonImage source={require("../../assets/facebook-color.png")} />*/}
        {/*  <Spacer position="left" size="medium" />*/}
        {/*  <Text variant="caption" style={{ fontSize: 14, color: "white" }}>*/}
        {/*    Continue with facebook*/}
        {/*  </Text>*/}
        {/*</AppButton>*/}
      </PaddedContainer>
    );
  };

  return <SafeArea style={{backgroundColor: "#ffffff"}}>
     <NavBarWhite title={"Select auth method"}/>
    {/* <NavBar title={"Select auth method"}/> */}
    {renderAppButtons()}
  </SafeArea>;
};

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectAuthMethodScreen);
