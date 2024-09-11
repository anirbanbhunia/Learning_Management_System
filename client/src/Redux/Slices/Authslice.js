import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../Helpers/axiosinstance"

const initialState = {
    
    isLoggedIn: localStorage.getItem("isLoggedIn") || false,
    role: localStorage.getItem("role") || "",
    data: JSON.parse(localStorage.getItem("data")) || {},
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

export const loginThunk = createAsyncThunk("/auth/login", async(data) => {
    try{
        const res = axiosInstance.post("user/login", data)
        toast.promise(res,{
            loading: "Wait! login in progress...",
            success: (data) => {
                res?.data?.message || "Login successful"
            },
            error: "Failed to login"
        })
        return (await res).data
    }catch(err){
        toast.error(e?.response?.data?.message)
    }
})

export const logoutThunk = createAsyncThunk("/auth/logout", async() => {
        try{
            const res = axiosInstance.get("user/logout")
            toast.promise(res,{
                loading: "Wait! logout in progress...",
                success: (data) => {
                    res?.data?.message
                },
                error: "Failed to logout"
            })
        }catch(err){
            toast.error(e?.response?.data?.message)
        }
})

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(loginThunk.fulfilled, (state,action) => {
            localStorage.setItem("data", JSON.stringify(action?.payload?.user))
            localStorage.setItem("isLoggedIn", true)
            localStorage.setItem("role", action?.payload?.user?.role)
            state.isLoggedIn = true
            state.role = action?.payload?.user?.role
            state.data = action?.payload?.user
        })
        .addCase(logoutThunk.fulfilled, (state,action) => {
            localStorage.clear()
            state.data = {}
            state.isLoggedIn = false
            state.role = ""
        })
    }
})

export default authSlice.reducer
export const {} = authSlice.actions
