import { FacilityCreationActionTypes } from "./facilityCreation.types";

export const facilityCreationSetAddress = (address) => {
  return {
    payload: address,
    type: FacilityCreationActionTypes.SET_FACILITY_LOCATION
  }
}

export const facilityCreationSetName = (name) => {
  return {
    payload: name,
    type: FacilityCreationActionTypes.SET_FACILITY_NAME
  }
}

export const facilityCreationSetDescription = (description) => {
  return {
    payload: description,
    type: FacilityCreationActionTypes.SET_FACILITY_DESCRIPTION
  }
}

export const facilityCreationSetWorkingHours = (workingHours) => {
  return {
    payload: workingHours,
    type: FacilityCreationActionTypes.SET_FACILITY_WORKING_HOURS
  }
}

export const facilityCreationSetSeatCapacity = (seatCapacity) => {
  return {
    payload: seatCapacity,
    type: FacilityCreationActionTypes.SET_FACILITY_SEAT_CAPACITY
  }
}
export const facilityCreationSetGallery = (gallery) => {
  return {
    payload: gallery,
    type: FacilityCreationActionTypes.SET_FACILITY_GALLERY
  }
}
