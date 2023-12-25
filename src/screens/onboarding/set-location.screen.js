import { Dimensions, Platform, View } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { connect } from "react-redux";
import React, { useContext, useEffect, useRef, useState } from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { SafeArea } from "../../components/utils/safearea.component";
import { CustomSearchBar } from "../../components/form/input.component";
import MapView, { Marker, Circle, Callout } from "react-native-maps";
import * as Location from "expo-location";

import mapStyles from "../components/mapStyles.json";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { rgba } from "polished";
import Slider from "@react-native-community/slider";
import { Spacer } from "../../components/spacer/spacer.component";
import { Text } from "../../components/typography/typography.component";
import { theme } from "../../infrastructure/theme";
import { LoadingScreen } from "../loading.screen";
import { PreferencesContext } from "../../providers/preferences.provider";
import { GlassBackground } from "../auth/components/helpers.component";
import { ContainerGradient } from "../../components/background/glass-background";
import { getBoundsOfDistance } from "geolib";
import { red } from "react-native-redash";

const SearchInput = styled(CustomSearchBar)`
  border-radius: 30px;
`;

const Map = styled(MapView)`
  flex: 1;
  position: relative;
  z-index: 0;
  width: ${Dimensions.get("window").width}px;
  height: ${Dimensions.get("window").height}px;
`;

const ConfirmationBar = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  top: 0;
  background-color: black;
  z-index: 2;
  padding: 16px;
  left: 0;
  right: 0;
  height: 80px;
`;

const ConfirmationButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  height: 44px;
  border-radius: 10px;
  overflow: hidden;
  padding: 0 16px;
  position: relative;
  background-color: ${({variant}) => variant === 'white' ? 'white' : '#25282b'}
 `;

const SetRadiusComponent = styled.View.attrs((props) => ({
  shadowColor: theme.colors.brand.quaternary,
  shadowOffset: { width: 0, height: 0.5 },
  shadowRadius: 1,
  shadowOpacity: 0.13,
  elevation: 2,
}))`
  position: absolute;
  border-radius: 10px;
  bottom: 16px;
  left: 16px;
  right: 16px;
  padding: 20px 16px;
  background-color: white;
`;

const SetLocationScreen = ({ navigation }) => {
  const theme = useTheme();
  const ref = useRef();
  const mapRef = useRef();
  const [location, setLocation] = useState([])
  const { isLoading, error, updateSearchLocation } =
    useContext(PreferencesContext);
  const [radius, setRadius] = useState(1);
  const { width, height } = Dimensions.get("window");
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = Platform.OS === "IOS" ? 1.5 : 0.5;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const initialRegion = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: LATITUDE_DELTA * Number(1 / 15),
    longitudeDelta: LONGITUDE_DELTA * Number(1 / 15),
  };
  const [region, setRegion] = useState(initialRegion);
  // console.log("mmmmmmmmmmmm------>", region);
  // const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    console.log(location);
    setRegion({
      latitudeDelta: LATITUDE_DELTA * Number(radius / 15),
      longitudeDelta: LONGITUDE_DELTA * Number(radius / 15),
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    mapRef.current?.animateToRegion(
      {
        latitudeDelta: LATITUDE_DELTA * Number(radius / 15),
        longitudeDelta: LONGITUDE_DELTA * Number(radius / 15),
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
      1000
    );
  };
  async function fitMapToCircle() {
    const coordinates = {latitude: region.latitude, longitude: region.longitude};
    const radiusBoundaries = getBoundsOfDistance(coordinates, radius * 1000);

    mapRef.current?.fitToCoordinates(radiusBoundaries, {
      edgePadding: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      },
    });
  }

  useEffect(() => {
    fitMapToCircle();
  }, [radius, region])

  useEffect(() => {
    ref.current?.setAddressText("Some Text");
    getCurrentLocation();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const handleRegionChange = () => {

  }
  return (
    <SafeArea>
      <View style={{ flex: 1 }}>
        <ConfirmationBar>
          <ConfirmationButton onPress={() => getCurrentLocation()}>
            <Ionicons
              name="location"
              size={18}
              color={theme.colors.brand.primary}
            />
            <Spacer position="right" size="medium" />
            <Text variant="caption" style={{ fontSize: 12,  fontWeight: 'light', color: theme.colors.brand.primary, textTransform: 'uppercase', letterSpacing: 1 }}>
              current location
            </Text>
          </ConfirmationButton>
          <ConfirmationButton
            variant={"white"}
            onPress={() =>
              updateSearchLocation(region, radius).then(() =>
                !error ? navigation.navigate("setSearchGender") : null
              )
            }
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={18}
              color="black"
            />
            <Spacer position="right" size="medium" />
            <Text variant="caption" style={{ fontSize: 12, fontWeight: 'light', color: "black", textTransform: 'uppercase', letterSpacing: 1 }}>
              confirm
            </Text>
          </ConfirmationButton>
        </ConfirmationBar>
        <View
          style={{
            zIndex: 10,
            position: "absolute",
            top: 100,
            left: 16,
            right: 16,
          }}
        >
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
            onPress={(data, details = null) => {
              setRegion({
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
                latitudeDelta: LATITUDE_DELTA * Number(radius / 15),
                longitudeDelta: LONGITUDE_DELTA * Number(radius / 15),
              });
              mapRef.current?.animateToRegion(
                {
                  latitudeDelta: LATITUDE_DELTA * Number(radius / 15),
                  longitudeDelta: LONGITUDE_DELTA * Number(radius / 15),
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                },
                1000
              );
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

        <Map
          ref={mapRef}
          showsUserLocation={true}
          showsMyLocationButton={true}
          onRegionChangeComplete={async (e) => {
            console.log(e);
            setRegion({ ...e });
            let l = await Location.reverseGeocodeAsync({
              "latitude":e.latitude,
              "longitude":e.longitude
            })
            console.log("innnnnnnnnnnnnnnn lllllll----->", l);
            setLocation(l)
          }}
          customMapStyle={mapStyles}
          
        >
          <Marker coordinate={region}>
            <FontAwesome
              name="map-marker"
              size={35}
              color={theme.colors.ui.primary}
            />
          </Marker>
          <Circle
            center={region}
            radius={radius * 1000}
            strokeColor={theme.colors.brand.primary}
            strokeWidth={3}
            fillColor={rgba(theme.colors.brand.primary, 0.3)}
            zIndex={2}
            
          />
        </Map>

        <SetRadiusComponent>
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <Slider
                minimumValue={1}
                step={1}
                thumbTintColor={theme.colors.brand.primary}
                fillColor={rgba(theme.colors.brand.primary, 0.5)}
                geodesic
                maximumValue={20}
                onSlidingComplete={(value) => {
                  setRadius(value);
                }}
                minimumTrackTintColor={theme.colors.brand.primary}
                maximumTrackTintColor={rgba(theme.colors.brand.primary, 0.5)}
              />
            </View>
            <Spacer position="right" size="medium" />
            {radius && (
              <Text variant="caption" style={{ fontSize: 16 }}>
                {radius} km
              </Text>
            )}
          </View>
        </SetRadiusComponent>
      </View>
    </SafeArea>
  );
};

export default connect(null, null)(SetLocationScreen);
