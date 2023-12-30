import { connect, useDispatch, useSelector } from "react-redux";
import styled, { useTheme } from "styled-components/native";
import {
  Entypo,
  Feather,
  FontAwesome,
  Fontisto,
  MaterialIcons,
  Ionicons,
} from "@expo/vector-icons";

import {
  FilterButton,
  IconButton,
} from "../../components/button/button.component";

import { SafeArea, SafeArea1 } from "../../components/utils/safearea.component";
// import {
//   Text,
// } from "../../components/typography/typography.component";
import { PageContainer, Row } from "../../components/helpers/helpers.component";
import { Spacer } from "../../components/spacer/spacer.component";
import { renderSearch } from "./utils";
import SyncStorage from 'sync-storage';
import {
  clearCart,
  selectFacility,
  setCurrentCategory,
  setProGender, setSearchLocation,
  setSearchRadius,
  setSpecialist,
  setTargetGender,
} from "../../redux/booking/booking.actions";
import React, {  useContext, useEffect, useRef, useState,useCallback } from "react";
import { setMatchingFacilities } from "../../redux/facilities/facilities.actions";
import { setMatchingSpecialists } from "../../redux/specialists/specialists.action";
import * as Location1 from 'expo-location'
import { rgba } from "polished";
import {
  Dimensions,
  ScrollView,
  TouchableOpacity,
  View,
  TextInput,
  Text,

  StyleSheet, ActivityIndicator, RefreshControl, SafeAreaView, Alert, BackHandler,
} from "react-native";
import Map from "../components/map.component";
import FacilityCard from "../components/facility-card.component";
import {
  PaddedContainer,
  SectionTitle,
} from "../components/details-screen.component";
import Carousel, { Pagination } from "react-native-snap-carousel";
import {  useNavigation ,useFocusEffect, useRoute} from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { AppContext } from "../../providers/app-provider";
import {
  setServicesCategories,
  setServicesTypes,
} from "../../redux/services/services.action";
import { io } from "socket.io-client";
import socketServices from "./components/Socket";
import { LoadingScreen } from "../loading.screen";
import { setUser } from "../../redux/auth/auth.actions";
import { SpecialistListModal, SpecialistsModal } from "../../components/bottom-sheet/SpecialistModal";
import { SearchRadiusModal } from "../../components/bottom-sheet/SearchRadiusModal";
import { CategoryModal } from "../../components/bottom-sheet/CategoryModal";
import { SortFacilityModal } from "../../components/bottom-sheet/SortFacilityModal";
import { LocationModal } from "../../components/bottom-sheet/LocationModal";
import { GenderModal } from "../../components/bottom-sheet/GenderModal";
import { PriceRangeModal } from "../../components/bottom-sheet/PriceRangeModal";
import axios from "axios";
import { BASE_API_URL } from "../../constants";
import { PubNubProvider, usePubNub } from "pubnub-react";

import { sendMessage } from "../../providers/utils";
import * as Device from "expo-device";
import { setMessageSeen } from "../../redux/chat/chat_actions";
import { AuthContext } from "../../providers/auth/auth.context";
import Delivery from "./Delivery";
import Saloon from "./Saloon";
import { Modal } from "react-native-paper";
import SpecialistCard from "../components/specialist-card.component";
import AsyncStorage from "@react-native-async-storage/async-storage";


// import { Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";


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

