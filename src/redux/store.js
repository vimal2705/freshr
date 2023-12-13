import { applyMiddleware, createStore } from "redux";
import { createLogger } from "redux-logger";
import rootReducer from "./root-reducer";

// Custom logger
const logger = createLogger({
  collapsed: (getState, action) => true,
  duration: true,
  timestamp: true,
  colors: {
    title: () => "#0f1842",
    prevState: () => "#de6f0d",
    action: () => "#6e13ab",
    nextState: () => "#1a9134",
  },
});


const store = createStore(rootReducer);

export default store;
