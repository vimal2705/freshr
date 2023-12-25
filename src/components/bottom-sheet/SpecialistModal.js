import styled, {useTheme} from 'styled-components/native';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { Dimensions, FlatList, View } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { connect } from "react-redux";


import { SectionTitle } from "../../screens/components/details-screen.component";
import { Spacer } from "../spacer/spacer.component";
import { Text } from "../typography/typography.component";
import { Row } from "../helpers/helpers.component";
import SpecialistCard from "../../screens/components/specialist-card.component";
import { setSortMethod } from "../../redux/booking/booking.actions";
import { CloseButton, SortButton, SortFilterContainer, SortFilterContainerSeparator } from "./bottom-sheet.component";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { getRegionForCoordinates } from "../../screens/components/map.component";
import mapStyles from "../../screens/components/mapStyles.json";
import MapView, { Circle, Marker } from "react-native-maps";
import { MapMarker } from "../../screens/components/map-marker.component";
import Carousel from "react-native-snap-carousel";
import { getBoundsOfDistance } from "geolib";
import { rgba } from "polished";
import { SpecialistContext } from '../../providers/specialist.provider';
import * as Location from 'expo-location'
import { HostContext } from '../../providers/facility.provider';

const SpecialistListContainer = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  
  background-color: black;
  border: 1px solid #25282b;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding: 16px 0;
