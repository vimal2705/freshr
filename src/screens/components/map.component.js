import React, { useCallback, useEffect, useRef, useState } from "react";
import MapView, { Circle, PROVIDER_GOOGLE } from "react-native-maps";

import styled, { useTheme } from "styled-components/native";
import { Dimensions, View } from "react-native";
import { MapMarker } from "./map-marker.component";
import Carousel from "react-native-snap-carousel";
import { connect } from "react-redux";
import { selectFacility, setSearchLocation, setSpecialist } from "../../redux/booking/booking.actions";
import { Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import { IconButton } from "../../components/button/button.component";
import { Text } from "../../components/typography/typography.component";
import { useNavigation } from "@react-navigation/native";
import { rgba } from "polished";
import { LinearGradient } from "expo-linear-gradient";
import { getBoundsOfDistance } from "geolib";
import { Spacer } from "../../components/spacer/spacer.component";
import { ActivityIndicator } from "react-native-paper";

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
    fullMap
      ? "flex: 1"
      : "elevation: 50; flex-direction: column; align-items: center; justify-content: center; margin: 1px; flex: 1; overflow: hidden;"};
`;
const MapContainer = styled(MapView)`
  ${({ fullMap }) =>
    fullMap
      ? "position: absolute; top: 0; bottom: 0; left: 0; right: 0; flex: 1; height: 100%"
      : "height: 300px; width: 100%; overflow: hidden"};
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
  ...restProps
}) => {

  const handleSnapToItem = useCallback((index)=>{
    restProps.setFacility(data[index]);
  },[data,restProps.selectFacility]);
  const theme = useTheme();
  const navigation = useNavigation();
  const [lng, lat] = restProps.searchLocation;
  const [defaultRegion, setDefaultRegion] = useState(null)
  const flatList = useRef();
  const [isMounted, setIsMounted] = useState(false)
  const [isFullMap, setIsFullMap] = useState(fullMap)
  const map = useRef()


  const CenteredCarouselContainer = styled.View`
   flex: 1;
  justify-content: center;
  align-items: center;
`;

  useEffect(() => {
    if (!restProps.selectedFacility || !flatList) {
      restProps.setFacility(data[0])
    }
    const index = data.findIndex(
      (item) => item._id === restProps.selectedFacility?._id
    );
    flatList.current?.snapToItem(index);

  }, [restProps.selectedFacility]);


 const fitMapToCircle = (node) =>  {
   try {
     const coord = {latitude: restProps.searchLocation[1], longitude: restProps.searchLocation[0]};
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

  useEffect(() => {
    fitMapToCircle()
  }, [restProps.selectedFacility, restProps.searchRadius, fullMap])


  useEffect(() => {
    restProps.setFacility(data[0])
    setIsMounted(true);
    setIsFullMap(fullMap)
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
            >
              <MapMarker
                key={`marker-search-location`}
                coordinate={{
                  latitude: lat,
                  longitude: lng,
                }}
                setSearchLocation={restProps.setSearchLocation}
                isSelected={false}
              />

              {data.map((item) => (
                <MapMarker
                  data={item}
                  key={`marker-${item._id}`}
                  isFacility={true}
                  coordinate={{
                    latitude: item.location.coordinates[1],
                    longitude: item.location.coordinates[0],
                  }}
                  gender={item.user.gender == undefined ? "Both": item.user.gender}

                  isSelected={
                    restProps.selectedFacility
                      ? item._id === restProps.selectedFacility?._id
                      : false
                  }
                  onPress={() => restProps.setFacility(item)}
                />
              ))}

              <Circle
                center={{
                  latitude: restProps.searchLocation[1],
                  longitude: restProps.searchLocation[0]
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
            <ExpandButtonContainer>
                <IconButton
                  active={false}
                  activeColor={theme.colors.brand.primary}
                  inactiveColor={'black'}
                  onPress={refresh}
                >
                  {loading ? <ActivityIndicator color={theme.colors.brand.primary} /> : <Ionicons name={"refresh"} size={20} color={"white"} />}
                </IconButton>
                <Spacer position={"bottom"} size={"small"}/>
              <IconButton
                active={false}
                activeColor={'white'}
                inactiveColor={theme.colors.brand.secondary}
                onPress={() => resizeMap()}
              >
                {!fullMap ? <FontAwesome name="expand" size={20} color={"white"} /> : <Entypo name="resize-100" size={24} color="white" />}
              </IconButton>
              <Spacer position={"bottom"} size={"small"}/>
              {/* <InfoContainer>
                <Text variant={"caption"} style={{fontSize: 10, color: "white"}}>Hold and drag</Text>
                <View style={{width: 12, height: 12, borderRadius: 12, marginHorizontal: 4, backgroundColor: theme.colors.brand.primary, ...theme.shadows.default}} />
                <Text variant={"caption"} style={{fontSize: 10, color: "white"}}>to change search location</Text>
              </InfoContainer> */}
              <Spacer position={"bottom"} size={"small"}/>

              {/* <InfoContainer>
              <Text variant={"caption"} style={{fontSize: 10, color: "white"}}>Barber shop</Text>
              <View style={{width: 12, height: 12, borderRadius: 12, marginHorizontal: 4, backgroundColor: "#0096FF"}} />

              <Text variant={"caption"} style={{fontSize: 10, color: "white"}}>Salon</Text>
              <View style={{width: 12, height: 12, borderRadius: 12, marginHorizontal: 4, backgroundColor: "#FA8072"}} />

              <Text variant={"caption"} style={{fontSize: 10, color: "white"}}>Both</Text>
              <View style={{width: 12, height: 12, borderRadius: 12, marginHorizontal: 4, backgroundColor: "#fff"}} />


              </InfoContainer> */}

              {/* <Spacer position={"bottom"} size={"small"}/>

              <InfoContainer>
             

              </InfoContainer> */}


              
            </ExpandButtonContainer>




          </MapOuterContainer>
          <DataContainer carouselBottom={carouselBottom}>
            {!fullMap && (
              <>
                {/*<ContainerGradient*/}
                {/*  colors={[*/}
                {/*    rgba(theme.colors.brand.quaternary, 1),*/}
                {/*    rgba(theme.colors.brand.primary, 1),*/}
                {/*  ]}*/}
                {/*  start={[0, 1]}*/}
                {/*  end={[1, 0]}*/}
                {/*/>*/}

                {/*<View style={{ paddingHorizontal: 16, backgroundColor: theme.colors.brand.secondary}}>*/}
                {/*  <Spacer position="bottom" size="medium" />*/}

                {/*  <Text*/}
                {/*    variant="caption"*/}
                {/*    style={{*/}
                {/*      fontSize: 16,*/}
                {/*      fontWeight: "normal",*/}
                {/*      textAlign: "center",*/}
                {/*      color: "white",*/}
                {/*    }}*/}
                {/*  >*/}
                {/*    Press{" "}*/}
                {/*    <Text*/}
                {/*      variant="caption"*/}
                {/*      style={{ fontSize: 16, color: theme.colors.brand.quaternary }}*/}
                {/*    >*/}
                {/*      show results*/}
                {/*    </Text>{" "}*/}
                {/*    and pick the right professional for you*/}
                {/*  </Text>*/}
                {/*  <Spacer position="bottom" size="large" />*/}
                {/*</View>*/}
              </>
            )}
           

           {fullMap? <Carousel
              ref={flatList}
              data={data}
              renderItem={renderItem}
              keyExtractor={(item) => `bottom-flat-map-${item._id}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              sliderWidth={width}
              itemWidth={(width - 48) * 0.97}
              onSnapToItem={(index) => restProps.setFacility(data[index])}
            />:
            
            <View style={{justifyContent:"center",alignItems:"center"}}>
            <Carousel
          ref={flatList}
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => `bottom-flat-map-${item._id}`}
          vertical
          sliderHeight={250}
          itemHeight={120}
          

          onSnapToItem={(index) => restProps.setFacility(data[index])}
        
        />
        </View>
        
        
           }
          </DataContainer>
        {/*</>*/}
      {/*)}*/}
    </>
  );
};

const mapStateToProps = (state) => ({
  searchRadius: state.booking.searchRadius,
  selectedFacility: state.booking.facility,
  searchLocation: state.booking.searchLocation
});

const mapDispatchToProps = (dispatch) => ({
  setFacility: (facility) => dispatch(selectFacility(facility)),
  setSpecialist: (specialist) => dispatch(setSpecialist(specialist)),
  setSearchLocation: (location) => dispatch(setSearchLocation(location)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Map);