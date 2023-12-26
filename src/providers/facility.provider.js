import {useTheme} from 'styled-components/native'
import { createContext, useRef, useState } from "react";
import { getTokenAndCreateAuthorizationHeader, handleError, handleSuccess } from "./utils";
import axios from "axios";
import { BASE_API_URL } from "../constants";
import FlashMessage from "react-native-flash-message";
import * as SecureStore from "expo-secure-store";
export const HostContext = createContext();
export const HostProvider = ({children}) => {
  const flashRef = useRef();
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [host, setHost] = useState(null);
  const [history, setHistory] = useState([]);
  const [hostFacilities, setHostFacilities] = useState(null);
  const [facility, setFacility] = useState(null);
  const [singleFacilityy, setSingleFacilityy] = useState(null);


  const onGetFacilityDetails = async(id) => {
    console.log("getting");
    try {
      setIsLoading(true);
      console.log('onGetFacilityDetails : ',id);
      const config = await getTokenAndCreateAuthorizationHeader();
      await axios.get(
        `${BASE_API_URL}/hosts/host/facilities/${id}`,
        config
      ).then(async (res)=>{
        console.log("Asdas",res);
        if(res.data == undefined)
        {
          console.log("UNDEFINED DATA ");
          await onGetFacilityDetails(id)
        }
        else{
          setError(null);
          console.log('FACILITY DETAILS-=-=-=-=-=-=-===-=------------------------>>>>>>>>>>>>>>>>',res?.data?.data?.facilities);
          setFacility(res?.data?.data?.facilities[0])
          handleSuccess(res, setIsLoading, theme);
          setIsLoading(false);
        }
       
      })
    } catch (e) {
      console.log("facility Details error",e);
      handleError(e, setIsLoading, setError, theme)
    }
  }
  const singlefacility = async(id) => {
    console.log("getting");
    try {
      // setIsLoading(true);
      console.log('onGetFacilityDetails : ',id);
      const config = await getTokenAndCreateAuthorizationHeader();
      await axios.get(
        // /services/facilitie/6385696fa7a9ef025625ab36
        `${BASE_API_URL}/services/facilitie/${id}`,
        config
      ).then(async (res)=>{
        console.log("singleFacilityDeatailssss----------------,,,,,,,,,,,<<<<<<<<<<<<<<<<,",res?.data?.data?.facilities);
        setSingleFacilityy(res?.data?.data?.facilities);
       
       
      })
    } catch (e) {
      console.log("facility Details error",e);
      
    }
  }
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

  const onGetHost = async() => {
    try {
      setIsLoading(true);
      const config = await getTokenAndCreateAuthorizationHeader()
      const res = await axios.get(
        `${BASE_API_URL}/hosts/getHost`,
        config,
      );
      setError(null);
      setHost(res.data.data.host);
      handleSuccess(res, setIsLoading, theme);
    } catch (e) {
      handleError(e, setIsLoading, setError, theme)
    }
  }

  const onGetHistoryFacility = async () => {
    try  {
      setIsLoading(true);
      const config = await getTokenAndCreateAuthorizationHeader();
      const res = await axios.get(`${BASE_API_URL}/hosts/host/history`, config)
      console.log(res.data.data.orders);
      setHistory(res.data.data.orders)
      setError(null);
      setIsLoading(false);
      // handleSuccess(res, setIsLoading, theme);
    } catch (err) {
      handleError(err, setIsLoading, setError, theme)
    }
  }

  const onGetFacilityBookingHistory = async (id) => {
    try  {
      setIsLoading(true);
      const config = await getTokenAndCreateAuthorizationHeader();
      const res = await axios.get(`${BASE_API_URL}/hosts/host/history/${id}`, config)
      setError(null);
      setIsLoading(false);
      console.log("sss=================",res.data.data.orders.length);
      return res.data.data.orders;
    } catch (err) {
      handleError(err, setIsLoading, setError, theme);
      return [];
    }
  }

  const onCreateFacility = async (data) => {
    try {
      setIsLoading(true);
    
      const config = await getTokenAndCreateAuthorizationHeader()
      console.log(config,"Sss",data);
      const res = await axios.post(
        `${BASE_API_URL}/hosts/host/facilities`,
        data,
        {
          ...config,
          transformRequest: (data, headers) => {
            return data;
          }},
      );
      setError(null);
      handleSuccess(res, setIsLoading, theme)
      await onGetHostFacilities();
      console.log("gfggg------------------------------------------------------------",res.config.data);
      return res.config.data._parts;
    } catch (e) {
      console.log("check",e);
      handleError(e, setIsLoading, setError, theme);
    }
  }

  const onUpdateFacility = async (id, data) => {
    try {
      setIsLoading(true);
      const config = await getTokenAndCreateAuthorizationHeader()
      const res = await axios.patch(
        `${BASE_API_URL}/hosts/host/facilities/${id}`,
        data,
        {
          ...config,
          transformRequest: (data, headers) => {
            return data;
          }},
      );
      setError(null);
      handleSuccess(res, setIsLoading, theme)
      await onGetHostFacilities();
      return res.data.data.facility;
    } catch (e) {
      console.log(e);
      handleError(e, setIsLoading, setError, theme);
    }
  }

  const loadHostData = async () => {
    try {
      await onGetHost();
      await onGetHostFacilities();
      await onGetHistoryFacility();
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <HostContext.Provider
      value={{
        isLoading,
        error,
        host,
        hostFacilities,
        history,
        facility,
        loadHostData,
        onCreateFacility,
        onUpdateFacility,
        onGetHistoryFacility,
        onGetFacilityBookingHistory,
        onGetFacilityDetails,
        singlefacility,
        singleFacilityy,
        setSingleFacilityy
      }}>
      <FlashMessage ref={flashRef} />
      {children}
    </HostContext.Provider>)
}
