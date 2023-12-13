import { SpecialistsActionTypes } from "./specialists.types";

export const setMatchingSpecialists = (specialists) => ({
  type: SpecialistsActionTypes.SET_MATCHING_SPECIALISTS,
  payload: specialists,
});
export const setMatchSpecialists = (specialists) => ({
  type: SpecialistsActionTypes.SET_MATCHING_SPECIALISTS,
  payload: specialists,
});
