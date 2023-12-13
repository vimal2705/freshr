// import { connect } from "react-redux";
// import styled, { useTheme } from "styled-components/native";
// import React, { useContext, useEffect, useState } from "react";
// import DashedLine from "react-native-dashed-line";
// import { View } from "react-native";
// import { selectFacility, setngngStep } from "../../redux/booking/booking.actions";
// import BookingStepper from "../components/booking-stepper.component";
// import { ServiceDetailsModal } from "../../components/bottom-sheet/ServiceDetailsModal";
// import { AppContext } from "../../providers/app-provider";
// import { useStripe } from "@stripe/stripe-react-native";
// import { LoadingScreen } from "../loading.screen";
// import { OrderCard } from "../pro-specialist/components/order-card.component";
// import { SafeArea } from "../../components/utils/safearea.component";
// import { setMatchingFacilities } from "../../redux/facilities/facilities.actions";
// import { setMatchingSpecialists } from "../../redux/specialists/specialists.action";
// import { NavBar } from "./components/nav-bar";
// import SyncStorage from "sync-storage"
// import { StackActions } from '@react-navigation/native';
// import socketServices from "./components/Socket";

// const popAction = StackActions.pop(1);


// const Container = styled.View`
//   flex: 1;
// `;

// const Content = styled.View`
//   padding: ${({ theme }) => theme.space[3]};
//   margin-bottom: 70px;
// `;

// const Separator = styled(DashedLine)`
//   flex-direction: row;
//   height: 3px;
// `;

// const CenteredRow = styled.View`
//   flex-direction: row;
//   align-items: center;
//   justify-content: center;
//   background-color: ${({ theme }) => theme.colors.ui.quaternary};
// `;

// const PriceCard = styled.View`
//   flex-direction: row;
//   align-items: center;
//   justify-content: space-between;
//   padding: ${({ theme }) => theme.space[3]};
//   border-radius: ${({ theme }) => theme.sizes[1]};
//   background-color: ${({ theme }) => theme.colors.ui.primary};
// `;

// const PriceContainer = styled.View`
//   flex-direction: row;
//   padding: ${({ theme }) => theme.space[2]};
//   background-color: white;
//   border-radius: ${({ theme }) => theme.sizes[1]};
//   align-items: center;
//   justify-content: center;
// `;

// const Row = styled.View`
//   flex-direction: row;
//   align-items: center;
//   justify-content: space-between;
// `;

// const EditButton = styled.TouchableOpacity`
//   background-color: ${({ theme }) => theme.colors.ui.quaternary};
//   border-radius: 5px;
//   padding: ${({ theme }) => theme.space[2]};
// `;

// const BookingReviewScreen = ({ booking, route, navigation, ...restProps }) => {
//   const theme = useTheme();
//   const [selectedService, setSelectedService] = useState(null);
//   const [newOrder, setNewOrder] = useState(null);
//   const {fetchPaymentSheetParams,setRefreshSearch,  search, loading, setLoading, payOrder} = useContext(AppContext);
//   const [totalPrice, setTotalPrice] = useState(0);
//   const [address,setAddress] = useState(SyncStorage.get('locationAddress'))
//   const { initPaymentSheet, presentPaymentSheet } = useStripe();
//   const paym="payment done";

//   const initializePaymentSheet = async () => {
    
//     console.log("newwwwww bwforeeeeee",SyncStorage.get('locationAddress'));
//     const {
//       paymentIntent,
//       ephemeralKey,
//       customer,
//       order
//     } = await fetchPaymentSheetParams(booking.services.map(service => service.id), booking.facility ==null ? null :booking.facility._id, 40, {...route.params,address:booking.facility ==null ?address :null}); 
//     console.log("newwwww afterrrrrr");
//     if (!paymentIntent) {
//       // Handle the case when paymentIntent is undefined, e.g., show an error message or return.
//       console.error('--------Payment intent is undefined-----');
//       // return;
//     }

