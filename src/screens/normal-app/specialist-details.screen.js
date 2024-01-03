import React, { useContext, useEffect, useRef, useState } from "react";
import styled, { useTheme } from "styled-components/native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import {
  ScrollView,
  TouchableOpacity,
  View,
  TextInput,
  Alert
} from "react-native";
import { AntDesign, Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { borderColor, rgba } from "polished";
import Modal from "react-native-modal";
import {
  FavButton,
  PageContainer,
  PageContentContainer,
  SectionTitle,
  TitleContainer,
} from "../components/details-screen.component";
import { Spacer } from "../../components/spacer/spacer.component";
import { Text } from "../../components/typography/typography.component";
import { Gallery } from "../components/gallery.component";
import { Title } from "react-native-paper";
import { RatingRow } from "../../components/rating/rating.component";
import {
  DescriptionContainer,
  QuoteIconContainer,
} from "../../components/typography/typography.component";
import ServiceCard from "../components/service-card.component";
import { connect } from "react-redux";
import { clearCart, setBookingStep } from "../../redux/booking/booking.actions";
import {
  ActionButton,
  ButtonContainer,
  CartItemCountContainer,
  PositioningContainer,
} from "../../components/button/process-action-button.component";
import BookingStepper from "../components/booking-stepper.component";
import { SafeArea } from "../../components/utils/safearea.component";
import { CancelButton } from "../../components/button/button.component";
import {
  CustomTabButton,
  CustomTabButtonsContainer,
  CustomTabSeparator,
} from "../components/custom-tab.component";
import { ServiceDetailsModal } from "../../components/bottom-sheet/ServiceDetailsModal";
import { StackActions } from "@react-navigation/native";
import { SpecialistContext } from "../../providers/specialist.provider";
import { AuthContext } from "../../providers/auth/auth.context";
import DropDownPicker from "react-native-dropdown-picker";
import { Rating } from "react-native-elements";
import { ReviewContext } from "../../providers/review.provider";
import { BASE_API_URL } from "../../constants";
import { AppContext } from "../../providers/app-provider";

const CategorySelectedCount = styled.View`
  height: 30px;
  width: 30px;
  border-radius: 100px;
  background-color: ${({ active, theme }) =>
    active ? "white" : theme.colors.ui.primary};
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const ModalViewPositioning = styled.View`
  flex-direction: row;
  justify-content: center;
`;
const ModalView = styled.View`
  width: 250px;
  background-color: white;
  border-radius: ${({ theme }) => theme.sizes[1]};
`;

const ModalCloseButton = styled.TouchableOpacity`
  position: absolute;
  top: ${({ theme }) => theme.space[2]};
  right: ${({ theme }) => theme.space[2]};
  padding: ${({ theme }) => theme.space[2]};
  border-radius: 100px;
  background-color: ${({ theme }) => theme.colors.ui.quaternary}; ;
`;

const Separator = styled.View`
  height: 2px;
  width: 100%;
  background-color: ${({ theme }) => rgba(theme.colors.ui.primary, 0.06)};
`;
const ServiceItemIcon = styled.Image`
  height: 40px;
  width: 40px;
  border-radius: 5px;
  overflow: hidden;
`;
const ModalContent = styled.View`
  padding: ${({ theme }) => theme.space[3]};
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;

const RatingContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const SpecialistDetailsScreen = ({
  resetCart,
  cart,
  route,
  navigation,
  edit,
  Del,
  ...restProps
}) => {
  const editBooking = route.params.edit;
  const theme = useTheme();
  const { id,setnewspecid,setsaloonspec } = route.params;
  console.log("deliveryyyyyyytrueeeeeeeeeorrrrrr",route.params.Del);
  
  // const {onGetSpecialistidd,specialistidd} =useContext(SpecialistContext)

  // useEffect(()=>{
  //   console.log("ASASsa",id);

  //   if(id)
  //   {
  //     console.log('LOG OF ID OF specialistttttt : ',id);
  //     onGetReviews(id,'SPECIALISTTTTTTTTT')  
  //     onGetSpecialistidd(id)
  //   }
  // },[id])
  
  const specialist =  route.params.specialist ? route.params.specialist : restProps.specialist;
  


  const [selectedCategory, setSelectedCategory] = useState(restProps.serviceCategories);
  const ref = useRef(null);
  const { loadFilters, getUser, refreshSearch, isLoading, search,  onGetOrders } = useContext(AppContext);
  const [dataSourceCords, setDataSourceCords] = useState({});
  const [reviewRatings, setReviewRatings] = useState(0);
  const [reviewDescription, setReviewDescription] = useState('');
  const [shownServices, setShownServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [sendingService, setsendingService] = useState(null);

  const [isFav, setIsFav] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [cntPerCategory, setCntPerCategory] = useState(null);
  const [ReviewModal, setReviewModal] = useState(false);
  const[user1,setuser1]=useState();
  const [pam, setpam] = useState(false)
  const { onLogout} = useContext(AuthContext)
  // const {  getUser } = useContext(AppContext);
  useEffect(()=>{
if(user1?.firstName == "Guest"){
  setpam(true)
}
  }, user1)
console.log("yourrrr userrrrr", user1?.firstName == "Guest", pam);
const {setSpecialistidd} =useContext(SpecialistContext)

  
  const { updateReviews, onGetReviews,reviews,ratings} = useContext(ReviewContext);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  // const [items, setItems] = useState(specialist?.services.map(item => item.serviceType.name))
  // const [items, setItems] = useState(specialist?.services?.map(service => ({ label: service.serviceType.name, value: service.serviceType.id, key: service.serviceType.id, id: service.serviceType.id, icon: () => renderServiceIcon(service.serviceType.photo) })))
  let name = `${(specialist?.user?.firstName ||'') + ' ' + (specialist?.user?.lastName || '')}`
  name = !name.trim() ? 'Name not set' : name;

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const renderServiceIcon = (icon) => {
    return <ServiceItemIcon source={{ uri: icon }} />;
  };
  const getServiceCategory = (service) => {
    return service.serviceType.category
  }


  useEffect(() => {
    if (!specialist) {
      navigation.dispatch(StackActions.popToTop());
    }
  }, [])
  const loadFav=async()=>{
    
    const { user } = await getUser();
    setuser1(user);
    // console.log("favvvvvvv",user.favorites.specialists[2].firstName);
    const data=user.favorites.specialists;
    const temp=[];
    for(let i=0;i<data.length;i++){

      temp.push(data[i].id)
   
      
    }
    

if (temp.includes(specialist?.user?.id)) {
  setIsFav(true)
}else{
  setIsFav(false)
}
  }
  useEffect(()=>{
      console.log("reviewsssssssssssssssssssssss",reviews);
  },[reviews])

  useEffect(() => {
loadFav()
    if (selectedCategory) {
      setShownServices(
        specialist?.services.filter((item) => getServiceCategory(item) === selectedCategory.name)
      );
    }
    
  }, [selectedCategory]);

  // const handleFavButtonPress = () => {
  //   setIsFav(!isFav);
  // };
  const handleFavButtonPress = async ()=>{
    // console.log("Asdasd",user);
    if(user1?.firstName == "Guest"){
      Alert.alert('Authorized user requied', 'You need to signup to access the feature', [
      
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'SignUp', onPress: () => onLogout()},
      ]);
    }
    else{
      if(!isFav){
        console.log("Ss");
        setIsFav(true);
        const token = await SecureStore.getItemAsync("token");
        console.log("token",token);
        const config = {headers: {
          Authorization: `Bearer ${token}`,
        }}
        axios.post(`${BASE_API_URL}/users/favorites`,
          {specialists:`${specialist?.user?.id}`},config
        ).then(loadFav())
      }else{
        console.log("--------------");
        const token = await SecureStore.getItemAsync("token");
        console.log("token",token);
        const config = {headers: {
          Authorization: `Bearer ${token}`,
        },
         data:{specialists:`${specialist?.user?.id}`}
        }
        axios.delete(`${BASE_API_URL}/users/favorites`,config
        ).then(loadFav())
      }
    }
    
 
    }
  // };
  const handleShowViewMore = (service) => {
    console.log("againnn doneee",service);
    setSelectedService(true);
    setSelectedService(service);
    // setsendingService(service);
  };
  const handleCloseViewMore = () => {
    setSelectedService(null);
  };
  const tempUse = [1, 2, 3]
  const renderRating = () => {
    return (
      <RatingContainer>
        <Text
          variant="caption"
          style={{
            fontSize: 24,
            color: theme.colors.brand.primary,
          }}
        >
          {parseFloat(ratings).toFixed(1)}
        </Text>
        <Spacer position="left" size="small" />
        <View style={{ flexDirection: 'row' }}>
          <Rating
            type="star"
            ratingColor={theme.colors.brand.primary}
            fractions={0}
            startingValue={ratings}
            readonly
            imageSize={22}
          />
        </View>

      </RatingContainer>
    );
  };

  useEffect(() => {
    const cnt = {};
    restProps.serviceCategories.forEach((item) => {
      cnt[`${item}`] = cart.filter(
        (service) => getServiceCategory(service) === item.name
      ).length;
    });
    setCntPerCategory(cnt);
    if (!editBooking) {
      return;
    }
    setModalVisible(cart.length <= 0);
  }, [cart]);

  useEffect(() => {
    if (editBooking) {
      restProps.setBookingStep(0);
    }
  }, [navigation.route]);
useEffect(()=>{
onGetReviews(specialist?.id,'specialist')
},[])
  useEffect(() => {
    if (restProps.currentCategory) {
      setSelectedCategory(restProps.currentCategory);
    }
    setSelectedCategory(restProps.serviceCategories.filter(cat => specialist?.services.filter((service) => getServiceCategory(service) === cat.name).length > 0)[0])
    return () => {
      resetCart();
    };
  }, []);

  useEffect(() => {
    if (restProps.currentCategory) {
      ref.current?.scrollTo({
        x: dataSourceCords[
          `${specialist.id}-category-${restProps.currentCategory.name}`
        ],
        y: 0,
        animated: true,
      });
    }
  }, [dataSourceCords]);


  const createReviewFormData = () => {

    const formData = new FormData();
   
    formData.append('service',value );
    formData.append('specialist',specialist.id );
    formData.append('rating',reviewRatings );
    formData.append('description',reviewDescription );
    updateSpecialistReviews(formData);
  }

  console.log("sendingdataaa========================================",sendingService?.estimatedDuration?.totalMinutes);
  return (
    specialist ==undefined ?
    <><Text>asdasd</Text></>
    :
    <>
      <SafeArea>
        {/*{restProps.bookingStep > 0 && <BookingStepper pageStep={0} />}*/}
        <PageContainer showsVerticalScrollIndicator={false}>
          <Modal isVisible={isModalVisible}>
            <ModalViewPositioning>
              <ModalView>
                <ModalContent>
                  <Row>
                    <Ionicons name="md-warning" size={40} />
                    <Spacer position="left" size="medium" />
                    <Text variant="caption" style={{ fontSize: 18 }}>
                      {" "}
                      Warning
                    </Text>
                  </Row>
                  <Spacer position="bottom" size="large" />
                  <Separator />
                  <Spacer position="bottom" size="large" />
                  <Text>
                    Emptying the cart will cancel the ongoing booking process
                  </Text>
                  <Spacer position="bottom" size="large" />
                  <Spacer position="bottom" size="medium" />
                  <ModalCloseButton onPress={toggleModal}>
                    <Ionicons name="close" size={20} />
                  </ModalCloseButton>
                </ModalContent>
              </ModalView>
            </ModalViewPositioning>
          </Modal>

          <Gallery  setnewspecid={setnewspecid} setsaloonspec={setsaloonspec} images={[...(specialist?.services?.map(service =>route.params.specialist ? service.photo : service.serviceType.photo))]} />

          <PageContentContainer showActionButton={cart.length > 0}>
            <Spacer position="top" size="medium" />
            <TitleContainer>
              <Title style={{ color: "black" }}>{name}</Title>

              <FavButton onPress={handleFavButtonPress}>
                <MaterialIcons
                  name={isFav ? "favorite" : "favorite-outline"}
                  size={30}
                  color={theme.colors.brand.primary}
                />
              </FavButton>
            </TitleContainer>
            <Spacer position="top" size="large" />
            <RatingRow>
              {renderRating()}
              
              {/*<ReviewButton >*/}
              {/*  <ReviewButtonText>{ratingCnt}</ReviewButtonText>*/}
              {/*  <Spacer position="right" size="small" />*/}
              {/*  <ReviewButtonText>reviews</ReviewButtonText>*/}
              {/*  <Spacer position="right" size="medium" />*/}
              {/*  <AntDesign*/}
              {/*    name="arrowright"*/}
              {/*    size={24}*/}
              {/*    color={theme.colors.ui.primary}*/}
              {/*  />*/}
              {/*</ReviewButton>*/}
              <TouchableOpacity onPress={() => { navigation.navigate("Reviews") }}>
                <Text
                  style={{ textDecorationLine: "underline", fontWeight: "bold", color: "black" }}
                >
                  {reviews?.length} reviews
                </Text>
              </TouchableOpacity>
            </RatingRow>

            <Spacer position="bottom" size="medium" />
            <Spacer position="bottom" size="medium" />
            {/* <TouchableOpacity onPress={() => { setReviewModal(true) }} style={{ alignSelf: 'flex-end' }}>
              <Text
                style={{ textDecorationLine: "underline", fontWeight: "bold", color: "black" }}
              >
                Add a Review
              </Text>
            </TouchableOpacity> */}

            <Spacer position="bottom" size="medium" />
            <Spacer position="bottom" size="medium" />
            <DescriptionContainer style={{ backgroundColor: "black", padding: 20 }}>
              <QuoteIconContainer style={{ bottom: 0, right: 0 }}>
                <MaterialIcons name="format-quote" size={16} color={"white"} />
              </QuoteIconContainer>
              <Text style={{ lineHeight: 22, fontSize: 14, color: "white" }}>{specialist.about ? specialist.about : "Lorem ipsum dolor sit amet   "}</Text>
            </DescriptionContainer>
            {!((specialist.isQueueing ? (specialist.queue < specialist.maxQueue) : !specialist.frontQueue)) && (
              <View>
                <Spacer position="bottom" size="large" />
                <CancelButton onPress={() => navigation.dispatch(StackActions.popToTop())} style={{ ...theme.shadows.default }}>
                  <AntDesign name="close" size={18} color="white" />
                  <Spacer position="left" size="large" />
                  <Text variant="caption"
                    style={{
                      color: "white",
                      fontSize: 14,
                      textTransform: "uppercase",
                      fontWeight: "light",
                      letterSpacing: 2,
                    }}>
                    Booking not possible
                  </Text>
                </CancelButton>
              </View>
            )}
            {restProps.currentService && (
              <View style={{ flex: 1 }}>
                <Spacer position="bottom" size="large" />
                <Spacer position="bottom" size="large" />
                <SectionTitle color={"black"}>Matching services</SectionTitle>
                <Spacer position="bottom" size="large" />
                <ScrollView showsVerticalScrollIndicator={false}>
                  {specialist?.services
                    .filter(
                      (service) => service.name === restProps.currentService.name
                    )
                    ?.map((serviceItem) => (
                      <View key={serviceItem.id}>
                        <ServiceCard
                          active={true} 
                          service={serviceItem}
                          // setsendingService={setsendingService}
                          onMorePress={() => handleShowViewMore(serviceItem)}
                        />
                        <Spacer position="bottom" size="medium" />
                      </View>
                    ))}
                </ScrollView>
              </View>
            )}
            <Spacer position="bottom" size="large" />
            <Spacer position="bottom" size="large" />
            <SectionTitle style={{ color: "black" }}>Services</SectionTitle>

            <Spacer position="bottom" size="large" />

            <CustomTabButtonsContainer
              horizontal
              showsHorizontalScrollIndicator={false}
              ref={ref}
            >
              {restProps.serviceCategories?.map(
                (category, index) =>
                  specialist?.services.filter((service) => getServiceCategory(service) === category.name)
                    .length > 0 && (
                    <Row key={`${specialist.id}-category-${category.id}`}>
                      <CustomTabSeparator />
                      <CustomTabButton
                        active={category.name === selectedCategory.name}
                        onPress={() => setSelectedCategory(category)}
                        onLayout={(event) => {
                          const layout = event.nativeEvent.layout;

                          setDataSourceCords((old) => {
                            return {
                              ...old,
                              [`${specialist.id}-category-${category.id}`]:
                                layout.x,
                            };
                          });
                          // console.log(dataSourceCords);
                          // console.log("height:", layout.height);
                          // console.log("width:", layout.width);
                          // console.log("x:", layout.x);
                          // console.log("y:", layout.y);
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: "bold",
                            textTransform: "uppercase",
                            letterSpacing: 1,
                            color:
                              category.name === selectedCategory.name
                                ? "white"
                                : theme.colors.ui.primary,
                          }}
                        >
                          {category.name}
                        </Text>
                        <Spacer position="left" size="medium" />

                        {cntPerCategory && cntPerCategory[category.name] > 0 && (
                          <CategorySelectedCount
                            active={category.name === selectedCategory.name}
                          >
                            <Text
                              style={{
                                color:
                                  category.name === selectedCategory.name
                                    ? theme.colors.ui.primary
                                    : "white",
                                fontWeight: "bold",
                              }}
                            >
                              {cntPerCategory[category.name]}
                            </Text>
                          </CategorySelectedCount>
                        )}
                      </CustomTabButton>
                      <CustomTabSeparator />
                    </Row>
                  )
              )}
            </CustomTabButtonsContainer>
            {/* <View style={{ height: 2, backgroundColor: theme.colors.brand.primary }} /> */}

            <Spacer position="bottom" size="large" />

            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
              {shownServices?.map((serviceItem) => (
                <View key={serviceItem.id}>
                  <ServiceCard
                  userr = {pam}
                  logout={onLogout}
                    active={true}
                    disabled={!((specialist.isQueueing ? (specialist.queue < specialist.maxQueue) : !specialist.frontQueue))}
                    service={serviceItem}
                    onMorePress={() => handleShowViewMore(serviceItem)}
                    setsendingService={setsendingService}
                  />
                  <Spacer position="bottom" size="medium" />
                </View>
              ))}
            </ScrollView>

            <Spacer position="bottom" size="large" />
            {(restProps.bookingStep > 0 && ((specialist.isQueueing ? (specialist.queue < specialist.maxQueue) : !specialist.frontQueue))) && (
              <View>
                <Spacer position="bottom" size="large" />

                <CancelButton onPress={() => navigation.dispatch(StackActions.popToTop())} style={{ ...theme.shadows.default }}>
                  <AntDesign name="close" size={18} color="white" />
                  <Spacer position="left" size="large" />
                  <Text variant="caption"
                    style={{
                      color: "white",
                      fontSize: 14,
                      textTransform: "uppercase",
                      fontWeight: "light",
                      letterSpacing: 2,
                    }}>
                    Cancel booking
                  </Text>
                </CancelButton>
                <Spacer position="bottom" size="large" />
              </View>
            )}

          </PageContentContainer>
        </PageContainer>
        {(cart.length > 0 && ((specialist.isQueueing ? (specialist.queue < specialist.maxQueue) : !specialist.frontQueue))) && (
          <ButtonContainer
            style={{
              backgroundColor: "transparent",
            }}
          >
            <ActionButton
              height={55}
              onPress={() =>
                {
                if(setnewspecid){
      setnewspecid(null);
    setSpecialistidd(null);
    }
    if(setsaloonspec){
      setsaloonspec(null);
      setSpecialistidd(null);
    }
                editBooking
                  ? navigation.push("BookingReview")
                  : navigation.push("MeetingTimeSelection", { edit: false,Del:route.params.Del?route.params.Del:false,servicee:sendingService.estimatedDuration.totalMinutes})

                }
              }
            >
              <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
                {editBooking ? "Back to review" : "Proceed with booking"}
              </Text>
              <PositioningContainer>
                <CartItemCountContainer>
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    {cart.length}
                  </Text>
                </CartItemCountContainer>
              </PositioningContainer>
            </ActionButton>
          </ButtonContainer>
        )}
        {selectedService && (
          <ServiceDetailsModal
            showModal={true}
            toggleShowModal={handleCloseViewMore}
            service={selectedService}
          />
        )}

      </SafeArea>

    </>
  );
        
};

const mapStateToProps = (state) => ({
  currentService: state.booking.currentService,
  currentCategory: state.booking.currentCategory,
  serviceTypes: state.services.serviceTypes,
  serviceCategories: state.services.serviceCategories,
  specialist: state.booking.specialist,
  cart: state.booking.services,
  bookingStep: state.booking.step,
});

const mapDispatchToProps = (dispatch) => ({
  resetCart: () => dispatch(clearCart()),
  setBookingStep: (step) => dispatch(setBookingStep(step)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SpecialistDetailsScreen);