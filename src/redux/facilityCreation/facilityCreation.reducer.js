import { FacilityCreationActionTypes } from "./facilityCreation.types";

const INITIAL_STATE = {
  name: "",
  street: "",
  city: "",
  country: "",
  region: "",
  postcode: "",
  coords: null,
  aptSuite: "",
  closingTime: null,
  openingTime: null,
  isOperational: true,
  description: "",
  seatCapacity: 0,
  coverImage: null,
  gallery: []
}

export const facilityCreationReducer = (state=INITIAL_STATE, action) => {
  switch (action.type) {
    case FacilityCreationActionTypes.SET_FACILITY_NAME:
      return {...state, name: action.payload}
    case FacilityCreationActionTypes.SET_FACILITY_DESCRIPTION:
      return {...state, description: action.payload}
    case FacilityCreationActionTypes.SET_FACILITY_LOCATION:
      const {address: street, city, country, region, aptSuite, postcode, coords} = action.payload
      return {...state, street, city, country, region, aptSuite, postcode, coords};
    case FacilityCreationActionTypes.SET_FACILITY_WORKING_HOURS:
      const {openingTime, closingTime} = action.payload
      return {...state, openingTime, closingTime};
    case FacilityCreationActionTypes.SET_FACILITY_SEAT_CAPACITY:
      return {...state, seatCapacity: action.payload};
    case FacilityCreationActionTypes.SET_FACILITY_GALLERY:
      return {...state, gallery: action.payload.gallery, coverImage: action.payload.coverImage }
    default:
      return {...state }
  }
}