//     console.log("SSSSSSSSSSSss",paymentIntent);
//     const { error } = await initPaymentSheet({
//       customerId: customer,
//       customerEphemeralKeySecret: ephemeralKey,
//       paymentIntentClientSecret: paymentIntent,
//       merchantDisplayName: 'Freshr',
//       style: "alwaysLight",
//       // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
//       //methods that complete payment after a delay, like SEPA Debit and Sofort.
//       allowsDelayedPaymentMethods: true,
//     });
//     setNewOrder(order);
//   };
 
//   useEffect(()=>{
//     socketServices.on('Send_Request',async (dataa)=>{
//       // console.log("startcodeeeecalled",dataa);
//       // onGetOrders();
//       const { error, paymentOption } = await presentPaymentSheet();
//       console.log("DDd",paymentOption);

//       if (error) {
//         console.log(`Error code: ${error.code}`, error.message);
//       } else {
//       // socketServices.on('Complete_payment',(dataa)=>{
//         //     console.log("doneeeeeeeeepaymenttttttt",dataa);
//         // })
//         try{
//           navigation.navigate('Orders')
//           // socketServices.emit('Complete_payment', {
//           //   paym,
//           // })
//           console.log("yessssssssss");
//         }
//         catch{
//           console.log("nooooooooo");
//         }
//         console.log('Success', 'Your order is confirmed!');
//         const paidOrder = await payOrder(newOrder.id);
//         setNewOrder({...paidOrder})
//       }
  
     
//     })
//   }, [])

//   const openPaymentSheet = async () => {
// console.log("beforeeeeee------------------------------");
//     // const { error, paymentOption } = await presentPaymentSheet();
// // console.log("DDd",paymentOption);

//     // if (error) {
//     //   console.log(`Error code: ${error.code}`, error.message);
//     // } else {
//     // socketServices.on('Complete_payment',(dataa)=>{
//       //     console.log("doneeeeeeeeepaymenttttttt",dataa);
//       // })
//       try{
//         navigation.navigate('Orders', {fromcheckout:true})
//         socketServices.emit('Complete_payment', {
//           paym,
//         })
//         console.log("yessssssssss");
//       }
//       catch{
//         console.log("nooooooooo");
//       }
//       console.log('Success', 'Your order is confirmed!');
//       const paidOrder = await payOrder(newOrder.id);
//       setNewOrder({...paidOrder})
//     // }

//     console.log("beforeeeeee-----------------------asdasd-------");
//   };

//   useEffect(() => {
//     initializePaymentSheet();
//   }, []);

//   useEffect(() => {
//     setTotalPrice(
//       booking.services.reduce(
//         (result, currentService) => result + currentService.price,
//         0
//       )
//     );
//     restProps.setBookingStep(2);
//   }, []);


//   useEffect(() => {
//     if (newOrder && newOrder.isPaid) {
//       setRefreshSearch(true);
//       restProps.setFacility(null);
//       search({
//         loadingAction: () => setLoading(true),
//         stopLoadingAction:  () => setLoading(false),
//         config: {
//           searchLocation: booking.searchLocation,
//           searchRadius: booking.searchRadius,
//           targetGender: booking.targetGender,
//           priceRange: booking.priceRange,
//           serviceType: booking.currentCategory,
//           proGender: booking.proGender,
//           currentService: booking.currentService,
//         },
//         setMatchingFacilities: restProps.setMatchingFacilities,
//         setMatchingSpecialists: restProps.setMatchingSpecialists
//       });
//       navigation.dispatch(StackActions.popToTop());
//     }
//   }, [newOrder])

//   const handleShowViewMore = (service) => {
//     setSelectedService(service);
//   };
//   const handleCloseViewMore = () => {
//     setSelectedService(null);
//   };

