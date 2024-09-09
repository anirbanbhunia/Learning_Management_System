import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "../Redux/Slices/Authslice"
import courseSliceReduser from "./Slices/CourseSlice";

const store = configureStore({
    reducer: {
        auth: authSliceReducer,
        course: courseSliceReduser
    },
    devTools: true
})

export default store