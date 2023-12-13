import styled, { useTheme } from 'styled-components/native';
import { AntDesign, FontAwesome, Ionicons, Entypo } from "@expo/vector-icons";
import { Spacer } from "../../../components/spacer/spacer.component";
import { Dimensions, FlatList, ToastAndroid, TouchableOpacity, View, Text } from "react-native";
import { TextInput } from 'react-native-paper';
import { SpecialistContext } from "../../../providers/specialist.provider";
import { useCallback, useContext, useEffect, useState } from "react";
import SpecialistCard from "../../components/specialist-card.component";
import { Formik } from "formik";
import * as yup from "yup";
import { Image } from 'react-native';
import { StackActions, useFocusEffect, useNavigation } from "@react-navigation/native";
import { MapBooking } from "../../components/map-booking.component";
import { usePubNub } from "pubnub-react";
import { AppContext } from "../../../providers/app-provider";
import { AuthContext } from "../../../providers/auth/auth.context";
import Modal from "react-native-modal";
import { Rating } from 'react-native-elements';
import { sendMessage } from '../../../providers/utils';
import { ReviewContext } from '../../../providers/review.provider';
import { useIsFocused } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import SyncStorage from 'sync-storage';
import { useDispatch } from 'react-redux';

import FlashMessage, {
  hideMessage,
  showMessage,
} from "react-native-flash-message";

import {
  flashMessageStyle,
  getError,
  getTokenAndCreateAuthorizationHeader, handleError,
  handleSuccess,
  // sendMessage,
} from "../utils";
import socketServices from '../../normal-app/components/Socket';
import { setMessageSeen } from '../../../redux/chat/chat_actions';


const { width, height } = Dimensions.get("window")

const Container = styled.View`
  flex: 1;
  z-index: 10;
  border-radius: 5px;
  overflow: hidden;
  background-color: white;
  border: 1px solid #25282b;
  margin: 10px;
`

const ExtraSmallServiceCard = styled.View`
  background-color: #25282b;
  border-radius: 5px;
  padding: 8px;
  margin-bottom: 2px;
  width: 100%;
  height: 70px;
  flex-direction: row;
  align-items: center;
`

const ExtraSmallServiceCardPrice = styled.View`
  background-color: black;
  padding: 10px;
  flex-direction: row;
`

const ExtraSmallServiceCardImage = styled.Image`
  width: 50px; 
  height: 50px;
  border-radius: 3px;
  aspect-ratio: 1;
`

const SmallOrderCard = styled.View`
  padding: 10px;
  border-radius: 5px;
  background-color: #25282b;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const Button = styled.TouchableOpacity`
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  padding: 14px;
`

const CloseButton = styled(Button)`
  position: absolute;
  z-index: 15;
  top: 0;
  left: 0;
  background-color: black;
`

const AcceptButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.primary};
  width: 100%;
  align-self: flex-end;
  justify-self: flex-end;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
`

const DetailsContainer = styled.View`
  background-color: white;
  min-height: 250px;
  padding: 16px;
  padding-bottom: 15px;
  padding-top: 20px;
`

const StatusContainer = styled.View`
  padding: 4px;
  background-color: ${({ variant, theme }) => {
    switch (variant) {
      case 'COMPLETED':
        return theme.colors.brand.primary;
      case 'ONGOING':
        return theme.colors.brand.secondary;
      case 'PENDING':
        return '#25282b'
      case 'IN_TRAFFIC':
        return 'black'
    }
  }};
  border-radius: 2px;
  
  position: absolute;
  z-index: 15;
  top: 6px;
  right: 16px;
`