//   if (loading) {
//     return <LoadingScreen/>
//   }
//   return (
//     <SafeArea>
//       <NavBar title={"Booking review"} white={true}/>
//       <Container showsVerticalScrollIndicator={false}>
//         <View style={{flex: 1}}>
//           {/*<BookingStepper pageStep={2} />*/}
//           {(booking.specialist && booking.services.length > 0) && <OrderCard  isClient={true} order={{ ...newOrder, ...booking, price: totalPrice * 100 }} showSpecialist={true} isCheckout={true} checkout={() => openPaymentSheet()} navigation={navigation} />}
//           {/*<ButtonContainer*/}
//           {/*  style={{*/}
//           {/*    shadowColor: "#000",*/}
//           {/*    shadowOffset: {*/}
//           {/*      width: 0,*/}
//           {/*      height: 5,*/}
//           {/*    },*/}
//           {/*    shadowOpacity: 0.34,*/}
//           {/*    shadowRadius: 6.27,*/}
//           {/*    elevation: 10,*/}
//           {/*    zIndex: 9999*/}
//           {/*  }}*/}
//           {/*>*/}
//           {/*  /!*<ActionButton*!/*/}
//           {/*  /!*  height={50}*!/*/}
//           {/*  /!*  style={{ backgroundColor: theme.colors.ui.primary }}*!/*/}
//           {/*  /!*  onPress={() => navigation.navigate("Checkout")}*!/*/}
//           {/*  /!*>*!/*/}
//           {/*  /!*  <Text*!/*/}
//           {/*  /!*    style={{*!/*/}
//           {/*  /!*      color: "white",*!/*/}
//           {/*  /!*      fontWeight: "bold",*!/*/}
//           {/*  /!*      fontSize: 16,*!/*/}
//           {/*  /!*    }}*!/*/}
//           {/*  /!*  >*!/*/}
//           {/*  /!*    Cancel booking*!/*/}
//           {/*  /!*  </Text>*!/*/}
//           {/*  /!*</ActionButton>*!/*/}
//           {/*  /!*<Spacer position="left" size="small" />*!/*/}
//           {/*  <ActionButton*/}
//           {/*    height={50}*/}
//           {/*    onPress={() => openPaymentSheet()}*/}
//           {/*  >*/}
//           {/*    <Text*/}
//           {/*      style={{*/}
//           {/*        color: "white",*/}
//           {/*        fontWeight: "bold",*/}
//           {/*        fontSize: 16,*/}
//           {/*      }}*/}
//           {/*    >*/}
//           {/*      Checkout*/}
//           {/*    </Text>*/}
//           {/*  </ActionButton>*/}
//           {/*</ButtonContainer>*/}
//           {selectedService && (
//             <ServiceDetailsModal
//               showModal={true}
//               toggleShowModal={handleCloseViewMore}
//               service={selectedService}
//             />
//           )}
//         </View>
//         {/*<Content>*/}
//         {/*  <Row>*/}
//         {/*    <SectionTitle>Services</SectionTitle>*/}
//         {/*    <EditButton*/}
//         {/*      onPress={() =>*/}
//         {/*        navigation.navigate("SpecialistDetails", { edit: true })*/}
//         {/*      }*/}
//         {/*    >*/}
//         {/*      <Entypo name="edit" size={20} />*/}
//         {/*    </EditButton>*/}
//         {/*  </Row>*/}
//         {/*  <Spacer position="bottom" size="medium" />*/}
//         {/*  <View style={{ flex: 1 }}>*/}
//         {/*    {booking.services.map((service) => (*/}
//         {/*      <Spacer key={service.id} position="bottom" size="medium">*/}
//         {/*        <ServiceCard*/}
//         {/*          service={service}*/}
//         {/*          info={true}*/}
//         {/*          press={() => handleShowViewMore(service)}*/}
//         {/*        />*/}
//         {/*      </Spacer>*/}
//         {/*    ))}*/}
//         {/*  </View>*/}

