import {useTheme} from 'styled-components/native'
import { createContext, useRef, useState, useCallback, useEffect,useContext } from "react";
import * as Location from "expo-location";

import { getError, getTokenAndCreateAuthorizationHeader, getTokenAndCreateAuthorizationHeader1, handleError, handleSuccess, sendMessage } from "./utils";
import axios from "axios";
import { BASE_API_URL } from "../constants";
import FlashMessage from "react-native-flash-message";
import moment from "moment/moment";
import {AuthContext} from './auth/auth.context'

export const SpecialistContext = createContext();
export const SpecialistProvider = ({children}) => {
  const flashRef = useRef();
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [specialist, setSpecialist] = useState(null);
  const [specialistidd, setSpecialistidd] = useState(null);
  const [specialistServices, setSpecialistServices] = useState(null);
  const [specialistStories, setSpecialistStories] = useState([]);
  const [orders, setOrders] = useState([])
  const [queue, setQueue] = useState([]);
  const [history, setHistory] = useState([]);
  const [ongoingOrder, setOngoingOrder] = useState(null)
  const [refreshing, setRefreshing] = useState(false);
  const [totalProfit, setTotalProfit] = useState(0);
  const [todayProfit, setTodayProfit] = useState(0);
  const [profitPerDay, setProfitPerDay] = useState([])

  const [dayOfYear, setDayOfYear] = useState(0);

  const getDayOfYear = date => Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24)
  useEffect(() => {
    setDayOfYear(getDayOfYear(new Date()))
  }, [])

  const onGetHostFacilities = async () => {
    try  {
      setIsLoading(true);
      const config = await getTokenAndCreateAuthorizationHeader();
      const res = await axios.get(`${BASE_API_URL}/hosts/host/facilities`, config)
      console.log("res.data.data.facilities",res.data.data.facilities);
      setHostFacilities(res.data.data.facilities)
  
      setError(null);
      console.log("1");
      handleSuccess(res, setIsLoading, theme);
    } catch (err) {
      console.log("2");
      handleError(err, setIsLoading, setError, theme)
    }
  }
  const buildGraphData = (stats) => {
    const graphData = [];
    let days = 90;
    let currentDate = moment()
    while (days > 0) {
      let value = (stats.filter(el => el._id?.day === currentDate?.dayOfYear() && el._id?.year === currentDate?.year())[0]?.total || 0) / 100
      graphData.push({date: `${currentDate.format("YYYY-MM-DD")}T05:00:00.000Z`, value: value})
      currentDate = currentDate.subtract(1, 'd')
      days -= 1;
    }
    return graphData;
  }


  const onCreateService = async (data) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Sss===----");
      const config = await getTokenAndCreateAuthorizationHeader()
      const res = await axios.post(
        `${BASE_API_URL}/specialists/specialist/services`,
        data,
        {
          ...config,
          transformRequest: (data, headers) => {
            return data;
          }},
      );
      setError(null);
      setIsLoading(false);
      handleSuccess(res, setIsLoading, theme)
      await onGetServices();
      return res.data.data.service;
    } catch (e) {
      setIsLoading(false);
      setError(e);
      console.log(e);
      handleError(e, setIsLoading, setError, theme);
      throw e;
    }
  }

  const onGetServices = async () => {
    try  {
      console.log("Sss===----1");
      setIsLoading(true);
      const config = await getTokenAndCreateAuthorizationHeader();
      console.log("sdsd",config);
      const res = await axios.get(`${BASE_API_URL}/specialists/specialist/services`, config)
      setSpecialistServices(res.data.data.services)
      setError(null);
      handleSuccess(res, setIsLoading, theme);
      setIsLoading(false);
    } catch (err) {
      handleError(err, setIsLoading, setError, theme)
    }
  }

  const onGetServiceStats = async (id, setResult) => {
    try {
      setIsLoading(true);
      const config = await getTokenAndCreateAuthorizationHeader();
      const res = await axios.get(`${BASE_API_URL}/specialists/specialist/services/stats/${id}`, config)
      setResult(res.data.data.orders.length || 0)
      setIsLoading(false);
    } catch (err) {
      handleError(err, setIsLoading, setError, theme);
    }
  }

  const onGetOrders = async () => {
    try  {
      setIsLoading(true);
      const config = await getTokenAndCreateAuthorizationHeader();
      const res = await axios.get(`${BASE_API_URL}/specialists/specialist/orders`, config)
      console.log(res.data.data)
      if (res.data.data.queue) {
        setQueue(res.data.data.queue)
      }
      
      setError(null);
      setIsLoading(false);
      // handleSuccess(res, setIsLoading, theme);
    } catch (err) {
      handleError(err, setIsLoading, setError, theme)
    }
  }

  const onGetHistory = async () => {
    try  {
      setIsLoading(true);
      const config = await getTokenAndCreateAuthorizationHeader();
      const res = await axios.get(`${BASE_API_URL}/specialists/specialist/history`, config)
      setHistory(res.data.data.orders)
      setError(null);
      setIsLoading(false);
      // handleSuccess(res, setIsLoading, theme);
    } catch (err) {
      handleError(err, setIsLoading, setError, theme)
    }
  }

  const acceptOrder = async (order) => {
    try  {
      setIsLoading(true);

      // let { status } = await Location.requestForegroundPermissionsAsync();
      // if (status !== 'granted') {
      //   setIsLoading(false);
      //   setError(new Error('Please allow geolocation'));
      //   sendMessage(
      //     "Failure",
      //     'Please allow geolocation',
      //     "warning",
      //     2500,
      //     theme.colors.ui.warning
      //   );
      //   return; // Exit the function if geolocation permission is not granted
      // }
  
      // // Attempt to get the current location
      // let location;
  
      // try {
      //   // Attempt to get the current location
      //   location = await Location.getCurrentPositionAsync({});
      // } catch (error) {
      //   // Handle the error (e.g., if location retrieval fails)
      //   console.error("Error getting current location:", error.message);
  
      //   // Fallback to specialist coordinates if available
      //   if (specialist && specialist.coordinates) {
      //     location = { coords: { latitude: specialist.coordinates[1], longitude: specialist.coordinates[0] } };
      //   } else {
      //     throw new Error("Unable to get current location, and specialist coordinates are not available.");
      //   }
      // }
  
      const config = await getTokenAndCreateAuthorizationHeader();
      const res = await axios.get(`${BASE_API_URL}/specialists/specialist/acceptOrder/${order}`, config)
      setOngoingOrder(res.data.data.order);
      setSpecialist(res.data.data.specialist);
      setOrders((old) => {
        const newOrders = [...old];
        const index = newOrders.findIndex(s => s.id === order);
        newOrders[index] = { ...res.data.data.order };
        return newOrders;
      });
      if (res.data.data.queue) {
        setQueue(res.data.data.queue)
      }

      //insert code here 

      // const formData = new FormData();
      // formData.append('location[type]', 'Point');
      // formData.append('location[coordinates][]', location.coords.longitude);
      // formData.append('location[coordinates][]', location.coords.latitude);
  
      // console.log("formmmmm========>", formData);
  
      // // Update specialist info with FormData
      // await updateSpecialistInfo({ formData });
  
      setError(null);
      handleSuccess(res, setIsLoading, theme);
    } catch (err) {
      handleError(err, setIsLoading, setError, theme)
    }
  }

  const rejectOrder = async (order) => {
    console.log("hereeeeeeeee",order);
    try  {
      setIsLoading(true);
      const config = await getTokenAndCreateAuthorizationHeader();
      const res = await axios.get(`${BASE_API_URL}/specialists/specialist/cancelOrder/${order}`, config)
      console.log("responseeeeeeeeorderrrrrrrrrrrrr",res.data.data);
      setOngoingOrder(null);
      setSpecialist(res.data.data.specialist);
      setQueue(res.data.data.queue)
      setError(null);
      handleSuccess(res, setIsLoading, theme);
    } catch (err) {
      handleError(err, setIsLoading, setError, theme)
    }
  }

  const startOrder = async (order, startCode) => {
    try  {
      setIsLoading(true);
      const config = await getTokenAndCreateAuthorizationHeader();
      const res = await axios.get(`${BASE_API_URL}/specialists/specialist/startOrder/${order}/${startCode}`, config)
      setOngoingOrder(res.data.data.order);
      setOrders((old) => {
        const newOrders = [...old];
        const index = newOrders.findIndex(s => s.id === order);
        newOrders[index] = { ...res.data.data.order };
        return newOrders;
      });
      if (res.data.data.queue) {
        setQueue(res.data.data.queue)
      }
      setError(null);
      handleSuccess(res, setIsLoading, theme);
    } catch (err) {
      handleError(err, setIsLoading, setError, theme)
    }
  }

  const completeOrder = async (order, endCode) => {
    try  {
      setIsLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setIsLoading(false);
        setError(new Error('Please allow geolocation'));
        sendMessage(
          "Failure",
          'Please allow geolocation',
          "warning",
          2500,
          theme.colors.ui.warning
        );
        return; // Exit the function if geolocation permission is not granted
      }
  
      // Attempt to get the current location
      let location;
  
      try {
        // Attempt to get the current location
        location = await Location.getCurrentPositionAsync({});
      } catch (error) {
        // Handle the error (e.g., if location retrieval fails)
        console.error("Error getting current location:", error.message);
  
        // Fallback to specialist coordinates if available
        if (specialist && specialist.coordinates) {
          location = { coords: { latitude: specialist.coordinates[1], longitude: specialist.coordinates[0] } };
        } else {
          throw new Error("Unable to get current location, and specialist coordinates are not available.");
        }
      }
  
      const config = await getTokenAndCreateAuthorizationHeader();
      const res = await axios.get(`${BASE_API_URL}/specialists/specialist/completeOrder/${order}/${endCode}`, config)
      setOngoingOrder(null);
      const formData = new FormData();
      formData.append('location[type]', 'Point');
      formData.append('location[coordinates][]', location.coords.longitude);
      formData.append('location[coordinates][]', location.coords.latitude);
  
      console.log("formmmmm========>", formData);
  
      // Update specialist info with FormData
      await updateSpecialistInfo({ formData });
  
      await onGetOrders();
      setError(null);
      handleSuccess(res, setIsLoading, theme);
    } catch (err) {
      handleError(err, setIsLoading, setError, theme)
    }
  }
