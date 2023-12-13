import { connect } from "react-redux";
import styled, { useTheme } from "styled-components/native";
import {
  Entypo,
  Feather,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";

import {
  FilterButton,
  IconButton,
} from "../../components/button/button.component";

import { SafeArea } from "../../components/utils/safearea.component";
import {
  Text,
} from "../../components/typography/typography.component";
import { PageContainer, Row } from "../../components/helpers/helpers.component";
import { Spacer } from "../../components/spacer/spacer.component";
import { renderSearch } from "./utils";
import {
  clearCart,
  selectFacility,
  setCurrentCategory,
  setProGender, setSearchLocation,
  setSearchRadius,
  setSpecialist,
  setTargetGender,
} from "../../redux/booking/booking.actions";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { setMatchingFacilities } from "../../redux/facilities/facilities.actions";
import { setMatchingSpecialists } from "../../redux/specialists/specialists.action";

import { rgba } from "polished";
import {
  Dimensions,
  ScrollView,
  TouchableOpacity,
  View,
  StyleSheet, ActivityIndicator, RefreshControl,
} from "react-native";
import Map from "../components/map.component";
import FacilityCard from "../components/facility-card.component";
import {
  PaddedContainer,
  SectionTitle,
} from "../components/details-screen.component";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { AppContext } from "../../providers/app-provider";
import {
  setServicesCategories,
  setServicesTypes,
} from "../../redux/services/services.action";
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
import { SpecialistContext } from "../../providers/specialist.provider";
import { renderOrderClient } from "../../utils/renderOrderClient";
import { SpecialistScreenHoc } from "./specialist-screen-hoc";

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

const ReservedSpecialist = (props) => {
  const { specialist} = useContext(SpecialistContext)

  console.log("propssssssssssssssssssssssssoffffffffffffffffffffffffspecialisttttttttttt",specialist._id);
  const theme = useTheme();
  const [searchIsLoading, setSearchIsLoading] = useState(false);
  const { loadFilters, getUser, refreshSearch, isLoading, search,  onGetOrders } = useContext(AppContext);
  const [fullMap, setFullMap] = useState(false)
  const [showSortFacilityFilter, setShowSortFacilityFilter] = useState(false);
  const [showSearchRadiusFilter, setShowSearchRadiusFilter] = useState(false);
  const [showGenderFilter, setShowGenderFilter] = useState(false);
  const [showLocationFilter, setShowLocationFilter] = useState(false);
  const [showPriceRangeFilter, setShowPriceRangeFilter] = useState(false);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [showSpecialistList, setShowSpecialistList] = useState(false);
  const [refreshingData, setRefreshingData] = useState(false);
  const {queue } = useContext(SpecialistContext) 
  const navigation = useNavigation();


  console.log("MMmMMMMMMMMMM-------------------", queue);


  // {queue && renderOrderClient({pendingOrders: queue, navigation: navigation, isClient: false, showSpecialist: false, normal: false})}


  const pubnub = usePubNub();

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

  // const search = async () => {
  //   try {
  //     setSearchIsLoading(true)
  //     const [lng, lat] = props.searchLocation
  //     const searchURL = ${BASE_API_URL}/services/services-within/${(props.searchRadius || 3)}/center/${lat},${lng}/unit/km/${props.targetGender || 'all'}/${props.proGender || 'all'}/${props.currentService?.name.toLowerCase() || 'all'}
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


  useEffect(() => {
   console.log("SSS");
  }, [])
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

  useEffect(() => {
    const loadAndSetFilters = async () => {
      const { serviceCategories, serviceTypes } = await loadFilters();
      const { user } = await getUser();
      await onGetOrders()
      // socket.auth = {username: user.id, id: user.id}
      // console.log(user);
      props.setServicesCategories(serviceCategories);
      props.setServicesTypes(serviceTypes);
      props.setTargetGender(user.searchStylesFor);
      props.setProGender(user.searchProGender);
      props.setSearchRadius(user.searchRadius);
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
     refreshData();
  }, [refreshSearch,  props.targetGender, props.priceRange, props.category, props.searchLocation, props.proGender, props.currentService, props.searchRadius])

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
        Gender
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
        <Spacer position="left" size="medium" />
        {renderFilterButton(
          "Sort by",
          showSortFacilityFilter,
          props.sortFacilitiesBy,
          renderSortFacility,
          handleShowSortFacilityFilterChange
        )}
        <Spacer position="left" size="medium" />
        {renderFilterButton(
          "Search radius",
          showSearchRadiusFilter,
          props.searchRadius,
          renderSearchRadius,
          handleShowSearchRadiusFilterChange
        )}
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

  return (

//     queue.length >0 ? 
//     // renderOrderClient({pendingOrders: queue, navigation: navigation, isClient: false, showSpecialist: false, normal: false})
//     <View>
//         {queue && renderOrderClient({pendingOrders: queue, navigation: navigation, isClient: false, showSpecialist: false, normal: false})}

// </View>


//     :
// {/* <SpecialistScreenHoc> */}
    <SafeArea style={{backgroundColor: theme.colors.brand.white}}>
      <PageContainer  style={{position: 'relative', backgroundColor: theme.colors.brand.white}}>
        <View>
          <View
            style={{
              position: "relative",
              overflow: "hidden",
            }}
          >
           
          
            
            <PaddedContainer
              style={{
                backgroundColor: rgba(theme.colors.brand.quaternary, 0),
              }}
            >
              <Spacer position="bottom" size="medium" />
              <Spacer position="bottom" size="medium" />
              {/* {renderSearchBar()} */}
              <Spacer position="bottom" size="medium" />
            </PaddedContainer>
            <View
              style={{
                backgroundColor: rgba(theme.colors.brand.quaternary, 0),
              }}
            >
              <Spacer position="bottom" size="medium" />
              {renderFilters()}
              <Spacer position="bottom" size="medium" />
              <Spacer position="bottom" size="medium" />
            </View>
            <Spacer position="bottom" size="medium" />

           
            <Spacer position="bottom" size="medium" />
          </View>
        </View>
        {!fullMap && props.facilities && <ScrollView style={{ flex: 1 }}  refreshControl={
          <RefreshControl style={{ position: "absolute", top: 200 }} refreshing={refreshingData} onRefresh={refreshData} />
        } showsVerticalScrollIndicator={false}>
          <View>
            <PaddedContainer>
             

              <Spacer position="left" size="medium">
                <SectionTitle style={{color: 'black'}}>Select a facility near you</SectionTitle>
              </Spacer>
              <Spacer position="bottom" size="large" />
            </PaddedContainer>

            <View>
              {searchIsLoading ? <ActivityIndicator /> : <Map
                key={'map-full'}
                fullMap={false}
                refresh={() => refreshData()}
                carouselBottom={false}
                loading={isLoading}
                data={props.facilities}
                bottomMargin={0}
                resizeMap={toggleFullMap}
                renderItem={({ item }) =>(
                  <FacilityCard
                    handleMorePress={() =>
                      props.navigation.navigate("FacilityDetails", {id: item._id,isSpecialist:true})
                    }
                    style={{ marginBottom: 18 }}
                    facility={item}
                    share={item._id}
                    specialist={specialist._id}
                  />
                )}
              />}
            </View>
          </View>
        </ScrollView>}
        {fullMap && props.facilities && <View style={{ flex: 1 }}><Map
          key={'map-small'}
          fullMap={true}
          carouselBottom={true}
          data={props.facilities}
          bottomMargin={30}
          resizeMap={toggleFullMap}
          renderItem={({ item }) => (
            <FacilityCard
            handleMorePress={() =>
              props.navigation.navigate("FacilityDetails", {
                facility: item,isSpecialist:true
              })
            }
            style={{ marginBottom: 18 }}
            facility={item}
            handleViewResultPress={() => {
              if(item.specialists.length <=0){
                sendMessage("Specialist unavailable","No Specialist Available or Specialist do not match your Selected Filters","error",2000,theme.colors.ui.warning)

              }
              else{
                if(item.availableSeats == 0){
                  sendMessage("No Seats","Selected Facility has no Seats Available","error",2000,theme.colors.ui.warning)
                }
                else{
                  props.setFacility(item)
                setShowSpecialistList(true);
                }
              }
              
              
            }}
          />
          )}
        /></View>}

       
        {showSpecialistList && <SpecialistListModal
          handleClose={() => {
            setShowSpecialistList(false);
          }}
          setSpecialist={props.setSpecialist}
        />}
      </PageContainer>

      <PriceRangeModal
        showModal={showPriceRangeFilter}
        toggleShowModal={handleShowPriceRangeFilterChange}
      />
      <GenderModal
        showModal={showGenderFilter}
        toggleShowModal={handleShowGenderFilterChange}
      />
      <LocationModal
        showModal={showLocationFilter}
        toggleShowModal={handleShowLocationFilterChange}
      />
      <SortFacilityModal
        showModal={showSortFacilityFilter}
        toggleShowModal={handleShowSortFacilityFilterChange}
      />
      <CategoryModal
        showModal={showCategoryFilter}
        toggleShowModal={handleShowCategoryFilterChange}
      />
      <SearchRadiusModal
        showModal={showSearchRadiusFilter}
        toggleShowModal={handleShowSearchRadiusFilterChange}
      />
    </SafeArea>
    // </SpecialistScreenHoc> 
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

export default connect(mapStateToProps, mapDispatchToProps)(ReservedSpecialist);