//         {/*  <Spacer position="bottom" size="large" />*/}
//         {/*  <Spacer position="bottom" size="medium" />*/}
//         {/*  <PriceCard>*/}
//         {/*    <Text variant="caption" style={{ color: "white", fontSize: 22 }}>*/}
//         {/*      Total*/}
//         {/*    </Text>*/}
//         {/*    <PriceContainer>*/}
//         {/*      <MaterialIcons*/}
//         {/*        name="attach-money"*/}
//         {/*        size={22}*/}
//         {/*        color={theme.colors.ui.primary}*/}
//         {/*      />*/}
//         {/*      <Spacer position="left" size="large" />*/}
//         {/*      <Text variant="caption" style={{ fontSize: 22 }}>*/}
//         {/*        {totalPrice}*/}
//         {/*      </Text>*/}
//         {/*    </PriceContainer>*/}
//         {/*  </PriceCard>*/}
//         {/*  <Spacer position="bottom" size="large" />*/}
//         {/*  <Spacer position="bottom" size="medium" />*/}
//         {/*  <Separator*/}
//         {/*    axis="horizontal"*/}
//         {/*    dashLength={8}*/}
//         {/*    dashThickness={2}*/}
//         {/*    dashGap={5}*/}
//         {/*    dashColor={rgba(theme.colors.ui.primary, 0.1)}*/}
//         {/*  />*/}
//         {/*  <Spacer position="bottom" size="large" />*/}
//         {/*  <Spacer position="bottom" size="medium" />*/}
//         {/*  <Row>*/}
//         {/*    <SectionTitle>The facility</SectionTitle>*/}
//         {/*  </Row>*/}
//         {/*  <Spacer position="bottom" size="medium" />*/}
//         {/*  <CenteredRow>*/}
//         {/*    <FacilityCard facility={booking.facility} />*/}
//         {/*  </CenteredRow>*/}
//         {/*  <Spacer position="bottom" size="medium" />*/}
//         {/*  <Spacer position="bottom" size="medium" />*/}
//         {/*  <MapBooking selectedFacility={booking.facility} searchLocation={booking.searchLocation}/>*/}
//         {/*  <Spacer position="bottom" size="large" />*/}
//         {/*  <Spacer position="bottom" size="medium" />*/}
//         {/*  <Separator*/}
//         {/*    axis="horizontal"*/}
//         {/*    dashLength={8}*/}
//         {/*    dashThickness={2}*/}
//         {/*    dashGap={5}*/}
//         {/*    dashColor={rgba(theme.colors.ui.primary, 0.1)}*/}
//         {/*  />*/}
//         {/*  <SectionTitle>Your specialist</SectionTitle>*/}
//         {/*  <View style={{backgroundColor: theme.colors.ui.quaternary}}>*/}
//         {/*    {booking.specialist && (*/}
//         {/*      <SpecialistCard*/}
//         {/*        specialist={booking.specialist}*/}
//         {/*        active={true}*/}
//         {/*        navigation={navigation}*/}
//         {/*      />*/}
//         {/*    )}*/}
//         {/*  </View>*/}

//         {/*  <Spacer position="bottom" size="large" />*/}
//         {/*  <Spacer position="bottom" size="medium" />*/}
//         {/*  <Separator*/}
//         {/*    axis="horizontal"*/}
//         {/*    dashLength={8}*/}
//         {/*    dashThickness={2}*/}
//         {/*    dashGap={5}*/}
//         {/*    dashColor={rgba(theme.colors.ui.primary, 0.1)}*/}
//         {/*  />*/}
//         {/*  <Spacer position="bottom" size="large" />*/}
//         {/*  <Spacer position="bottom" size="medium" />*/}

//         {/*  <Spacer position="bottom" size="large" />*/}
//         {/*  <Spacer position="bottom" size="large" />*/}

//         {/*  <CancelButton onPress={() => navigation.navigate("Map")}>*/}
//         {/*    <AntDesign name="close" size={14} color="white" />*/}
//         {/*    <Spacer position="left" size="small" />*/}
//         {/*    <Text variant="caption" style={{ color: "white" }}>*/}
//         {/*      Cancel booking and go back to map*/}
//         {/*    </Text>*/}
//         {/*  </CancelButton>*/}
//         {/*</Content>*/}
//       </Container>

//     </SafeArea>
//   );
// };

// const mapStateToProps = (state) => ({
//   booking: state.booking,
// });

// const mapDispatchToProps = (dispatch) => ({
//   setBookingStep: (step) => dispatch(setBookingStep(step)),
//   setMatchingFacilities: (facilities) =>
//     dispatch(setMatchingFacilities(facilities)),
//   setMatchingSpecialists: (specialists) =>
//     dispatch(setMatchingSpecialists(specialists)),
//   setFacility: (facility) => dispatch(selectFacility(facility)),

// });

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(BookingReviewScreen);



