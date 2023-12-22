// import { useContext } from "react";
// import styled, {useTheme} from 'styled-components/native'

// import { SafeArea } from "../../components/utils/safearea.component";
// import {Text} from '../../components/typography/typography.component';
// import { NavButton } from "../../components/button/button.component";
// import { Spacer } from "../../components/spacer/spacer.component";
// import { AppContext } from "../../providers/app-provider";
// import { ContainerGradient } from "../../components/background/glass-background";
// import Logo from "../../assets/Logo_C_FB.svg";
// import { View } from "react-native";
// import { LogoContainer } from "../../components/logo/logo";

// const Container = styled.View`
//   padding: 30px;
//   flex: 1;
//   justify-content: space-between;
//   background-color: transparent;
//   position: relative;
// `

// const NavButtonContainer = styled.View`
//   padding: 32px 16px;
// `


// export const CompleteScreen = (name, app, nav) =>  ({ navigation , ...restProps}) => {
//   const theme = useTheme();
//   const {changeApp} = useContext(AppContext);
//   const {currentApp} = useContext(AppContext);


//   let goBack = ''

//   if (currentApp === 'normal') {
//     goBack = "Client's side"

//   } else if (currentApp === 'host') {
//     goBack = "Host's side"

//   } else if (currentApp === 'specialist') {
//     goBack = "Specialist's side"
//   }

//   return <SafeArea style={{position: "relative"}}>
//     <ContainerGradient
//       colors={[
//         theme.colors.brand.primary,
//         theme.colors.brand.quaternary,
//       ]}
//       start={[0, 1]}
//       end={[1, 0]}
//     />
//     <Container>
//       <Text variant="caption" style={{fontSize: 32, color: "white"}}>Where to?</Text>
//       <LogoContainer>
//         <Logo width={300} height={250} fill={theme.colors.brand.secondary}/>
//         <View style={{ marginBottom: -20 }} />
//       </LogoContainer>
//     </Container>
//     <NavButtonContainer>
//       <NavButton
//         style={{ backgroundColor: theme.colors.brand.primary }}
//         onPress={() => {
//           if (currentApp === 'normal') {
//             changeApp('normal')

//           } else if (currentApp === 'host') {
//             changeApp('host')

//           } else if (currentApp === 'specialist') {
//             changeApp('specialist')
//           }
//         }}
//       >
//         <Text variant="caption" style={{ color: "white", fontSize: 16 }}>
//           &larr; {goBack}
//         </Text>
//       </NavButton>
//       <Spacer position="bottom" size="large" />
//       <NavButton
//         style={{
//           backgroundColor: theme.colors.brand.secondary,
//         }}
//         onPress={() => {
//           changeApp(app);
//         }}
//       >
//         <Text
//           variant="caption"
//           style={{ color: "white", fontSize: 16 }}
//         >
//           {name} &rarr;
//         </Text>
//       </NavButton>

//     </NavButtonContainer>
//   </SafeArea>
// }

// export const SpecialistVerificationCompletedScreen = CompleteScreen("Specialist's side", 'specialist','specialistApp')
// export const HostVerificationCompletedScreen = CompleteScreen("Host's side", 'host','facilityApp')


import { useContext } from "react";
import styled, {useTheme} from 'styled-components/native'

import { SafeArea } from "../../components/utils/safearea.component";
import {Text} from '../../components/typography/typography.component';
import { NavButton } from "../../components/button/button.component";
import { Spacer } from "../../components/spacer/spacer.component";
import { AppContext } from "../../providers/app-provider";
import { ContainerGradient } from "../../components/background/glass-background";
import Logo from "../../assets/Logo_C_FB.svg";
import { View } from "react-native";
import { LogoContainer } from "../../components/logo/logo";
import { useNavigation } from "@react-navigation/native";

const Container = styled.View`
  padding: 30px;
  flex: 1;
  justify-content: space-between;
  background-color: transparent;
  position: relative;
`

const NavButtonContainer = styled.View`
  padding: 32px 16px;
`


export const CompleteScreen = (name, app, nav) =>  ({  ...restProps}) => {
  const theme = useTheme();
  const {changeApp} = useContext(AppContext);
  const {currentApp} = useContext(AppContext);
  const navigation = useNavigation()

  let goBack = ''

  if (currentApp === 'normal') {
    goBack = "Client's side"

  } else if (currentApp === 'host') {
    goBack = "Host's side"

  } else if (currentApp === 'specialist') {
    goBack = "Specialist's side"
  }

  return <SafeArea style={{position: "relative"}}>
    <ContainerGradient
      colors={[
        theme.colors.brand.primary,
        theme.colors.brand.quaternary,
      ]}
      start={[0, 1]}
      end={[1, 0]}
    />
    <Container>
      <Text variant="caption" style={{fontSize: 32, color: "white"}}>Where to?</Text>
      <LogoContainer>
        <Logo width={300} height={250} fill={theme.colors.brand.secondary}/>
        <View style={{ marginBottom: -20 }} />
      </LogoContainer>
    </Container>
    <NavButtonContainer>
      <NavButton
        style={{ backgroundColor: theme.colors.brand.primary }}
        onPress={async() => {
          if (currentApp === 'normal') {
            await changeApp('normal')
            navigation.navigate("normalApp")

          } else if (currentApp === 'host') {
            await changeApp('host')
            console.log("navigation to host done");
            navigation.navigate('facilityApp')

          } else if (currentApp === 'specialist') {
            await changeApp('specialist')
            navigation.navigate('facilityApp')
          }
        }}
      >
        <Text variant="caption" style={{ color: "white", fontSize: 16 }}>
          &larr; {goBack}
        </Text>
      </NavButton>
      <Spacer position="bottom" size="large" />
      <NavButton
        style={{
          backgroundColor: theme.colors.brand.secondary,
        }}
        onPress={async () => {
          await changeApp(app);
          if(app=='host'){
            console.log("navigating to hostttt");
            navigation.navigate('facilityApp')
          }
          else{
            console.log("nav to spee=====");
            navigation.navigate('specialistApp')
          }
        }}
      >
        <Text
          variant="caption"
          style={{ color: "white", fontSize: 16 }}
        >
          {name} &rarr; 
        </Text>
      </NavButton>

    </NavButtonContainer>
  </SafeArea>
}

export const SpecialistVerificationCompletedScreen = CompleteScreen("Specialist's side", 'specialist','specialistApp')
export const HostVerificationCompletedScreen = CompleteScreen("Host's side", 'host','facilityApp')
