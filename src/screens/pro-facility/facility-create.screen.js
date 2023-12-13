import styled, {useTheme} from 'styled-components/native';
import {connect} from 'react-redux';
import { SafeArea } from "../../components/utils/safearea.component";
import { ActionButton, ButtonContainer } from "../../components/button/process-action-button.component";
import { Text } from "../../components/typography/typography.component";
import mime from "mime";
import { useContext, useEffect } from "react";
import { HostContext } from "../../providers/facility.provider";
import { LoadingScreen } from "../loading.screen";
import { createImageFormData } from "./utils";
import { PaddedContainer, SectionTitle } from "../components/details-screen.component";
import { Spacer } from "../../components/spacer/spacer.component";
import { View } from "react-native";
import { FacilityScreenHoc } from "./facility-screen-hoc";

const Container = styled.View`
  flex: 1;
  flex-direction: column-reverse;
`

const FacilityCreateScreen = (props) => {
  const theme = useTheme();

  const {isLoading, error, onCreateFacility} = useContext(HostContext);


  const createFacilityFormData = () => {

    const formData = new FormData();
   
    formData.append('name', props.name);
    formData.append('street', props.street);
    formData.append('city', props.city);
    formData.append('country', props.country);
    formData.append('region', props.region);
    formData.append('postcode', props.postcode);
    formData.append('coords', JSON.stringify({
      type: "Point",
      coordinates: [props.coords.longitude, props.coords.latitude],
    }));
    formData.append('aptSuite', props.aptSuite);
    formData.append('closingTime', `${props.closingTime}`);
    formData.append('openingTime', `${props.openingTime}`);
    formData.append('description', props.description);
    formData.append('seatCapacity', props.seatCapacity);
    formData.append('coverImage', createImageFormData(props.coverImage));
    const gallery =  props.gallery.map(image => createImageFormData(image))
    gallery.forEach(el => {
      formData.append('gallery', el)
    })
    return formData;
  }

  if (isLoading) {
    return <LoadingScreen/>
  }


  const resJsonData = () =>{
    const gallery =  props.gallery.map(image => createImageFormData(image))
    let obj ={
      'name':props.name,
      'street':props.street,
      'city':props.city,
      'country':props.country,
      'region':props.region,
      'postcode':props.postcode,
      'location':{
        'coordinates': [props.coords.longitude, props.coords.latitude]
      },
      'aptSuite':props.aptSuite,
      'closingTime':`${props.closingTime}`,
      'openingTime':`${props.openingTime}`,
      'description': props.description,
      'coverImage':createImageFormData(props.coverImage),
      'gallery':gallery
    }
    return obj
  }

  return (
    <FacilityScreenHoc showBackButton={true}>
      <Container>
        <View style={{flex: 1}}>
          <PaddedContainer>
            <Spacer position={"top"} size={"large"}/>
            <Spacer position={"top"} size={"large"}/>
            <Spacer position={"top"} size={"large"}/>
            <SectionTitle style={{color: "black"}}>Create facility</SectionTitle>
            <Spacer position="bottom" size="medium" />
            <Text variant="caption" style={{ lineHeight: 22, color: "black" }}>
              Proceed with the creation of the facility
            </Text>
          </PaddedContainer>

        </View>
        <ButtonContainer
          style={{backgroundColor: theme.colors.brand.white, alignSelf: "flex-end"}}
        >
          <ActionButton
            height={55}
            onPress={() => {
              const formData = createFacilityFormData();
              console.log("sssss",formData);
              onCreateFacility(formData).then(res=>{
                console.log("ddd",res),
              //  res!== null? console.log('JSON ====>',resJsonData()) : null
                res !==null ? !error && props.navigation.navigate('ProFacilityDetails', {facility: resJsonData()}) :<></>
              }).then
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
              Confirm and create facility
            </Text>
          </ActionButton>
        </ButtonContainer>
      </Container>
    </FacilityScreenHoc>
  )
}

const mapStateToProps = (state) => ({
  name:  state.facilityCreation.name,
  street:  state.facilityCreation.street,
  city:  state.facilityCreation.city,
  country:  state.facilityCreation.country,
  region:  state.facilityCreation.region,
  postcode:  state.facilityCreation.postcode,
  coords:  state.facilityCreation.coords,
  aptSuite:  state.facilityCreation.aptSuite,
  closingTime:  state.facilityCreation.closingTime,
  openingTime:  state.facilityCreation.openingTime,
  description:  state.facilityCreation.description,
  seatCapacity:  state.facilityCreation.seatCapacity,
  coverImage:  state.facilityCreation.coverImage,
  gallery:  state.facilityCreation.gallery
})
const mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(FacilityCreateScreen)
