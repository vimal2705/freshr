import styled from 'styled-components/native';
import { Dimensions, FlatList, RefreshControl, ScrollView, useWindowDimensions, View } from "react-native";
import { useEffect, useState, useContext } from "react";
import { SafeArea } from "../../components/utils/safearea.component";
import { Spacer } from "../../components/spacer/spacer.component";
import { Text } from '../../components/typography/typography.component'
import { connect, useSelector } from "react-redux";
import { AppContext } from "../../providers/app-provider";
import { OrderCard } from "../pro-specialist/components/order-card.component";
import { TouchableOpacity } from 'react-native';
import socketServices from './components/Socket';
import SpecialistCard from '../components/specialist-card.component';
import { Modal } from 'react-native-paper';
import { Entypo } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Paymentsheet } from '../../components/bottom-sheet/payment-sheet';
import { AuthContext } from '../../providers/auth/auth.context';
const TabButton = styled.TouchableOpacity`
  padding: 0px 16px;
  position: relative;
  height: 60px;
  border: 1px solid ${({ active, theme }) => active ? theme.colors.brand.primary : '#25282B'};
  background-color: ${({ active, theme }) => active ? theme.colors.brand.primary : 'black'};
  align-items: center;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 6px;
  min-width: ${(Dimensions.get("window").width - 24) / 3}px;
  z-index: 20;
`
const CountContainer = styled.View`
margin-left:3
height: ${({ isLarge }) => isLarge ? '30px' : '20px'};
width: ${({ isLarge }) => isLarge ? '30px' : '20px'};
background-color: black;
border-radius: ${({ isLarge }) => isLarge ? '30px' : '20px'};
border: 1px solid ${({ active, theme }) => active ? theme.colors.brand.primary : '#25282B'};
align-items: center;
justify-content: center;
`
const OrdersScreen = (props) => {
  // const fromcheckout = false
  // const {fromcheckout} = props.route.params
  // const route = useRoute()
  // const {paymentIntent1,
  //   ephemeralKey1,
  //   customer1} = props.route.params

  //   console.log("frommmmm routeeeeeeee||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||", paymentIntent1,
  //   ephemeralKey1,
  //   customer1);
  const [showPaymentsheet, setshowPaymentsheet] = useState(false);
  const { ongoingOrder, orders, onGetOrders, pendingOrders, refreshing, onRefresh } = useContext(AppContext); 
  const {user} = useContext(AuthContext)

  console.log("user========>", user);

  const fromcheckout = false
  // const open=props.route.params?.open?true:false;
  const handleshowPaymentsheet = () => {
    setshowPaymentsheet(!showPaymentsheet);
  };

  // useEffect(()=>{
  //   if(open){
  //     console.log("insidepaymentsheet");
  //   handleshowPaymentsheet();
  //   }
  // },[props.route.params])
  console.log("-------------------------------------------------->", fromcheckout);
  const navigation = useNavigation()
  useEffect(()=>{
    if(fromcheckout){
      setCurrentTab('pending')
    }
  }, [])

  console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\npaid or not ******************************", ongoingOrder?.isPaid);
  const[userLoc,setUserloc]=useState();
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
    // console.log("location:::::::", location);
      // setUserloc(location.coords)
      setUserloc(location.coords)
    }
    console.log("outtt");
    findLoc()
  }, []);
  useEffect(()=>{
    socketServices.initializeSocket();
    console.log("orderssssss connected")
//     socketServices.on('Send_Request',(dataa)=>{

//       // userLoc
//       getUserLoc();

//       console.log("requestttttttttttttttttt------------",dataa);
// setCurrentTab('ongoing');
//     })
    // socketServices.on('Send_complete_code',(dataa)=>{
    //   console.log("donejobbbbbbbbbb",(dataa));
      
    //     onGetOrders();
    //     setLength([...orders.filter(order => !['ONGOING', 'IN_TRAFFIC', 'PENDING', 'CANCELLED'].includes(order.status))].length)
    
      
     
    // })



    socketServices.on('Send_complete_Busy',(dataa)=>{
      console.log("yoooooooooooooooooooooooooodoneeeeeeeeeeeeeeeeeeeee",(dataa));
      if(dataa.order3==false){
      setTimeout(()=>{
      onGetOrders();
    setLength([...orders.filter(order => !['ONGOING', 'IN_TRAFFIC', 'PENDING', 'CANCELLED'].includes(order.status))].length)
      }, 5000)
    }
    })

    socketServices.on('Send_Request',async (dataa)=>{ 
      setTimeout(async ()=>{
        await onGetOrders()
        console.log("requestttttttttttttttttt------------",dataa);
  setCurrentTab('ongoing');
        console.log("paymentdataaaaa=========================",dataa, ongoingOrder);
        
    // socketServices.on('Send_Request',(dataa)=>{
    //   console.log("paymentdataaaaa=========================",dataa, ongoingOrder);
      
    //     if(user?._id == dataa.orderr){
    //       console.log("mhhgyghyugyugyugyuguuuuhujhyuhuhu",ongoingOrder,dataa.orderr);
    //       handleshowPaymentsheet();
    //     }
    // })


          if(user?._id == dataa.orderr){
            console.log("mhhgyghyugyugyugyuguuuuhujhyuhuhu",ongoingOrder,dataa.orderr);
            handleshowPaymentsheet();
          }
      }, 4000)
    })
  },[])


  console.log("hbdxjaghsdcgbajdgshbxagsgdsjgcgevkcfuwgaebkcb::::::::::::::::::::::::::::::::::::::;", ongoingOrder);
  const getUserLoc=async()=>{
    console.log("adsasddedddd",orders);
    // const {orderr}= await fetchLiveLocation(order._id,specialistlocation=[loc.coords.longitude,loc.coords.latitude],clientloction=[]);

  }
  const layout = useWindowDimensions();
  const [length, setLength] = useState(10);
  useEffect(() => {
    onGetOrders()
    setLength([...orders.filter(order => !['ONGOING', 'IN_TRAFFIC', 'PENDING', 'CANCELLED'].includes(order.status))].length)
    // console.log("mmmmmmmmmmmmmmmmmmmmmmmmmm",[...orders.filter(order => !['ONGOING', 'IN_TRAFFIC', 'PENDING', 'CANCELLED'].includes(order.status))]);
    // console.log([...orders.filter(order => !['ONGOING', 'IN_TRAFFIC', 'PENDING', 'CANCELLED'].includes(order.status))].length);
  }, [])
 
  const [currentTab, setCurrentTab] = useState('ongoing')
  const [visibleHistory, setVisibleHistory] = useState(10);
  const [visiblePending, setVisiblePending] = useState(10);
  const [historyViewMore, setHistoryViewMore] = useState(true);
  const [rejectmodal, setRejectmodal] = useState(false);
  const [rejectSpecialist, setRejectSpecialist] = useState([]);
  const [sname, setSname] = useState(null)
  const [sid, setSid] = useState(null)
  // const [data, setData] = useState([]);
  const tabs = ['ongoing', 'pending', 'history']
  const getOrders = (tab) => {
    switch (tab) {
      case 'ongoing':
        return ongoingOrder ? [ongoingOrder] : []
      case 'history':
        // if([...orders.filter(order => !['ONGOING', 'IN_TRAFFIC', 'PENDING', 'CANCELLED'].includes(order.status))]
        // .slice(0, visibleHistory).length <= visibleHistory  ){
        //   // setHistoryViewMore(false)
        // }
        return [...orders.filter(order => !['ONGOING', 'IN_TRAFFIC', 'PENDING', 'CANCELLED'].includes(order.status))]
          .slice(0, visibleHistory);
      case 'pending':
        return [...pendingOrders].slice(0, visiblePending)
    }
  }
  const loadMoreHistory = () => {
    setVisibleHistory(visibleHistory + 10);
    setVisiblePending(visiblePending +10);
  };

  useEffect(()=>{
    setshowPaymentsheet(ongoingOrder ? ongoingOrder?.isPaid ? false : true : false)
  }, [])
