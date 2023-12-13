import { Dimensions, StyleSheet, Text, View,ScrollView,  Modal, TouchableOpacity,Platform ,ActivityIndicator} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import styled from "styled-components/native";
import { SafeArea, SafeArea1 } from "../../components/utils/safearea.component";
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useIsFocused, useNavigation } from "@react-navigation/native";
import mapStyles from "../components/mapStyles.json";
import { useTheme } from 'styled-components';

import MapView, { Circle } from 'react-native-maps';
import SyncStorage from "sync-storage"
import Map from "../components/specil.component";
import { MapMarker } from '../components/map-marker.component';
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { SearchLocation } from "../../components/form/input.component";
import SpecialistCard from "../components/specialist-card.component";
// import { useSelector } from 'react-redux';
import { PageContainer, Row } from "../../components/helpers/helpers.component";
import Carousel from 'react-native-snap-carousel';
import { FilterButton } from '../../components/button/button.component';
import { Spacer } from '../../components/spacer/spacer.component';
import { rgba } from 'polished';
import { LinearGradient } from "expo-linear-gradient";
import { connect, useDispatch, useSelector } from "react-redux";
import { BlurView } from "expo-blur";
import BookingStepper from "../components/booking-stepper.component";
import {
  Entypo,
  Feather,
  FontAwesome,
  Fontisto,
  MaterialIcons,
  Ionicons,
} from "@expo/vector-icons";
import { PriceRangeModal } from '../../components/bottom-sheet/PriceRangeModal';
import { GenderModal } from '../../components/bottom-sheet/GenderModal';
import { LocationModal } from '../../components/bottom-sheet/LocationModal';
import { MapModal } from '../../components/bottom-sheet/MapModel';
import { CategoryModal } from '../../components/bottom-sheet/CategoryModal';
import { SearchRadiusModal } from '../../components/bottom-sheet/SearchRadiusModal';
import { setMatchingFacilities } from "../../redux/facilities/facilities.actions";
import { setMatchSpecialists } from "../../redux/specialists/specialists.action";
import * as Location1 from 'expo-location'
import * as Location from 'expo-location'
import {
  clearCart,
  selectFacility,
  setCurrentCategory,
  setProGender, setSearchLocation,
  setSearchRadius,
  setSpecialist,
  setTargetGender,
} from "../../redux/booking/booking.actions";
import { AppContext } from '../../providers/app-provider';
import { LocationAction } from '../../redux/location/LocationAction';
import { useLayoutEffect } from 'react';
import { SpecialistContext } from '../../providers/specialist.provider';

const WelcomeText = styled(Text)`
  font-size: 30px;
  line-height: 40px;
  font-weight: bold;
`;

const AdSlideContainer = styled.View.attrs((props) => ({
  shadowColor: props.theme.colors.brand.quaternary,
  shadowOffset: {
    width: 4,
    height: 2,
  },
  shadowOpacity: 1,
  shadowRadius: 5,
  elevation: 1,
}))`
  height: 170px;
  background-color: white;
  border-radius: 20px;
  justify-content: center;
  margin-bottom: 18px;
`;
const AdContainer = styled.View`
  height: 170px;
  background-color: ${({ theme }) => rgba(theme.colors.brand.primary, 0.15)};
  border-radius: 20px;
  position: relative;
  overflow: hidden;
`;

