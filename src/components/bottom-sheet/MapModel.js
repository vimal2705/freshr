import React, { useEffect, useState } from "react";
import { View,Dimensions } from "react-native";
import { connect, useDispatch, useSelector } from "react-redux";
import { CustomSearchBar } from "../form/input.component";

import { Text } from "../typography/typography.component";
import { CheckBoxInput } from "../form/form-checkbox.component";
import { Row, Separator } from "../helpers/helpers.component";
import { ModalButton } from "../button/button.component";

import { FilterModal } from "./bottom-sheet-googlecomplete.component";
import {
  setProGender,
  setSearchLocation,
  setTargetGender,
} from "../../redux/booking/booking.actions";
import styled, { useTheme } from "styled-components/native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SyncStorage from "sync-storage"


import {
  Footer, FooterRow,
  HeaderContainer,
  PaddedContainer,
  PageTitle,
} from "../../screens/components/details-screen.component";
import { Spacer } from "../spacer/spacer.component";



import { Formik } from 'formik';
import * as yup from "yup";


import { AntDesign, MaterialIcons } from "@expo/vector-icons";

import { facilityCreationSetAddress } from "../../redux/facilityCreation/facilityCreation.actions";
const Container = styled.View`
  flex: 1;
  background-color: black;
`;
export const FormInput = styled(TextInput).attrs((props) => ({
  mode: "outlined",
  color: 'black',
  multiline: false,
  textAlign: { undefined },
  theme: {
    colors:
      { primary: props.theme.colors.brand.primary,
        text: 'black',
        placeholder: 'black',
        underlineColor: props.theme.colors.brand.primary
      }
  }
}))`
  width: 100%;
  font-size: 14px;
  background-color: white;
  font-weight: bold;
`;