const{user,setUser}=useContext(AuthContext);
  const onGetSpecialist = async() => {
    try {
      setIsLoading(true);
      const config = await getTokenAndCreateAuthorizationHeader()
      const res = await axios.get(
        `${BASE_API_URL}/specialists/specialist`,
        config,
      );
      console.log("SSSssddddasaa=======-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-",res.data.data.specialist);
        setUser(res.data.data.specialist.user);
      setError(null);
      setSpecialist(res.data.data.specialist);
      setTotalProfit((res.data.data.profitPerOrderStatus.filter(el => el._id === "COMPLETED")[0].total || 0) / 100)
      setTodayProfit((res.data.data.profitPerDay.filter(el => el.status === "COMPLETED" && el._id.day === dayOfYear && el._id.year === (new Date()).getFullYear())[0].total || 0) / 100)
      setProfitPerDay(buildGraphData(res.data.data.profitPerDay))
      // handleSuccess(res, setIsLoading, theme);
      setIsLoading(false);
    } catch (e) {
      console.log("SShhhhS",e);
      handleError(e, setIsLoading, setError, theme)
    }
  }

  const onGetSpecialistidd = async(id) => {
    try {
      // setIsLoading(true);
      const config = await getTokenAndCreateAuthorizationHeader()
      const res = await axios.get(
        `${BASE_API_URL}/specialists/specialist/${id}`,
        config,
      );
      console.log(id,"SSSssddddasaa",res.data.data.specialist);

      setError(null);
      setSpecialistidd(res.data.data.specialist);
      console.log("specialisttttttttttttttttttttttttttttt byyyyyyyyy idddddddddddddddddddddddddddd-=-=-=-=-=--=-=-=-=-==-=-=-=--==-=--==--=-=-=--===-=-=-",res.data.data.specialist);
      // setTotalProfit((res.data.data.profitPerOrderStatus.filter(el => el._id === "COMPLETED")[0].total || 0) / 100)
      // setTodayProfit((res.data.data.profitPerDay.filter(el => el.status === "COMPLETED" && el._id.day === dayOfYear && el._id.year === (new Date()).getFullYear())[0].total || 0) / 100)
      // setProfitPerDay(buildGraphData(res.data.data.profitPerDay))
      // // handleSuccess(res, setIsLoading, theme);
      // setIsLoading(false);
    } catch (e) {
      console.log("SShhhhS",e);
      handleError(e, setIsLoading, setError, theme)
    }
  }

  const updateSpecialistInfo = async (data,param) => {
    const config = await getTokenAndCreateAuthorizationHeader()
      console.log("-----------> data2------------->", data.formData);
    
    try {
      if(param){
        const res = await axios.patch(
          `${BASE_API_URL}/specialists/specialist`,
           data,
           {
            ...config,
            transformRequest: (data, headers) => {
              return data;
            }},
          )
          console.log("response form paymengtttyuh======",res.data.data);
      }
      else{
        // setIsLoading(true);
        console.log("data of update", data);
        const config = await getTokenAndCreateAuthorizationHeader()
        const res = await axios.patch(
        `${BASE_API_URL}/specialists/specialist`,
         data.formData ? data.formData : data,
          {
            ...config,
            transformRequest: (data, headers) => {
              return data;
            }},
        )
        console.log("dataofpaymenttttt----------------------",res.data.data);
        setError(null);
        setSpecialist(res.data.data.specialist);
        handleSuccess(res, setIsLoading, theme);
      }
     
    } catch (e) {
      console.log("errorrr in paymentttttt-=-=====");
      console.log(e);
      handleError(e, setIsLoading, setError, theme)
    }
  }



  const goOnline = async () => {
    console.log("hereeeeeeeeeeeeeeeeeeeeee", specialist);
  
    try {
      setIsLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log("status::", status);
  
      if (status !== 'granted') {
        setIsLoading(false);
        setError(new Error('Please allow geolocation'));
        sendMessage(
          "Failure",
          'Please allow geolocation',
          "warning",
          2500,
          theme.colors.ui.warning
        );
        return; // Exit the function if geolocation permission is not granted
      }
  
      console.log("outttt");
      let location;
  
      try {
        // Attempt to get the current location
        location = await Location.getCurrentPositionAsync();
      } catch (error) {
        // Handle the error (e.g., if location retrieval fails)
        console.error("Error getting current location:", error.message);
  
        // Fallback to specialist coordinates if available
        if (specialist && specialist.coordinates) {
          location = { coords: { latitude: specialist.coordinates[1], longitude: specialist.coordinates[0] } };
        } else {
          throw new Error("Unable to get current location, and specialist coordinates are not available.");
        }
      }
  
      console.log("locccc", location);
  
      const config = await getTokenAndCreateAuthorizationHeader1();
      console.log("config", config);
  
      const res = await axios.post(
        `${BASE_API_URL}/specialists/specialist/goOnline`,
        {
          location: {
            type: "Point",
            coordinates: [location.coords.longitude, location.coords.latitude]
          }
        },
        config
      );
  
      console.log("ressss");
      setError(null);
      handleSuccess(res, setIsLoading, theme);
      setSpecialist(res.data.data.specialist);
      setIsLoading(false);
    } catch (e) {
      handleError(e, setIsLoading, setError, theme);
    }
  };
  
  const goOffline = async () => {
    try {
      setIsLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setIsLoading(false);
        setError(new Error('Please allow geolocation'));
        sendMessage(
          "Failure",
          'Please allow geolocation',
          "warning",
          2500,
          theme.colors.ui.warning
        );
        return; // Exit the function if geolocation permission is not granted
      }
  
      // Attempt to get the current location
      let location;
  
      try {
        // Attempt to get the current location
        location = await Location.getCurrentPositionAsync({});
      } catch (error) {
        // Handle the error (e.g., if location retrieval fails)
        console.error("Error getting current location:", error.message);
  
        // Fallback to specialist coordinates if available
        if (specialist && specialist.coordinates) {
          location = { coords: { latitude: specialist.coordinates[1], longitude: specialist.coordinates[0] } };
        } else {
          throw new Error("Unable to get current location, and specialist coordinates are not available.");
        }
      }
  
      const config = await getTokenAndCreateAuthorizationHeader1();
  
      const res = await axios.post(
        `${BASE_API_URL}/specialists/specialist/goOffline`,
        {
          location: {
            type: "Point",
            coordinates: [location.coords.longitude, location.coords.latitude]
          }
        },
        config
      );
  
      setError(null);
      handleSuccess(res, setIsLoading, theme);
      setSpecialist(res.data.data.specialist);
  
      // Create FormData
      const formData = new FormData();
      formData.append('location[type]', 'Point');
      formData.append('location[coordinates][]', location.coords.longitude);
      formData.append('location[coordinates][]', location.coords.latitude);
  
      console.log("formmmmm========>", formData);
  
      // Update specialist info with FormData
      await updateSpecialistInfo({ formData });
  
      setIsLoading(false);
    } catch (e) {
      handleError(e, setIsLoading, setError, theme);
    }
  };
  
