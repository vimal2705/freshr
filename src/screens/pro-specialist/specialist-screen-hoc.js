import { SafeArea } from "../../components/utils/safearea.component";
import { Dimensions, FlatList, RefreshControl, TouchableOpacity, View ,ToastAndroid} from "react-native";
import { renderOrderClient } from "../../utils/renderOrderClient";
import { AntDesign, FontAwesome, Entypo } from "@expo/vector-icons";
import { TextInput } from 'react-native-paper';
import Modal from "react-native-modal";
import { Rating } from 'react-native-elements';
import { useContext, useState,useEffect } from "react";
import { SpecialistContext } from "../../providers/specialist.provider";
import { NavButton, TopNavContainer } from "./components/top-nav.component";
import { SmallButton } from "../../components/button/button.component";
import { Text } from "../../components/typography/typography.component";
import { Spacer } from "../../components/spacer/spacer.component";
import { Feather, Ionicons } from "@expo/vector-icons";
import { renderConfirmModal } from "./components/modal.component";
import { ReviewContext } from "../../providers/review.provider";
import styled, { useTheme } from "styled-components/native";
import { Image } from 'react-native';
import { BlurView } from "expo-blur";
import { sendMessage } from "../../providers/utils";
import { useNavigation } from "@react-navigation/native";
import { BackButton } from "../../components/navbar/navbar.component";
import SyncStorage from 'sync-storage';
const ProfileAvatar = styled.ImageBackground`
  height: 44px;
  width: 44px;
  border-radius: 44px;
  overflow: hidden;
  background-color: #25282b;
`;

