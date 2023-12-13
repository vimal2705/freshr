import { combineReducers } from "redux";
import { bookingReducer } from "./booking/booking.reducer";
import { specialistsReducer } from "./specialists/specialists.reducer";
import { facilitiesReducer } from "./facilities/facilities.reducer";
import { servicesReducer } from "./services/services.reducer";
import { categoriesReducer } from "./categories/categories.reducer";
import authReducer from "./auth/auth.reducer";
import { facilityCreationReducer } from "./facilityCreation/facilityCreation.reducer";
import { chatReducer } from "./chat/chat_reducers";
import {LocationReducer}from "./location/LocationReducer"
// console.log("Locationnnnnnnnnnnnnnnnnreducerrrrrrrrrrrrrrrrrrrrrrrrrrrr",LocationReducer);
export default combineReducers({
  booking: bookingReducer,
  specialists: specialistsReducer,
  services: servicesReducer,
  facilities: facilitiesReducer,
  categories: categoriesReducer,
  facilityCreation: facilityCreationReducer,
  auth: authReducer,
  chat: chatReducer,
  locationn:LocationReducer,
  
});