useEffect(()=>{
  socketServices.on('Reject_Send', (dataa) => {
    console.log("rejectedddddataaaa---------------------------------^^^^^^^^^^^^^^^^^^^^^^^^^^^", dataa);
    setSname(dataa.spename)
    setSid(dataa.speid)
let temp 
    if(dataa.speid){
      temp = specialist.filter((item)=> item?.user?._id != dataa.speid)
    }
if(temp){
  setRejectSpecialist(temp)
}
    // let temp = []
    // specialist.map((item)=>{
    //   const temp1 = item.services.filter((item1)=>item1.serviceType.name == dataa.serviceName)
    //   temp = [...temp, temp1]
    //   console.log("tempppp", temp);
    // })
    // temp = specialist.filter((item)=>item.services[0]?.serviceType?.name == dataa?.serviceName)
    // const temp = specialist.filter(specialist => {
    //   // Check each service for the "Bob" haircut
    //   const bobService = specialist.services.find(service => service.serviceType.name === dataa.serviceName);
    //   return bobService !== undefined; // Return true if Bob haircut is found in services
    // });
    // console.log("<><><><>", temp);
    // setRejectSpecialist(temp)
    setRejectmodal(true)
  })
}, [])
const specialist = useSelector((state) => state?.specialists?.specialists) 

