import React, { useCallback, useEffect, useRef, useState } from "react";
import MapView, { Circle, PROVIDER_GOOGLE } from "react-native-maps";

import styled, { useTheme } from "styled-components/native";
import { Dimensions, View } from "react-native";
import { MapMarker,MapMarkerLocation } from "./map-marker.component";
import Carousel from "react-native-snap-carousel";
import { connect } from "react-redux";
import { selectFacility, setSearchLocation, setSpecialist,selectSpecialist } from "../../redux/booking/booking.actions";
import { Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import { IconButton } from "../../components/button/button.component";
import { Text } from "../../components/typography/typography.component";
import { useNavigation } from "@react-navigation/native";
import { rgba } from "polished";
import { LinearGradient } from "expo-linear-gradient";
import { getBoundsOfDistance } from "geolib";
import { Spacer } from "../../components/spacer/spacer.component";
import { ActivityIndicator } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const mapStyles = require("./mapStyles.json");
const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");

const InfoContainer = styled.View`
  background-color: black;
  padding: 8px 12px;
  border-radius: 0;
  //position: absolute;
  //bottom: 8px;
  //left: 4px;
  flex-direction: row;
  align-items: center;
`

const RefreshButton = styled.View`
  height: 30px;
  width: 30px;
  background-color: black;
  border-radius: 30px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 4px;
  bottom: 40px
`

const MapOuterContainer = styled.View.attrs((props) => ({
}))`
  position: relative;
  ${({ fullMap }) =>
    // fullMap
    //   ?
       "flex: 1"
    //   : "elevation: 50; flex-direction: column; align-items: center; justify-content: center; margin: 1px; flex: 1; overflow: hidden;"
};
`;
const MapContainer = styled(MapView)`
  ${({ fullMap }) =>
    // fullMap
    //   ? 
      "position: absolute; top: 0; bottom: 0; left: 0; right: 0; flex: 1; height: 100%"
    //   : "height: 300px; width: 100%; overflow: hidden"
};
`;

const DataContainer = styled.View`
  ${({ carouselBottom, theme }) =>
    carouselBottom
      ? "position: absolute; top: 12px;  left: 0px; right: 0;"
      : `padding: 8px 0px; background-color: transparent;`};
`;

const ContainerGradient = styled(LinearGradient)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const ExpandButtonContainer = styled.View`
  position: absolute;
  bottom: 5px;
  right: 5px;
  align-items: flex-end;
`;

export function getRegionForCoordinates(points, center=null) {
  // points should be an array of { latitude: X, longitude: Y }
  let minX, maxX, minY, maxY;

  // init first point
  ((point) => {
    minX = point.latitude;
    maxX = point.latitude;
    minY = point.longitude;
    maxY = point.longitude;
  })(points[0]);

  // calculate rect
  points.map((point) => {
    minX = Math.min(minX, point.latitude);
    maxX = Math.max(maxX, point.latitude);
    minY = Math.min(minY, point.longitude);
    maxY = Math.max(maxY, point.longitude);
  });

  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;
  let deltaX = (maxX - minX);
  let deltaY = (maxY - minY);

  if (center) {
    deltaX = Math.abs(center.latitude - midX) + deltaX;
    deltaY = Math.abs(center.longitude  - midY) + deltaY;
  }

  return {
    latitude: midX,
    longitude: midY,
    latitudeDelta: deltaX + 0.0043,
    longitudeDelta: deltaY + 0.0034
  };
}

const Map = ({
  location = {},
  data,
  renderItem,
  itemWidth,
  fullMap = true,
  resizeMap,
  carouselBottom = true,
  refresh=null,
  loading=false,
  delivery=false,
  sharelinkdata=null,
  ...restProps
}) => {

  const handleSnapToItem = useCallback((index)=>{
    restProps.setSpecialist(data[index]);
  },[data,restProps.selectSpecialist]);
  const theme = useTheme();
  const navigation = useNavigation();
  const [lng, lat] = restProps.searchLocation;
  const [defaultRegion, setDefaultRegion] = useState(null)
  const flatList = useRef();
  const [isMounted, setIsMounted] = useState(false)
  const [isFullMap, setIsFullMap] = useState(fullMap)
  const [deliverylocation, setDeliverylocation] = useState()

  const fetchdeliverylocation = async ()=>{
    const jsonvalue = await AsyncStorage.getItem(
      'del'
    )
    const value = JSON.parse(jsonvalue)
    console.log("moxaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", value);
    setDeliverylocation(value)
  }
  const map = useRef()


  const CenteredCarouselContainer = styled.View`
   flex: 1;
  justify-content: center;
  align-items: center;
`;

  useEffect(() => {
    console.log("restProps.searchLocation",restProps.searchLocation);
    if (!restProps.selectedspecialist || !flatList) {
      restProps.setSpecialist(data[0])
    }
    const index = data.findIndex(
      (item) => item._id === restProps.selectedspecialist?._id
    );
    flatList.current?.snapToItem(index);

  }, [restProps.selectedspecialist]);


 const fitMapToCircle = (node) =>  {
   try {
     const coord = {latitude: delivery && deliverylocation? deliverylocation[1] : restProps.searchLocation[1], longitude:delivery && deliverylocation? deliverylocation[0]: restProps.searchLocation[0]};
     console.log("zooming");
     const radiusBoundaries = getBoundsOfDistance(coord, restProps.searchRadius * 1000);
     map.current?.fitToCoordinates([...data.map(item => {
         const coordinates = item.location.coordinates
         return {latitude: coordinates[1], longitude: coordinates[0]}
       }), ...radiusBoundaries],
       {
         edgePadding: {
           top: 30,
           right: 10,
           bottom: 10,
           left: 20,
         },
       })
   } catch (err) {
     console.log(err)
   }

  }
// console.log("delllllllllll", deliverylocation[0]);
  useEffect(() => {
    fitMapToCircle()

  }, [restProps.selectedspecialist, restProps.searchRadius, fullMap])


  useEffect(() => {
    restProps.setSpecialist(data[0])
    restProps.setFacility(null);
    setIsMounted(true);
    setIsFullMap(fullMap)
    fetchdeliverylocation()
  }, [])

  return (
    <>
      {/*{defaultRegion && (*/}
      {/*  <>*/}
          {/*{!fullMap &&*/}
          {/*  <View style={{ paddingHorizontal: 24, backgroundColor: "white"}}>*/}
          {/*    <Spacer position="bottom" size="medium" />*/}

          {/*    <Text*/}
          {/*      variant="caption"*/}
          {/*      style={{*/}
          {/*        fontSize: 13,*/}
          {/*        color: theme.colors.brand.quaternary,*/}
          {/*      }}*/}
          {/*    >*/}
          {/*      Press{" "}*/}
          {/*      <Text*/}
          {/*        variant="caption"*/}
          {/*        style={{ fontSize: 16, color: theme.colors.brand.secondary }}*/}
          {/*      >*/}
          {/*        show results*/}
          {/*      </Text>{" "}*/}
          {/*      and pick the right professional for you*/}
          {/*    </Text>*/}
          {/*    <Spacer position="bottom" size="large" />*/}
          {/*  </View>}*/}
          <MapOuterContainer fullMap={fullMap}>
            <MapContainer
              fullMap={fullMap}
              customMapStyle={mapStyles}
              ref={map}
              onLayout={() => fitMapToCircle()}
              showUserLocation
              followUserLocation
            //   minZoomLevel={11}

            >
              <MapMarker
                key={`marker-search-location`}
                coordinate={
                  delivery && deliverylocation ?  
                    {
                      latitude: deliverylocation[1],
                      longitude: deliverylocation[0],
                    }
                  :
                  {
                  latitude: lat,
                  longitude: lng,
                }}
                setSearchLocation={restProps.setSearchLocation}
                isSelected={false}
                delivery={delivery}
             
              />

              {data.map((item) => (
                <MapMarker
                  data={item}
         
            // active={specialistt._id === specialist?._id}
            // isSelected={specialistt._id === specialist?._id}
            isBarber={true}
            coordinate={{
              latitude: item.location.coordinates[1],
              longitude:item.location.coordinates[0],
            }}
            isSelected={
                restProps.selectedspecialist
                  ? item._id === restProps.selectedspecialist?._id
                  : false
              }
              onPress={() => restProps.setSpecialist(item)}
                />
              ))}

              <Circle
                center={{
                  latitude:delivery && deliverylocation ? deliverylocation[1]: restProps.searchLocation[1],
                  longitude:delivery && deliverylocation ? deliverylocation[0]: restProps.searchLocation[0]
                }}
                radius={restProps.searchRadius * 1000}
                strokeColor={theme.colors.brand.primary}
                strokeWidth={3}
                fillColor={rgba(theme.colors.brand.primary, 0.3)}
                zIndex={2}
              />

              {/*{restProps.selectedFacility && restProps.selectedFacility.specialists && restProps.selectedFacility.specialists.map((item) => (*/}
              {/*  <MapMarker*/}
              {/*    key={`marker-${item.id}`}*/}
              {/*    isBarber={true}*/}
              {/*    isFacility={true}*/}
              {/*    coordinate={{*/}
              {/*      latitude: item.location.coordinates[1],*/}
              {/*      longitude: item.location.coordinates[0],*/}
              {/*    }}*/}
              {/*    isSelected={*/}
              {/*      restProps.selectedFacility*/}
              {/*        ? item.id === restProps.selectedFacility.id*/}
              {/*        : false*/}
              {/*    }*/}
              {/*    onPress={() => {*/}
              {/*      restProps.setSpecialist(item);*/}
              {/*      navigation.navigate("SpecialistDetails", {*/}
              {/*        edit: false,*/}
              {/*      });*/}
              {/*    }}*/}
              {/*  />*/}
              {/*))}*/}
              {/*<Circle*/}
              {/*  center={{*/}
              {/*    latitude: lat,*/}
              {/*    longitude: lng,*/}
              {/*  }}*/}
              {/*  radius={restProps.searchRadius * 1000}*/}
              {/*  strokeColor={theme.colors.brand.primary}*/}
              {/*  strokeWidth={2}*/}
              {/*  fillColor={rgba(theme.colors.brand.primary, 0.3)}*/}
              {/*  zIndex={2}*/}
              {/*/>*/}
            </MapContainer>
           



          </MapOuterContainer>
      
          { 
          <View style={{height:height/6}}>
          <Carousel
              ref={flatList}
              data={data}
              renderItem={renderItem}
              keyExtractor={(item) => `bottom-flat-map-${item._id}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              sliderWidth={width}
              itemWidth={(width - 48) * 0.97}
              onSnapToItem={sharelinkdata ? restProps.setSpecialist(sharelinkdata) : (index) => restProps.setSpecialist(data[index])}
            />        
        </View>
           }
        {/*</>*/}
      {/*)}*/}
    </>
  );
};

const mapStateToProps = (state) => ({
  searchRadius: state.booking.searchRadius,
  selectedFacility: state.booking.facility,
  selectedspecialist: state.booking.specialist,
  searchLocation: state.booking.searchLocation
});

const mapDispatchToProps = (dispatch) => ({
  setFacility: (facility) => dispatch(selectFacility(facility)),
  setSpecialist: (specialist) => dispatch(selectSpecialist(specialist)),
  setSearchLocation: (location) => dispatch(setSearchLocation(location)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Map);