`

const { width } = Dimensions.get("window");



const mapStateToProps = (state) => ({
  sortMethod: state.booking.sortBy,
  selectedFacility: state.booking.facility,
  selectedSpecialist: state.booking.specialist,
  searchLocation: state.booking.searchLocation,
  searchRadius: state.booking.searchRadius,
});

const mapDispatchToProps = (dispatch) => ({
  setSortMethod: (method) => dispatch(setSortMethod(method)),
});

const SpecialistList = ({selectedFacility,saloonspec,setsaloonspec, handleClose, setSpecialist, selectedSpecialist, searchLocation, searchRadius,singleFacilityy}) => {
  
  const {setSingleFacilityy} = useContext(HostContext)
  const navigation = useNavigation()
  const theme = useTheme();
  const mapRef = useRef(null);
  const flatList = useRef(null);
  const isFocused = useIsFocused()
  const [lng, lat] = searchLocation;
const {onGetSpecialistidd,specialistidd} =useContext(SpecialistContext)

const [currentloc, setCurrentloc] = useState(null)

  const getcurrentlocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
      console.log("unka afterr", status);
      if (status !== 'granted') {
        sendMessage(
          "Failure",
          'Please allow geolocation',
          "warning",
          2500,
          theme.colors.ui.warning
        );
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setCurrentloc(location.coords)
  }
// console.log("");
useEffect(()=>{
  getcurrentlocation()
}, [])

  // console.log("----------------->", lat, lng);

  // console.log("================================>BEforeeeee",selectedFacility, singleFacilityy);

  // console.log("================================>duppppppppppp",selectedFacility);
  // useEffect(()=>{
  //   if(singleFacilityy){
  //     selectedFacility=singleFacilityy[0];
  // console.log("================================>After",selectedFacility);

  //   }
  // },[singleFacilityy])

  // console.log("outside----------------->", selectedFacility);
  useEffect(()=>{
    const singldata=async()=>{
      
      if(saloonspec){
        console.log("saloonspeccccccccccccccc",saloonspec);
        await onGetSpecialistidd(saloonspec);
      }
    } 
    singldata();
    
  },[saloonspec])

  useEffect(()=>{
    if(specialistidd){
      console.log("yoooooooiddddddd",specialistidd);
      setSpecialist(specialistidd)
      navigation.navigate("SpecialistDetails", {
        edit: false,
        specialist: specialistidd,
        setsaloonspec:setsaloonspec
      });
    }
  },[specialistidd])


  useEffect(() => {
    if(!selectedFacility) handleClose()
  }, [selectedFacility])


  useEffect(() => {

    const index = singleFacilityy ? singleFacilityy[0]?.specialists?.findIndex(
      (item) => item.id === selectedSpecialist?.id
    ) :  selectedFacility?.specialists?.findIndex(
      (item) => item.id === selectedSpecialist?.id
    );
    flatList.current?.snapToItem(index);
    fitMapToCircle()

  }, [selectedSpecialist]);

  const fitMapToCircle = (node) =>  {
    mapRef.current?.fitToCoordinates(singleFacilityy ? 
      
      [...singleFacilityy[0]?.specialists.map(item => {
        const coordinates = item.location.coordinates
        return {latitude: coordinates[1], longitude: coordinates[0]}
      }),  {
        latitude: singleFacilityy[0]?.location.coordinates[1],
        longitude: singleFacilityy[0]?.location.coordinates[0],
      }]
      :
       [...selectedFacility?.specialists.map(item => {
        const coordinates = item.location.coordinates
        return {latitude: coordinates[1], longitude: coordinates[0]}
      }),  {
        latitude: selectedFacility?.location.coordinates[1],
        longitude: selectedFacility?.location.coordinates[0],
      }],
      {
        edgePadding: {
          top: 35,
          right: 10,
          bottom: 5,
          left: 10,
        },
      })
  }


  return <SpecialistListContainer>
    <CloseButton
      onPress={() =>{
        setSingleFacilityy(null)
        handleClose()
      } }
      style={{
        backgroundColor: "white",
        shadow: theme.shadows.default,
      }}>
      <Ionicons name="close" size={20} color={"#25282b"}/>
    </CloseButton>
    <Spacer position={"bottom"} size={"large"}/>

    {isFocused && <MapView
      
      ref={mapRef}
      onLayout={() => fitMapToCircle()}
      customMapStyle={mapStyles}
      style={{
        height: 250,
        width: "100%",
      }}
      toolbarEnabled={false}
    >
      <MapMarker
        key={`marker-search-location`}
        coordinate={ currentloc ? currentloc : {
          latitude: lat,
          longitude: lng,
        }}
        isSelected={false}
      />
      <Circle
        center={{
          latitude: lat,
          longitude: lng
        }}
        radius={searchRadius * 1000}
        strokeColor={theme.colors.brand.primary}
        strokeWidth={3}
        fillColor={rgba(theme.colors.brand.primary, 0.3)}
        zIndex={2}
      />
      {isFocused && <MapMarker
        data={singleFacilityy ? singleFacilityy[0] : selectedFacility}
        isFacility={true}
        active={true}
        coordinate={{
          latitude: singleFacilityy ? singleFacilityy[0]?.location?.coordinates[1] : selectedFacility?.location.coordinates[1],
          longitude: singleFacilityy ? singleFacilityy[0]?.location?.coordinates[0] :selectedFacility?.location.coordinates[0],
        }}
        isSelected={true}
        onPress={() => null}
      />}
      {selectedFacility && selectedFacility?.specialists && (singleFacilityy ? singleFacilityy[0]: selectedFacility)?.specialists.map(specialist => (
        <>
          {isFocused && <MapMarker
            data={specialist}
            active={specialist.id === selectedSpecialist?.id}
            isSelected={specialist.id === selectedSpecialist?.id}
            isBarber={true}
            coordinate={{
              latitude: specialist.location.coordinates[1],
              longitude: specialist.location.coordinates[0],
            }}
            onPress={() => setSpecialist(specialist)}
          />}
        </>
      ))}
    </MapView>}
    <Spacer position={"bottom"} size={"large"}/>
    <View style={{padding: 16}}>
      <SectionTitle style={{color: "white"}}>Professionals</SectionTitle>
      <Spacer position="bottom" size="medium" />
      <Text variant="caption" style={{fontWeight: "light", color: "white"}}>Select professional and book a seat</Text>
      <Spacer position="bottom" size="large" />
      <Spacer position="bottom" size="medium" />
    </View>
    <Carousel
      horizontal
      showsHorizontalScrollIndicator={false}
      sliderWidth={width}
      itemWidth={(width - 48) * 0.97}
      onSnapToItem={(index) => setSpecialist(singleFacilityy ? singleFacilityy[0]?.specialists[index] : selectedFacility?.specialists[index])}
      ref={flatList}
      style={{ paddingHorizontal: 4 }}
      showsVerticalScrollIndicator={false}
      data={singleFacilityy ? singleFacilityy[0]?.specialists :  selectedFacility ? selectedFacility?.specialists : [] }
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <SpecialistCard
          navigation={navigation}
          darkTheme={true}
          active={item.id === selectedSpecialist?.id}
          onPress={() => {
            setSpecialist(item);
            navigation.navigate("SpecialistDetails", {
              edit: false,
            });
          }}
          specialist={item}
        />
      )}
    />
  </SpecialistListContainer>
}

export const SpecialistListModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(SpecialistList);



const SpecialistsModalComponent = (props) => {
  const theme = useTheme();
  // ref
  const bottomSheetRef = useRef(null);

  const snapPoints = useMemo(() => ["1%", "40%", "93%"], []);

  // callbacks
  const handleSheetChanges = useCallback((i) => {
    props.setIndex(i);
    console.log("Handle changes", i);
  }, []);

  const checkSortMethod = (label) => {
    return label === props.sortMethod;
  };

  const handleSortButtonPress = (label) => {
    props.setSortMethod(label);
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={props.index}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      style={{ borderRadius: 10, overflow: "hidden" }}
      elevation={1}
      enablePanDownToClose={true}
    >
      <View style={{ flex: 1, backgroundColor: "black" }}>
        <View style={{ padding: 16 }}>
          <SectionTitle style={{color: "white"}}>Professionals</SectionTitle>
          <Spacer position="bottom" size="medium" />
          <Text variant="caption" style={{fontWeight: "light", color: "white"}}>Select profess a seat</Text>
          <Spacer position="bottom" size="large" />
          <Spacer position="bottom" size="medium" />

          <Row>
            <MaterialIcons name="sort" size={16}  color={theme.colors.brand.primary}/>
            <Spacer position="left" size="medium" />
            <Text variant="caption" style={{ fontSize: 16, color: theme.colors.brand.primary }}>
              Sort by
            </Text>
          </Row>

          <Spacer position="bottom" size="medium" />
          <SortFilterContainer>
            <SortButton
              active={checkSortMethod("pricing")}
              onPress={() => handleSortButtonPress("pricing")}
            >
              <Text
                variant="caption"
                style={{
                  color: "white",
                }}
              >
                Pricing
              </Text>
            </SortButton>
            <SortFilterContainerSeparator />
            <SortButton
              active={checkSortMethod("popularity")}
              onPress={() => handleSortButtonPress("popularity")}
            >
              <Text
                variant="caption"
                style={{
                  color: "white",
                }}
              >
                Popularity
              </Text>
            </SortButton>
            <SortFilterContainerSeparator />
            <SortButton
              active={checkSortMethod("rating")}
              onPress={() => handleSortButtonPress("rating")}
            >
              <Text
                variant="caption"
                style={{ color: "white" }}
              >
                Rating
              </Text>
            </SortButton>
          </SortFilterContainer>
        </View>

        <BottomSheetFlatList
          style={{ paddingHorizontal: 16 }}
          showsVerticalScrollIndicator={false}
          data={singleFacilityy ? singleFacilityy[0]?.specialists :  props.selectedFacility ? props.selectedFacility?.specialists : [] }
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SpecialistCard
              navigation={props.navigation}
              darkTheme={true}
              onPress={() => {
                props.setSpecialist(item);
                props.navigation.navigate("SpecialistDetails", {
                  edit: false,
                });
              }}
              specialist={item}
            />
          )}
        />
      </View>
    </BottomSheet>
  );
};



export const SpecialistsModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(SpecialistsModalComponent);