const Row = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`

export const SpecialistScreenHoc = ({children, showBackButton=false}) => {
  const theme = useTheme();
  const {queue } = useContext(SpecialistContext) 
  const navigation = useNavigation();
  const [showAvailableConfirmation, setShowAvailableConfirmation] =
    useState(false);
  const [showUnavailableConfirmation, setShowUnavailableConfirmation] =
    useState(false);
    const [reviewRatings, setReviewRatings] = useState(0);
    const [selectedEntity, setSelectedEntity] = useState('')
    const [reviewDescription, setReviewDescription] = useState('');
    const [modal,setModal]= useState(false)
    const [order,setOrder] =useState([])
    const { updateReviews, onGetRatings } = useContext(ReviewContext)
  const [refreshing, setRefreshing] = useState(false);
  const {isLoading, error, specialist, goOnline, goOffline, startQueue, stopQueue,specialistServices, loadSpecialistData , orders } = useContext(SpecialistContext)
  const [showQueueConfirmation, setShowQueueConfirmation] = useState(false);
  const [showStopQueueConfirmation, setShowStopQueueConfirmation] =
    useState(false);
    const { acceptOrder, rejectOrder, startOrder, completeOrder } = useContext(SpecialistContext)
useEffect(()=>{
console.log(queue,"-0-0-0-0-0asdasd",SyncStorage.get("ordercomplete") == null);
if (SyncStorage.get("ordercomplete") == null) {
  console.log("Asdasd");
  setModal(false)
  setOrder([])


}else{
  console.log(SyncStorage.get("ordercomplete"))
  let orderdata = SyncStorage.get("ordercomplete")
  
  
  setOrder(orderdata?.order)
    setModal(true)
}
console.log("ordercheck",order);

},[])

  const renderTopNav = () => {
    return (
      <TopNavContainer style={{ backgroundColor: "transparent" }}>
        <Row>
          {showBackButton && <BackButton onPress={() => navigation.goBack()} elevation={2}
                       style={{ backgroundColor: "black", marginRight: 20 }}>
            <Ionicons name="arrow-back" size={20} color={"white"} />
          </BackButton>}
          {!showBackButton && <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <ProfileAvatar source={{ uri: specialist?.user?.photo }} />
          </TouchableOpacity>
          }
           {specialist?.isBusy && <View  style={{backgroundColor:theme.colors.brand.secondary,borderRadius:5,paddingVertical:4, paddingHorizontal:8 ,marginLeft:4}}>
            <Text variant="caption" style={{color: "white"}}>Busy</Text>
          </View>}
        </Row>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {specialist?.isOnline && <SmallButton primary={specialist.isQueueing}
                        onPress={() => specialist.isQueueing ? setShowStopQueueConfirmation(true) : setShowQueueConfirmation(true)}>
            <Text variant="caption"
                  style={{ color: "white" }}>{specialist.isQueueing ? "Stop queue" : "Start queue"}</Text>
          </SmallButton>}
         
          <Spacer position="left" size="medium" />
          <Spacer position="left" size="small" />
          <SmallButton primary={specialist?.isOnline}
                       onPress={() => specialist?.isOnline ? setShowUnavailableConfirmation(true) : setShowAvailableConfirmation(true) }>
            <Text variant="caption" style={{color: "white"}}>{specialist?.isOnline ? 'Go offline' : 'Go online'}</Text>
          </SmallButton>
          <Spacer position="left" size="large" />
          <Spacer position="left" size="small" />
          <NavButton
            color={specialist?.isOnline ? "white" : "transparent"}
            onPress={() => navigation.navigate("SpecialistMenu")}
          >
            <Feather name="settings" size={24} color={specialist?.isOnline ? "black" : "white"} />
          </NavButton>
        </View>
      </TopNavContainer>
    );
  };
  // const pendingOrders = orders.filter(order => order.status === 'PENDING')
  // const currentOrder = orders.filter(order => order.status === 'IN_TRAFFIC')[0]
  // const ongoingOrder = orders.filter(order => order.status === 'ONGOING')[0]
  // let queue = [...pendingOrders]
  // if (currentOrder) {
  //   queue = [currentOrder, ...queue]
  // }
  // if (ongoingOrder) {
  //   queue = [ongoingOrder, ...queue]
  // }

  const _goOnline = async () => {
    await goOnline();
  }

  const _startQueue = async () => {
    // if (!specialist?.isOnline ) {
    //   await goOnline();
    // }
    await startQueue()
  }

  const _stopQueueCancelAction = async () => {
    // if (!specialist?.isOnline) {
    //   await goOnline();
    // }
  }


  return <SafeArea style={{backgroundColor:  specialist?.isOnline ? theme.colors.brand.white : "black"}}>
    {renderConfirmModal(
      showAvailableConfirmation,
      setShowAvailableConfirmation,
      "Available",
      "Make sure you are ready to get clients and move to requested locations",
      _goOnline,
      null,
      true,
    )}
    {renderConfirmModal(
      showUnavailableConfirmation,
      setShowUnavailableConfirmation,
      "Unavailable",
      "You won't be visible in search results and will not receive any client",
      () => goOffline()
    )}
    {renderConfirmModal(
      showQueueConfirmation,
      setShowQueueConfirmation,
      "Start queue",
      "Make sure you are ready to get clients in the queue",
      _startQueue
    )}
    {renderConfirmModal(
      showStopQueueConfirmation,
      setShowStopQueueConfirmation,
      "Stop queue",
      "You will receive requests one at a time",
      () => stopQueue(),
      _stopQueueCancelAction,
    )}
    {renderTopNav()}

    <FlatList
      data={[1]}
      horizontal={false}
      showsVerticalScrollIndicator={false}
      style={{flex: 0, height: 0,  backgroundColor: "transparent", zIndex: -1}}
      refreshControl={
        <RefreshControl style={{ position: "absolute", top: 10 }} refreshing={refreshing} onRefresh={loadSpecialistData} />
      }
      ListHeaderComponent={<><View style={{flex: 1, minHeight: Dimensions.get("window").height * 0.8, height: "100%",  position: 'relative'}}>

        {children} 
        {queue && renderOrderClient({pendingOrders: queue, navigation: navigation, isClient: false, showSpecialist: false, normal: false})}

      </View></>}
      renderItem={() => <View style={{height: 0}}/>}/>
  <Modal
          animationType={"fade"}
          transparent={true}
          visible={modal}
          style={{ backgroundColor: "#00000030", marginLeft: 0, marginBottom: 0, height: '100%', width: "100%" }
          }
          onRequestClose={() => {
            //  onClose ? onClose:null 
         
            setSelectedEntity('')
            setReviewDescription('')
            setReviewRatings(0)
            setModal(false)
          }}>
          {/*All views of Modal*/}


          <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.colors.brand.primary,
            height: selectedEntity == '' ? '60%' : "auto",
            alignSelf: 'center',
            width: '80%',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#fff',

          }}>

            {
              selectedEntity == '' ?
                <>
                  <TouchableOpacity
                    style={{ width: 20, height: 20, backgroundColor: 'white', borderRadius: 30, position: 'absolute', top: 10, right: 10, justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => {
                      setModal(false)
                   
                      setSelectedEntity('')
                      setReviewDescription('')
                      setReviewRatings(0)
                      SyncStorage.set("ordercomplete",null)
                    }}>
                    <Entypo name='cross' size={20} color={'black'} />
                  </TouchableOpacity>
                  <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Select Entity to Review</Text>
                  {
                
                      <View style={{ flexDirection: "row", alignSelf: "center" }}>

                        <FontAwesome name="home" size={18} color={'white'} style={{ margin: 5 }} />
                        <Text style={{ color: 'white', fontSize: 20, }}>Facility</Text>

                      </View>
                  }
                 
                  <TouchableOpacity
                    onPress={() => {
                  setSelectedEntity('facility')
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
                      alignItems: 'center',
                    }}>
                    <Image source={{ uri: order?.facility?.coverImage }} style={{ height: 30, width: 30, marginHorizontal: 10 }} />
                    <Text style={{ color: '#000', fontSize: 15, fontWeight: '600' }}>
                      {
                      `${order?.facility?.name}`
                      }
                    </Text>
                  </TouchableOpacity>
                  {
                  
                   <View style={{ flexDirection: "row", alignSelf: "center" }}>
                     <FontAwesome name="user" size={18} color={'white'} style={{ margin: 5 }} />

                     <Text style={{ color: 'white', fontSize: 20 }}>Client</Text>

                   </View>

                }
                   <TouchableOpacity
                    onPress={() => {
                      setSelectedEntity('client') 
                       
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
                          alignItems: 'center'
                        }}>
                        <Image source={{ uri: order?.facility?.coverImage }} style={{ height: 30, width: 30, marginHorizontal: 10 }} />
                        <Text style={{ color: '#000', fontSize: 15, fontWeight: '600' }}>
                        {
                         `${order?.client?.firstName} ${order?.client?.lastName}` 
              
                      }
                        </Text>
                      </TouchableOpacity>
                 

                </>
                : <></>
            }
            {
              selectedEntity !== ''
                ?
                <>
                  <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
                    Your Review for 
                    {selectedEntity == 'facility' ?
                      ` ${order?.facility?.name} `:
                      ` ${order?.client?.firstName}`}
                  </Text>
                  {
                   
                      <>
                      {selectedEntity == 'facility' ?  <Text style={{ color: 'black', fontSize: 18, fontWeight: '700', marginBottom: 5 }}>Services</Text>:<></>}
                        {  selectedEntity == 'facility' ?
                          order?.services.map((item) => {
                            return (
                              <View style={{
                                backgroundColor: '#fff',
                                marginTop: 10,
                                width: '80%',
                                elevation: 2,
                                height: 50,
                                alignItems: 'center',
                                padding: 5,
                                borderRadius: 5,
                                flexDirection: 'row'
                              }}>
                                <Image source={{ uri: item.photo }} style={{ height: 30, width: 30, marginHorizontal: 10 }} />
                                <Text style={{ color: '#000', fontSize: 15, fontWeight: '400' }}>{item.serviceType.name}</Text>
                              </View>
                            )
                          })
                          :<></>
                        }
                      </>
                  
                  }

                  <TouchableOpacity
                    style={{ width: 20, height: 20, backgroundColor: 'white', borderRadius: 30, position: 'absolute', top: 10, right: 10, justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => {
                      // setModal(false)
              
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
                      if (reviewRatings > 0.99) {
                    
                          selectedEntity == 'client' ? updateReviews({ service: order?.services.map((item) => item._id),reviewType:"specialist", specialist: order?.specialist?._id, rating: reviewRatings, description: reviewDescription })
                          : selectedEntity == 'facility' ? updateReviews({ facility: order?.facility?._id,reviewType:"specialist", rating: reviewRatings, description: reviewDescription })
                            : null
                        // updateReviews({ facility: order?.facility?._id, rating: reviewRatings, description: reviewDescription })
                      
                     
                       SyncStorage.set("ordercomplete",null)
                        setSelectedEntity('')
                        setReviewDescription('')
                        setReviewRatings(0)
                        // setModal(false)
                      }
                      else {
                        if (reviewRatings < 1) {
                          sendMessage(
                            "Rating should be 1 star or more",
                            "Minimum Rating to be given is 1",
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
      
  </SafeArea>
}
