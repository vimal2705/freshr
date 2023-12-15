import { connect, useDispatch, useSelector } from "react-redux";
import styled, { useTheme } from "styled-components/native";
import {
  Entypo,
  Feather,
  FontAwesome,
  Fontisto,
  MaterialCommunityIcons,
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
import SyncStorage from "sync-storage";
import {
  clearCart,
  selectFacility,
  setCurrentCategory,
  setProGender,
  setSearchLocation,
  setSearchRadius,
  setSpecialist,
  setTargetGender,
} from "../../redux/booking/booking.actions";
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { setMatchingFacilities } from "../../redux/facilities/facilities.actions";
import { setMatchingSpecialists } from "../../redux/specialists/specialists.action";
import * as Location1 from "expo-location";
import { rgba } from "polished";
import {
  Dimensions,
  ScrollView,
  TouchableOpacity,
  View,
  TextInput,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  Alert,
  BackHandler,
} from "react-native";
import Map from "../components/map.component";
import FacilityCard from "../components/facility-card.component";
import {
  PaddedContainer,
  SectionTitle,
} from "../components/details-screen.component";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
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
import {
  SpecialistListModal,
  SpecialistsModal,
} from "../../components/bottom-sheet/SpecialistModal";
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
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5 } from '@expo/vector-icons';
import { HostContext } from "../../providers/facility.provider";

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
const InfoContainer = styled.View`
  background-color: black;
  padding: 8px 12px;
  border-radius: 10;
  //position: absolute;
  //bottom: 8px;
  //left: 4px;
  flex-direction: row;
  align-items: center;
  width:180
`
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

