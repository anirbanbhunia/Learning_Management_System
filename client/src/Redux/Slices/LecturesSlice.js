import{ createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import toast from "react-hot-toast"
import axiosInstance from "../../Helpers/axiosinstance"

const initialState = {
    lectures:[]
}

export const getCourseLectures = createAsyncThunk("/course/lecture/get",async(cid) => {
    try{
        const res = axiosInstance.get(`/courses/${cid}`)
        toast.promise(res,{
            loading: "Feaching course lectures",
            success: "Lecture fetched successfully",
            error: "Failed to load the lectures"
        })
        return (await res).data
    }catch(err){
        toast.error(err?.response?.data?.message)
    }
})

export const addCourseLectures = createAsyncThunk("/course/lecture/add",async(data) => {
    try{
        const formData = new FormData()
        formData.append("lecture",data.lecture)
        formData.append("title",data.title)
        formData.append("description",data.description)

        //console.log("courseId =>",data)

        const res = axiosInstance.post(`/courses/${data.id}`,formData)
        toast.promise(res,{
            loading: "Adding course lecture",
            success: "Lecture added successfully",
            error: "Failed to add the lectures"
        })
        return (await res).data
    }catch(err){
        toast.error(err?.response?.data?.message)
    }
})

export const deleteCourseLectures = createAsyncThunk("/course/lecture/delete",async(data) => {
    try{
        const res = axiosInstance.delete(`/courses/${data.id}/lectures/${data.lectureId}`)
        console.log("deletelecture", res)
        toast.promise(res,{
            loading: "Deleting course lectures",
            success: "Lecture deleted successfully",
            error: "Failed to delete the lectures"
        })
        return (await res).data
    }catch(err){
        toast.error(err?.response?.data?.message)
    }
})

const lectureSlice = createSlice({
    name: "lecture",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(getCourseLectures.fulfilled, (state,action) => {
            state.lectures = action?.payload?.lectures
        })
        .addCase(addCourseLectures.fulfilled, (state,action) => {
            state.lectures = action?.payload?.course?.lectures
        })
    }
})

export default lectureSlice.reducer