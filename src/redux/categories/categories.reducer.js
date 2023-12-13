import { CategoriesActionTypes } from "./categories.types";

const INITIAL_STATE = {
  categories: [],
};

export const categoriesReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CategoriesActionTypes.SET_CATEGORIES:
      return { ...state, categories: action.payload };
    default:
      return state;
  }
};