const ContainerGradient = styled(LinearGradient)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const GlassBackground = styled(BlurView)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 60px;
`;

const Delivery = (props) => {
const { loadFilters, getUser, refreshSearch, isLoading,  searchSpecialist, onGetOrders , refreshing, onRefresh} = useContext(AppContext);
const {address, setAddress} = props
const {onGetSpecialistidd,specialistidd} =useContext(SpecialistContext)

  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [searchIsLoading, setSearchIsLoading] = useState(false);
  const [showGenderFilter, setShowGenderFilter] = useState(false);
  const [showPriceRangeFilter, setShowPriceRangeFilter] = useState(false);
  const [showSearchRadiusFilter, setShowSearchRadiusFilter] = useState(false);
  const [showMapModel,setShowMapFilter] =useState(false)
  const [showLocationFilter, setShowLocationFilter] = useState(false);
  const[specialist,setSpecialist]=useState('')
  const[location,setLocation] = useState()
  const [locationData, setlocationData] = useState(null);
  const [Coordinates, setCoordinates] = useState(null);
  const [data,setData]=useState([]);
  const { width, height } = Dimensions.get("window");
  const ASPECT_RATIO = width / height;
  const [currentScreen, setCurrentScreen] = useState('Delivery')
  const navigation=useNavigation();
  const LATITUDE_DELTA = Platform.OS === "IOS" ? 1.5 : 0.5;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  useEffect(()=>{
    const singldata=async()=>{
      
      if(props.newspecid){
        console.log("oggggggggspecidddddddddddddddddddddddddddddddddddomjdjkdjjdjkndnd",props.newspecid);
        await onGetSpecialistidd(props.newspecid);
        
      }
    } 
    singldata();
    
  },[props])

  useEffect(()=>{
    if(specialistidd){
      console.log("yoooooooiddddddd",specialistidd);
      // setSpecialist(specialistidd)
      // dispatch(setSpecialist(specialistidd))
      props.setSpecialist(specialistidd)
      navigation.navigate("SpecialistDetails", {
        edit: false,
        specialist: specialistidd,
        setnewspecid:props.setnewspecid
      });
    }
  },[specialistidd])
  
  const initialRegion = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: LATITUDE_DELTA * Number(1 / 15),
    longitudeDelta: LONGITUDE_DELTA * Number(1 / 15),
  };
  const [region, setRegion] = useState(initialRegion);
  const refreshData = () => {
    console.log("Asddasdasdasdasdasdasd");
    searchSpecialist({
       loadingAction: () => setSearchIsLoading(true),
       stopLoadingAction:  () => setSearchIsLoading(false),
       config: {
         searchLocation: props.searchLocation,
         searchRadius: props.searchRadius,
         targetGender: props.targetGender,
         proGender: props.proGender,
         priceRange: props.priceRange,
         currentService: props.currentService,
         serviceType: props.category
       },
       setMatchingFacilities: props.setMatchingFacilities,
       setMatchingSpecialists: props.setMatchingSpecialists
     });
     console.log("Asddasdasdasdasdasdasdadsasdads",props.specialists);
   } 
  

const setDeliveryStorage=async()=>{
  const cityy="udaipur";
try {
  await AsyncStorage.setItem(
    "loc",
    cityy
  )
} catch (error) {
  console.log("erorrrrrrrrrrrr",error);
}
}

const getDeliveryStorage=async()=>{
  
try {
  const value = await AsyncStorage.getItem(
    "loc"
  )
  console.log("#######################------------->", value);
} catch (error) {
  console.log("erorrrrrrrrrrrr",error);
}
}


const setDeliverylocation1 = async ()=>{
  const key = "del"
                      const coordinates = [props.searchLocation[1], props.searchLocation[0]];
  const stringifiedCoordinates = JSON.stringify(coordinates);

  await AsyncStorage.setItem(key, stringifiedCoordinates);
  props.setSearchLocation(props.searchLocation)
  setLocation()
}
useEffect(()=>{
  (async()=>{
    const locn = await fetchdeliverylocation()
    console.log("^^^^^^^^^^^^^^^^^^^^", locn);
    if(locn==null){
       setDeliverylocation1()
      
    }
  })
}, [])

  useEffect(() => {


    (async () => {

      await setDeliveryStorage();
      await getDeliveryStorage();
      
      let { status } = await Location.requestForegroundPermissionsAsync();
     
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }


  
      let location = await Location.getCurrentPositionAsync();
      console.log("asdasda=====11222======1221",location);
      setLocation(location);
    })();
  }, []);
  useEffect(() => {
    const loadAndSetFilters = async () => {
      const { serviceCategories, serviceTypes } = await loadFilters();
      const { user } = await getUser();
      await onGetOrders()
      // socket.auth = {username: user.id, id: user.id}
      // console.log(user);
      // props.setServicesCategories(serviceCategories);
      props.setServicesTypes(serviceTypes);
      props.setTargetGender(gen);
      props.setProGender(user.searchProGender);
      // props.setSearchRadius(user.searchRadius);
      props.setUser(user);

      console.log("delivery search loc", Coordinates == null ? user.searchLocation.coordinates : Coordinates);
    
      props.setSearchLocation( Coordinates == null ? user.searchLocation.coordinates : Coordinates)
  
      pubnub.setUUID(`${user.id}`)
      console.log('pubnub', pubnub.getUUID())
    
      
    };



  
   loadAndSetFilters();
   return () => {
     props.resetCart();
   };
  }, [props.navigation]);
  
  const [deliverylocation, setDeliverylocation] = useState()

  const fetchdeliverylocation = async ()=>{
    const jsonvalue = await AsyncStorage.getItem(
      'del'
    )
    const value = JSON.parse(jsonvalue)
    console.log("sujallllllllllllllllllllllllllllllllllllllllllllllll", value);
    setDeliverylocation(value)
    return value;
  }


const dispatch=useDispatch()
  const setlocation = async ()=>{
    console.log("SETTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT", props.searchLocation);
    // await AsyncStorage.setItem(
    //   'deliverylocation',
    //   props.searchLocation
    // )

    const val = await fetchdeliverylocation();
    dispatch(LocationAction(val ? val : props.searchLocation))


    let l = await Location1.reverseGeocodeAsync({
      "latitude" : val ?val[1] : props.searchLocation[1],
      "longitude": val? val[0] : props.searchLocation[0]
    })

    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~>", l);

    // setAddress(`${l[0].city==null?'':l[0].city},${l[0].street==null?'':l[0].street}`)
    setAddress(locationData == null? `${l[0].city==null?'':l[0].city},${l[0].street==null?'':l[0].street}`:`${locationData?.locality==null?'':locationData?.locality},${locationData?.address1==null?'':locationData?.address1}`)
    const result = SyncStorage.get('locationAddress');
    const city="udaipur";
    SyncStorage.setItem('deliveryStorage',city);
    const resultt=SyncStorage.getItem('deliverystorage');
    console.log("resulttttttttttttttttttttttttttttttttttttttttttt",resultt);

    SyncStorage.set('locationAddress',locationData == null? l[0] :result)
    mapRef.current?.animateToRegion(
      {
        latitudeDelta: LATITUDE_DELTA * Number(radius / 15),
        longitudeDelta: LONGITUDE_DELTA * Number(radius / 15),
        latitude: Coordinates[1],
        longitude:  Coordinates[0],
      },
      1000
    );
  }
  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});

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
   
  useLayoutEffect( () => {
    getCurrentLocation()
    refreshData();
    setlocation();
    console.log("bhagaaaaaaaaaaa");
  // })
 }, [refreshSearch, location, props.targetGender, props.priceRange, props.category, props.searchLocation, props.proGender, props.currentService, props.searchRadius])

 
  const handleShowCategoryFilterChange = () => {
    setShowCategoryFilter(!showCategoryFilter);
  };
  const handleShowLocationFilterChange = () => {
    setShowLocationFilter(!showLocationFilter);
  };

  const handleShowMapChange = () => {
    setShowMapFilter(!showMapModel);
  };
  const handleShowGenderFilterChange= () =>{
    setShowGenderFilter(!showGenderFilter)
  }
  

  const handleShowPriceRangeFilterChange = () => {
    setShowPriceRangeFilter(!showPriceRangeFilter);
  };
  const handleShowSearchRadiusFilterChange = () => {
    setShowSearchRadiusFilter(!showSearchRadiusFilter);
  };

  
  // console.log("propsofdeliveryyyyyy",props);
  const renderFilterButton = (
    label,
    active,
    value,
    renderValue,
    handlePress
  ) => {
    return (
      <FilterButton
        active={active || value}
        onPress={handlePress}
        style={{
          position: "relative",
          borderColor: "transparent",
        }}
      >
        <GlassBackground intensity={80} />
        <Text
          variant="caption"
          style={{
            color: (active || value) ? "white" : "black",
            fontSize: 14,
            fontWeight: active || value ? "bold" : "normal",
          }}
        >
          {value ? renderValue(value) : label}
        </Text>
        <Spacer position="left" size="medium" />
        <Entypo name="chevron-down" color={(active || value) ? "white" : "black"} />
      </FilterButton>
    );
  };

  const renderCategory = (value) => {
    return (
      <Text
        variant="caption"
        style={{
          fontSize: 14,
          fontWeight: "bold",
          color: "white",
        }}
      >
        {value.name}
      </Text>
    );
  };
  const renderGender = (value) => {
    return (
      <Text
        variant="caption"
        style={{
          fontSize: 14,
          fontWeight: "bold",
          color: "white",
        }}
      >
        Styles
      </Text>
    );
  };
  const renderPriceRange = (value) => {
    return (
      <Text
        variant="caption"
        style={{ fontSize: 14, fontWeight: "bold", color: "white" }}
      >
        <Feather name="dollar-sign" size={16} />
        {value[0]} - <Feather name="dollar-sign" size={16} />
        {value[1]}
      </Text>
    );
  };
  const renderSearchRadius = (value) => {
    return (
      <Text
        variant="caption"
        style={{
          fontSize: 14,
          fontWeight: "bold",
          color: "white",
        }}
      >
        Distance {value} km
      </Text>
    );
  };
  const renderFilters = () => {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Spacer position="left" size="large" />
        {props.currentService && (
          <>
            <FilterButton
              onPress={() => props.navigation.navigate("Search")}
              style={{
                borderColor: theme.colors.brand.secondary,
                backgroundColor: theme.colors.brand.secondary,
              }}
            >
              {/*<GlassBackground intensity={100} />*/}
              <Text
                variant="caption"
                style={{
                  color: "white",
                  fontSize: 14,
                  fontWeight: "bold",
                }}
              >
                {props.currentService.name}
              </Text>
              <Spacer position="left" size="medium" />
              <Entypo name="chevron-down" color="white" />
            </FilterButton>
            <Spacer position="left" size="medium" />
          </>
        )}
        {renderFilterButton(
          "Type of service",
          showCategoryFilter,
          props.category,
          renderCategory,
          handleShowCategoryFilterChange
        )}
        <Spacer position="left" size="medium" />
        {renderFilterButton(
          "Gender",
          showGenderFilter,
          props.targetGender,
          renderGender,
          handleShowGenderFilterChange
        )}
        <Spacer position="left" size="medium" />
        {renderFilterButton(
          "Price range",
          showPriceRangeFilter,
          props.priceRange,
          renderPriceRange,
          handleShowPriceRangeFilterChange
        )}
        {/* <Spacer position="left" size="medium" />
        {renderFilterButton(
          "Sort by",
          showSortFacilityFilter,
          props.sortFacilitiesBy,
          renderSortFacility,
          handleShowSortFacilityFilterChange
        )} */}
        <Spacer position="left" size="medium" />
        {renderFilterButton(
          "Search radius",
          showSearchRadiusFilter,
          props.searchRadius,
          renderSearchRadius,
          handleShowSearchRadiusFilterChange
        )}
        <Spacer position="left" size="medium" />
      </ScrollView>
    );
  };

const theme = useTheme();
    const mapRef = useRef(null);
    const flatList = useRef(null);
    const lng = -73.77249799668789
    const lat = 45.504769529788376


    const isFocused = useIsFocused()

    const selectedFacility = useSelector((state)=>state.booking.facility)
    useEffect(() => {
    

      const index = props?.specialists.findIndex(
        (item) => item.id === specialist?._id
      );
      flatList.current?.snapToItem(index);
      fitMapToCircle()
  
    }, [specialist]);
    
    const fitMapToCircle = (node) =>  {
        mapRef.current?.fitToCoordinates([...props.specialists.map(item => {
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
      const gradients = [
        [rgba(theme.colors.brand.primary, 0.9), rgba("#92FE9D", 0.9)],
        [
          rgba(theme.colors.brand.secondary, 0.9),
          rgba(theme.colors.brand.tertiary, 0.9),
        ],
        [rgba("#06beb6", 0.9), rgba("#48b1bf", 0.9)],
        [rgba(theme.colors.brand.primary, 0.9), rgba(theme.colors.ui.primary, 0.9)],
      ];
      console.log("changing specialistsss",locationData);
    return (
    <>
      <SafeArea1>
      <View style={{height:80,flexDirection:'row',alignItems:'center'}}>
      <TouchableOpacity style={{backgroundColor:currentScreen=='SalonScreen'?'#fff': theme.colors.brand.secondary,width:'50%',height:80,alignItems:'center',justifyContent:'center'}} onPress={()=>setCurrentScreen('Delivery')}>
     
        <Text style={{fontWeight:'bold'}}>Delivery</Text>
     <View style={{flex:1,flexDirection:"row",position:'absolute',bottom:-2,marginVertical:12}}> 
      
     <Entypo
              name="location-pin"
              size={16}
              color={"black"}
            />
            <Text onPress={()=>  currentScreen=='Delivery' ? setShowMapFilter(true):setCurrentScreen('Delivery')} style={{borderWidth:1,borderRadius:10,paddingHorizontal:5}}>{address.length<20 ? address:`${address.slice(0,20)}....`}</Text>
            </View>
      </TouchableOpacity>
      <TouchableOpacity style={{backgroundColor:currentScreen=='Delivery'?'#fff': theme.colors.brand.secondary,width:'50%',height:80,alignItems:'center',justifyContent:'center'}} onPress={()=>props.changescreen('SalonScreen')} ><MaterialIcons name="storefront" size={18} color="black"  style={{top:10}} /><Text style={{fontWeight:'bold',top:10}}>In Salon</Text>
     
      </TouchableOpacity>
      </View>
      </SafeArea1>
      <SafeArea style={{backgroundColor: theme.colors.brand.white}}>
      <PageContainer  style={{position: 'relative', backgroundColor: theme.colors.brand.white}}>
      
     <View
              style={{
                backgroundColor: rgba(theme.colors.brand.quaternary, 0),
              }}
            >
              {/* <Spacer position="bottom" size="medium" /> */}
              {renderFilters()}
              <Spacer position="bottom" size="medium" />
              <Spacer position="bottom" size="medium" />
            </View>
         
     
{/* <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={{ flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,}}>
          <View style={{ margin: 20,
    backgroundColor: 'white',
    width:"80%",
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,}}>
            <Text style={{  marginBottom: 15,
    textAlign: 'center',}}>Hello World!</Text>
     

          
          </View>
        </View>
      </Modal> */}
  
  {searchIsLoading ? <ActivityIndicator /> :  <Map
          key={'map-full'}
          fullMap={false}
          carouselBottom={true}
          loading={isLoading}
          data={props.specialists}
          delivery={true}
       
          // resizeMap={toggleFullMap}
          renderItem={({ item, index }) => (
            <SpecialistCard 
              navigation={navigation}
              darkTheme={true}
              active={item.id === specialist?._id}
              onPress={() => {
                props.setSpecialist(item);
                console.log("theogitem",item);
                
                navigation.navigate("SpecialistDetails", {
                  edit: false,
                  specialist: item
                });
              }}
              specialist={item}
              locationData={locationData}
              sharelinkdata={specialistidd}
            />
          )}
        
        />
            }
</PageContainer>

    <PriceRangeModal
        showModal={showPriceRangeFilter}
        toggleShowModal={handleShowPriceRangeFilterChange}
      />
      <GenderModal
        showModal={showGenderFilter}
        toggleShowModal={handleShowGenderFilterChange}
        data = {data}
      />
      <LocationModal
        showModal={showLocationFilter}
        toggleShowModal={handleShowLocationFilterChange}

      />
            <MapModal
        showModal={showMapModel}
        toggleShowModal={handleShowMapChange}
        SetLoctiondata={setlocationData}
        setCoordinates={setCoordinates}
      />
      {/* <SortFacilityModal
        showModal={showSortFacilityFilter}
        toggleShowModal={handleShowSortFacilityFilterChange}
      /> */}
      <CategoryModal
        showModal={showCategoryFilter}
        toggleShowModal={handleShowCategoryFilterChange}
        data={data}
      />
      <SearchRadiusModal
        showModal={showSearchRadiusFilter}
        toggleShowModal={handleShowSearchRadiusFilterChange}
      />
      {
<TouchableOpacity 
          style={{ 
              borderWidth: 1, 
              borderColor: 'white', 
              alignItems: 'center', 
              justifyContent: 'center', 
              width: 60, 
              position: 'absolute', 
              top: 650, 
              right: 20, 
              height: 60, 
              backgroundColor: theme.colors.brand.primary, 
              borderRadius: 100, 
          }} 
          onPress={() => refreshData()} 
      > 
      <Ionicons name={"refresh"} size={30} color={"white"} />
          {/* <Text style={{ color: "white" }}>Refresh</Text>  */}
      </TouchableOpacity> 
      }
       </SafeArea> 
       </> )
}

const mapStateToProps = (state) => ({
    selectedFacility: state.booking.facility,
    facilities: state.facilities.facilities,
    specialists: state.specialists.specialists,
    targetGender: state.booking.targetGender,
    priceRange: state.booking.priceRange,
    category: state.booking.currentCategory,
    currentService: state.booking.currentService,
    sortFacilitiesBy: state.booking.sortFacilitiesBy,
    searchRadius: state.booking.searchRadius,
    searchLocation: state.booking.searchLocation,
  });
  
  const mapDispatchToProps = (dispatch) => ({
    setTargetGender: (gender) => dispatch(setTargetGender(gender)),
    setSearchRadius: (radius) => dispatch(setSearchRadius(radius)),
    setProGender: (gender) => dispatch(setProGender(gender)),
    setUser: (user) => dispatch(setUser(user)),
    setSearchLocation: (location) => dispatch(setSearchLocation(location)),
  
    
    setMatchingFacilities: (facilities) =>
      dispatch(setMatchingFacilities(facilities)),
    setMatchSpecialists: (specialists) =>
      dispatch(setMatchSpecialists(specialists)),
    setFacility: (facility) => dispatch(selectFacility(facility)),
    setSpecialist: (specialist) => dispatch(setSpecialist(specialist)),
    resetCart: () => dispatch(clearCart()),
    setCurrentCategory: (category) => dispatch(setCurrentCategory(category)),
  });
  

export default connect(mapStateToProps, mapDispatchToProps)(Delivery)

const styles = StyleSheet.create({})