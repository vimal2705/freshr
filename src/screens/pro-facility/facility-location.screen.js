import {useEffect, useRef} from 'react';
import styled, { useTheme } from "styled-components/native";
import { connect } from "react-redux";
import Geocoder from 'react-native-geocoding';

import { Dimensions, Keyboard, View } from "react-native";
import React, { useState } from "react";
import { CustomSearchBar, } from "../../components/form/input.component";
import { Spacer } from "../../components/spacer/spacer.component";
import {
  Footer,
  FooterRow,
  PaddedContainer,
  SectionTitle,
} from "../components/details-screen.component";
import { Text } from "../../components/typography/typography.component";
import { SafeArea } from "../../components/utils/safearea.component";
import MapView, { Marker ,PROVIDER_GOOGLE } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as Location from "expo-location";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import LocationManualScreen from "./location-manual.screen";
import { Separator } from "../../components/helpers/helpers.component";
import { ModalButton } from "../../components/button/button.component";
import { FacilityScreenHoc } from "./facility-screen-hoc";
const mapStyles = require("../components/mapStyles.json");

Geocoder.init("AIzaSyCOv8bKnTUh_03fuq11mXQPBEx9-TF3bWE");

const Container = styled.View`
  flex: 1;
  position: relative;
`;

const SearchInput = styled(CustomSearchBar)`
  border-radius: 30px;
`;

const Map = styled(MapView)`
  flex: 1;
  border-radius: 15px;
`;

const MapContainer = styled.View`
  flex: 1;
`;

const FloatTextMapContainer = styled.View`
  position: absolute;
  bottom: 60px;
  left: 0;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Content = styled.View`
  flex: 1;
  overflow: hidden;
`;


const FacilityLocationScreen = (props) => {
  const theme = useTheme();
  const ref = useRef();
  const mapRef = useRef();
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });
  const [errorMsg, setErrorMsg] = useState(null);
  const [facilityLocation, setFacilityLocation] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setRegion({
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    mapRef.current?.animateToRegion(
      {
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
      1000
    );
  };

  useEffect(() => {
    // ref.current?.setAddressText("Some Text");
    getCurrentLocation();
  }, []);

  useEffect(() => {
    console.log('here', facilityLocation);
  }, [facilityLocation])

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

  const renderLocationPicker = () => {
    return (
      <View style={{flex : 1}}>
        <Content>
          <Spacer position="bottom" size="medium" />
          <Spacer position="bottom" size="large" />
          <PaddedContainer>
            <SectionTitle style={{color: "black"}}>Set location</SectionTitle>
            <Spacer position="bottom" size="medium" />
            <Text variant="caption" style={{color: "black"}}>Where is your facility located ?</Text>
            <Spacer position="bottom" size="large" />
            <View style={{position: "relative", zIndex: 99999999}}>
              <GooglePlacesAutocomplete
                placeholder="Enter Location"
                minLength={1}
                styles={{
                  container: {
                    position: "relative",
                    zIndex: 4,
                    flex: undefined,
                  },
                }}
                onPress={(data, details = null) => {
                  setRegion({
                    latitude: details.geometry.location.lat,
                    longitude: details.geometry.location.lng,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                  });
                  mapRef.current?.animateToRegion(
                    {
                      latitudeDelta: 0.015,
                      longitudeDelta: 0.0121,
                      latitude: details.geometry.location.lat,
                      longitude: details.geometry.location.lng,
                    },
                    1000
                  );
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
            </View>
            {/*{*/}
            {/*  facilityLocation && (*/}
            {/*    <>*/}
            {/*      <Spacer position="bottom" size="medium" />*/}
            {/*      <Spacer position="bottom" size="medium" />*/}
            {/*      <View style={{flexDirection: 'row'}}>*/}
            {/*        <CustomButton*/}
            {/*          onPress={() => setShowConfirmation(true)}*/}
            {/*        >*/}
            {/*          <Text variant="caption" style={{color: "white"}}>Confirm address</Text>*/}
            {/*        </CustomButton>*/}
            {/*      </View>*/}
            {/*    </>*/}
            {/*  )*/}
            {/*}*/}
          </PaddedContainer>
          <Spacer position="bottom" size="large" />
          <MapContainer>
            <Map
              ref={mapRef}
              region={region}
              showsUserLocation={true}
              showsMyLocationButton={true}
              onRegionChangeComplete={(e) => {
                setRegion({ ...e });
                // Geocoder.from({
                //   latitude : e.latitude,
                //   longitude : e.longitude
                // }).then(res => {
                //   console.log(res);
                //   readGeoCodingResult(res)
                // });

              }}
              customMapStyle={mapStyles}
              provider={PROVIDER_GOOGLE}
            >
              <Marker coordinate={region}>
                <FontAwesome
                  name="map-marker"
                  size={35}
                  color={theme.colors.ui.primary}
                />
              </Marker>
            </Map>
          </MapContainer>
          <Spacer position="bottom" size="medium" />
        </Content>
        {renderBottomNav()}
      </View>
    )
  }

  const renderBottomNav = () => {
   return (
     <Footer style={{backgroundColor: "white"}}>
       <Separator />
       <FooterRow style={{backgroundColor: "white"}}>
         <ModalButton
           style={{backgroundColor: "black", borderWidth: 2, borderColor: "#25282b"}}
           onPress={() => {
           if (showConfirmation) {
             setShowConfirmation(false)
           } else {
             props.navigation.goBack()
           }
         }}>
           <AntDesign name="arrowleft" size={16} color="white" />
           <Spacer position="left" size="small" />
           <Text style={{color: "white"}}>Cancel</Text>
         </ModalButton>
         {facilityLocation && <ModalButton
           variant="primary"
           style={{backgroundColor: theme.colors.brand.secondary}}
           onPress={() => setShowConfirmation(true)}
         >
            <Text style={{ color: "white" }}> Confirm address </Text>
           <Spacer position="left" size="small" />
           <AntDesign name="arrowright" size={16} color="white" />
         </ModalButton> }
       </FooterRow>
     </Footer>
   )
  }

  return (
    <FacilityScreenHoc showBackButton={true}>
      <Container>
        {showConfirmation ? <LocationManualScreen
          navigation={props.navigation}
          initValue={facilityLocation}
          coords={{latitude: region.latitude, longitude: region.longitude}}
          close={() => setShowConfirmation(false)}/>
          : renderLocationPicker()}
      </Container>
    </FacilityScreenHoc>
  );
};

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (state) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FacilityLocationScreen);
