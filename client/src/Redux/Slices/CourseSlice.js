import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../../Helpers/axiosinstance"
import toast from "react-hot-toast"

const initialState = {
    courseData: []
}

export const getAllCoursesThunk = createAsyncThunk("/course/get", async() => {
    try{
        const res = axiosInstance.get("/courses")
        toast.promise(res,{
            loading: "Loading course data",
            success: "Courses loaded successfully",
            error: "Failed to get the courses"
        })
        return (await res).data.courses
    }catch(err){
        toast.error(err?.response?.data?.message)
    }
    
})

const courseSlice = createSlice({
    name: "course",
    initialState,
    reducers:{},
    extraReducers: (builder) => {
        builder.
        addCase(getAllCoursesThunk.fulfilled,(state,action) => {
            if(action.payload){
                console.log(action.payload)
                state.courseData = [...action.payload]
            }
        })
    }
})

export default courseSlice.reducer