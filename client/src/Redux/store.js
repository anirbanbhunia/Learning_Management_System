import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "../Redux/Slices/Authslice"

const store = configureStore({
    reducer: {
        auth: authSliceReducer
    },
    devTools: true
})

export default store