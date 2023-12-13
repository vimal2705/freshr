import { SliderBox } from "react-native-image-slider-box";

import styled, { useTheme } from "styled-components/native";
import { SliderContainer } from "./details-screen.component";
import { Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { IconButton } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import React, { useContext } from "react";
import { SpecialistContext } from "../../providers/specialist.provider";

const { height } = Dimensions.get("window");

export const BackButtonContainer = styled.TouchableOpacity`
  position: absolute;
  top: 12px;
  left: 12px;
  width: 40px;
  height: 40px;
  background-color: white;
  border-radius: 100px;
  align-items: center;
  justify-content: center;
  z-index: 100;
  border: 2px solid #25282b; 
`;

export const Gallery = ({ setsaloonspec,setnewspecid,images, darkTheme=false}) => {
  const theme = useTheme();
  const navigation = useNavigation();
const {setSpecialistidd} =useContext(SpecialistContext)

  const goBackk=()=>{
    navigation.goBack();
    if(setnewspecid){
      setnewspecid(null);
    setSpecialistidd(null);
    }
    if(setsaloonspec){
      setsaloonspec(null);
      setSpecialistidd(null);
    }
    
  }
console.log("photos****", images);
  return (
    <SliderContainer style={{ position: "relative", backgroundColor: darkTheme ? "black" : 'transparent'  }}>
      <BackButtonContainer onPress={() => goBackk() } elevation={2} style={{backgroundColor: 'black'}}>
        <Ionicons name="arrow-back" size={20} color={'white'} />
      </BackButtonContainer>
      {
        images !== null 
        ?
        <SliderBox
        images={images}
        sliderBoxHeight={height * 0.3}
        dotColor={theme.colors.brand.primary}
        paginationBoxVerticalPadding={20}
        autoplay
        // style={{
        //   backgroundColor: darkTheme ? "black" : 'white'
        // }}
        // containerStyle={{
        //   backgroundColor: darkTheme ? "black" : 'white'
        // }}
        circleLoop
        resizeMethod={"resize"}
        resizeMode={"cover"}
        paginationBoxStyle={{
          position: "absolute",
          bottom: 0,
          padding: 0,
          alignItems: "center",
          alignSelf: "center",
          justifyContent: "center",
          paddingVertical: 10,
        }}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 0,
          padding: 0,
          margin: 0,
          backgroundColor: "rgba(128, 128, 128, 0.92)",
        }}
        ImageComponentStyle={{
          borderRadius: 15,
          width: "97%",
          marginTop: 5,
          backgroundColor: darkTheme ? "black" : 'white'
        }}
        imageLoadingColor="#2196F3"
      />
        :
        <>
        </>
      }
     
    </SliderContainer>
  );
};
