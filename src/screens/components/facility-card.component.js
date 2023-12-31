import styled, { useTheme } from "styled-components/native";
import {
  AntDesign,
  Entypo,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import { selectFacility } from "../../redux/booking/booking.actions";
import { Spacer } from "../../components/spacer/spacer.component";
import { Row } from "../../components/helpers/helpers.component";
import { Text } from "../../components/typography/typography.component";
import { rgba } from "polished";
import { Dimensions,Share,Linking, View } from "react-native";
import { ReviewContext } from "../../providers/review.provider";
const { width } = Dimensions.get("window");



const SlideContainer = styled.View`
  height: 120px;
  width: ${width - 48}px;
  background-color: black;
  margin-top: 4px;
  margin-bottom: 12px;
  border-radius: 15px;
  overflow: hidden;
  position: relative;
  border: 2px solid ${({ active, theme }) => active ? theme.colors.brand.secondary : "transparent"};
`;
const Container = styled.View`
  height: 120px;
  width: ${width - 48}px;
  background-color: white;
  border-radius: 15px;
  flex-direction: row;
  align-items: center;
  padding: 0;
`;

const Button = styled.TouchableOpacity`
  width: 100%;
  height: 100%;
  flex-direction: row;
  align-items: center;
`;

const MoreButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  position: absolute;
  background-color: ${({ theme }) => theme.colors.brand.white};
  border-radius: 100px;
  height: 30px;
  width: 30px;

  top: 4px;
  right: 4px;
  z-index: 10;
`;

const ShowResultsButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 12px;
  right: 12px;
  border-radius: 15px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 38px;
  padding: 0px ${({ theme }) => theme.space[3]};
  background-color: ${({ theme }) => theme.colors.brand.secondary};
`;

const ShareIcon = styled.TouchableOpacity`
  position: absolute;
  bottom: 12px;
  right: 12px;
  border-radius: 15px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 30px;
  padding: 0px ${({ theme }) => theme.space[3]};
  background-color: ${({ theme }) => theme.colors.brand.secondary};
`;

const CoverImage = styled.Image.attrs((props) => ({
  resizeMode: "cover",
}))`
  height: 130px;
  width: 95px;
  overflow: hidden;
`;

const ContentContainer = styled.View`
  flex: 1;
  justify-content: center;
  
`;

const Title = styled(Text)`
  font-size: 13px;
  font-weight: bold;
  color: black;
`;

const RatingContainer = styled.View`
  flex-direction: row;
  padding: ${({ theme }) => theme.space[2]} 5px;
  background-color: ${({ theme }) => rgba(theme.colors.brand.secondary, 0.1)};
  border-radius: 30px;
`;

const FacilityCard = ({
  facility,
  specialist,
  selectedFacility,
  setSelectedFacility,
  handleMorePress,
  handleViewResultPress = false,
  share = false,
  info = false,
}) => {
  const theme = useTheme();
  const [selected, setSelected] = useState(false);
  const { _id, name, address, coverImage, time, distance, ratingCnt } =
    facility;
  const {onGetRatings} =useContext(ReviewContext)
  const [ratings,setRatings] =useState(0)

  useEffect(()=>{
    console.log("SSsdad",_id,'facility');
    getRatings()
    },[])
  
    const getRatings =async ()=>{
      let rts =0
      rts = await onGetRatings(_id,'facility')
      setRatings(rts)
    }
  const handlePress = () => {
    setSelectedFacility(facility);
    if (handleViewResultPress) {

      handleViewResultPress();
    } else {
      handleMorePress()
    }
  };
  useEffect(() => {
    if (selectedFacility) {
      setSelected(facility.id === selectedFacility.id);
    } else {
      setSelected(false);
    }
  }, [selectedFacility]);
  

  return (
    <SlideContainer style={{ ...theme.shadows.default }} active={facility.id === selectedFacility?.id}>
      <Container active={selected}>
        <MoreButton onPress={handleMorePress}>
          <MaterialIcons
            name="more-horiz"
            size={24}
            color={theme.colors.brand.secondary}
          />
        </MoreButton>

        {/*{selected && (*/}
        {/*  <Ionicons*/}
        {/*    name="checkmark-circle"*/}
        {/*    size={24}*/}
        {/*    color={theme.colors.brand.primary}*/}
        {/*    style={{ position: "absolute", top: 4, left: 4, zIndex: 1 }}*/}
        {/*  />*/}
        {/*)}*/}
        <Button onPress={handlePress}>
          <CoverImage source={{ uri: coverImage }} />
          <Spacer position="left" size="medium" />
          <ContentContainer>
            <View style={{bottom:10}}>
            <Title numberOfLines={1}>{name}</Title>
            </View>
            <Spacer position="bottom" size="large" />
            <Row>
              {/* <Ionicons
                name="location"
                size={12}
                color={theme.colors.brand.secondary}
              /> */}
              <Spacer position="left" size="small" />
              {/* <Text variant="caption" style={{ fontWeight: "normal", fontSize: 10, color: "black" }}>
                {[facility.postcode || '', facility.city || '', facility.country || ''].join('  ')}
              </Text> */}
            </Row>
            <Spacer position="bottom" size="large" />

            <Row style={{ flexWrap: "wrap" }}>
              <RatingContainer>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "bold",
                    color: theme.colors.brand.secondary,
                  }}
                >
                  {ratings ? parseFloat(ratings).toFixed(1) : 'Not Rated'}
                </Text>
                <Spacer position="left" size="small" />
                <AntDesign
                  name="star"
                  size={13}
                  color={theme.colors.brand.secondary}
                />
              </RatingContainer>
            </Row>
          </ContentContainer>
        </Button>
      </Container>
      {handleViewResultPress && (
        <ShowResultsButton onPress={handleViewResultPress}>
          <Text
            variant="caption"
            style={{ color: "black", fontWeight: "bold" }}
          >
            Available stylist {facility.specialists.length}
          </Text>
        </ShowResultsButton>
      )}
      {
        share && (
          <ShareIcon onPress={async () => {
            try {
              await Share.share({message:`freshr://Home/${share}/${false}/${specialist}`,url:`freshr://Home/${share}/${false}/${specialist}`})
                .then((res) => {
                  console.log("responseeeeeeeeeeeeeeeeeeeeeeeeeeeee",res);
                })
                .catch((err) => {
                  err && console.log(err);
                });
            }
            catch (e) {
              console.log(e.message)
            }
          }} >
            <Entypo name='share' size={20} color='#000' />
          </ShareIcon>
        )
      }
    </SlideContainer>
  );
};

const mapStateToProps = (state) => ({
  selectedFacility: state.booking.facility,
});

const mapDispatchToProps = (dispatch) => ({
  setSelectedFacility: (facility) => dispatch(selectFacility(facility)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FacilityCard);
