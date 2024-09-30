import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "../Redux/Slices/Authslice"
import courseSliceReduser from "./Slices/CourseSlice";
import razorpayReduser from "./Slices/RazorpaySlice";
import LectureReducer from "./Slices/LecturesSlice";
import StatSlice from "./Slices/StatSlice";

const store = configureStore({
    reducer: {
        auth: authSliceReducer,
        course: courseSliceReduser,
        razorpay: razorpayReduser,
        lecture: LectureReducer,
        stat: StatSlice
    },
    devTools: true
})

export default store