const Saloon = (props) => {
  const {singlefacility,singleFacilityy,setSingleFacilityy} =useContext(HostContext);

  useEffect(()=>{
    const singldata=async()=>{
      if(props.specid){
        console.log("specidddddddddddddddddddddddddddddddddddomjdjkdjjdjkndnd",props.specid);
        await singlefacility(props.specid);
        console.log("singledetaulsskslskslkssoeccccccccccccoppp",singleFacilityy);
      }

      if(props.facid){
        await singlefacility(props.facid);
        console.log("singledetaulsskslskslks",singleFacilityy);
    
   }

    }

    
    singldata();
    
  },[props])
 console.log("singledetaulsskslskslks",singleFacilityy);
 useEffect(()=>{
  if(singleFacilityy){
    setShowSpecialistList(true)
   }
 },[singleFacilityy])
 
  
  console.log("salonnnnnnnnnnnnnidddddddddddddddd",props.facid);
  
  const navigation = useNavigation();
  const theme = useTheme();
  const [searchIsLoading, setSearchIsLoading] = useState(false);
  const {
    loadFilters,
    refreshSearch,
    isLoading,
    search,
    onGetOrders,
    refreshing,
    onRefresh,
    getUser,
  } = useContext(AppContext);
console.log("propsssssssdsdsdsdsdsdsddsdsdddsdssddssdddsddsdsds",props.setSpecialist);
// const {singlefacility} =useContext(HostContext)

  const [fullMap, setFullMap] = useState(false);
  const [showSortFacilityFilter, setShowSortFacilityFilter] = useState(false);
  const [showSearchRadiusFilter, setShowSearchRadiusFilter] = useState(false);
  const [showGenderFilter, setShowGenderFilter] = useState(false);
  const [showLocationFilter, setShowLocationFilter] = useState(false);
  const [showPriceRangeFilter, setShowPriceRangeFilter] = useState(false);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [showSpecialistList, setShowSpecialistList] = useState(false);
  const [refreshingData, setRefreshingData] = useState(false);
  // const [currentScreen, setCurrentScreen] = useState("SalonScreen");
  const [modal, setModal] = useState(false);
  const [address, setAddress] = useState([]);
  const [Notify, setNotify] = useState(false);
  const [data, setData] = useState({});
  const pubnub = usePubNub();
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);
  const { route } = useRoute();

  const { onLogout } = useContext(AuthContext);

  useEffect(async () => {
    const { user } = await getUser();
    // const {route} = useRoute()
    // console.log("route::::", route.name);

    const backAction = () => {
      console.log("user:", user);
      // Alert.alert('Hold on!', 'Are you sure you want to go back?', [
      //   {
      //     text: 'Cancel',
      //     onPress: () => null,
      //     style: 'cancel',
      //   },
      //   {text: 'YES', onPress: () => BackHandler.exitApp()},
      // ]);
      // console.log("routeee:", route.name);

      if (user?.firstName == "Guest") {
        // console.log("routeee:", route.name);
        onLogout();
      } else {
        // BackHandler.()
        navigation.goBack();
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    socketServices.initializeSocket();

    socketServices.on("Send_complete_Busy", (dataa) => {
      console.log("finallyfinalllllllllll done", dataa);
      refreshData();
    });
  }, []);
  useFocusEffect(
    useCallback(() => {
      socketServices.initializeSocket();
      socketServices.on("recived_message", (msg) => {
        //condition ===>> if(myId == msg.to) set MessageSeen(true)
        if (user._id != msg.from) {
          dispatch(setMessageSeen(true));
        }
      });
    }, [])
  );

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
  const [check, setChecked] = useState(false);

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
      stopLoadingAction: () => setSearchIsLoading(false),
      config: {
        searchLocation: props.searchLocation,
        searchRadius: props.searchRadius,
        targetGender: props.targetGender,
        proGender: props.proGender,
        priceRange: props.priceRange,
        currentService: props.currentService,
        serviceType: props.category,
      },
      setMatchingFacilities: props.setMatchingFacilities,
      setMatchingSpecialists: props.setMatchingSpecialists,
    });
  };
  const gen = useSelector((state) => state.booking.targetGender);

  useEffect(() => {
    const loadAndSetFilters = async () => {
      const { serviceCategories, serviceTypes } = await loadFilters();
      const { user } = await getUser();
      await onGetOrders();
      // socket.auth = {username: user.id, id: user.id}
      // console.log(user);
      props.setServicesCategories(serviceCategories);
      props.setServicesTypes(serviceTypes);
      props.setTargetGender(gen);
      props.setProGender(user.searchProGender);
      // props.setSearchRadius(user.searchRadius);
      props.setUser(user);
      props.setSearchLocation(user.searchLocation.coordinates);
      pubnub.setUUID(`${user.id}`);
      console.log("pubnub", pubnub.getUUID());
    };
    loadAndSetFilters();
    return () => {
      props.resetCart();
    };
  }, [props.navigation]);

  useEffect(() => {
    // if(address.length==0){
    refreshData();
    // }
  }, [
    refreshSearch,
    props.targetGender,
    props.priceRange,
    props.category,
    props.searchLocation,
    props.proGender,
    props.currentService,
    props.searchRadius,
  ]);

  if (isLoading) {
    return <LoadingScreen />;
  }
  const toggleFullMap = () => {
    setFullMap(!fullMap);
  };

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

  useEffect(() => {
    (async () => {
      let { status } = await Location1.requestPermissionsAsync();
      console.log("mmmmmmmmmmmmmmmmmmmmmmmm", status);
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      console.log(
        "settttttttttttttttttttttttttttttttttt",
        props.searchLocation
      );
      setTimeout(() => {
        setlocation();
      }, 10000);
      let locationnn = await Location1.getCurrentPositionAsync();
      console.log("asdasda=====11222======1221", location);
      // setLocation(location);
    })();
  }, []);

  useEffect(() => {
    let data = {};
    data = SyncStorage.get("filters");
    if (data != undefined && Object.keys(data).length > 0) {
      setChecked(true);
      setData(data);
      if (data.category != null) {
        dispatch(setCurrentCategory(data.category));
      }
      if (data.targetGender != "") {
        dispatch(setTargetGender(data.targetGender));
      }
      dispatch(setSearchRadius(data.searchRadius));
    }
    console.log("oooooooo", data);
  }, []);

  const savefilter = async() => {
    // try {
    //   await AsyncStorage.setItem(
    //     "filters", {
    //       category: props.category,
    //       priceRange: props.priceRange,
    //       targetGender: props.targetGender,
    //       sortFacilitiesBy: props.sortFacilitiesBy,
    //       searchRadius: props.searchRadius,
    //     })
    // } catch (error) {
    //   console.log("erorrrrrrrrrrrr",error);
    // }
    // console.log(SyncStorage.get("filters")),
      SyncStorage.set("filters", {
        category: props.category,
        priceRange: props.priceRange,
        targetGender: props.targetGender,
        sortFacilitiesBy: props.sortFacilitiesBy,
        searchRadius: props.searchRadius,
      })
        .then(() => {
          setData(SyncStorage.get("filters"));
          setChecked(!check);
        })
        .catch((error) => {
          console.log(error);
        });
  };

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
            justifyContent: "center",
            paddingHorizontal: 16,
            height: 50,
            borderRadius: 5,
            position: "relative",
            backgroundColor: theme.colors.brand.primary,
          }}
          onPress={() => setShowLocationFilter(!showLocationFilter)}
        >
          <GlassBackground intensity={40} />
          <Entypo name="location-pin" size={20} color={"white"} />
          <Spacer position="left" size="medium" />
          {/*<Text variant="caption">Current location</Text>*/}
          {/*<Spacer position="bottom" size="small" />*/}
          <Text
            variant="caption"
            numberOfLines={1}
            ellipsis="tail"
            style={{
              fontSize: 16,
              color: "white",
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
            color: active || value ? "white" : "black",
            fontSize: 14,
            fontWeight: active || value ? "bold" : "normal",
          }}
        >
          {value ? renderValue(value) : label}
        </Text>
        <Spacer position="left" size="medium" />
        <Entypo
          name="chevron-down"
          color={active || value ? "white" : "black"}
        />
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

  const changeaddress = () => {
    console.log("Asdasd");
    setModal(modal);
    props.setCurrentScreen("Delivery");
  };

  const [deliverylocation, setDeliverylocation] = useState();


  const fetchdeliverylocation = async () => {
    const jsonvalue = await AsyncStorage.getItem("del");
    const value = JSON.parse(jsonvalue);

    setDeliverylocation(value);
    return value;
  };

  const setDeliverylocation1 = async () => {
    const key = "del";
    const coordinates = [props.searchLocation[1], props.searchLocation[0]];
    const stringifiedCoordinates = JSON.stringify(coordinates);

    await AsyncStorage.setItem(key, stringifiedCoordinates);

    props.setSearchLocation(props.searchLocation);
    setlocation();
  };
  const fetchDeliveryLocationProcess = async () => {
      const locn = await fetchdeliverylocation();


      if (locn == null) {
        setDeliverylocation1();
      }
    }
  useEffect(() => {
  
    return ;
  }, []);

  const setlocation = async () => {

    const val = await fetchdeliverylocation();
   
    const lati = val != null ? val[1] : props.searchLocation[1];
    const longi = val != null ? val[0] : props.searchLocation[0];
   
    let l = await Location1.reverseGeocodeAsync({
      latitude: lati,
      longitude: longi,
    });
  
    setAddress(
      `${l[0].city == null ? "" : l[0].city},${
        l[0].street == null ? "" : l[0].street
      }`
    );
  };
  useEffect(() => {
  
    setlocation();
  }, [props.searchLocation]);

  return (
    <>
      <SafeArea1>
        <View
          style={{ height: 100, flexDirection: "row", alignItems: "center",justifyContent:'center' }}
        >
          <TouchableOpacity
          activeOpacity={1}
            style={{
              backgroundColor:
                props.currentScreen == "SalonScreen"
                  ? "#fff"
                  : theme.colors.brand.secondary,
              width: "45%",
              height: 90,
              alignItems: "center",
              justifyContent:"space-evenly",borderWidth:5,borderRightWidth:0,borderRadius:20,borderTopRightRadius:0,borderBottomRightRadius:0
            }}
            onPress={() => {props.changescreen("Delivery")
            props.setCurrentScreen("Delivery")
          }
          }
          >
            <Text style={{fontSize:16, fontWeight: 'bold',position:'absolute',right:1,top:0, }}>Where do</Text>
            <Text style={{fontWeight:"bold",top:10}}>Delivery</Text>
            <View style={{flexDirection:"row",paddingHorizontal:5}}>
              <Entypo name="location-pin" size={16} color={"black"} />

              <Text
                onPress={() =>
                  props.currentScreen == "Delivery"
                    ? props.changescreen("Delivery")
                    : props.setCurrentScreen("Delivery")
                }
                style={{borderWidth:1,borderRadius:10,paddingHorizontal:5,fontSize:12}}
              >
                {address.length>0 ? address.length < 20 ? address : `${address.slice(0, 20)}....` : `Click here to set Location`}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
          activeOpacity={1}
            style={{
              backgroundColor:
                props.currentScreen == "Delivery"
                  ? "#fff"
                  : theme.colors.brand.secondary,
              width: "45%",
              height: 90,
              alignItems: "center",
              justifyContent:"space-evenly",borderWidth:5,borderBottomLeftRadius:0,borderTopLeftRadius:0,borderLeftWidth:0,borderRadius:20
            }}
            onPress={() => props.setCurrentScreen("SalonScreen")}
          >
            <Text style={{fontSize:16, fontWeight: 'bold',position:'absolute',left:1,top:0 }}>we meet?</Text>
            <MaterialIcons name="storefront" size={18} color="black" style={{top:10}} />
            <Text style={{fontWeight:'bold'}}>In Salon</Text>
            
          </TouchableOpacity>
        </View>
      </SafeArea1>
      <SafeArea style={{ backgroundColor: theme.colors.brand.white }}>
        <PageContainer
          style={{
            position: "relative",
            backgroundColor: theme.colors.brand.white,
          }}
        >
          <View>
            <View
              style={{
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/*<ContainerGradient*/}
              {/*  colors={[*/}
              {/*    "black",*/}
              {/*    "black",*/}
              {/*  ]}*/}
              {/*  start={[0, 1]}*/}
              {/*  end={[1, 0]}*/}
              {/*/>*/}
              {/*{!fullMap && renderAddress()}*/}
              {/* <PaddedContainer
        style={{
          backgroundColor: rgba(theme.colors.brand.quaternary, 0),
        }}
      >
        <Spacer position="bottom" size="medium" />
        {/* <Spacer position="bottom" size="medium" />
        {renderSearchBar()}
        <Spacer position="bottom" size="medium" /> */}
              {/* </PaddedContainer> */}
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
              <Spacer position="bottom" size="medium" />

              {/*<PaddedContainer style={{ backgroundColor: "transparent" }}>*/}
              {/*  <Spacer position="bottom" size="medium" />*/}
              {/*  {renderAds()}*/}
              {/*  <Spacer position="bottom" size="small" />*/}
              {/*</PaddedContainer>*/}
              <Spacer position="bottom" size="medium" />
            </View>
          </View>
          {!fullMap && props.facilities && (
            <ScrollView
              style={{ flex: 1 }}
              scrollEnabled={false}
              // refreshControl={
              //   <RefreshControl style={{ position: "absolute", top: 200 }} refreshing={refreshing} onRefresh={onRefresh} />
              // }
              showsVerticalScrollIndicator={false}
            >
              <View>
                <PaddedContainer>
                  {/*<Spacer position="bottom" size="large" />*/}
                  {/*<Spacer position="bottom" size="medium" />*/}
                  {/*<Text variant="caption" style={{ fontSize: 16 }}>*/}
                  {/*  Filter facilities & professionals by preference*/}
                  {/*</Text>*/}

                  {/*<Spacer position="bottom" size="medium" />*/}
                  {/*<Spacer position="bottom" size="large" />*/}
                  {/*{renderWelcome()}*/}

                  {/*<Spacer position="bottom" size="medium" />*/}

                  {/*<FlatGrid*/}
                  {/*  data={props.serviceCategories}*/}
                  {/*  spacing={4}*/}
                  {/*  renderItem={({ item, index }) =>*/}
                  {/*    renderCategoryButton(gradients[index], item)*/}
                  {/*  }*/}
                  {/*/>*/}

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <SectionTitle style={{ color: "black" }}>
                      Select a facility near you
                    </SectionTitle>
                    <TouchableOpacity
                      onPress={() => savefilter()}
                      style={{ flexDirection: "row",borderRadius:10,justifyContent:'center',alignItems:'center',gap:10}}
                    >
                      <MaterialCommunityIcons
                        name={check ? "checkbox-blank-outline": "checkbox-marked" }
                        size={20}
                        color={"black"}
                        style={{ }}
                      />

                      <SectionTitle style={{ color: "black", marginTop: 2 }}>
                        Save Filters
                      </SectionTitle>
                    </TouchableOpacity>
                  </View>


                  <Spacer position="bottom" size="large" />
                  <InfoContainer>
              <Text variant={"caption"} style={{fontSize: 10, color: "white"}}>Barber shop</Text>
              <View style={{width: 12, height: 12, borderRadius: 12, marginHorizontal: 4, backgroundColor: "#0096FF"}} />

              <Text variant={"caption"} style={{fontSize: 10, color: "white"}}>Salon</Text>
              <View style={{width: 12, height: 12, borderRadius: 12, marginHorizontal: 4, backgroundColor: "#FA8072"}} />

              <Text variant={"caption"} style={{fontSize: 10, color: "white"}}>Both</Text>
              <View style={{width: 12, height: 12, borderRadius: 12, marginHorizontal: 4, backgroundColor: "#fff"}} />


              </InfoContainer>
                </PaddedContainer>
                <View>
                  {searchIsLoading ? (
                    <ActivityIndicator />
                  ) : (
                    <Map
                      key={"map-full"}
                      fullMap={false}
                      refresh={() => refreshData()}
                      carouselBottom={false}
                      loading={isLoading}
                      data={props.facilities}
                      bottomMargin={0}
                      resizeMap={toggleFullMap}
                      renderItem={({ item }) => (
                        <FacilityCard
                          handleMorePress={() =>
                            navigation.navigate("FacilityDetails", {
                              id: item._id,
                            })
                          }
                          facility={item}
                          handleViewResultPress={() => {
                            if (item.specialists.length <= 0) {
                              sendMessage(
                                "Specialist unavailable",
                                "No Specialist Available or Specialist do not match your Selected Filters",
                                "error",
                                2000,
                                theme.colors.ui.warning
                              );
                            } else {
                              if (item.availableSeats == 0) {
                                sendMessage(
                                  "No Seats",
                                  "Selected Facility has no Seats Available",
                                  "error",
                                  2000,
                                  theme.colors.ui.warning
                                );
                              } else { 
                                props.setFacility(item);
                                setShowSpecialistList(true);
                              }
                            }
                          }}
                        />
                      )}
                    />
                  )}
                </View>
              </View>
            </ScrollView>
          )}
          {fullMap && props.facilities && (
            <View style={{ flex: 1 }}>
              <Map
                key={"map-small"}
                fullMap={true}
                carouselBottom={true}
                data={props.facilities}
                bottomMargin={30}
                resizeMap={toggleFullMap}
                renderItem={({ item }) => (
                  <FacilityCard
                    handleMorePress={() =>
                      navigation.navigate("FacilityDetails", {
                        facility: item,
                      })
                    }
                    style={{ marginBottom: 18 }}
                    facility={item}
                    handleViewResultPress={() => {
                      if (item.specialists.length <= 0) {
                        sendMessage(
                          "Specialist unavailable",
                          "No Specialist Available or Specialist do not match your Selected Filters",
                          "error",
                          2000,
                          theme.colors.ui.warning
                        );
                      } else {
                        if (item.availableSeats == 0) {
                          sendMessage(
                            "No Seats",
                            "Selected Facility has no Seats Available",
                            "error",
                            2000,
                            theme.colors.ui.warning
                          );
                        } else {
                          props.setFacility(item);
                          setShowSpecialistList(true);
                        }
                      }
                    }}
                  />
                )}
              />
            </View>
          )}

          {/*{renderOrderClient({pendingOrders, navigation: props.navigation})}*/}
          {showSpecialistList && (
            <SpecialistListModal
              handleClose={() => {
                setShowSpecialistList(false);
                setSingleFacilityy(null)
                props.setfacid(null);
                props.setspecid(null);
                props.setsaloonspec(null);

              }}
              singleFacilityy={singleFacilityy}
              setSpecialist={props.setSpecialist}
              saloonspec={props.saloonspec}
              setsaloonspec={props.setsaloonspec}
            />
          )}
        </PageContainer>

        <PriceRangeModal
          showModal={showPriceRangeFilter}
          toggleShowModal={handleShowPriceRangeFilterChange}
        />
        <GenderModal
          showModal={showGenderFilter}
          toggleShowModal={handleShowGenderFilterChange}
          data={data}
        />
        <LocationModal
          showModal={showLocationFilter}
          toggleShowModal={handleShowLocationFilterChange}
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
        {/* <Text>hiiii</Text> */}
        {!showSpecialistList && (
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: "white",
              alignItems: "center",
              justifyContent: "center",
              width: 60,
              position: "absolute",
              bottom: 110,
              right: 10,
              height: 60,
              backgroundColor: theme.colors.brand.primary,
              borderRadius: 100,
            }}
            onPress={() => refreshData()}
          >
            <Ionicons name={"refresh"} size={30} color={"white"} />
            {/* <Text style={{ color: "white" }}>Refresh</Text>  */}
          </TouchableOpacity>
        )}
        
      </SafeArea>
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

export default connect(mapStateToProps, mapDispatchToProps)(Saloon);
