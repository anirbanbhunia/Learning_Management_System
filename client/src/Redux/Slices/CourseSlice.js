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

export const createCourseThunk = createAsyncThunk("/course/create", async(data) => {
    try{
        const formData = new FormData() 
        formData.append("title",data?.title)
        formData.append("description",data?.description)
        formData.append("category",data?.category)
        formData.append("createdBy",data?.createdBy)
        formData.append("thumbnail",data?.thumbnail)

        const res = axiosInstance.post("/courses",formData)
        toast.promise(res,{
            loading: "Creating new course",
            success: "Course created successfully",
            error: "Failed to create course"
        })
        return (await res).data
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