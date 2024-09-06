import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../Helpers/axiosinstance"

const initialState = {
    
    isLoggedIn: localStorage.getItem("isLoggedIn") || false,
    role: localStorage.getItem("role") || "",
    data: localStorage.getItem("data") || {},
}

export const createAccountByThunk = createAsyncThunk("/auth/signup", async(data) => {
    try{
        const res = axiosInstance.post("user/register", data)
        toast.promise(res,{
            loading: "Wait! creating your account",
            success: (data) => {
                res?.data?.message
            },
            error: "Failed to create account"
        })
        return (await res).data
    }catch(e){
        toast.error(e?.response?.data?.message)
    }
})

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {}
})

export default authSlice.reducer
export const {} = authSlice.actions