console.log("specialistttttttttttttt[][][][][][][][][][][][][][{}{}{}{}{}{}{}{()()()()()()()()", specialist);
  // console.log("!!!!!!>>>>>>>>>>>>>>>>>>>>>>>>>", specialist[0]?.services);
  //658c3ae2638851878cb1a19f 658d45c891e1f97785e0ad1b
  useEffect(()=>{
    let temp
    if(sid){
      temp = specialist.filter((item)=> item?.user?._id != sid)
    }
    setRejectSpecialist(temp ? temp : specialist)
    console.log("\n\n\n\n\n\n\n\n\n\n\n0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000", sid, sname);
    console.log("~~~~~~~~~~~~~~~~~~~~~>>>>>>>>>>>", specialist);
    // console.log("<<<<>>>>>", specialist[0]?.services[0].serviceType.name);
    // 658d45c891e1f97785e0ad1b
  }, [specialist, sid, sname])
  
  return (
    // <SafeArea>
      <View style={{ flex: 1, paddingVertical: 16, paddingHorizontal: 12 }}>
        <Spacer position={"bottom"} size={"large"} />
        <Spacer position={"bottom"} size={"large"} />
        <Text variant="caption" style={{ color: "black", fontSize: 18, letterSpacing: 2 }}>Your orders</Text>
        <Spacer position={"bottom"} size={"large"} />
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={tabs}
          renderItem={({ item }) => {
            const orders = getOrders(item);
const isLarge = orders.length > 3;
            return (
              <TabButton active={item === currentTab} onPress={() => {
                setCurrentTab(item)
                }}>
                <Text variant='caption' style={{ fontWeight: 'light', color: 'white', textTransform: 'uppercase', letterSpacing: 1 }}>{item}</Text>
                <CountContainer isLarge={isLarge}>
  <Text variant='caption' style={{ fontWeight: 'light', color: 'white', textTransform: 'uppercase', letterSpacing: 1 }}>
    {item === 'history' ? length : orders.length}
  </Text>
</CountContainer>
              </TabButton>
            )
          }
          } />
        <View>
          <Spacer position={"bottom"} size={"small"} />
        </View>
        {currentTab === 'history' && <FlatList
          // horizontal={false}
          // showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl style={{ position: "absolute", top: 200 }} refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={getOrders("history").length == 0 ? ['empty'] : getOrders("history")}
          renderItem={({ item }) => {
            if (item === 'empty') {
              return <View style={{ flex: 1 }} />
            } else {
              return (
                <ScrollView showsVerticalScrollIndicator={false}>
                  <OrderCard style={{ marginBottom: 10 }} isClient={true} order={item}
                    showSpecialist={true} navigation={props.navigation} giveReview={true} />
                </ScrollView>
              )
            }
          }}
          keyExtractor={(item) => `completed}-${item.id}`}
        />}
        {/*{currentTab === 'cancelled' && <FlatList*/}
        {/*  horizontal={false}*/}
        {/*  showsHorizontalScrollIndicator={false}*/}
        {/*  refreshControl={*/}
        {/*    <RefreshControl style={{ position: "absolute", top: 200 }} refreshing={refreshing} onRefresh={onRefresh} />*/}
        {/*  }*/}
        {/*  data={getOrders("cancelled")}*/}
        {/*  renderItem={({ item }) => <View>*/}
        {/*    <OrderCard style={{ marginBottom: 10, paddingVertical: 7 }} isClient={true} order={item} key={item.id}*/}
        {/*               showSpecialist={true} navigation={props.navigation} />*/}
        {/*  </View>}*/}
        {/*  keyExtractor={(item) => `completed}-${item.id}`}*/}
        {/*/>}*/}
        {currentTab === 'ongoing' && <FlatList
          horizontal={false}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl style={{ position: "absolute", top: 200 }} refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={getOrders("ongoing").length === 0 ? ['empty'] : getOrders("ongoing")}
          renderItem={({ item }) => {
            if (item === 'empty') {
              return <View style={{ flex: 1 }} />
            } else {
              return (
                <View>
                  <OrderCard style={{ marginBottom: 10 }} isClient={true} order={item} key={item.id}
                    showSpecialist={true} navigation={props.navigation} />
                  <Spacer position={'top'} size={'medium'} />
                </View>
              )
            }
          }}
          keyExtractor={(item) => `completed}-${item.id}`}
        />}
        {currentTab === 'pending' && <FlatList
          horizontal={false}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl style={{ position: "absolute", top: 200 }} refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={getOrders("pending").length === 0 ? ['empty'] : getOrders("pending")}
          renderItem={({ item }) => {
            // console.log('=======>',item.services[0].serviceType)
            if (item === 'empty') {
              return <View style={{ flex: 1 }} />
            } else {
              return (
                <View>
                  <OrderCard style={{ marginBottom: 10 }} isClient={true} order={item} key={item.id}
                    showSpecialist={true} navigation={props.navigation} />
                  <Spacer position={'top'} size={'medium'} />
                </View>
              )
            }
          }}
          keyExtractor={(item) => `completed}-${item?.id}`}
        />}
        {currentTab=='history' && historyViewMore && length > 10 &&
        <TouchableOpacity
          onPress={loadMoreHistory}
          style={{
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'black',
            margin: 10,
          }}>
          <Text style={{ color: 'white' }}>View More</Text>
        </TouchableOpacity>
         }
{/* { rejectmodal &&
//  <View style={{backgroundColor:'red',height:200}}> */}
<Modal
visible={rejectmodal}
style={{ backgroundColor: "#fff", height: '90%', marginHorizontal:15}
}
><View style={{alignItems:'flex-end',height:30}}>

  <TouchableOpacity style={{width: 20, height: 20, backgroundColor: 'white', borderRadius: 30, position: 'absolute', top: 10, right: 10, justifyContent: 'center', alignItems: 'center' }}
            onPress={()=>setRejectmodal(false)}
            >
  <Entypo name='cross' size={20} color={'black'} />
  </TouchableOpacity> 

  </View>
  <View style={{justifyContent:'center', alignItems:'center', backgroundColor:'black', paddingVertical: 10}}>
    <Text style={{fontSize: 15, color:'#fff'}}>{`     Hi There, '${sname}' is no longer available 
Please Choose from our other list of pros`}</Text>
  </View>
  <ScrollView>
  {
rejectSpecialist?.map((item, index)=>{
  // console.log("rejecteddddddddddddddddddddddddddddddddddddddd",item);
return(

<View style={{justifyContent:'center',alignItems:'center',height:200}}>
<View style={{width:300}}>
   <SpecialistCard
      navigation={navigation}
      darkTheme={true}
      // active={item.id === specialist?._id}
      onPress={() => {
        // setSpecialist(item);
        navigation.navigate("SpecialistDetails", {
          edit: false,
          specialist: item
        });
        // setRejectmodal(false)
      }}
      specialist={item}
      // locationData={locationData}
    />
    </View>
    </View>
)
})
}
<Text></Text>
</ScrollView>
</Modal>  




{/* // </View>
 }  */}
 {/* 5147586982 */}
  <Paymentsheet
        showModal={showPaymentsheet}
        toggleShowModal={handleshowPaymentsheet}
        ongoingOrder={ongoingOrder}
      />
      </View>
    // </SafeArea>
  );
};
const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(OrdersScreen);