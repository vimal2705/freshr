import styled, { useTheme } from "styled-components/native";
import { TouchableOpacity, View } from "react-native";
import { rgba } from "polished";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";

import { Text } from "../../components/typography/typography.component";
import { Spacer } from "../../components/spacer/spacer.component";
import { setSpecialist } from "../../redux/booking/booking.actions";
import { ReviewContext } from "../../providers/review.provider";

const Wrapper = styled.TouchableOpacity`
  background-color: ${({darkTheme}) => darkTheme ? "#25282b" : "white"};
  border: 2px solid ${({active, theme}) => active ? theme.colors.brand.secondary : "transparent"};
  border-radius: 8px;
  margin: 10px 0;
  position: relative;
  padding: 0 0;
  overflow: hidden;
`;
const SpecialistCardContainer = styled.View`
  flex-direction: row;
  align-items: center;
  position: relative;
  max-height: 110px;
  //background-color: white;
  padding: 0;
  overflow: hidden;
`;

const SpecialistCardImage = styled.ImageBackground.attrs((props) => ({
  resizeMode: "cover",
}))`
  height: 110px;
  width: 95px;
  overflow: hidden;
`;

const ImageContent = styled.View`
  flex: 1;
  border-radius: 10px;
  background-color: ${rgba("black", 0.3)};
`;

const SpecialistCardInfoContainer = styled.View`
  justify-content: center;
  flex: 1;
  height: 100%;
  padding: ${({ theme }) => theme.space[2]} 8px;
`;

const Title = styled(Text)`
  font-size: 13px;
  color: black;
`;

const RatingContainer = styled.View`
  flex-direction: row;
  padding: ${({ theme }) => theme.space[2]} 10px;
  padding-left: 0;
  border-radius: 5px;
  align-items: center;
`;
const InformationRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const InformationChip = styled.View`
  padding: 6px 8px;
  background-color: ${({ theme, darkTheme }) =>
    darkTheme ? theme.colors.brand.primary : `${rgba(theme.colors.brand.secondary, 0.9)}`};
  color: white;
  border-radius: 30px;
`;
const InformationChipp = styled.View`
  padding: 6px 8px;
  background-color: ${({ theme, darkTheme }) =>
    darkTheme ? theme.colors.brand.primary : `${rgba(theme.colors.brand.secondary, 0.9)}`};
  color: white;
  border-radius: 30px;
  height:40px;
  justify-content: center;
  align-items: center;
  margin-top:5px;
`;

