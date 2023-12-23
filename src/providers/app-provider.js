import { createContext, useCallback,  useState } from "react";
import {
  getTokenAndCreateAuthorizationHeader,
  handleError,
  handleSuccess,
} from "./utils";
import FlashMessage from "react-native-flash-message";
import axios from "axios";
import { BASE_API_URL } from "../constants";
import * as SecureStore from "expo-secure-store";
import { useRef } from "react";
import { useTheme } from "styled-components/native";
import { Dimensions, FlatList, RefreshControl, ScrollView, View } from "react-native";
import Carousel from "react-native-snap-carousel";
import socketServices from "../screens/normal-app/components/Socket";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import SyncStorage from "sync-storage"
// import { OrderCard } from "../screens/pro-specialist/components/order-card.component";
import { setOrder as setOD } from "../redux/chat/chat_actions";

export const AppContext = createContext();

export const AppProvider = ({ children, ...restProps }) => {
  const flashRef = useRef();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [currentApp, setCurrentApp] = useState('normal')
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([])
  const [pendingOrders, setPendingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [ongoingOrder, setOngoingOrder] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshingMessages, setRefreshingMessages] = useState(false);
  const [refreshSearch, setRefreshSearch] = useState(false);
  const [chatRooms, setChatRooms] = useState([]);
  const [UnreadMessage,setUnreadMessages] =useState(0)
  const [address,setAddress] = useState() 
  const [paydata, setPaydata] = useState(null)

  const dispatch = useDispatch()

useEffect(()=>{
    socketServices.initializeSocket()
    
    socketServices.on('Send_complete_code',(dataa)=>{
      console.log("donejobbbbbbbbbb",(dataa));
      onGetOrders();
    })
    socketServices.on('Send_Request',(dataa)=>{
      console.log("requestttttttttttttttttt------------",dataa);
      onGetOrders();
    })
    socketServices.on('Send_start_code',(dataa)=>{
      console.log("startcodeeeecalled",dataa);
      onGetOrders();
    })

    
  },[])
 
  const loadinstruction = async (type) => {
    console.log("loading instruction of", type);
    try {
      const inst = await axios.get(
        `${BASE_API_URL}/cms/${type}`
      );
      console.log("instructions------->", inst.data.data[0].url);
      return inst.data.data[0].url
    } catch (error) {
      console.log("instruction fetching failed", error);
      // return error
    }
  }

  const bankDetails = async () => {
    try {
      const bank = await axios.get(
        `${BASE_API_URL}/cms/bankinfo`
      );
      console.log("bankkkk instructions------->", bank.data);
      return bank.data
    } catch (error) {
      console.log("instruction fetching failed", error);
      // return error
    }
  }
  
  

  const loadFilters = async () => {
    try {
      setLoading(true);
      const resCategories = await axios.get(
        `${BASE_API_URL}/filters/serviceCategories`
      );
      const resServiceTypes = await axios.get(
        `${BASE_API_URL}/filters/serviceTypes`
      );

      console.log(resCategories.data);

      const serviceCategories = resCategories.data.data.categories;
      const serviceTypes = resServiceTypes.data.data.serviceTypes;
      setLoading(false);
      return { serviceCategories, serviceTypes };
    } catch (e) {
      handleError(e, setLoading, setError, theme)
    }
  };

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const config = await getTokenAndCreateAuthorizationHeader();
      const res = await axios.get(
        `${BASE_API_URL}/users/conversations`, config
      );
      console.log("RESSSS--MMMM",res.data.data.conversations);
      setChatRooms(res.data.data.conversations)
      await getUnreadMessage(res.data.data.conversations)
      setLoading(false) 
    } catch(err) {
      handleError(err, setLoading, setError, theme)
    }
  }
  
  const getUnreadMessage =async (conversations=false)=>{
    const {user}= await getUser()
    const {id}=user 
    const ord= conversations ?
    conversations.filter((item)=>{
      console.log('ITEEMMMMM',item.messages[item.messages.length - 1])
      if(item.messages[item.messages.length - 1].user._id !==id)
    {
      if(item.messages[item.messages.length - 1].seen == false)
      {
        return item
      }
    }
    }): chatRooms.filter((item)=>{
      console.log('ITEEMMMMM',item.messages[item.messages.length - 1])
      if(item.messages[item.messages.length - 1].user._id !==id)
    {
      console.log('ITEEMMMMM',item.messages[item.messages.length - 1]);
      if(item.messages[item.messages.length - 1].seen == false)
      {
        return 'yes'
      }
    }
    })
    console.log('Unread Message :',ord.length);
    if(ord.length == UnreadMessage){
      return;
    }
    else{
      setUnreadMessages(ord.length)
    }
    
  }
  
  const fetchPaymentSheetParams = async (services, facility, maxTime, data) => {
   
    
    try  {
      setLoading(true);
      const config = await getTokenAndCreateAuthorizationHeader(true);
      const res = await axios.post(`${BASE_API_URL}/orders/checkout-session/${services.join(',')}/${facility}/${maxTime}`,data, config)
      setError(null);
      setLoading(false);
      console.log("check---232323333333333",res.data);
      SyncStorage.remove('locationAddress');
      return res.data;
    } catch (err) {
      handleError(err, setLoading, setError, theme)
    }
  }

  const fetchLiveLocation = async (id, data1,data2) => {
    console.log("fetchhhhhhhhhhliveeeeeeeeeeeeeeeeeeee",id,data1,data2);
    const data={
      specialistlocation:data1,
      clientloction:data2
      

    }
    // url /api/v1/orders/:id
    // body : {
    // specialistlocation : []
    // clientloction: []
    // }
    // response : order model
    
    try  {
      // setLoading(true);
      const config = await getTokenAndCreateAuthorizationHeader(true);
      const res = await axios.put(`${BASE_API_URL}/orders/${id}`,data, config)
      // setError(null);
      // setLoading(false);
      console.log("check---232323333333333",res.data);
      // SyncStorage.remove('locationAddress');
      return res.data;
    } catch (err) {
      handleError(err, setLoading, setError, theme)
    }
  }

  const payOrder = async (order,delivery) => {
    console.log("hereeeeeeeeeeeeeeeeeeeeee",delivery,order);
    try {
      setLoading(true);
      const config = await getTokenAndCreateAuthorizationHeader();
     
      const res= await axios.post(`${BASE_API_URL}/orders/pay/${order}`, null, config)
      setError(null);
      setLoading(false);
      console.log("orderdataaaaaa=-=-=-=-=-=-[][-=[]==-[]=[]]=//////////djdjjdjdjdjdjdjjdjd8888*******************",res.data.data.order);
      return res.data.data.order;
    } catch (err) {
      handleError(err, setLoading, setError, theme)
    }
  }

  

 const getUser = async () => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync("token");
      console.log("asdasds");

      const res = await axios.get(`${BASE_API_URL}/users/getMe`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      handleSuccess(res, setLoading, theme)
      setLoading(false);
      console.log("dddds",res.data.data.user.favorites.facilities.length);
      console.log("user response",res.data.data);
      return res.data.data;
    } catch (e) {
      handleError(e, setLoading, setError, theme)
    }
  };

  const onGetOrders = async () => {
    try  {
      setLoading(true);
      const config = await getTokenAndCreateAuthorizationHeader();

      const res = await axios.get(`${BASE_API_URL}/users/user/orders`, config)
      setOrders(res.data.data.orders)
      dispatch(setOD(res.data.data.orders))
      const pendingOrders = res.data.data.orders.filter(order => order.status === 'PENDING');
      const completedOrders = res.data.data.orders.filter(order => order.status === 'COMPLETED');
      const cancelledOrders = res.data.data.orders.filter(order => order.status === 'CANCELLED');
      const currentOrder = res.data.data.orders.filter(order => order.status === 'IN_TRAFFIC')[0];
      const ongoingOrder = res.data.data.orders.filter(order => order.status === 'ONGOING')[0];

      setCompletedOrders(completedOrders);
      setCancelledOrders(cancelledOrders);

      setOngoingOrder(currentOrder || ongoingOrder);
      // console.log("LOG THIS THING PART 2",currentOrder);

      setPendingOrders(pendingOrders)

      setError(null);
      setLoading(false);
      // handleSuccess(res, setIsLoading, theme);
    } catch (err) {
      handleError(err, setLoading, setError, theme)
    }
  }
  const onRefresh = useCallback(() => {
    const refresh = async () => {
      setRefreshing(true);
      await onGetOrders();    
      setRefreshing(false)
    }
    refresh();
  })
  const onRefreshMessages = useCallback(() => {
    const refreshMessages = async () => {
      setRefreshingMessages(true);
      await fetchMessages();
      setRefreshingMessages(false)
    }
    refreshMessages();
  })
