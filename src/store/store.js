import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./profile/profile.slice";
import filterSlice from "./filter/filter.slice";
import timeReducer from "./time/time.slice";

// preloadedState — например, период из адреса страницы
export const makeStore = (preloadedState) => {
    return configureStore({
        reducer: {
            profile: profileReducer,
            filter: filterSlice,
            time: timeReducer,
        },
        preloadedState,
    })
}