const SpecialistCard = ({
  specialist,
  active = false,
  darkTheme=false,
  selectedSpecialist,
  ...restProps
}) => {
  const theme = useTheme();
  const coverImage = specialist.user.photo || ''

  const prices = specialist.services.map(service => service.price)
  const priceRange = [Math.min(...prices), Math.max(...prices)]
  // const ratingCnt = 0 //specialist.reviews.length
  const serviceCnt = specialist.services.length
  let name = `${(specialist?.user?.firstName || '') + ' ' + (specialist?.user?.lastName || '')}`
  name = !name.trim() ?  'Name not set' : name;
  // const halfStarType = rating - ratingArray.length >= 0.5 ? "fill" : "empty";

  const shadow = darkTheme ? {} : {...theme.shadows.default}
  const {onGetRatings} =useContext(ReviewContext)
  const[ratings,setRatings]=useState(0)

  useEffect(()=>{
    getRatings()
    },[])
  
    const getRatings =async ()=>{
      let rts =0
      rts = await onGetRatings(specialist._id,'specialist')
      setRatings(rts)
    }
  useEffect(() => {
    console.log('services',  specialist.services)
  }, [])

  return (
    <Wrapper {...restProps} style={{...shadow}} darkTheme={darkTheme} active={active}>
      {/*<ContainerGradient*/}
      {/*  colors={[*/}
      {/*    "white",*/}
      {/*    'purple',*/}
      {/*  ]}*/}
      {/*  start={[0, 1]}*/}
      {/*  end={[1, 0]}*/}
      {/*/>*/}
      <View>
        <SpecialistCardContainer
          active={
            active ||
            (selectedSpecialist && selectedSpecialist.id === specialist.id)
          }
        >

          {active ||
            (selectedSpecialist && selectedSpecialist.id === specialist.id && (
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={ darkTheme ? theme.colors.brand.primary : theme.colors.ui.primary}
                style={{ position: "absolute", top: 0, right: 0, zIndex: 1 }}
              />
            ))}
          <SpecialistCardImage source={coverImage ? { uri: coverImage } : require('../../assets/blank-profile.png')} >
            <ImageContent />
          </SpecialistCardImage>
          <SpecialistCardInfoContainer>
            
              <View style={{flexDirection:'row',justifyContent:'space-between'}}>
              <Title variant="caption" numberOfLines={2} ellipsizeMode="tail" width={110} style={{color: darkTheme ? "white" : "black"}}>
                {name}
              </Title>
              <InformationChipp darkTheme={false}>
                  <Text
                    variant="caption"
                    style={{ color: darkTheme ? "white" : "white", fontWeight: "light", fontSize: 16 }}
                  >
                     Book Now
                  </Text>
                </InformationChipp>
              </View>
              
            
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <RatingContainer>
              <Text
                 style={{
                   fontSize: 14,
                   fontWeight: "bold",
                   color: theme.colors.brand.primary,
                 }}
                >
                 {parseInt(ratings).toFixed(2) >0.99 ?parseInt(ratings).toFixed(2) : 'Not Rated'}
                </Text>
                <Spacer position="left" size="small" />
                {
                  ratings >0.99 ? 
                  <View style={{marginRight: 2}}>
                  <AntDesign
                    name="star"
                    size={14}
                    color={darkTheme ? theme.colors.brand.primary : theme.colors.brand.secondary}
                  />
                </View>
                  :<></>
                }
             
                {/* {ratingArray.map((start, index) => (
                  <View key={`${index}-star-`} style={{marginRight: 2}}>
                    <AntDesign
                      name="star"
                      size={14}
                      color={darkTheme ? theme.colors.brand.primary : theme.colors.brand.secondary}
                    />
                  </View>
                ))} */}
               
               
              </RatingContainer>
              {/*<TouchableOpacity>*/}
              {/*  <Text*/}
              {/*    style={{*/}
              {/*      textDecorationLine: "underline",*/}
              {/*      fontWeight: "bold",*/}
              {/*      fontSize: 12,*/}
              {/*      color: darkTheme ? "white" : theme.colors.brand.secondary*/}
              {/*    }}*/}
              {/*  >*/}
              {/*    {ratingCnt} reviews*/}
              {/*  </Text>*/}
              {/*  <Spacer position="left" size="medium" />*/}

              {/*</TouchableOpacity>*/}

            </View>
            <Spacer position="bottom" size="medium" />

            <InformationRow>
              <Spacer position="right" size="medium">
                <InformationChip darkTheme={darkTheme}>
                  <Text
                    variant="caption"
                    style={{ color: darkTheme ? "white" : "white", fontWeight: "light", fontSize: 11 }}
                  >
                    {serviceCnt} services
                  </Text>
                </InformationChip>
              </Spacer>
            
                <InformationChip darkTheme={darkTheme}>
                  <Text
                    variant="caption"
                    style={{ color: darkTheme ? "white" : "white", fontWeight: "light", fontSize: 11 }}
                  >
                    ${priceRange[0]} - ${priceRange[1]}
                  </Text>
                </InformationChip>
               
            </InformationRow>
            {/* <Spacer position="right" size="medium"> */}
               
              {/* </Spacer> */}
            {/*<Spacer position="bottom" size="medium" />*/}
          </SpecialistCardInfoContainer>
        </SpecialistCardContainer>
      </View>
    </Wrapper>
  );
};

const mapStateToProps = (state) => ({
  selectedSpecialist: state.booking.specialist,
});

const mapDispatchToProps = (dispatch) => ({
  setSpecialist: (specialist) => dispatch(setSpecialist(specialist)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SpecialistCard);