const HomeScreen = (props) => {
  // const { id } = props?.route?.params;
  const route=useRoute();
  
  



  const theme = useTheme();
  const [searchIsLoading, setSearchIsLoading] = useState(false);
  const { loadFilters, getUser, refreshSearch, isLoading, search,  onGetOrders , refreshing, onRefresh} = useContext(AppContext);
  const [fullMap, setFullMap] = useState(false)
  const [showSortFacilityFilter, setShowSortFacilityFilter] = useState(false);
  const [showSearchRadiusFilter, setShowSearchRadiusFilter] = useState(false);
  const [showGenderFilter, setShowGenderFilter] = useState(false);
  const [showLocationFilter, setShowLocationFilter] = useState(false);
  const [showPriceRangeFilter, setShowPriceRangeFilter] = useState(false);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [showSpecialistList, setShowSpecialistList] = useState(false);
  const [refreshingData, setRefreshingData] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('SalonScreen')
const [user1, setUser1] = useState()
  const[modal,setModal] = useState(false)
  const [address, setAddress] = useState([])
  const[Notify,setNotify]=useState(false);
  const [data, setData] = useState({}); 
  const [rejectmodal, setRejectmodal] = useState(false)
  const [facid,setfacid]=useState(null);
  const [specid,setspecid]=useState(null);
  const[newspecid,setnewspecid]=useState(null);
  const[saloonspec,setsaloonspec]=useState(null)


  const [rejectSpecialist, setRejectSpecialist] = useState([])
 
  const pubnub = usePubNub();
  const dispatch=useDispatch();
  const {user} = useContext(AuthContext)

  // console.log("userrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr",user);


useEffect(async ()=>{


  socketServices.initializeSocket();
 
  socketServices.on('Send_complete_Busy',(dataa)=>{
    console.log("finallyfinalllllllllll doneee",dataa);
    refreshData();
  })

  // const { user } = await getUser();
},[])

useEffect(()=>{
  console.log("checkkkkkkkk",route?.params);
  if(route?.params?.data == "true"){
    console.log("oggggggspceeeeeeiddddddddddd",route?.params);
    setCurrentScreen("Delivery");
    setnewspecid(route?.params?.id)
    
  }
  else if(route?.params?.id){
    console.log("++try",route?.params?.data);
    const { id } = route.params;
    setCurrentScreen('SalonScreen')
    setfacid(id);
    console.log("idddddfrommmmlinkkkkkkkk",id);
    if(route?.params?.spid != "null"){
      setsaloonspec(route?.params?.spid);
    }
    }
    
},[route.params])
useFocusEffect(useCallback(()=>{
  socketServices.initializeSocket(); 
  socketServices.on('recived_message',(msg)=>{

     
  
    //condition ===>> if(myId == msg.to) set MessageSeen(true)
      if( user._id != msg.from){
       
        dispatch(setMessageSeen(true)); 
      }
  })
  
  
},[]))


//  Notify?dispatch(setMessageSeen(true)):null;
  // const [ads, setAds] = useState([
  //   {
  //     id: 1,
  //     text: "Top services",
  //   },
  //   {
  //     id: 2,
  //     text: "Top services",
  //   },
  //   {
  //     id: 3,
  //     text: "Top services",
  //   },
  //   {
  //     id: 4,
  //     text: "Top services",
  //   },
  // ]);
  const [activeSlide, setActiveSlide] = useState(0);
  const adSliderRef = useRef(null);
  const [check,setChecked] = useState(false)

  // const search = async () => {
  //   try {
  //     setSearchIsLoading(true)
  //     const [lng, lat] = props.searchLocation
  //     const searchURL = `${BASE_API_URL}/services/services-within/${(props.searchRadius || 3)}/center/${lat},${lng}/unit/km/${props.targetGender || 'all'}/${props.proGender || 'all'}/${props.currentService?.name.toLowerCase() || 'all'}`
  //     console.log(searchURL)
  //     const res = await axios.get(
  //       searchURL
  //     );
  //     props.setMatchingFacilities(res.data.data.facilities);
  //     if (res.data.data.facilities.length > 0) {
  //       props.setMatchingSpecialists(res.data.data.facilities[0].specialists);
  //       props.setFacility(res.data.data.facilities[0]);
  //     }
  //     // await onGetOrders();
  //     setSearchIsLoading(false)
  //   } catch(err) {
  //     console.log(err)
  //     setSearchIsLoading(false);
  //   }
  // }



  //



  const refreshData = () => {
    search({
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
  } 
  const gen = useSelector(state=>state.booking.targetGender)

  const { onLogout} = useContext(AuthContext)

  const navigation = useNavigation()


  useEffect(async() => {

    const { user } = await getUser();
  
   

    const backAction = () => {
 
      if( user?.firstName == 'Guest'){
    
  if (props.navigation.isFocused()) {
    Alert.alert(
    "Exit App",
    "Do you want to exit?",
    [
      {
        text: "No",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      },
      { text: "Yes", onPress: () => onLogout() }
    ],
    { cancelable: false }
    );
}
else{

  navigation.goBack()
}
        
      }
      else{
        if (props.navigation.isFocused()) {
          BackHandler.exitApp()

        }
        else{
          navigation.goBack()
      
        props.navigation.goBack()
        }
      }
      return true;
    
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

// console.log("user1111", user1);



  useEffect(() => {
    const loadAndSetFilters = async () => {
      const { serviceCategories, serviceTypes } = await loadFilters();
      const { user } = await getUser();
      setUser1(user)
      await onGetOrders()
      // socket.auth = {username: user.id, id: user.id}
      // console.log(user);
      props.setServicesCategories(serviceCategories);
      props.setServicesTypes(serviceTypes);
      props.setTargetGender(gen);
      props.setProGender(user.searchProGender);
      // props.setSearchRadius(user.searchRadius);
      props.setUser(user);
      props.setSearchLocation(user.searchLocation.coordinates)
      pubnub.setUUID(`${user.id}`)
      console.log('pubnub', pubnub.getUUID())
    
    };
    loadAndSetFilters();
    return () => {
      props.resetCart();
    };
  }, [props.navigation.route]);

  useEffect(() => {
    // if(address.length==0){
     refreshData();
    // }
  }, [refreshSearch,  props.targetGender, props.priceRange, props.category, props.searchLocation, props.proGender, props.currentService, props.searchRadius ,props.currentscreen])

  if (isLoading) {
    return <LoadingScreen />;
  }
  const toggleFullMap = () => {
    setFullMap(!fullMap);
  }

  const handleShowGenderFilterChange = () => {
    setShowGenderFilter(!showGenderFilter);
  };

  const handleShowPriceRangeFilterChange = () => {
    setShowPriceRangeFilter(!showPriceRangeFilter);
  };

  const handleShowLocationFilterChange = () => {
    setShowLocationFilter(!showLocationFilter);
  };

  const handleShowCategoryFilterChange = () => {
    setShowCategoryFilter(!showCategoryFilter);
  };

  const handleShowSortFacilityFilterChange = () => {
    setShowSortFacilityFilter(!showSortFacilityFilter);
  };

  const handleShowSearchRadiusFilterChange = () => {
    setShowSearchRadiusFilter(!showSearchRadiusFilter);
  };

  useEffect(()=>{
    let data = {}; 
    data = SyncStorage.get('filters');
    console.log("dataaaa of filtersssssssssss",data); 
    if(data!=undefined && Object.keys(data).length > 0){
      setChecked(true)
      setData(data) 
      if(data.category != null){
        dispatch(setCurrentCategory(data.category)) 
      }
      if(data.targetGender != ""){

        dispatch(setTargetGender(data.targetGender))
      }
      dispatch(setSearchRadius(data.searchRadius))
    }  
    console.log("oooooooo",data);
  }, [])



  const savefilter =()=>{
    console.log(SyncStorage.get('filters')),
    SyncStorage.set('filters', {"category":props.category,"priceRange":props.priceRange,"targetGender": props.targetGender, "sortFacilitiesBy": props.sortFacilitiesBy,"searchRadius": props.searchRadius}).then(() => {
      setData(SyncStorage.get('filters'))
      setChecked(!check)
    })
    .catch(error => {
      console.log(error);
    });
  }

  const renderAddress = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
          paddingBottom: 0,
        }}
      >
        <TouchableOpacity
          style={{
            flexDirection: "row",
            flex: 1,
            alignItems: "center",
            justifyContent: 'center',
            paddingHorizontal: 16,
            height: 50,
            borderRadius: 5,
            position: "relative",
            backgroundColor: theme.colors.brand.primary,
          }}
          onPress={() => setShowLocationFilter(!showLocationFilter)}
        >
          <GlassBackground intensity={40} />
          <Entypo
            name="location-pin"
            size={20}
            color={"white"}
          />
          <Spacer position="left" size="medium" />
          {/*<Text variant="caption">Current location</Text>*/}
          {/*<Spacer position="bottom" size="small" />*/}
          <Text
            variant="caption"
            numberOfLines={1}
            ellipsis="tail"
            style={{
              fontSize: 16,
              color: 'white',
            }}
          >
            Koblenz metterninch
          </Text>
        </TouchableOpacity>
      </View>
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

  const renderSortFacility = (value) => {
    return (
      <Row>
        <MaterialIcons name="sort" size={16} />
        <Spacer position="left" size="medium" />
        <Text
          variant="caption"
          style={{
            fontSize: 14,
            fontWeight: "bold",
            color: "white",
          }}
        >
          {value}
        </Text>
      </Row>
    );
  };

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

  const renderSearchBar = () => {
    return (
      <Row
        style={{
          justifyContent: "space-between",
        }}
      >
        {renderSearch(props.navigation, true, "Search services...")}
      </Row>
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

  const renderWelcome = () => {
    return (
      <>
        <WelcomeText>
          Welcome to{" "}
          <WelcomeText style={{ color: theme.colors.brand.primary }}>
            Freshr
          </WelcomeText>
          , it's you just a little{" "}
          <WelcomeText style={{ color: theme.colors.brand.primary }}>
            lighter
          </WelcomeText>
        </WelcomeText>
      </>
    );
  };

  const gradients = [
    [rgba(theme.colors.brand.primary, 0.9), rgba("#92FE9D", 0.9)],
    [
      rgba(theme.colors.brand.secondary, 0.9),
      rgba(theme.colors.brand.tertiary, 0.9),
    ],
    [rgba("#06beb6", 0.9), rgba("#48b1bf", 0.9)],
    [rgba(theme.colors.brand.primary, 0.9), rgba(theme.colors.ui.primary, 0.9)],
  ];

  const renderAd = ({ item, index }) => {
    return (
      <AdSlideContainer>
        <AdContainer key={`ad-${item.id}`}>
          <ContainerGradient
            colors={gradients[index % 4]}
            start={[0, 1]}
            end={[1, 0]}
          />
          <BlurView
            tint="light"
            intensity={20}
            style={StyleSheet.absoluteFill}
          />
        </AdContainer>
      </AdSlideContainer>
    );
  };

  const renderAds = () => {
    const { width } = Dimensions.get("window");
    return (
      <View>
        <Carousel
          ref={adSliderRef}
          data={ads}
          renderItem={renderAd}
          sliderWidth={width - 32}
          itemWidth={(width - 32) * 0.99}
          hasParallaxImages={true}
          firstItem={0}
          inactiveSlideScale={0.94}
          inactiveSlideOpacity={1}
          inactiveSlideShift={10}
          containerCustomStyle={{
            marginTop: 15,
            overflow: "visible",
          }}
          // scrollInterpolator={scrollInterpolator1}
          // slideInterpolatedStyle={animatedStyles1}
          layout={"tinder"}
          loop={true}
          // loopClonesPerSide={2}
          // autoplay={true}
          // autoplayDelay={500}
          // autoplayInterval={3000}
          onSnapToItem={(index) => setActiveSlide(index)}
        />
        <Pagination
          dotsLength={ads.length}
          activeDotIndex={activeSlide}
          containerStyle={{
            paddingVertical: 6,
          }}
          dotColor={theme.colors.brand.primary}
          dotStyle={{
            width: 12,
            height: 8,
            borderRadius: 4,
          }}
          inactiveDotColor={theme.colors.ui.border}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.5}
          carouselRef={adSliderRef}
          tappableDots={!!adSliderRef}
        />
      </View>
    );
  };

const changeaddress =()=>{
  console.log("ASDADS");
  setModal(modal)
  setCurrentScreen('SalonScreen')

}

const setDeliverylocation1 = async ()=>{
  const key = "del"
                      const coordinates = [props.searchLocation[1], props.searchLocation[0]];
  const stringifiedCoordinates = JSON.stringify(coordinates);

  await AsyncStorage.setItem(key, stringifiedCoordinates);
  props.setSearchLocation(props.searchLocation)
  setlocation()
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

const setlocation = async ()=>{
  console.log('hereeee');
 const val = await fetchdeliverylocation()
  let l = await Location1.reverseGeocodeAsync({
    "latitude" :val ? val[1] : props.searchLocation[1],
    "longitude": val ? val[0] : props.searchLocation[0]
  })
  console.log("---->", l);
  setAddress(`${l[0].city==null?'':l[0].city},${l[0].street==null?'':l[0].street}`)
}
useEffect(()=>{
  console.log("doneeeeeee", props.searchLocation);
  setlocation()
}, [props.searchLocation])

const changescreen = (screen) =>{
  console.log("rannnnnnnnnnnnnnnnnnn");
  setCurrentScreen(screen)
}


useEffect(()=>{
  socketServices.on('Reject_Send', (dataa) => {
    console.log("rejectedddddataaaa", dataa);
    
    setRejectmodal(true) 
  
  })
}, [])

const specialist = useSelector((state) => state.specialists.specialists)
  // console.log("!!!!!!>>>>>>>>>>>>>>>>>>>>>>>>>", specialist[0]?.services);

  useEffect(()=>{
    setRejectSpecialist(specialist)
    console.log("<<<<>>>>>", specialist[0]?.services[0].serviceType.name);
  }, [specialist])
  return (
    
    <>
  
    {
      currentScreen=='SalonScreen' ? 
    
   <Saloon props={props} facid={facid} setfacid={setfacid}  specid={specid} setspecid={setspecid} saloonspec={saloonspec} setsaloonspec={setsaloonspec} changescreen={changescreen} currentScreen={currentScreen} setCurrentScreen={setCurrentScreen}/>
    :
    <Delivery address={address}  setAddress={setAddress} changescreen={changescreen} newspecid={newspecid} setnewspecid={setnewspecid} />
  }

  <View style={{justifyContent:'center', alignItems:'center'}}>
{ rejectmodal &&

<Modal
visible={rejectmodal}
style={{ backgroundColor: '#fff', justifyContent:'center',alignItems:'center',width: "90%",height:'80%', marginTop: 50 }}
>
  <TouchableOpacity style={{ width: 20, height: 20, backgroundColor: 'white', borderRadius: 30, position: 'absolute', top: 10, right: 10, justifyContent: 'center', alignItems: 'center' }}
            onPress={()=>{setRejectmodal(false)}}
            >
  <Entypo name='cross' size={20} color={'black'} />
  </TouchableOpacity>
  
 
  {

rejectSpecialist.map((item, index)=>{ 
return(
<View style={{width:'90%'}}>

   <SpecialistCard
      navigation={navigation}
      darkTheme={true}
      // active={item.id === specialist?._id}
      onPress={() => {
        // setSpecialist(item);
        console.log("itemmmmmmm", item);
        navigation.navigate("SpecialistDetails", {
          edit: false,
          specialist: item
        });
        setRejectmodal(false)
      }}
      specialist={item}
      // locationData={locationData}
    /> 
    </View>
)
})
}
 


    
</Modal>
// </View>

}
</View>
  
  </>
  );
};

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
  setServicesCategories: (serviceCategories) =>
    dispatch(setServicesCategories(serviceCategories)),
  setServicesTypes: (servicesTypes) =>
    dispatch(setServicesTypes(servicesTypes)),
  setMatchingFacilities: (facilities) =>
    dispatch(setMatchingFacilities(facilities)),
  setMatchingSpecialists: (specialists) =>
    dispatch(setMatchingSpecialists(specialists)),
  setFacility: (facility) => dispatch(selectFacility(facility)),
  setSpecialist: (specialist) => dispatch(setSpecialist(specialist)),
  resetCart: () => dispatch(clearCart()),
  setCurrentCategory: (category) => dispatch(setCurrentCategory(category)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);