//   const goOffline = async () => {
//     try {
//       setIsLoading(true);
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         setIsLoading(false);
//         setError(new Error('Please allow geolocation'));
//         sendMessage(
//           "Failure",
//           'Please allow geolocation',
//           "warning",
//           2500,
//           theme.colors.ui.warning
//         );
//       }
//       // let location = await Location.getCurrentPositionAsync({});
//       let location = {coords : {
//         longitude:72.679483 ,
//         latitude: 23.053738
//       }}
//       const config = await getTokenAndCreateAuthorizationHeader()
//       const res = await axios.post(
//         `${BASE_API_URL}/specialists/specialist/goOffline`,
//         {
//           location: {
//             type: "Point",
//             coordinates: [location.coords.longitude, location.coords.latitude]
//           }
//         },
//         config
//       );
//       setError(null);
//       handleSuccess(res, setIsLoading, theme);
//       setSpecialist(res.data.data.specialist); 
//       const formData = new FormData()
//       const loca = {location : {
//         type: "Point",
//         coordinates: [location.coords.longitude, location.coords.latitude]
//       } }

// formData.append('location[type]', 'Point');
// formData.append('location[coordinates][]', location.coords.longitude);
// formData.append('location[coordinates][]', location.coords.latitude);

//       // formData.append(loca.location)
//       // formData.append(loca.location.coordinates)