import { connect, useSelector } from "react-redux";
import styled, { useTheme } from "styled-components/native";
import React, { useContext, useEffect, useRef, useState } from "react";
import DashedLine from "react-native-dashed-line";
import { View } from "react-native";
import { selectFacility, setBookingStep } from "../../redux/booking/booking.actions";
import BookingStepper from "../components/booking-stepper.component";
import { ServiceDetailsModal } from "../../components/bottom-sheet/ServiceDetailsModal";
import { AppContext } from "../../providers/app-provider";
import { useStripe } from "@stripe/stripe-react-native";
import { LoadingScreen } from "../loading.screen";
import { OrderCard } from "../pro-specialist/components/order-card.component";
import { SafeArea } from "../../components/utils/safearea.component";
import { setMatchingFacilities } from "../../redux/facilities/facilities.actions";
import { setMatchingSpecialists } from "../../redux/specialists/specialists.action";
import { NavBar } from "./components/nav-bar";
import SyncStorage from "sync-storage"
import { StackActions } from '@react-navigation/native';
import socketServices from "./components/Socket";



const popAction = StackActions.pop(1);


const Container = styled.View`
  flex: 1;
`;

const Content = styled.View`
  padding: ${({ theme }) => theme.space[3]};
  margin-bottom: 70px;
`;

const Separator = styled(DashedLine)`
  flex-direction: row;
  height: 3px;
`;

const CenteredRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.ui.quaternary};
`;

const PriceCard = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.space[3]};
  border-radius: ${({ theme }) => theme.sizes[1]};
  background-color: ${({ theme }) => theme.colors.ui.primary};
`;

const PriceContainer = styled.View`
  flex-direction: row;
  padding: ${({ theme }) => theme.space[2]};
  background-color: white;
  border-radius: ${({ theme }) => theme.sizes[1]};
  align-items: center;
  justify-content: center;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const EditButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.ui.quaternary};
  border-radius: 5px;
  padding: ${({ theme }) => theme.space[2]};
`;

