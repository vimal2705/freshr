import {useTheme} from 'styled-components/native'
import { createContext, useRef, useState } from "react";
import { getTokenAndCreateAuthorizationHeader, handleError, handleSuccess } from "./utils";
import axios from "axios";
import { BASE_API_URL } from "../constants";
import FlashMessage from "react-native-flash-message";
import * as SecureStore from "expo-secure-store";

export const ReviewContext = createContext(null);

export const ReviewProvider = ({children}) => {
const flashRef = useRef();
const theme = useTheme();
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);
const [reviews, setReviews] = useState([]);
const [ratings, setRatings] = useState(0);

const onGetReviews = async(id,type) => {
    try {
      setIsLoading(true);
      console.log(id,type);
      const config = await getTokenAndCreateAuthorizationHeader()
      console.log(config);
      const res = await axios.get(
        `${BASE_API_URL}/review/${type}/${id}`,
        config,
      );
      setError(null);
      console.log('REVIEWS :',res.data.data);
      setReviews(res.data.data.reviews)
      setRatings(res.data.data?.ratings)
      handleSuccess(res, setIsLoading, theme);
      setIsLoading(false);
    } catch (e) {
      console.log("reviews error",e);
      handleError(e, setIsLoading, setError, theme)
    }
  }
    const updateReviews = async (data) => {
      try {
        setIsLoading(true);   
        const token = await SecureStore.getItemAsync("token");
        const config = {headers: {
          Authorization: `Bearer ${token}`,
        }}
        console.log(config,'==>',data);
       const res= await axios.post(
          `${BASE_API_URL}/review`,
          data,
          config
        );
        setError(null);
        // setReviews(res.data.data);
        handleSuccess(res, setIsLoading, theme);
      } catch (e) {
        console.log(e.request);
        handleError(e, setIsLoading, setError, theme)
      }
    }

    const onGetRatings = async(id,type) => {
      try {
        setIsLoading(true);
        console.log(id,type);
        const config = await getTokenAndCreateAuthorizationHeader()
        console.log(config);
        const res = await axios.get(
          `${BASE_API_URL}/review/${type}/${id}`,
          config,
        );
        setError(null);
        handleSuccess(res, setIsLoading, theme);
        setIsLoading(false);
        return res.data.data?.ratings
      } catch (e) {
        console.log("SShhhhS",e);
        handleError(e, setIsLoading, setError, theme)
      }
    }

    return (
        <ReviewContext.Provider
          value={{
            isLoading,
            error,
            reviews,
            ratings,
            onGetRatings,
            onGetReviews,
            updateReviews,
          }}>
          <FlashMessage ref={flashRef} />
          {children}
        </ReviewContext.Provider>)
    }