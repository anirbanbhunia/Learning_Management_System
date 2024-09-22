import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "../Redux/Slices/Authslice"
import courseSliceReduser from "./Slices/CourseSlice";
import razorpayReduser from "./Slices/RazorpaySlice";

const store = configureStore({
    reducer: {
        auth: authSliceReducer,
        course: courseSliceReduser,
        razorpay: razorpayReduser
    },
    devTools: true
})

export default store