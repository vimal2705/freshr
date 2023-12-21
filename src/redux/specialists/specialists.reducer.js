import { SpecialistsActionTypes } from "./specialists.types";

const INITIAL_STATE = {
  specialists: [],
  delspecialist: []
};

export const specialistsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SpecialistsActionTypes.SET_MATCHING_SPECIALISTS:
      return { ...state, specialists: action.payload };
    case SpecialistsActionTypes.SET_MATCHING_SPECIALISTS_DEL:
      return { ...state, delspecialist: action.payload };
    default:
      return state;
  }
};