export const OrderCard = ({ order, isClient = false, isSpecialist = false, isHost = false, showSpecialist = false, isCheckout = false, checkout = null, giveReview = false, ...restProps }) => {
  const navigation = useNavigation()
  const theme = useTheme();
  const pubnub = usePubNub();
  const { user } = useContext(AuthContext);
  const [ReviewModal, setReviewModal] = useState(false);
  const [reviewRatings, setReviewRatings] = useState(0);
  const [reviewDescription, setReviewDescription] = useState('');
  const [orderCompleted, setOrderCompleted] = useState(false);
  const { updateReviews, onGetRatings } = useContext(ReviewContext)
  const { acceptOrder, rejectOrder, startOrder, completeOrder } = useContext(SpecialistContext)
  const { UnreadMessage } = useContext(AppContext)
  const [code, setCode] = useState('')
  const [ratings, setRatings] = useState(0)
  const [selectedEntity, setSelectedEntity] = useState('')
  // const[unreadMessaage,setunreadMessaage]=useState(false);
  const isFocused = useIsFocused();
  useEffect(() => {
    getRatings()
  }, [])
  const dispatch=useDispatch()
  const unreadMessaage=useSelector((state)=>state.chat.seen)
  // useEffect(()=>{
  //   socketServices.initializeSocket(); 
  //   socketServices.on('recived_message',(msg)=>{
  //     console.log("miracleee ---------------rr------------------------------------ miracleeee",msg);
  //     if( msg.to!==msg.from){
  //       console.log("-=-=-=-=-------------------------",msg.to,msg.from);
  //       console.log("_______________________________________________fataaaaaaaaaaaaaaaaaaaaaa_____________________________________________________________________"); 
  //     // dispatch(setMessageSeen(false));

  //     }
      
  // })
  
  // },[])

  const getRatings = async () => {
    let rts = 0
    if (isClient) {
      rts = await onGetRatings(order?.specialist?._id, 'specialist')
    }
    else {
      rts = await onGetRatings(order?.client?._id, 'user')
    }
    setRatings(rts)
  }
  if (!order || !order.facility || !order.specialist) {
    return <View><Text variant="caption" style={{ color: "black" }}>Something is wrong</Text></View>
  }
  // const dispatch=useDispatch();
  console.log("clientttttt",isClient);
  console.log("isspecialis",isSpecialist);
  console.log("hostttt",isHost); 

  return (
    <Container>
      {!isClient && order.position === 0 && !['COMPLETED', 'CANCELLED', 'ONGOING'].includes(order.status) && <CloseButton onPress={() => {
        if (isCheckout) {
          navigation.dispatch(StackActions.popToTop());
        } else {
          if (!isClient) {
            console.log(order.id);
            rejectOrder(order.id);
          }
        }
      }}>
        <AntDesign name="close" size={16} color="white" />
        <Spacer position="left" size="medium" />
        <Text variant="caption"
          style={{
            color: "white",
            fontSize: 14,
            textTransform: "uppercase",
            fontWeight: "light",
            letterSpacing: 1,
          }}> {isClient ? "Cancel" : "Reject"} </Text>
      </CloseButton>}
      {order.position !== 0 && !isCheckout && !['COMPLETED', 'CANCELLED',].includes(order.status) && <CloseButton onPress={() => null}>
        <Text variant="caption"
          style={{
            color: "white",
            fontSize: 12,
            textTransform: "uppercase",
            fontWeight: "light",
            letterSpacing: 1,
          }}> {order.position + 1}  / in queue </Text>
      </CloseButton>}

      {order.status && <StatusContainer variant={order.status}>
        <Text
          variant="caption"
          style={{ color: "white", fontWeight: "light", letterSpacing: 2 }}> {order.status.replace('_', ' ').toLowerCase()} </Text>
      </StatusContainer>}
      <View style={{ flex: 1 }}>
        {/*<MapView*/}
        {/*  region={getRegionForCoordinates([*/}
        {/*    {latitude: order.specialist.location.coordinates[1], longitude: order.specialist.location.coordinates[0]},*/}
        {/*    {latitude: order.facility.location.coordinates[1], longitude: order.facility.location.coordinates[0]}*/}
        {/*  ])}*/}
        {/*  customMapStyle={mapStyles}*/}
        {/*  style={{*/}
        {/*    minHeight: 320,*/}
        {/*    height: "100%",*/}
        {/*    width: "100%"*/}
        {/*  }}*/}
        {/*/>*/}
        {!['COMPLETED', 'CANCELLED', 'ONGOING',].includes(order.status) && <MapBooking
          selectedFacility={order.facility}
          searchLocation={order.specialist.location.coordinates}
          specialistLocation={order.specialist.location.coordinates}
          clientSetters={null}
          specialistSetters={null}
          order={order}
        />}
        {['ONGOING',].includes(order.status) && !isClient && <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text variant={"caption"} style={{ color: "white" }}> Service being provided ...</Text>
        </View>}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {/* {
        ratings > 0.99 ? <></> :
          <>
            {['COMPLETED', 'CANCELLED'].includes(order.status) &&
              <View style={{alignSelf: 'flex-end',margin:10 }}>
                <Rating
                  type="star"
                  ratingColor={theme.colors.brand.primary}
                  fractions={0}
                  startingValue={ratings > 0.99 ? ratings : 0}
                  readonly
                  imageSize={22}
                />
              </View>
            }
          </>
      } */}
        {['COMPLETED', 'CANCELLED'].includes(order.status) &&

          <SmallOrderCard style={{ marginTop: 30, marginHorizontal: 10, alignSelf: 'flex-end' }}>
            <TouchableOpacity onPress={() => setReviewModal(true)}>
              <Text style={{ color: '#fff' }}>Add a Review</Text>
            </TouchableOpacity>
          </SmallOrderCard>
        }
      </View>
      <DetailsContainer style={!showSpecialist ? {} : { flex: 1 }}>
        <View style={!showSpecialist ? {} : { flex: 1 }}>
          <Spacer position="bottom" size="medium" />
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <SmallOrderCard>
              <Ionicons name="cash" size={16} color="white" />
              <Spacer position="left" size="large" />
              <Text variant="caption" style={{ color: "white", fontSize: 15 }}>
                $ {order.price / 100}
              </Text>
            </SmallOrderCard>

            <SmallOrderCard>
              <FontAwesome name="car" size={16} color="white" />
              <Spacer position="left" size="large" />
              <Text variant="caption" style={{ color: "white", fontSize: 15 }}>
                {isClient ? order.clientTravelDistance : order.specialistTravelDistance} km
              </Text>
            </SmallOrderCard>
            {!['COMPLETED', 'CANCELLED', 'ONGOING'].includes(order.status) && !isCheckout && <SmallOrderCard>
              <TouchableOpacity onPress={() => {
                console.log("=================================>",order.status);
                if(order.status === 'ONGOING' || order.status === 'IN_TRAFFIC'){
                console.log('order.client ======>', order.client.firstName)
                navigation.navigate("Chat", {
                  order: order.id,
                  sender: isClient ? order.client.id : order.specialist.id,
                  isClient: isClient,
                  receiver: {
                    _id: !isClient ? order.client.id : order.specialist.id,
                    name: !isClient ? `${order.client.firstName} ${order.client.lastName}` : `${order.specialist.user.firstName} ${order.specialist.user.lastName}`,
                    avatar: "",
                  },
                })
              }
              else{
                showMessage({
                  message: "Failure",
                  description:  isClient ? "Message can only be sent after order acceptance.": "Accept the Order",
                  type:"warning",
                  ...flashMessageStyle,
                });
              }
              }
              }>
                {
                  unreadMessaage?
                    <View style={{ position: 'absolute', backgroundColor: 'red', width: 10, height: 10, top: 0, right: 0, borderRadius: 50, zIndex: 1, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontSize: UnreadMessage > 10 ? 8 : 10, color: '#fff' }}>
                        {/* {UnreadMessage > 10 ? 10 + '+' : UnreadMessage} */}
                        {1}
                      </Text>
                    </View>
                    : <></>
                }
                
                  <Ionicons name="md-chatbox-outline" size={16} color={'white'} />

              </TouchableOpacity>
            </SmallOrderCard>}
          </View>
          {showSpecialist && <><SpecialistCard specialist={order.specialist} rating={ratings !== undefined ? ratings : false} darkTheme={true} /><Spacer position="bottom" size="medium" /></>}

          <FlatList
            horizontal={false}
            data={order.services}
            renderItem={({ item }) => (
              <ExtraSmallServiceCard key={item.id} style={{ shadow: theme.shadows.default }} width={showSpecialist ? width + 112 : width}>
                <ExtraSmallServiceCardImage source={{ uri: item.photo }} />
                <View style={{ flex: 1, padding: 8 }}>
                  <Text variant="caption"
                    style={{ color: "white", fontSize: 14, width: '100%', overflow: 'hidden' }}>
                    {item.serviceType.name}
                  </Text>
                </View>
                <ExtraSmallServiceCardPrice>
                  <Text variant="caption"
                    style={{ color: "white", fontSize: 14, textTransform: "uppercase", fontWeight: "light" }}>
                    $ {item.price}
                  </Text>
                </ExtraSmallServiceCardPrice>
              </ExtraSmallServiceCard>
            )}
          />
          <View style={{ alignItems: "center", justifyContent: "center" }}>

          </View>

        </View>
        <Spacer position="bottom" size="large" />

        {order.position === 0 && !isClient && (order.status === 'PENDING') && <AcceptButton style={{ shadow: theme.shadows.default }} onPress={() => acceptOrder(order.id)}>
          <Text variant="caption"
            style={{
              color: "white",
              fontSize: 14,
              textTransform: "uppercase",
              fontWeight: "light",
              letterSpacing: 2,
            }}>
            Accept request
          </Text>
        </AcceptButton>}

        {order.position === 0 && !isClient && (order.status === 'IN_TRAFFIC') && (
          <Formik
            initialValues={{ code: '' }}
            onSubmit={values => {
              console.log(values.code)
              
              startOrder(order.id, values.code);
             
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <>
                <TextInput
                  color={"white"}
                  mode={"outlined"}
                  type={"outlined"}
                  onChangeText={handleChange('code')}
                  onBlur={handleBlur('code')}
                  value={values.code}
                  label={"Enter start code"}
                  theme={{
                    colors: {
                      primary: theme.colors.brand.primary,
                      muted: "#fafafa",
                      text: "white",
                      placeholder: "white"
                    }
                  }}
                  style={{ backgroundColor: "#25282b", color: "white" }}
                  keyboardType={"numeric"}
                  maxLength={4}
                />
                <Spacer position="bottom" size="large" />
                <AcceptButton style={{ shadow: theme.shadows.default }} onPress={handleSubmit}>
                  <Text variant="caption"
                    style={{
                      color: "white",
                      fontSize: 14,
                      textTransform: "uppercase",
                      fontWeight: "light",
                      letterSpacing: 2,
                    }}>
                    Confirm start code
                  </Text>
                </AcceptButton>
              </>
            )}
          </Formik>
        )}
        {isCheckout && <AcceptButton style={{ shadow: theme.shadows.default }} onPress={checkout}>
          <Text variant="caption"
            style={{
              color: "white",
              fontSize: 14,
              textTransform: "uppercase",
              fontWeight: "light",
              letterSpacing: 2,
            }}>
            Checkout
          </Text>
        </AcceptButton>}

        {!['COMPLETED', 'CANCELLED', 'PENDING'].includes(order.status) && (order.startCode || order.endCode) && isClient && !isCheckout && <View style={{ padding: 16, backgroundColor: "#25282b", borderRadius: 5 }}>
          {order.status === 'IN_TRAFFIC' && order.startCode && <Text variant={"caption"} style={{ textTransform: "uppercase", letterSpacing: 2, fontWeight: "bold", color: theme.colors.brand.primary }}>start code</Text>}
          {order.status === 'ONGOING' && order.endCode && <Text variant={"caption"} style={{ textTransform: "uppercase", letterSpacing: 2, fontWeight: "bold", color: theme.colors.brand.primary }}>End code</Text>}
          <Spacer position={"bottom"} size={"medium"} />
          {order.status === 'IN_TRAFFIC' && order.startCode && <View style={{ padding: 8, flexDirection: "row", alignItems: "center", backgroundColor: "black", justifyContent: "space-between" }}>{order.startCode.split('').map(c => <Text variant={"caption"} style={{ fontSize: 24, color: theme.colors.brand.primary, fontWeight: "bold" }}>{c}</Text>)}</View>}
          {order.status === 'ONGOING' && order.endCode && <View style={{ padding: 8, flexDirection: "row", alignItems: "center", backgroundColor: "black", justifyContent: "space-between" }}>{order.endCode.split('').map(c => <Text variant={"caption"} style={{ fontSize: 24, color: theme.colors.brand.primary, fontWeight: "bold" }}>{c}</Text>)}</View>}
        </View>}

        {order.position === 0 && !isClient && (order.status === 'ONGOING') && (
          <Formik
            initialValues={{ code: '' }}
            onSubmit={values => {
            
              setOrderCompleted(true)
              setCode(values.code)
            
              if (orderCompleted){
                completeOrder(order.id, code)
              setOrderCompleted(false)
              SyncStorage.set("ordercomplete",{value:"true",order:order})
              console.log(":Asdadsas");
              }
              
    
            
              

            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <>
                <TextInput
                  color={"white"}
                  type={"outlined"}
                  mode={"outlined"}
                  onChangeText={handleChange('code')}
                  onBlur={handleBlur('code')}
                  value={values.code}
                  label={"Enter end code"}
                  theme={{
                    colors: {
                      primary: theme.colors.brand.primary,
                      muted: "#fafafa",
                      text: "white",
                      placeholder: "white"
                    }
                  }}
                  style={{ backgroundColor: "#25282b", color: "white" }}
                  keyboardType={"numeric"}
                  maxLength={4}
                />
                <Spacer position="bottom" size="large" />
                <AcceptButton style={{ shadow: theme.shadows.default }} onPress={handleSubmit}>
                  <Text variant="caption"
                    style={{

                      fontSize: 14,
                      textTransform: "uppercase",
                      fontWeight: "light",
                      letterSpacing: 2,
                    }}>
                    Confirm complete code
                  </Text>
                </AcceptButton>
              </>
            )}
          </Formik>
        )}
      </DetailsContainer>
      {
         <Modal
         animationType={"fade"}
         transparent={true}
         visible={ReviewModal}
         style={{ backgroundColor: "#00000030", marginLeft: 0, marginBottom: 0, height: '100%', width: "100%" }
         }
         onRequestClose={() => {
           //  onClose ? onClose:null 
           if (orderCompleted) {
             completeOrder(order.id, code)
             setOrderCompleted(false)
           }
           setSelectedEntity('')
           setReviewDescription('')
           setReviewRatings(0)
           setReviewModal(false)
         }}
         >
         {/*All views of Modal*/}

         
         <View style={{
           justifyContent: 'center',
           alignItems: 'center',
           backgroundColor: theme.colors.brand.primary,
           height: selectedEntity == ''? '60%': "auto",
           alignSelf: 'center',
           width: '80%',
           borderRadius: 10,
           borderWidth: 1,
           borderColor: '#fff',

         }}>
        
           {
             selectedEntity ==''  ?
             <>
                <TouchableOpacity
             style={{ width: 20, height: 20, backgroundColor: 'white', borderRadius: 30, position: 'absolute', top: 10, right: 10, justifyContent: 'center', alignItems: 'center' }}
             onPress={() => {
               setReviewModal(false)
               if (orderCompleted) {
                 completeOrder(order.id, code)
                 setOrderCompleted(false)
               }
               setSelectedEntity('')
               setReviewDescription('')
               setReviewRatings(0)
               // onClose ? onClose:null 
             }}>
             <Entypo name='cross' size={20} color={'black'} />
           </TouchableOpacity>
             <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Select Entity to Review</Text>
             {
             isClient || isHost ?
           <View  style={{flexDirection:"row",alignSelf:"center"}}>
   
             <FontAwesome name="scissors" size={18} color={'white'} style={{margin:5}} />
             <Text style={{ color: 'white', fontSize: 20 }}>Specialist</Text>
</View>

          
           :
           <View style={{flexDirection:"row",alignSelf:"center"}}>
   
   <FontAwesome name="home" size={18} color={'white'}  style={{margin:5}}/>
           <Text style={{ color: 'white', fontSize: 20,   }}>Facility</Text> 
         
</View>
}
             <TouchableOpacity
             onPress={()=>{
               isClient || isHost ? 
               setSelectedEntity('specialist')
               : isClient || isSpecialist ? setSelectedEntity('facility')
               :ToastAndroid.show('Please Select a Valid Entity to Review',ToastAndroid.SHORT)
             }}
             style={{
                   backgroundColor: '#fff',
                   margin: 10,
                   width: '80%',
                   elevation: 2,
                   height: 50,
                   padding: 5,
                   borderRadius: 5,
                   flexDirection: 'row',
                   alignItems:'center',
                 }}>
               <Image source={{ uri: isClient || isHost ? order.specialist?.user?.photo : order.facility?.coverImage }} style={{ height: 30, width: 30, marginHorizontal: 10 }} />
               <Text style={{ color: '#000', fontSize: 15, fontWeight: '600'}}>
             {
               isClient || isHost ? `${order.specialist?.user?.firstName} ${order.specialist?.user?.lastName}`:
               isSpecialist ?  `${order.facility?.name}` :``
             } 
               </Text>
               </TouchableOpacity> 
               {
isSpecialist || isHost ? 
<View style={{flexDirection:"row",alignSelf:"center"}}>
<FontAwesome name="user" size={18} color={'white'} style={{margin:5}} />

<Text style={{ color: 'white', fontSize: 20}}>Client</Text>
  
</View> 
          
                :
                <View style={{flexDirection:"row",alignSelf:"center"}}>
      <FontAwesome name="home" size={18} color={'white'} style={{margin:5}} />

           <Text style={{ color: 'white', fontSize: 20,   }}>Facility</Text> 
        
</View> }
                 <TouchableOpacity 
                 onPress={()=>{
                   isSpecialist || isHost ? setSelectedEntity('client') :
               isClient ?  setSelectedEntity('facility') 
               :ToastAndroid.show('Please Select a Valid Entity to Review',ToastAndroid.SHORT)  
                 }}
                 style={{
                   backgroundColor: '#fff',
                   margin: 10,
                   width: '80%',
                   elevation: 2,
                   height: 50,
                   padding: 5,
                   borderRadius: 5,
                   flexDirection: 'row',
                   alignItems:'center'
                 }}>
               <Image source={{ uri:order.facility?.coverImage }} style={{ height: 30, width: 30, marginHorizontal: 10}} />
               <Text style={{ color: '#000', fontSize: 15, fontWeight: '600'}}>
             {
               isSpecialist || isHost ? `${order.client?.firstName} ${order.client?.lastName}`:
               isClient ?  `${order.facility?.name}` :``
             }             
               </Text>
               </TouchableOpacity> 
               </>
             :<></>
           }
           {
             selectedEntity !==''
             ?
             <>
           <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
             Your Review for
             {selectedEntity =='specialist' ? 
             ` ${order.specialist?.user?.firstName} ${order.specialist?.user?.lastName}` : 
             ` ${order?.client?.firstName}`}
             </Text>  
           {
              isClient && selectedEntity =='specialist' ?  
              <> 
             <Text style={{ color: 'black', fontSize: 18, fontWeight: '700', marginBottom: 5 }}>Services</Text>
              {
               order?.services.map((item) => {
               return (
                 <View style={{
                   backgroundColor: '#fff',
                   marginTop: 10,
                   width: '80%',
                   elevation: 2,
                   height: 50,
                   alignItems:'center',
                   padding: 5,
                   borderRadius: 5,
                   flexDirection: 'row'
                 }}>
                   <Image source={{ uri: item.photo }} style={{ height: 30, width: 30, marginHorizontal: 10 }} />
                   <Text style={{ color: '#000', fontSize: 15, fontWeight: '400' }}>{item.serviceType.name}</Text>
                 </View>
               )
             })
             } 
             </>  
             :<></>
           }

           <TouchableOpacity
             style={{ width: 20, height: 20, backgroundColor: 'white', borderRadius: 30, position: 'absolute', top: 10, right: 10, justifyContent: 'center', alignItems: 'center' }}
             onPress={() => {
               setReviewModal(false)
               if (orderCompleted) {
                 completeOrder(order.id, code)
                 setOrderCompleted(false)
               }
               setSelectedEntity('')
               setReviewDescription('')
               setReviewRatings(0)
               // onClose ? onClose:null 
             }}>
             <Entypo name='cross' size={20} color={'black'} />
           </TouchableOpacity>
           <TextInput
             placeholder="Write Your Review Here"
             value={reviewDescription}
             onChangeText={(t) => setReviewDescription(t)}
             style={{
               backgroundColor: '#fff',
               marginTop: 10,
               width: '80%',
               elevation: 2,
               height: '10%',
               padding: 5,
               borderRadius: 5
             }} />
           <Rating
             type="star"
             ratingColor={theme.colors.brand.primary}
             ratingBackgroundColor={'red'}
             fractions={0}
             startingValue={reviewRatings}
             showrating
             style={{ marginTop: 10 }}
             onFinishRating={(rt) => setReviewRatings(rt)}
             imageSize={22}
           />
           <TouchableOpacity
             style={{ width: "60%", height: '13%', backgroundColor: 'white', borderRadius: 5, justifyContent: 'center', alignItems: 'center', margin: 20, elevation: 2, shadowColor: '#000' }}
             onPress={() => {
               if (reviewRatings > 0.99 ) {
                 //CHANGE HOWEVER YOU NEED TO CHANGE THE REVIEW FORMAT
                 if (isClient) {
                   selectedEntity == 'specialist' ? updateReviews({ service: order?.services.map((item) => item._id), specialist: order?.specialist?._id,reviewType:"client", rating: reviewRatings, description: reviewDescription })
                   : selectedEntity =='facility' ? updateReviews({ facility: order?.facility?._id, rating: reviewRatings, reviewType:"client",description: reviewDescription })
                   :null
                 }
                 else if(isSpecialist) {
                   console.log('this is NOtt happening');
                   selectedEntity == 'client' ? updateReviews({ service: order?.services.map((item) => item._id), specialist: order?.specialist?._id, reviewType:"specialist",rating: reviewRatings, description: reviewDescription })
                   : selectedEntity =='facility' ? updateReviews({ facility: order?.facility?._id, rating: reviewRatings,reviewType:"specialist", description: reviewDescription })
                   :null
                   // updateReviews({ facility: order?.facility?._id, rating: reviewRatings, description: reviewDescription })
                 }
                 else if(isHost)
                 {
                   selectedEntity == 'specialist'? updateReviews({ service: order?.services.map((item) => item._id),facility: order?.facility?._id, specialist: order?.specialist?._id,reviewType:"facility", rating: reviewRatings, description: reviewDescription })
                   : selectedEntity == 'client' ? updateReviews({ facility: order?.facility?._id, reviewType:"facility" ,facility: order?.facility?._id, rating: reviewRatings, description: reviewDescription })
                   :null
                 }
                 if (orderCompleted) {
                   completeOrder(order.id, code)
                   setOrderCompleted(false)
                 }
                 setSelectedEntity('')
                 setReviewDescription('')
                 setReviewRatings(0)
                //  setReviewModal(false)
               }
               else {
                if (reviewRatings < 1 || reviewRatings == undefined ) {
                  console.log("check");
                  sendMessage(
                    "Rating should be 1 star or more",
                    "Minimum Rating to be given is 1 star",
                    "error",
                    2000,
                    theme.colors.ui.warning
                  );
                }
              }
             }}>
             <Text style={{ color: theme.colors.brand.primary, fontSize: 20, fontWeight: 'bold' }}>Submit</Text>
           </TouchableOpacity>
           </>
             : <></>
           }
         </View>
       </Modal>
      }
    </Container>
  )
}