const setPaymentData=(data)=>{
setPaydata(data)
}
  const search = async ({ loadingAction, stopLoadingAction, config, setMatchingFacilities, setMatchingSpecialists } ) => {
    try {
      loadingAction()
      const [lng, lat] = config.searchLocation
      console.log(lat,"1check",lng);
      const searchURL = `${BASE_API_URL}/services/services-within/${(config.searchRadius || 3)}/center/${lat},${lng}/unit/km/${config.targetGender || 'all'}/${config.proGender || 'all'}/${config.currentService?.name.toLowerCase() || 'all'}/${config.serviceType?.name.toLowerCase() || 'all'}/${config.priceRange ? config.priceRange[0] : '0'}/${config.priceRange ? config.priceRange[1] : '1000'}/all`
    //  const searchURL=`${BASE_API_URL}/services/services-within/20/center/45.504769529788376,-73.77249799668789/unit/km/all/all/all/all/8/150`
      // console.log("insideapicallingggggggggggggggggg");
      const configHeader = await getTokenAndCreateAuthorizationHeader();
      const res = await axios.get(
        searchURL,configHeader
      );
      // console.log("resssposnsessss s wjwnjhuhsjjsjbshjbsjj",res.data.data.specialists);
      const tempData = res.data.data.facilities
      console.log("fining facilities-=-=-=0009988765567890989",res.data.data.facilities);

      if(config.targetGender=='male' || config.targetGender=='female'){
        const filteredData = tempData.filter((item)=>item?.user?.gender == config.targetGender)
        setMatchingFacilities(filteredData)
      }
      else{
      setMatchingFacilities(res.data.data.facilities);
      }
      // console.log("ssssssssssssssss",config.targetGender,config.proGender);
      if (res.data.data.facilities.length > 0) {
        // console.log("resssposnsessss s wjwnjhuhsjjsjbshjbsjj",res);
        setMatchingSpecialists(res.data.data.facilities[0].specialists);
        // console.log("genderrrrrrrrrrrrrrrrr",setMatchingFacilities);

      }
      await onGetOrders();
      stopLoadingAction();
    } catch(err) {
      console.log(err)
      stopLoadingAction();
    }
  }


  
  const searchSpecialist = async ({ loadingAction, stopLoadingAction, config, setMatchingFacilities, setMatchSpecialists } ) => {
    try {
      loadingAction()
      console.log("config.searchLocation",config.searchLocation);
      const [lng, lat] = config.searchLocation
      console.log(lat,"2check",lng);
      const searchURL = `${BASE_API_URL}/services/services-within/${(config.searchRadius || 3)}/center/${lat},${lng}/unit/km/${config.targetGender || 'all'}/${config.proGender || 'all'}/${config.currentService?.name.toLowerCase() || 'all'}/${config.serviceType?.name.toLowerCase() || 'all'}/${config.priceRange ? config.priceRange[0] : '0'}/${config.priceRange ? config.priceRange[1] : '1000'}`
    //  const searchURL=`${BASE_API_URL}/services/services-within/20/center/45.504769529788376,-73.77249799668789/unit/km/${config.targetGender || 'all'}/${config.proGender || 'all'}/${config.currentService?.name.toLowerCase() || 'all'}/${config.serviceType?.name.toLowerCase() || 'all'}/${config.priceRange ? config.priceRange[0] : '0'}/${config.priceRange ? config.priceRange[1] : '1000'}`
      const configHeader = await getTokenAndCreateAuthorizationHeader();
      const res = await axios.get(
        searchURL,configHeader
      );
      // console.log("responseneapiiiiiiiii",res.data.data.specialists);
  // const searchSpecialist = async ({ loadingAction, stopLoadingAction, config, setMatchingFacilities, setMatchingSpecialists } ) => {
    setMatchSpecialists (res.data.data.specialists);
    console.log("res.data.data.specialists",res.data.data.specialists);
      // setMatchingFacilities(res.data.data.facilities);
      // console.log("ssssssssssssssss",config.targetGender,config.proGender);
      // if (res.data.data.facilities.length > 0) {
      //   setMatchingSpecialists(res.data.data.facilities[0].specialists);
      //   // console.log("genderrrrrrrrrrrrrrrrr",setMatchingFacilities);
      // }
      await onGetOrders();
      stopLoadingAction();
    } catch(err) {
      console.log(err)
      stopLoadingAction();
    }
  } 

  


  return (
    <AppContext.Provider
      value={{
        error,
        orders,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        ongoingOrder,
        loadFilters,
        loading,
        refreshing,
        refreshingMessages,
        currentApp,
        setLoading,
        onRefresh,
        onRefreshMessages,
        chatRooms,
        refreshSearch,
        setRefreshSearch,
        search,
        searchSpecialist,
        fetchMessages,
        changeApp: val => setCurrentApp(val),
        fetchPaymentSheetParams,
        fetchLiveLocation,
        getUser,
        payOrder,
        onGetOrders,
        getUnreadMessage,
        UnreadMessage,
        loadinstruction,
        bankDetails,
        paydata,
        setPaydata,
        setPaymentData,
      }}
    >



      <FlashMessage ref={flashRef} />
      {children}


    </AppContext.Provider>
  );
};