const MapComponent = ({ showModal, toggleShowModal, data,SetLoctiondata, setCoordinates,...restProps }) => {

    const SearchInput = styled(CustomSearchBar)`
  border-radius: 30px;
`;
const theme = useTheme();

const [radius, setRadius] = useState(1);
    const { width, height } = Dimensions.get("window");
    const ASPECT_RATIO = width / height;
  const [apartment, setApartment] = useState("");
  // const [coordinates,setCoordinates] =useState()
  // const []
  const [address, setaddress] = useState(false);
  const LATITUDE_DELTA = Platform.OS === "IOS" ? 1.5 : 0.5;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const initialRegion = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: LATITUDE_DELTA * Number(1 / 15),
    longitudeDelta: LONGITUDE_DELTA * Number(1 / 15),
  };
  const [facilityLocation, setFacilityLocation] = useState(null);
  const [region, setRegion] = useState(initialRegion);
  const [longaddress,setLongaddress] = useState("")
  const dispatch = useDispatch();
  const gen = useSelector(state=>state.booking.targetGender);

  useEffect(() => {
    console.log("Asdads",facilityLocation);
    setFacilityLocation(null)
    // dispatch(setSearchLocation())
setaddress(false)
  }, []);


  const readGeoCodingResult = (details) => {
    let address1 = "";
    let postcode = "";
    let locality = "";
    let country = "";
    let state = ""

    for (const component of details.address_components) {
      // @ts-ignore remove once typings fixed
      const componentType = component.types[0];

      switch (componentType) {
        case "street_number": {
          address1 = `${component.long_name} ${address1}`;
          break;
        }

        case "route": {
          address1 += component.short_name;
          break;
        }

        case "postal_code": {
          postcode = `${component.long_name}${postcode}`;
          break;
        }

        case "postal_code_suffix": {
          postcode = `${postcode}-${component.long_name}`;
          break;
        }

        case "locality":
          locality = component.long_name;
          break;

        case "administrative_area_level_1": {
          state = component.short_name;
          break;
        }

        case "country":
          country = component.long_name;
          break;
      }
    }

    setFacilityLocation({
      address1,
      postcode,
      locality,
      country,
      state,
    })
  }

  const onConfirm = () => {
    if (facilityLocation != null) {
      
      toggleShowModal()
      SetLoctiondata({...facilityLocation,apartment:apartment})
      SyncStorage.set('locationAddress',{...facilityLocation,apartment:apartment} );
 
const result = SyncStorage.get('locationAddress');
console.log(result); 
      setFacilityLocation(null)
    }
  }

  const Setdata = async(longitude,latitude) =>{
    const key = "del"
    if(delivery){
      const coordinates = [longitude,latitude];
const stringifiedCoordinates = JSON.stringify(coordinates);

await AsyncStorage.setItem(key, stringifiedCoordinates);
    }
  }
  return (
    <FilterModal showModal={showModal} toggleShowModal={toggleShowModal}>
      {/* <Spacer position="top" size="large" /> */}
      <View style={{ flex: 1 }}>
        <Spacer position="left" size="medium">
          <Spacer position="top" size="medium" />
          {facilityLocation == null ?
          <GooglePlacesAutocomplete
            placeholder="Enter Location"
            minLength={4}
            styles={{
              container: {
                position: "relative",
                zIndex: 4,
                flex: undefined,
              },
            }}
            onPress={async (data, details = null) => {

              const key = "del"
             
               const coordinates = [details.geometry.location.lng, details.geometry.location.lat];
const stringifiedCoordinates = JSON.stringify(coordinates);

await AsyncStorage.setItem(key, stringifiedCoordinates);

              setRegion({
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
                latitudeDelta: LATITUDE_DELTA * Number(radius / 15),
                longitudeDelta: LONGITUDE_DELTA * Number(radius / 15),
              });
              dispatch(setSearchLocation([details.geometry.location.lng,details.geometry.location.lat])) 
              setCoordinates([details.geometry.location.lng,details.geometry.location.lat])
             Setdata(details.geometry.location.lng,details.geometry.location.lat)
              
                           // mapRef.current?.animateToRegion(
              //   {
              //     latitudeDelta: LATITUDE_DELTA * Number(radius / 15),
              //     longitudeDelta: LONGITUDE_DELTA * Number(radius / 15),
              //     latitude: details.geometry.location.lat,
              //     longitude: details.geometry.location.lng,
              //   },
              //   1000
              // );
              console.log("ASDadasdas",details.geometry.location);
              readGeoCodingResult(details)
            }}
            autoFocus={false}
            listViewDisplayed={false}
            keepResultsAfterBlur={true}
            returnKeyType={"default"}
            fetchDetails={true}
            GooglePlacesDetailsQuery={{
              rankby: "distance",
            }}

            textInputProps={{
              InputComp: SearchInput,
            }}
            query={{
              key: "AIzaSyCOv8bKnTUh_03fuq11mXQPBEx9-TF3bWE",
              language: "en",
              radius: 30000,
              location: `${region.latitude}, ${region.longitude}`,
            }}
          
          />
          :<View>
             <TextInput label="Street" mode="outlined" outlineColor="black"  activeOutlineColor="black" value={facilityLocation?.address1}/>
             <TextInput label="Apartment, suite, (optional)" mode="outlined" activeOutlineColor="black"  outlineColor="black"  value={apartment} onChangeText={(text) =>  setApartment(text)}/>
             <Text style={{color:"red",fontSize:14}}>*Are you sure, you don't need to address</Text>
             <TextInput label="City" mode="outlined" outlineColor="black"  activeOutlineColor="black"  value={facilityLocation?.locality}/>
     <View style={{flexDirection:"row",justifyContent:"space-between"}}>

             <TextInput label="State/provience" mode="outlined" style={{width:"48%" }} activeOutlineColor="black"  outlineColor="black" value={facilityLocation?.state}/>
             <TextInput label="Postal code" mode="outlined" style={{width:"48%"}} activeOutlineColor="black"  outlineColor="black" value={facilityLocation?.postcode}/>
             </View>
             <TextInput label="Country/Region" mode="outlined" outlineColor="black" activeOutlineColor="black"  value={facilityLocation?.country}/>
             </View>}
          <Spacer position="bottom" size="large" />
        </Spacer>
      </View>
      <Spacer position="top" size="large" />

      
      <Spacer position="bottom" size="large" />
      <Separator />
      <Row
        style={{
          justifyContent: "space-between",
          paddingHorizontal: 8,
          paddingVertical: 16,
        }}
      >

        <ModalButton variant="primary" onPress={onConfirm}>
          <Text style={{ color: "white" }}>Confirm address</Text>
        </ModalButton>
      </Row>
    </FilterModal>
  );
};

const mapStateToProps = (state) => ({
  targetGender: state.booking.targetGender,
  searchLocation: state.booking.searchLocation,
  // proGender: state.booking.proGender,
});

const mapDispatchToProps = (dispatch) => ({
  setTargetGender: (gender) => dispatch(setTargetGender(gender)),
  setSearchLocation: (location) => dispatch(setSearchLocation(location)),
  // setProGender: (gender) => dispatch(setProGender(gender)),
});

export const MapModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(MapComponent);
