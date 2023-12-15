import styled, { useTheme } from "styled-components/native";
import { AntDesign, FontAwesome, Ionicons, Entypo } from "@expo/vector-icons";
// const {fetchPaymentSheetParams,setRefreshSearch,  search, loading, setLoading, payOrder} = useContext(AppContext);

import { Spacer } from "../../../components/spacer/spacer.component";
// import { Text } from "../../../components/typography/typography.component";
import {
  Dimensions,
  FlatList,
  ToastAndroid,
  TouchableOpacity,
  View,
  Text,
  Linking,
} from "react-native";
import { TextInput } from "react-native-paper";
import { SpecialistContext } from "../../../providers/specialist.provider";
import { useCallback, useContext, useEffect, useState } from "react";
import SpecialistCard from "../../components/specialist-card.component";
import { Formik } from "formik";
import * as yup from "yup";
import { Image } from "react-native";
import {
  StackActions,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { MapBooking } from "../../components/map-booking.component";

import { usePubNub } from "pubnub-react";
import { AppContext } from "../../../providers/app-provider";
import { AuthContext } from "../../../providers/auth/auth.context";
import Modal from "react-native-modal";
import { Rating } from "react-native-elements";
import { sendMessage } from "../../../providers/utils";
import { ReviewContext } from "../../../providers/review.provider";
import { useIsFocused } from "@react-navigation/native";
import { useSelector } from "react-redux";
import SyncStorage from "sync-storage";
import * as Clipboard from "expo-clipboard";
import { useDispatch } from "react-redux";
import * as Location from "expo-location";
import { FontAwesome5 } from '@expo/vector-icons';
import FlashMessage, {
  hideMessage,
  showMessage,
} from "react-native-flash-message";

import {
  flashMessageStyle,
  getError,
  getTokenAndCreateAuthorizationHeader,
  handleError,
  handleSuccess,
  // sendMessage,
} from "../utils";
import socketServices from "../../normal-app/components/Socket";
import { setMessageSeen, setOrder } from "../../../redux/chat/chat_actions";

const { width, height } = Dimensions.get("window");

const Container = styled.View`
  flex: 1;
  z-index: 10;
  border-radius: 5px;
  overflow: hidden;
  background-color: white;
  border: 1px solid #25282b;
  margin: 10px;
`;

const ExtraSmallServiceCard = styled.View`
  background-color: #25282b;
  border-radius: 5px;
  padding: 8px;
  margin-bottom: 2px;
  width: 100%;
  height: 70px;
  flex-direction: row;
  align-items: center;
`;

const ExtraSmallServiceCardPrice = styled.View`
  background-color: black;
  padding: 10px;
  flex-direction: row;
`;

const ExtraSmallServiceCardImage = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 3px;
  aspect-ratio: 1;
`;

const SmallOrderCard = styled.View`
  padding: 10px;
  border-radius: 5px;
  background-color: #25282b;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Button = styled.TouchableOpacity`
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  padding: 14px;
`;

const CloseButton = styled(Button)`
  position: absolute;
  z-index: 15;
  top: 0;
  left: 0;
  background-color: black;
`;

const AcceptButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.primary};
  width: 100%;
  align-self: flex-end;
  justify-self: flex-end;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
`;

const DetailsContainer = styled.View`
  background-color: white;
  min-height: 250px;
  padding: 16px;
  padding-bottom: 15px;
  padding-top: 20px;
`;

const StatusContainer = styled.View`
  padding: 4px;
  background-color: ${({ variant, theme }) => {
    switch (variant) {
      case "COMPLETED":
        return theme.colors.brand.primary;
      case "ONGOING":
        return theme.colors.brand.secondary;
      case "PENDING":
        return "#25282b";
      case "IN_TRAFFIC":
        return "black";
    }
  }};
  border-radius: 2px;

  position: absolute;
  z-index: 15;
  top: 6px;
  right: 16px;
`;

export const OrderCard = ({
  isform,
  order,
  isClient = false,
  isSpecialist = false,
  isHost = false,
  showSpecialist = false,
  isCheckout = false,
  checkout = null,
  giveReview = false,
  ...restProps
}) => {
  const navigation = useNavigation();
  const theme = useTheme();
  const pubnub = usePubNub();
  const { user } = useContext(AuthContext);
  const [ReviewModal, setReviewModal] = useState(false);
  const [reviewRatings, setReviewRatings] = useState(0);
  const [reviewDescription, setReviewDescription] = useState("");
  const [orderCompleted, setOrderCompleted] = useState(false);
  const { updateReviews, onGetRatings } = useContext(ReviewContext);
  const { acceptOrder, rejectOrder, startOrder, completeOrder } =
    useContext(SpecialistContext);
  const { UnreadMessage, fetchLiveLocation } = useContext(AppContext);
  const [code, setCode] = useState("");
  const [ratings, setRatings] = useState(0);
  const [selectedEntity, setSelectedEntity] = useState("");
  const [rejectmodal, setRejectmodal] = useState(false);
  const [rejectSpecialist, setRejectSpecialist] = useState([]);
  const isFocused = useIsFocused();
  const orderr = "Accepted";
  const orderreject = "Rejected";
  const order1 = "CODE SEND";
  const order2 = "Task Done";
  const order3 = isSpecialist;
  const { specialist } = useContext(SpecialistContext);
  // console.log("specialllllllllllllllllll", specialist);

  // const dispatch = useDispatch()
  const dispatch = useDispatch();
  const [copiedText, setCopiedText] = useState("");

  const copyToClipboard = (text) => {
    Clipboard.setStringAsync(text);
  };
  // console.log("HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH", order);

  const [userloc, setUserloc] = useState({});
  useEffect(() => {
    const findLoc = async () => {
      console.log("startt");
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log("endd", status);
      if (status !== "granted") {
        // setErrorMsg('Permission to access location was denied');
        console.log("noooooooooooooooooooo");
        return;
      }
      const isAndroid = Platform.OS == "android";
      console.log("here");
      let location = await Location.getCurrentPositionAsync();
      console.log("location:::::::", location);
      // setUserloc(location.coords)
      setUserloc(location.coords);
    };
    if (isClient) {
      handleUserLocation();
    }
    console.log("outtt");
    findLoc();
  }, []);
  const handleUserLocation = async () => {
    console.log(
      "heloooooooooooooooooooooooooooooofrommmmmmmmmmmmmmmmmmuserrrrrrrrrrrrrrrrrrrr"
    );
    const { orderr } = await fetchLiveLocation(
      order._id,
      (specialistlocation = []),
      (clientloction = [userloc.longitude, userloc.latitude])
    );
    // console.log("apiputttttttttttttttorderrrr", orderr);
  };

  const [host, setHost] = useState([]);
  const [address, setAddress] = useState("");
  const h = useSelector((state) => state.locationn);
  useEffect(() => {
    if (order?.selectedLocation) {
      setHost(order?.selectedLocation);
    } else if (h?.length>0) {
      setHost(h);
    } else {
      setHost(
        order.facility == null
          ? order.specialist.location.coordinates
          : order.facility.location.coordinates
      );
    }
    // console.log("mmmmmmmsssssss",order?.selectedLocation, h, order?.facility?.location?.coordinates, order?.specialist?.location?.coordinates);
  }, [h]);

  useEffect(() => {
    const setadd = async () => {
      // console.log("============================================>", host);
      let l = await Location.reverseGeocodeAsync({
        latitude: host[1],
        longitude: host[0],
      });
      // console.log("_________________________________________________", l);
      // console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~>", l);

      // setAddress(`${l[0].city==null?'':l[0].city},${l[0].street==null?'':l[0].street}`)
      setAddress(
        `${l[0].city == null ? "" : l[0].city},${l[0].street == null ? "" : l[0].street
        }`
      );
    };
    setadd();
  }, [host]);

  useEffect(() => {
    socketServices.initializeSocket();
    socketServices.on("Send_complete_code", (dataa) => {
      console.log("donejobbbbbbbbbb", dataa);
      setReviewModal(true);
    });
    showSpecialist ? getRatings() : console.log("true");

    console.log("doneee");
  }, []);

  // useEffect(()=>{
  //   socketServices.on('Reject_Send', (dataa) => {
  //     console.log("rejectedddddataaaa", dataa);

  //     setRejectmodal(true)

  //   })
  // }, [])
  // const specialist = useSelector((state) => state.specialists.specialists)
  // console.log("!!!!!!>>>>>>>>>>>>>>>>>>>>>>>>>", specialist[0].services);

  // useEffect(()=>{
  //   setRejectSpecialist(specialist)
  //   console.log("<<<<>>>>>", specialist[0].services[0].serviceType.name);
  // }, [specialist])

  // const dispatch=useDispatch()
  const unreadMessaage = useSelector((state) => state.chat.seen);
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
    let rts = 0;
    if (isClient) {
      rts = await onGetRatings(order?.specialist?._id, "specialist");
    } else {
      rts = await onGetRatings(order?.client?._id, "user");
    }
    console.log("rtssss", rts);
    setRatings(rts);
  };
  if (!order || !order.specialist) {
    return (
      <View>
        <Text variant="caption" style={{ color: "black" }}>
          Something is wrong
        </Text>
      </View>
    );
  }
  const [serviceName, setServiceName] = useState("");
  const [rejectedid, setRejectedid] = useState();
  useEffect(() => {
    if (!isClient) {
      // console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", order.services[0]);
      setServiceName(order.services[0].serviceType.name);
      setRejectedid(order.services[0].id);
    }
  }, []);
  // console.log("ordersssssssssssssssssssssssssssssssss", order.client);
  const handleLoctaion = async () => {
    const { orderr } = await fetchLiveLocation(
      order._id,
      (specialistlocation = [userloc.longitude, userloc.latitude]),
      (clientloction = [])
    );
    // console.log("apiputttttttttttttttorderrrr", orderr);
  };

  console.log("121212121234567890~~~~~~~~~~~~~~~~~~~~~~~~", order._id);
  const sendMapp = () => {
    Linking.openURL(`google.navigation:q=${host[1]}+${host[0]}`);
  };
  return (
    
<>
<View
              style={{
                flexDirection: "row",
                // justifyContent: "center",
                gap: 10,
                left:25,
                
              }}
            >
              <Text style={{ fontSize: 15 }}>id: {order?._id}</Text>
              <TouchableOpacity
              onPress={()=>copyToClipboard(order?._id)}
                style={{
                  borderWidth: 1,
                  height: 20,
                  width: 20,
                  backgroundColor: "#000",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 5,
                }}
              >
                <AntDesign name="copy1" size={14} color="#fff" />
              </TouchableOpacity>
            </View>

    <Container>
      {isClient && order?.status == 'PENDING' &&
        <View style={{
          backgroundColor: 'black', borderRadius: 2, padding: 4,
          position: 'absolute',
          zIndex: 15,
          top: 6,
          left: 16
        }}>
          <Text
            variant="caption"
            style={{ color: "white", fontWeight: "light", letterSpacing: 2 }}
          >
            Please Wait!
          </Text>
        </View>
      }
      {!isClient &&
        order.position === 0 &&
        !["COMPLETED", "CANCELLED", "ONGOING", "IN_TRAFFIC"].includes(
          order.status
        ) && (
          <CloseButton
            onPress={() => {
              if (isCheckout) {
                console.log("OPENNNNNNNN");
                navigation.dispatch(StackActions.popToTop());
              } else {
                if (!isClient) {
                  console.log(order.id);
                  try {
                    socketServices.emit("Reject", {
                      serviceName,
                      rejectedid,
                    });
                    console.log("yessssssssss");
                  } catch {
                    console.log("nooooooooo");
                  }
                  rejectOrder(order.id);
                }
              }
            }}
          >
            <AntDesign name="close" size={16} color="white" />
            
            <Spacer position="left" size="medium" />
            <Text
              variant="caption"
              style={{
                color: "white",
                fontSize: 14,
                textTransform: "uppercase",
                fontWeight: "light",
                letterSpacing: 1,
              }}
            >
              {" "}
              {isClient ? "Cancel" : "Reject"}{" "}
            </Text>
          </CloseButton>
        )}
        
      {order.position !== 0 &&
        !isCheckout &&
        !["COMPLETED", "CANCELLED"].includes(order.status) && (
          <CloseButton onPress={() => null}>
            <Text
              variant="caption"
              style={{
                color: "white",
                fontSize: 12,
                textTransform: "uppercase",
                fontWeight: "light",
                letterSpacing: 1,
              }}
            >
              {" "}
              {order.position + 1} / in queue{" "}
            </Text>
          </CloseButton>
        )}


      {order.status && (
        <>

          <StatusContainer variant={order.status}>

            <Text
              variant="caption"
              style={{ color: "white", fontWeight: "light", letterSpacing: 2 }}
            >
              {" "}
              {order.status.replace("_", " ").toLowerCase()}{" "}
            </Text>
          </StatusContainer>
        </>
      )}
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
        
        {!["COMPLETED", "CANCELLED", "ONGOING"].includes(order.status) && (
          <MapBooking
            selectedFacility={order.facility}
            searchLocation={order.specialist.location.coordinates}
            specialistLocation={order.specialist.location.coordinates}
            clientSetters={null}
            specialistSetters={null}
            order={order}
            isClient={isClient}
          />
        )}
        {/* <Text style={{ color: "black", fontSize: 18, letterSpacing: 2, marginHorizontal:10 }}>{order?.specialist?.user?.firstName} {order?.specialist?.user?.lastName}</Text> */}
        {/* <Text style={{marginHorizontal:10}}>{order?.specialist?.user?.searchLocation?.address}</Text> */}
        {["ONGOING"].includes(order.status) && !isClient && (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Text variant={"caption"} style={{ color: "white" }}>
              {" "}
              Service being provided ...
            </Text>
          </View>
        )}
      </View>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
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
        {["COMPLETED", "CANCELLED"].includes(order.status) && (
          <SmallOrderCard
            style={{
              marginTop: 30,
              marginHorizontal: 10,
              alignSelf: "flex-end",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setReviewModal(true),
                  console.log("111111111111111", order.specialist.user);
              }}
            >
              <Text style={{ color: "#fff" }}>Add a Review</Text>
            </TouchableOpacity>
          </SmallOrderCard>
        )}
      </View>

      <DetailsContainer style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Spacer position="bottom" size="medium" />
          

          <View style={{
          backgroundColor: 'black', borderRadius: 2, padding: 4,
          position: 'absolute',
          zIndex: 15,
          top: 6,
          
        }}>
          <Text
            variant="caption"
            style={{ color: "white", fontWeight: "light", letterSpacing: 2 }}
          >
              {`${order?.createdAt?.substring(
                8,
                10
              )}/${order?.createdAt?.substring(
                5,
                7
              )}/${order?.createdAt?.substring(0, 4)}`}
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <Text style={{ fontSize: 16 }}>id: {order?._id}</Text>
              <TouchableOpacity
                onPress={() => copyToClipboard(order?._id)}
                style={{
                  borderWidth: 1,
                  height: 20,
                  width: 20,
                  backgroundColor: "#000",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 5,
                }}
              >
                <AntDesign name="copy1" size={14} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* {order.address == undefined ? <View><Text></Text></View> : <TouchableOpacity onPress={copyToClipboard(order?.address?.address1 + order?.address?.apartment + order?.address?.locality + order?.address?.State + order?.address?.postcode + order?.address?.country)}><Text>{order?.address?.address1} {order?.address?.apartment} {order?.address?.locality} {order?.address?.State} {order?.address?.postcode} {order?.address?.country}</Text></TouchableOpacity>} */}
          {order.address == undefined ? (
            <View>
              <Text></Text>
            </View>
          ) : (
            <TouchableOpacity onPress={console.log("asdasd")}>
              <Text>
                {order?.address?.address1} {order?.address?.apartment}{" "}
                {order?.address?.locality} {order?.address?.State}{" "}
                {order?.address?.postcode} {order?.address?.country}
              </Text>
            </TouchableOpacity>
          )}
          {/* {order.address?.country == undefined ? <View><Text style={{fontWeight:"bold"}}>Address</Text> <Text onPress={()=>Clipboard.setString(`${order?.address?.address1} ${order?.address?.apartment} ${order?.address?.locality} ${order?.address?.State} ${order?.address?.postcode} ${order?.address?.country} `)}>{order?.address?.address1} {order?.address?.apartment} ,{order?.address?.locality},{order?.address?.State} ,{order?.address?.postcode}</Text></View> :<View><Text>{order?.address?.address1}</Text></View> } */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
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
                {isClient
                  ? order.clientTravelDistance
                  : order.specialistTravelDistance}{" "}
                km
              </Text>
            </SmallOrderCard>
            {!["COMPLETED", "CANCELLED", "ONGOING"].includes(order.status) &&
              !isCheckout && (
                <SmallOrderCard>
                  <TouchableOpacity
                    onPress={() => {
                      if (
                        order.status === "ONGOING" ||
                        order.status === "IN_TRAFFIC"
                      ) {
                        console.log(
                          "order.client ======>",
                          order.client.firstName
                        );
                        navigation.navigate("Chat", {
                          order: order.id,
                          sender: isClient
                            ? order.client.id
                            : order.specialist.id,
                          isClient: isClient,
                          receiver: {
                            _id: !isClient
                              ? order.client.id
                              : order.specialist.id,
                            name: !isClient
                              ? `${order.client.firstName} ${order.client.lastName}`
                              : `${order.specialist.user.firstName} ${order.specialist.user.lastName}`,
                            avatar: "",
                          },
                        });
                      } else {
                        showMessage({
                          message: "Failure",
                          description: isClient
                            ? "Message can only be sent after order acceptance."
                            : "Accept the Order",
                          type: "warning",
                          ...flashMessageStyle,
                        });
                      }
                    }}
                  >
                    {unreadMessaage ? (
                      <View
                        style={{
                          position: "absolute",
                          backgroundColor: "red",
                          width: 10,
                          height: 10,
                          top: 0,
                          right: 0,
                          borderRadius: 50,
                          zIndex: 1,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: UnreadMessage > 10 ? 8 : 10,
                            color: "#fff",
                          }}
                        ></Text>
                      </View>
                    ) : (
                      <></>
                    )}
                    <Ionicons
                      name="md-chatbox-outline"
                      size={16}
                      color={"white"}
                    />
                  </TouchableOpacity>
                </SmallOrderCard>
              )}
          </View>

          {/* {showSpecialist && <><SpecialistCard specialist={order.specialist} rating={ratings !== undefined ? ratings :false} darkTheme={true} /><Spacer position="bottom" size="medium" /></>} */}

          <FlatList
            horizontal={false}
            data={order.services}
            renderItem={({ item }) => (
              <>
                <ExtraSmallServiceCard
                  key={item.id}
                  style={{ shadow: theme.shadows.default }}
                  width={showSpecialist ? width + 112 : width}
                >
                  <ExtraSmallServiceCardImage source={{ uri: item.photo }} />
                  <View style={{ flex: 1, padding: 8 }}>
                    <Text
                      variant="caption"
                      style={{
                        color: "white",
                        fontSize: 14,
                        width: "100%",
                        overflow: "hidden",
                      }}
                    >
                      {item.serviceType.name}
                    </Text>
                  </View>
                  <ExtraSmallServiceCardPrice>
                    <Text
                      variant="caption"
                      style={{
                        color: "white",
                        fontSize: 14,
                        textTransform: "uppercase",
                        fontWeight: "light",
                      }}
                    >
                      $ {item.price}
                    </Text>
                  </ExtraSmallServiceCardPrice>
                </ExtraSmallServiceCard>
                <>
                  <View style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 }}>
                    <View style={{ flexDirection: "row", gap: 10 }}>
                      <View
                        style={{
                          backgroundColor: "#000",
                          borderRadius: 10,
                          height: 20,
                          width: 20,
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        <AntDesign name="user" size={14} color="#fff" />
                      </View>
                      <Text style={{ fontSize: 16, textAlign: 'center' }}>
                        {order?.client?.firstName} {order?.client?.lastName}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center', alignItems: 'center' }}>
                      <Entypo name="scissors" size={18} color="black" />
                      <Text style={{ fontSize: 16 }}>
                        {specialist?.user?.firstName
                          ? specialist?.user?.firstName
                          : order?.specialist?.user?.firstName}{" "}
                        {specialist?.user?.lastName
                          ? specialist?.user?.lastName
                          : order?.specialist?.user?.lastName}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity style={{ flexDirection: 'row', gap: 10 }} onPress={() => sendMapp()}>
                    <Entypo name="direction" size={18} color="black" />
                    <Text style={{ fontSize: 16, textDecorationLine: 'underline', color: '#1D6DF3' }}>{address}</Text>
                    <FontAwesome5 name="directions" size={18} color="#1D6DF3" />
                  </TouchableOpacity>
                </>
              </>
            )}
          />
        </View>

        <Spacer position="bottom" size="large" />

        {order.position === 0 && !isClient && order.status === "PENDING" && (
          <AcceptButton
            style={{ shadow: theme.shadows.default }}
            onPress={() => {
              handleLoctaion();
              try {
                socketServices.emit("Accept_Request", {
                  orderr,
                });
                console.log("yessssssssss");
              } catch {
                console.log("nooooooooo");
              }
              // try {
              //   socketServices.emit('Location_ChangeSP',{
              //     userloc
              //   })

              // } catch (error) {
              //   console.log("nooooooooolocccccccccccc",error);
              // }

              console.log("doneeeeeeee----------------------");
              acceptOrder(order.id);
            }}
          >
            <Text
              variant="caption"
              style={{
                color: "white",
                fontSize: 14,
                textTransform: "uppercase",
                fontWeight: "light",
                letterSpacing: 2,
              }}
            >
              Accept request
            </Text>
          </AcceptButton>
        )}

        {order.position === 0 && !isClient && order.status === "IN_TRAFFIC" && (
          <Formik
            initialValues={{ code: "" }}
            onSubmit={(values) => {
              try {
                socketServices.emit("Accept_start_code", {
                  order1,
                });
                console.log("yessssssssss");
              } catch {
                console.log("nooooooooo");
              }
              console.log(values.code);
              startOrder(order.id, values.code);
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <>
                <TextInput
                  color={"white"}
                  mode={"outlined"}
                  type={"outlined"}
                  onChangeText={handleChange("code")}
                  onBlur={handleBlur("code")}
                  value={values.code}
                  label={"Enter start code"}
                  theme={{
                    colors: {
                      primary: theme.colors.brand.primary,
                      muted: "#fafafa",
                      text: "white",
                      placeholder: "white",
                    },
                  }}
                  style={{ backgroundColor: "#25282b", color: "white" }}
                  keyboardType={"numeric"}
                  maxLength={4}
                />
                <Spacer position="bottom" size="large" />
                <AcceptButton
                  style={{ shadow: theme.shadows.default }}
                  onPress={handleSubmit}
                >
                  <Text
                    variant="caption"
                    style={{
                      color: "white",
                      fontSize: 14,
                      textTransform: "uppercase",
                      fontWeight: "light",
                      letterSpacing: 2,
                    }}
                  >
                    Confirm start code
                  </Text>
                </AcceptButton>
              </>
            )}
          </Formik>
        )}
        {isCheckout && (
          <AcceptButton
            style={{ shadow: theme.shadows.default }}
            onPress={checkout}
          >
            <Text
              variant="caption"
              style={{
                color: "white",
                fontSize: 14,
                textTransform: "uppercase",
                fontWeight: "light",
                letterSpacing: 2,
              }}
            >
              Place Order
            </Text>
          </AcceptButton>
        )}

        {!["COMPLETED", "CANCELLED", "PENDING"].includes(order.status) &&
          (order.startCode || order.endCode) &&
          isClient &&
          !isCheckout && (
            <View
              style={{
                padding: 16,
                backgroundColor: "#25282b",
                borderRadius: 5,
              }}
            >
              {order.status === "IN_TRAFFIC" && order.startCode && (
                <Text
                  variant={"caption"}
                  style={{
                    textTransform: "uppercase",
                    letterSpacing: 2,
                    fontWeight: "bold",
                    color: theme.colors.brand.primary,
                  }}
                >
                  start code
                </Text>
              )}
              {order.status === "ONGOING" && order.endCode && (
                <Text
                  variant={"caption"}
                  style={{
                    textTransform: "uppercase",
                    letterSpacing: 2,
                    fontWeight: "bold",
                    color: theme.colors.brand.primary,
                  }}
                >
                  End code
                </Text>
              )}
              <Spacer position={"bottom"} size={"medium"} />
              {order.status === "IN_TRAFFIC" && order.startCode && (
                <View
                  style={{
                    padding: 8,
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "black",
                    justifyContent: "space-between",
                  }}
                >
                  {order.startCode.split("").map((c) => (
                    <Text
                      variant={"caption"}
                      style={{
                        fontSize: 24,
                        color: theme.colors.brand.primary,
                        fontWeight: "bold",
                      }}
                    >
                      {c}
                    </Text>
                  ))}
                </View>
              )}
              {order.status === "ONGOING" && order.endCode && (
                <View
                  style={{
                    padding: 8,
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "black",
                    justifyContent: "space-between",
                  }}
                >
                  {order.endCode.split("").map((c) => (
                    <Text
                      variant={"caption"}
                      style={{
                        fontSize: 24,
                        color: theme.colors.brand.primary,
                        fontWeight: "bold",
                      }}
                    >
                      {c}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          )}

        {order.position === 0 && !isClient && order.status === "ONGOING" && (
          <Formik
            initialValues={{ code: "" }}
            onSubmit={(values) => {
              // Complete_code
              console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^", isform);
              if (isform == "host") {
                console.log("check1");
                setOrderCompleted(true);
                completeOrder(order.id, code);
                setCode(values.code);
                console.log(order.client.firstName);
                // setReviewModal(true)
              } else {
                setOrderCompleted(true);
                setCode(values.code);

                if (orderCompleted) {
                  completeOrder(order.id, code);
                  setOrderCompleted(false);
                  SyncStorage.set("ordercomplete", {
                    value: "true",
                    order: order,
                  });
                  console.log(":Asdadsas");
                }
              }
              try {
                socketServices.emit("Complete_code", {
                  order2,
                });
                console.log("yessssssssss");
              } catch {
                console.log("nooooooooo");
              }
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <>
                <TextInput
                  color={"white"}
                  type={"outlined"}
                  mode={"outlined"}
                  onChangeText={handleChange("code")}
                  onBlur={handleBlur("code")}
                  value={values.code}
                  label={"Enter end code"}
                  theme={{
                    colors: {
                      primary: theme.colors.brand.primary,
                      muted: "#fafafa",
                      text: "white",
                      placeholder: "white",
                    },
                  }}
                  style={{ backgroundColor: "#25282b", color: "white" }}
                  keyboardType={"numeric"}
                  maxLength={4}
                />
                <Spacer position="bottom" size="large" />
                <AcceptButton
                  style={{ shadow: theme.shadows.default }}
                  onPress={handleSubmit}
                >
                  <Text
                    variant="caption"
                    style={{
                      fontSize: 14,
                      textTransform: "uppercase",
                      fontWeight: "light",
                      letterSpacing: 2,
                    }}
                  >
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
          style={{
            backgroundColor: "#00000030",
            marginLeft: 0,
            marginBottom: 0,
            height: "100%",
            width: "100%",
          }}
          onRequestClose={() => {
            //  onClose ? onClose:null
            if (orderCompleted) {
              completeOrder(order.id, code);
              setOrderCompleted(false);
            }
            setSelectedEntity("");
            setReviewDescription("");
            setReviewRatings(0);
            // setReviewModal(false)
          }}
        >
          {/*All views of Modal*/}

          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: theme.colors.brand.primary,
              height: selectedEntity == "" ? "60%" : "auto",
              alignSelf: "center",
              width: "80%",
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#fff",
            }}
          >
            {selectedEntity == "" ? (
              <>
                <TouchableOpacity
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: "white",
                    borderRadius: 30,
                    position: "absolute",
                    top: 10,
                    right: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    try {
                      socketServices.emit("Complete_Busy", {
                        order3,
                      });
                      console.log("yessssssssssbusssyyyyyyyyyyyyyyyyyyy");
                    } catch {
                      console.log("nooooooooobusyyyyyyyyyyyyyyyyyyyy");
                    }

                    setReviewModal(false);
                    if (orderCompleted) {
                      completeOrder(order.id, code);
                      setOrderCompleted(false);
                    }
                    setSelectedEntity("");
                    setReviewDescription("");
                    setReviewRatings(0);
                    // onClose ? onClose:null
                  }}
                >
                  <Entypo name="cross" size={20} color={"black"} />
                </TouchableOpacity>
                <Text
                  style={{
                    color: "white",
                    fontSize: 20,
                    fontWeight: "bold",
                    marginBottom: 10,
                  }}
                >
                  Select Entity to Review
                </Text>
                {isClient || isHost ? (
                  <View style={{ flexDirection: "row", alignSelf: "center" }}>
                    <FontAwesome
                      name="scissors"
                      size={18}
                      color={"white"}
                      style={{ margin: 5 }}
                    />
                    <Text style={{ color: "white", fontSize: 20 }}>
                      Specialist
                    </Text>
                  </View>
                ) : order.facility == undefined ? (
                  <></>
                ) : (
                  <View style={{ flexDirection: "row", alignSelf: "center" }}>
                    <FontAwesome
                      name="home"
                      size={18}
                      color={"white"}
                      style={{ margin: 5 }}
                    />
                    <Text style={{ color: "white", fontSize: 20 }}>
                      Facility
                    </Text>
                  </View>
                )}
                {order.facility == undefined ? (
                  <></>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      isClient || isHost
                        ? setSelectedEntity("specialist")
                        : isClient || isSpecialist
                          ? setSelectedEntity("facility")
                          : ToastAndroid.show(
                            "Please Select a Valid Entity to Review",
                            ToastAndroid.SHORT
                          );
                    }}
                    style={{
                      backgroundColor: "#fff",
                      margin: 10,
                      width: "80%",
                      elevation: 2,
                      height: 50,
                      padding: 5,
                      borderRadius: 5,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={{
                        uri:
                          isClient || isHost
                            ? order.specialist?.user?.photo
                            : order.facility?.coverImage,
                      }}
                      style={{ height: 30, width: 30, marginHorizontal: 10 }}
                    />
                    <Text
                      style={{ color: "#000", fontSize: 15, fontWeight: "600" }}
                    >
                      {isClient || isHost
                        ? `${order.specialist?.user?.firstName} ${order.specialist?.user?.lastName}`
                        : isSpecialist
                          ? `${order.facility?.name}`
                          : ``}
                    </Text>
                  </TouchableOpacity>
                )}
                {isSpecialist || isHost ? (
                  <View style={{ flexDirection: "row", alignSelf: "center" }}>
                    <FontAwesome
                      name="user"
                      size={18}
                      color={"white"}
                      style={{ margin: 5 }}
                    />

                    <Text style={{ color: "white", fontSize: 20 }}>Client</Text>
                  </View>
                ) : (
                  <View style={{ flexDirection: "row", alignSelf: "center" }}>
                    <FontAwesome
                      name="home"
                      size={18}
                      color={"white"}
                      style={{ margin: 5 }}
                    />

                    <Text style={{ color: "white", fontSize: 20 }}>
                      Facility
                    </Text>
                  </View>
                )}
                <TouchableOpacity
                  onPress={() => {
                    isSpecialist || isHost
                      ? setSelectedEntity("client")
                      : isClient
                        ? setSelectedEntity("facility")
                        : ToastAndroid.show(
                          "Please Select a Valid Entity to Review",
                          ToastAndroid.SHORT
                        );
                  }}
                  style={{
                    backgroundColor: "#fff",
                    margin: 10,
                    width: "80%",
                    elevation: 2,
                    height: 50,
                    padding: 5,
                    borderRadius: 5,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={{ uri: order.facility?.coverImage }}
                    style={{ height: 30, width: 30, marginHorizontal: 10 }}
                  />
                  <Text
                    style={{ color: "#000", fontSize: 15, fontWeight: "600" }}
                  >
                    {isSpecialist || isHost
                      ? `${order.client?.firstName} ${order.client?.lastName}`
                      : isClient
                        ? `${order.facility?.name}`
                        : ``}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <></>
            )}
            {selectedEntity !== "" ? (
              <>
                <Text
                  style={{
                    color: "white",
                    fontSize: 20,
                    fontWeight: "bold",
                    marginBottom: 10,
                  }}
                >
                  Your Review for
                  {selectedEntity == "specialist"
                    ? ` ${order.specialist?.user?.firstName} ${order.specialist?.user?.lastName}`
                    : selectedEntity == "facility"
                      ? ` ${order.facility?.name}`
                      : ` ${order?.client?.firstName}`}
                </Text>
                {isClient && selectedEntity == "specialist" ? (
                  <>
                    <Text
                      style={{
                        color: "black",
                        fontSize: 18,
                        fontWeight: "700",
                        marginBottom: 5,
                      }}
                    >
                      Services
                    </Text>
                    {order?.services.map((item) => {
                      return (
                        <View
                          style={{
                            backgroundColor: "#fff",
                            marginTop: 10,
                            width: "80%",
                            elevation: 2,
                            height: 50,
                            alignItems: "center",
                            padding: 5,
                            borderRadius: 5,
                            flexDirection: "row",
                          }}
                        >
                          <Image
                            source={{ uri: item.photo }}
                            style={{
                              height: 30,
                              width: 30,
                              marginHorizontal: 10,
                            }}
                          />
                          <Text
                            style={{
                              color: "#000",
                              fontSize: 15,
                              fontWeight: "400",
                            }}
                          >
                            {item.serviceType.name}
                          </Text>
                        </View>
                      );
                    })}
                  </>
                ) : (
                  <></>
                )}

                <TouchableOpacity
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: "white",
                    borderRadius: 30,
                    position: "absolute",
                    top: 10,
                    right: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    setReviewModal(false);
                    if (orderCompleted) {
                      completeOrder(order.id, code);
                      setOrderCompleted(false);
                    }
                    setSelectedEntity("");
                    setReviewDescription("");
                    setReviewRatings(0);
                    // onClose ? onClose:null
                  }}
                >
                  <Entypo name="cross" size={20} color={"black"} />
                </TouchableOpacity>
                <TextInput
                  placeholder="Write Your Review Here"
                  value={reviewDescription}
                  onChangeText={(t) => setReviewDescription(t)}
                  style={{
                    backgroundColor: "#fff",
                    marginTop: 10,
                    width: "80%",
                    elevation: 2,
                    height: "10%",
                    padding: 5,
                    borderRadius: 5,
                  }}
                />
                <Rating
                  type="star"
                  ratingColor={theme.colors.brand.primary}
                  ratingBackgroundColor={"red"}
                  fractions={0}
                  startingValue={reviewRatings}
                  showrating
                  style={{ marginTop: 10 }}
                  onFinishRating={(rt) => setReviewRatings(rt)}
                  imageSize={22}
                />
                <TouchableOpacity
                  style={{
                    width: "60%",
                    height: "13%",
                    backgroundColor: "white",
                    borderRadius: 5,
                    justifyContent: "center",
                    alignItems: "center",
                    margin: 20,
                    elevation: 2,
                    shadowColor: "#000",
                  }}
                  onPress={() => {
                    if (reviewRatings > 0.99) {
                      //CHANGE HOWEVER YOU NEED TO CHANGE THE REVIEW FORMAT
                      if (isClient) {
                        selectedEntity == "specialist"
                          ? updateReviews({
                            service: order?.services.map((item) => item._id),
                            specialist: order?.specialist?._id,
                            reviewType: "client",
                            rating: reviewRatings,
                            description: reviewDescription,
                          })
                          : selectedEntity == "facility"
                            ? updateReviews({
                              facility: order?.facility?._id,
                              rating: reviewRatings,
                              reviewType: "client",
                              description: reviewDescription,
                            })
                            : null;
                      } else if (isSpecialist) {
                        console.log("this is NOtt happening");
                        selectedEntity == "client"
                          ? updateReviews({
                            service: order?.services.map((item) => item._id),
                            specialist: order?.specialist?._id,
                            rating: reviewRatings,
                            reviewType: "specialist",
                            description: reviewDescription,
                          })
                          : selectedEntity == "facility"
                            ? updateReviews({
                              facility: order?.facility?._id,
                              rating: reviewRatings,
                              reviewType: "specialist",
                              description: reviewDescription,
                            })
                            : null;
                        // updateReviews({ facility: order?.facility?._id, rating: reviewRatings, description: reviewDescription })
                      } else if (isHost) {
                        selectedEntity == "specialist"
                          ? updateReviews({
                            service: order?.services.map((item) => item._id),
                            facility: order?.facility?._id,
                            specialist: order?.specialist?._id,
                            reviewType: "facility",
                            rating: reviewRatings,
                            description: reviewDescription,
                          })
                          : selectedEntity == "client"
                            ? updateReviews({
                              facility: order?.facility?._id,
                              facility: order?.facility?._id,
                              rating: reviewRatings,
                              reviewType: "facility",
                              description: reviewDescription,
                            })
                            : null;
                      }
                      if (orderCompleted) {
                        completeOrder(order.id, code);
                        setOrderCompleted(false);
                      }
                      setSelectedEntity("");
                      setReviewDescription("");
                      setReviewRatings(0);
                      // setReviewModal(false)
                    } else {
                      if (reviewRatings < 1 || reviewRatings == undefined) {
                        console.log("check------", reviewRatings);
                        sendMessage(
                          "Rating should be 1 star or more",
                          "Minimum Rating to be given is 1 star",
                          "error",
                          2000,
                          theme.colors.ui.warning
                        );
                      }
                      // else if(reviewDescription == ''){
                      //   sendMessage(
                      //     "Please write a review",
                      //     2000,
                      //     theme.colors.ui.warning
                      //   );
                      // }
                    }
                  }}
                >
                  <Text
                    style={{
                      color: theme.colors.brand.primary,
                      fontSize: 20,
                      fontWeight: "bold",
                    }}
                  >
                    Submit
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <></>
            )}
          </View>
        </Modal>
      }
      {/* 
      { rejectmodal && isClient &&

        // <View style={{backgroundColor:'red',height:200}}>
        <Modal 
        visible={rejectmodal}
        style={{ backgroundColor: '#fff', justifyContent:'center',alignItems:'center',width: "90%",height:'80%' }}
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
                setRejectmodal(false)
                navigation.navigate("SpecialistDetails", {
                  edit: false,
                  specialist: item
                });
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
      
      } */}
    </Container>
    </>
  );
};
