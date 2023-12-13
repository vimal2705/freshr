import styled from "styled-components/native";
import { rgba } from "polished";
import { Text } from "../typography/typography.component";
import { Spacer } from "../spacer/spacer.component";
import { Fontisto } from "@expo/vector-icons";
import { Entypo } from '@expo/vector-icons';
import { View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect } from "react";


export const PageContainer = styled.View`
  flex: 1;
  background-color: #fafafa;
`;

export const Content = styled.View`
  padding: 0px 18px;
`;

export const Row = styled.View`
  flex-direction: row;
  width: 100%;
  align-items: center;
`;

export const Separator = styled.View`
  height: 1px;
  background-color: ${({ theme }) => rgba("white", 0.1)};
`;


export const GenderCard = styled.TouchableOpacity`
  padding: 16px;
  flex: 1;
  background-color: ${({active, theme}) => active ? theme.colors.brand.primary : '#25282b'};
  align-items: center;
  justify-content: center;
`

export const GenderCardSelectorContainer  = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

export const renderGenderForm = (newGender, setNewGender, isform) => {


 
  
  const setGenderStorage=async(data)=>{
    console.log("mnppp", data);
    if(data=="all"){
      setNewGender("both")
    }
    else{
      setNewGender(data)
    }
  try {
    await AsyncStorage.setItem(
      "gender",
      data
    )
  } catch (error) {
    console.log("erorrrrrrrrrrrr",error);
  }
  }
  return (
    <GenderCardSelectorContainer>
      <GenderCard key="male" active={newGender === 'male'} onPress={() => setGenderStorage('male')}>
        <Text
          variant="label"
          style={{
            fontSize: 14,
            fontWeight: "bold",
            color: "white",
          }}
        >
         {isform == "specialist"? "Barber" :" Barber Shop"}
        </Text>
        <Spacer position="bottom" size="large" />
        {/* <Fontisto
          name={"male"}
          size={60}
          color={newGender === 'male' ? "white" : "black"}
        /> */}
  <Fontisto name="male"  size={60} color={newGender === 'male' ? "white" : "black"} />
      </GenderCard>
      <GenderCard key="female" active={newGender === 'both'} onPress={() => setGenderStorage('all')}>
        <Text
          variant="label"
          style={{
            fontSize: 14,
            fontWeight: "bold",
            color: "white",
          }}
        >
          Both
        </Text>
        <Spacer position="bottom" size="large" />

        {/* <Fontisto
          name={"female"}
          size={60}
          color={newGender === 'female' ? "white" : "black"}
        /> */}
        <View style={{flexDirection:"row"}}>
        <Fontisto name="female" size={30} color={newGender === 'all' ? "white" : "black"} />
     
        <Fontisto name="male"  size={30} color={newGender === 'all' ? "white" : "black"} />
        </View>

      </GenderCard>
      <GenderCard key="female" active={newGender === 'female'} onPress={() => setGenderStorage('female')}>
        <Text
          variant="label"
          style={{
            fontSize: 14,
            fontWeight: "bold",
            color: "white",
          }}
        >
           {isform == "specialist"? "Hairdresser" :"Salon"} 
        </Text>
        <Spacer position="bottom" size="large" />
        {/* <Fontisto
          name={"female"}
          size={60}
          color={newGender === 'female' ? "white" : "black"}
        /> */}
        <Fontisto name="female"  size={60} color={newGender === 'female' ? "white" : "black"} />
      </GenderCard>
    </GenderCardSelectorContainer>
  )
}

export default renderGenderForm