//       // formData.append(loca.coordinates) 
//       console.log("formmmmm========>", formData);
//       await updateSpecialistInfo( {
//         formData
//       })
//       setIsLoading(false)
//     } catch (e) {
//       handleError(e, setIsLoading, setError, theme)
//     }
//   }

  const startQueue = async () => {
    try {
      setIsLoading(true);
      const config = await getTokenAndCreateAuthorizationHeader()
      const res = await axios.post(
        `${BASE_API_URL}/specialists/specialist/startQueue`,
        null,
        config
      );
      setError(null);
      handleSuccess(res, setIsLoading, theme);
      setSpecialist(res.data.data.specialist);
    } catch (e) {
      handleError(e, setIsLoading, setError, theme)
    }
  }

  const stopQueue = async () => {
    try {
      setIsLoading(true);
      const config = await getTokenAndCreateAuthorizationHeader()
      const res = await axios.post(
        `${BASE_API_URL}/specialists/specialist/stopQueue`,
        null,
        config
      );
      setError(null);
      handleSuccess(res, setIsLoading, theme);
      setSpecialist(res.data.data.specialist);
    } catch (e) {
      handleError(e, setIsLoading, setError, theme)
    }
  }


  const updateService = async (id, data) => {
    try {
      setIsLoading(true);
      const config = await getTokenAndCreateAuthorizationHeader()
      const res = await axios.patch(
        `${BASE_API_URL}/specialists/specialist/services/${id}`,
        data,
        {
          ...config,
          transformRequest: (data, headers) => {
            return data;
          }},
      );
      setError(null);
      handleSuccess(res, setIsLoading, theme);
      await onGetServices();
      return res.data.data.service;
    } catch (e) {
      handleError(e, setIsLoading, setError, theme)
    }
  }

  const deleteService = async (id) => {
    try {
      setIsLoading(true);
      const config = await getTokenAndCreateAuthorizationHeader()
      const res = await axios.delete(
        `${BASE_API_URL}/specialists/specialist/services/${id}`,
        config
      );
      setError(null);
      handleSuccess(res, setIsLoading, theme);
      await onGetServices();
    } catch (e) {
      handleError(e, setIsLoading, setError, theme)
    }
  }

  const deleteStory = async (id) => {
    try {
      setIsLoading(true);
      const config = await getTokenAndCreateAuthorizationHeader()
      const res = await axios.delete(
        `${BASE_API_URL}/specialists/specialist/stories/${id}`,
        config
      );
      setError(null);
      handleSuccess(res, setIsLoading, theme);
      await onGetStories();
    } catch (e) {
      handleError(e, setIsLoading, setError, theme)
    }
  }


  const onGetStories = async () => {
    try {
      setIsLoading(true);
      const config = await getTokenAndCreateAuthorizationHeader()
      const res = await axios.get(
        `${BASE_API_URL}/specialists/specialist/stories`, config
      );
      setError(null);
      await onGetServices();
      setSpecialistStories(res.data.data.stories);
      console.log("storiesssssss-s-s-s-s-s-s-s-s-s-s-s-s-s-s-s-s-s-s-s-s-s-s-s-s-s-s-ss-s-s-s-s-s-s-s",res.data.data.stories);
      console.log(res.data.data.stories)
      setIsLoading(false);
      // handleSuccess(res, setIsLoading, theme);
    } catch (e) {
      handleError(e, setIsLoading, setError, theme)
    }
  }
  const postStory = async (data) => {
    try {
      setIsLoading(true);
      const config = await getTokenAndCreateAuthorizationHeader()
      const res = await axios.post(
        `${BASE_API_URL}/specialists/specialist/stories`,
        data,
        {
          ...config,
          transformRequest: (data, headers) => {
            return data;
          }},
      );
      setError(null);
      handleSuccess(res, setIsLoading, theme);
      await onGetStories();
    } catch (e) {
      handleError(e, setIsLoading, setError, theme)
    }
  }

  const loadSpecialistData = async () => {
    try {
      await onGetSpecialist();
      await onGetServices();
      await onGetStories();
      await onGetOrders();
      await onGetHistory();
      sendMessage(
        "Updated",
        "specialist information loaded",
        "success",
        1000,
        theme.colors.brand.primary
      );
    } catch (e) {
      console.log(e);
    }
  }

  const onRefresh = useCallback(() => {
    const refresh = async () => {
      setRefreshing(true);
      await loadSpecialistData();
      setRefreshing(false)
    }
    refresh();
  })

  return (
      <SpecialistContext.Provider
        value={{
          isLoading,
          ongoingOrder,
          error,
          specialist,
          specialistServices,
          specialistStories,
          orders,
          queue,
          history,
          refreshing,
          onRefresh,
          totalProfit,
          todayProfit,
          deleteStory,
          onGetServiceStats,
          postStory,
          loadSpecialistData,
          onCreateService,
          goOnline,
          goOffline,
          onGetServices,
          onGetStories,
          onGetOrders,
          updateService,
          deleteService,
          onGetHistory,
          acceptOrder,
          completeOrder,
          startOrder,
          rejectOrder,
          updateSpecialistInfo,
          startQueue,
          stopQueue,
          onGetSpecialistidd,
          specialistidd,
          setSpecialistidd
      }}>
        <FlashMessage ref={flashRef} />
        {children}
    </SpecialistContext.Provider>)
}