const BookingReviewScreen = ({ Apilocc,booking, route, navigation, ...restProps }) => {

  console.log("APIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIILOCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",route.params.Apilocc);
  const mapRef = useRef(null)

  const theme = useTheme();
  const [selectedService, setSelectedService] = useState(null);
const [delayedSelectedLocation, setDelayedSelectedLocation] = useState([]);

  const [newOrder, setNewOrder] = useState(null);
  const {fetchPaymentSheetParams,setRefreshSearch,  search, loading, setLoading, payOrder} = useContext(AppContext);
  const [totalPrice, setTotalPrice] = useState(0);
  const [address,setAddress] = useState(SyncStorage.get('locationAddress'))
  const [selectedLocation,setSelectedLocation] = useState([])
  // const [selectedLocation,setSelectedLocation] = useState(SyncStorage.get('userLocation'))
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const paym="payment done";
  const [userloc, setUserloc] = useState({})
  useEffect(() => {
    const findLoc = async () => {
      console.log("startt");
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log("endd", status);
      if (status !== 'granted') {
        // setErrorMsg('Permission to access location was denied');
        console.log("noooooooooooooooooooo");
        return;
      }
    const isAndroid = Platform.OS == 'android';
    console.log("here");
    let location = await Location.getCurrentPositionAsync();
    console.log("location:::::::", location);
      // setUserloc(location.coords)
      setUserloc(location.coords)
    }
    console.log("outtt");
    findLoc()
  }, []);

  const loc = useSelector(state=>state.locationn)
  useEffect(()=>{
    console.log("loccc", loc);
    setSelectedLocation(loc)
  }, [loc])

// useEffect(() => {
//   const timer = setTimeout(() => {
//     setDelayedSelectedLocation(selectedLocation);
//   }, 5000);

//   return () => clearTimeout(timer);
// }, [selectedLocation]);

  const initializePaymentSheet = async () => {
    
    console.log("newwwwww bwforeeeeee",SyncStorage.get('locationAddress'));
    setTimeout(async()=>{

    
    const {
      paymentIntent,
      ephemeralKey,
      customer,
      order
    } = await fetchPaymentSheetParams(booking.services.map(service => service.id), booking.facility ==null ? null :booking.facility._id, 40, {...route.params,address:booking.facility ==null ?address :null,selectedLocation:booking.facility == null ?route.params.Apilocc:null, }); 
    console.log("newwwww afterrrrrr");
    if (!paymentIntent) {
      // Handle the case when paymentIntent is undefined, e.g., show an error message or return.
      console.error('--------Payment intent is undefined-----');
      // return;
    }

    console.log("SSSSSSSSSSSss",paymentIntent);
    const { error } = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      merchantDisplayName: 'Freshr',
      style: "alwaysLight",
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
    });
    setNewOrder(order);
  },500)
  };

 useSelector(state=> console.log("forrrrrrrlocationnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn",state.locationn))
 //-73.5190523788333, 45.66905077342461
  // useSelector(state=>console.log("reduxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",state))

  

  // useEffect(()=>{
  //   console.log("MNMNMNMNMNMNMNMNMNMNMNMNMNMNMNMNMNMNMNMNMNMNMNMNMNMN", location);
  //   setSelectedLocation(location)
  // }, location)
 
  useEffect(()=>{
    socketServices.on('Send_Request',async (dataa)=>{
      // console.log("startcodeeeecalled",dataa);
      // onGetOrders();
      const { error, paymentOption } = await presentPaymentSheet();
      console.log("DDd",paymentOption);

      if (error) {
        console.log(`Error code: ${error.code}`, error.message);
      } else {
      // socketServices.on('Complete_payment',(dataa)=>{
        //     console.log("doneeeeeeeeepaymenttttttt",dataa);
        // })
        try{
          navigation.navigate('Orders')
          // socketServices.emit('Complete_payment', {
          //   paym,
          // })
          console.log("yessssssssss");
        }
        catch{
          console.log("nooooooooo");
        }
        console.log('Success', 'Your order is confirmed!');
        const paidOrder = await payOrder(newOrder.id);
        setNewOrder({...paidOrder})
      }
  
     
    })
  }, [])
  

  const openPaymentSheet = async () => {
console.log("beforeeeeee------------------------------");
    // const { error, paymentOption } = await presentPaymentSheet();
// console.log("DDd",paymentOption);

    // if (error) {
    //   console.log(`Error code: ${error.code}`, error.message);
    // } else {
    // socketServices.on('Complete_payment',(dataa)=>{
      //     console.log("doneeeeeeeeepaymenttttttt",dataa);
      // })
      try{
        navigation.navigate('Orders', {fromcheckout:true})
        socketServices.emit('Complete_payment', {
          paym,
        })
        console.log("yessssssssss");
      }
      catch{
        console.log("nooooooooo");
      }
      console.log('Success', 'Your order is confirmed!');
      const paidOrder = await payOrder(newOrder.id);
      setNewOrder({...paidOrder})
    // }

    console.log("beforeeeeee-----------------------asdasd-------");
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  useEffect(() => {
    setTotalPrice(
      booking.services.reduce(
        (result, currentService) => result + currentService.price,
        0
      )
    );
    restProps.setBookingStep(2);
  }, []);


  useEffect(() => {
    if (newOrder && newOrder.isPaid) {
      setRefreshSearch(true);
      restProps.setFacility(null);
      search({
        loadingAction: () => setLoading(true),
        stopLoadingAction:  () => setLoading(false),
        config: {
          searchLocation: booking.searchLocation,
          searchRadius: booking.searchRadius,
          targetGender: booking.targetGender,
          priceRange: booking.priceRange,
          serviceType: booking.currentCategory,
          proGender: booking.proGender,
          currentService: booking.currentService,
        },
        setMatchingFacilities: restProps.setMatchingFacilities,
        setMatchingSpecialists: restProps.setMatchingSpecialists
      });
      navigation.dispatch(StackActions.popToTop());
    }
  }, [newOrder])

  const handleShowViewMore = (service) => {
    setSelectedService(service);
  };
  const handleCloseViewMore = () => {
    setSelectedService(null);
  };

  if (loading) {
    return <LoadingScreen/>
  }
  return (
    <SafeArea>
      <NavBar title={"Booking review"} white={true}/>
      <Container showsVerticalScrollIndicator={false}>
        <View style={{flex: 1}}>
          {/*<BookingStepper pageStep={2} />*/}
          {(booking.specialist && booking.services.length > 0) && <OrderCard  isClient={true} order={{ ...newOrder, ...booking, price: totalPrice * 100 }} showSpecialist={true} isCheckout={true} checkout={() => openPaymentSheet()} navigation={navigation} />}
          {/*<ButtonContainer*/}
          {/*  style={{*/}
          {/*    shadowColor: "#000",*/}
          {/*    shadowOffset: {*/}
          {/*      width: 0,*/}
          {/*      height: 5,*/}
          {/*    },*/}
          {/*    shadowOpacity: 0.34,*/}
          {/*    shadowRadius: 6.27,*/}
          {/*    elevation: 10,*/}
          {/*    zIndex: 9999*/}
          {/*  }}*/}
          {/*>*/}
          {/*  /!*<ActionButton*!/*/}
          {/*  /!*  height={50}*!/*/}
          {/*  /!*  style={{ backgroundColor: theme.colors.ui.primary }}*!/*/}
          {/*  /!*  onPress={() => navigation.navigate("Checkout")}*!/*/}
          {/*  /!*>*!/*/}
          {/*  /!*  <Text*!/*/}
          {/*  /!*    style={{*!/*/}
          {/*  /!*      color: "white",*!/*/}
          {/*  /!*      fontWeight: "bold",*!/*/}
          {/*  /!*      fontSize: 16,*!/*/}
          {/*  /!*    }}*!/*/}
          {/*  /!*  >*!/*/}
          {/*  /!*    Cancel booking*!/*/}
          {/*  /!*  </Text>*!/*/}
          {/*  /!*</ActionButton>*!/*/}
          {/*  /!*<Spacer position="left" size="small" />*!/*/}
          {/*  <ActionButton*/}
          {/*    height={50}*/}
          {/*    onPress={() => openPaymentSheet()}*/}
          {/*  >*/}
          {/*    <Text*/}
          {/*      style={{*/}
          {/*        color: "white",*/}
          {/*        fontWeight: "bold",*/}
          {/*        fontSize: 16,*/}
          {/*      }}*/}
          {/*    >*/}
          {/*      Checkout*/}
          {/*    </Text>*/}
          {/*  </ActionButton>*/}
          {/*</ButtonContainer>*/}
          {selectedService && (
            <ServiceDetailsModal
              showModal={true}
              toggleShowModal={handleCloseViewMore}
              service={selectedService}
            />
          )}
        </View>
        {/*<Content>*/}
        {/*  <Row>*/}
        {/*    <SectionTitle>Services</SectionTitle>*/}
        {/*    <EditButton*/}
        {/*      onPress={() =>*/}
        {/*        navigation.navigate("SpecialistDetails", { edit: true })*/}
        {/*      }*/}
        {/*    >*/}
        {/*      <Entypo name="edit" size={20} />*/}
        {/*    </EditButton>*/}
        {/*  </Row>*/}
        {/*  <Spacer position="bottom" size="medium" />*/}
        {/*  <View style={{ flex: 1 }}>*/}
        {/*    {booking.services.map((service) => (*/}
        {/*      <Spacer key={service.id} position="bottom" size="medium">*/}
        {/*        <ServiceCard*/}
        {/*          service={service}*/}
        {/*          info={true}*/}
        {/*          press={() => handleShowViewMore(service)}*/}
        {/*        />*/}
        {/*      </Spacer>*/}
        {/*    ))}*/}
        {/*  </View>*/}

        {/*  <Spacer position="bottom" size="large" />*/}
        {/*  <Spacer position="bottom" size="medium" />*/}
        {/*  <PriceCard>*/}
        {/*    <Text variant="caption" style={{ color: "white", fontSize: 22 }}>*/}
        {/*      Total*/}
        {/*    </Text>*/}
        {/*    <PriceContainer>*/}
        {/*      <MaterialIcons*/}
        {/*        name="attach-money"*/}
        {/*        size={22}*/}
        {/*        color={theme.colors.ui.primary}*/}
        {/*      />*/}
        {/*      <Spacer position="left" size="large" />*/}
        {/*      <Text variant="caption" style={{ fontSize: 22 }}>*/}
        {/*        {totalPrice}*/}
        {/*      </Text>*/}
        {/*    </PriceContainer>*/}
        {/*  </PriceCard>*/}
        {/*  <Spacer position="bottom" size="large" />*/}
        {/*  <Spacer position="bottom" size="medium" />*/}
        {/*  <Separator*/}
        {/*    axis="horizontal"*/}
        {/*    dashLength={8}*/}
        {/*    dashThickness={2}*/}
        {/*    dashGap={5}*/}
        {/*    dashColor={rgba(theme.colors.ui.primary, 0.1)}*/}
        {/*  />*/}
        {/*  <Spacer position="bottom" size="large" />*/}
        {/*  <Spacer position="bottom" size="medium" />*/}
        {/*  <Row>*/}
        {/*    <SectionTitle>The facility</SectionTitle>*/}
        {/*  </Row>*/}
        {/*  <Spacer position="bottom" size="medium" />*/}
        {/*  <CenteredRow>*/}
        {/*    <FacilityCard facility={booking.facility} />*/}
        {/*  </CenteredRow>*/}
        {/*  <Spacer position="bottom" size="medium" />*/}
        {/*  <Spacer position="bottom" size="medium" />*/}
        {/*  <MapBooking selectedFacility={booking.facility} searchLocation={booking.searchLocation}/>*/}
        {/*  <Spacer position="bottom" size="large" />*/}
        {/*  <Spacer position="bottom" size="medium" />*/}
        {/*  <Separator*/}
        {/*    axis="horizontal"*/}
        {/*    dashLength={8}*/}
        {/*    dashThickness={2}*/}
        {/*    dashGap={5}*/}
        {/*    dashColor={rgba(theme.colors.ui.primary, 0.1)}*/}
        {/*  />*/}
        {/*  <SectionTitle>Your specialist</SectionTitle>*/}
        {/*  <View style={{backgroundColor: theme.colors.ui.quaternary}}>*/}
        {/*    {booking.specialist && (*/}
        {/*      <SpecialistCard*/}
        {/*        specialist={booking.specialist}*/}
        {/*        active={true}*/}
        {/*        navigation={navigation}*/}
        {/*      />*/}
        {/*    )}*/}
        {/*  </View>*/}

        {/*  <Spacer position="bottom" size="large" />*/}
        {/*  <Spacer position="bottom" size="medium" />*/}
        {/*  <Separator*/}
        {/*    axis="horizontal"*/}
        {/*    dashLength={8}*/}
        {/*    dashThickness={2}*/}
        {/*    dashGap={5}*/}
        {/*    dashColor={rgba(theme.colors.ui.primary, 0.1)}*/}
        {/*  />*/}
        {/*  <Spacer position="bottom" size="large" />*/}
        {/*  <Spacer position="bottom" size="medium" />*/}

        {/*  <Spacer position="bottom" size="large" />*/}
        {/*  <Spacer position="bottom" size="large" />*/}

        {/*  <CancelButton onPress={() => navigation.navigate("Map")}>*/}
        {/*    <AntDesign name="close" size={14} color="white" />*/}
        {/*    <Spacer position="left" size="small" />*/}
        {/*    <Text variant="caption" style={{ color: "white" }}>*/}
        {/*      Cancel booking and go back to map*/}
        {/*    </Text>*/}
        {/*  </CancelButton>*/}
        {/*</Content>*/}
      </Container>

    </SafeArea>
  );
};

const mapStateToProps = (state) => ({
  booking: state.booking,
});

const mapDispatchToProps = (dispatch) => ({
  setBookingStep: (step) => dispatch(setBookingStep(step)),
  setMatchingFacilities: (facilities) =>
    dispatch(setMatchingFacilities(facilities)),
  setMatchingSpecialists: (specialists) =>
    dispatch(setMatchingSpecialists(specialists)),
  setFacility: (facility) => dispatch(selectFacility(facility)),

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BookingReviewScreen);