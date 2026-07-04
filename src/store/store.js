import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./profile/profile.slice";
import filterSlice from "./filter/filter.slice";
import timeReducer from "./time/time.slice";

export const makeStore = () => {
    return configureStore({
        reducer: {
            profile: profileReducer,
            filter: filterSlice,
            time: timeReducer,
        },
    })
}
