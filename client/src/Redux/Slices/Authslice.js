import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../Helpers/axiosinstance"

const initialState = {
    
    isLoggedIn: localStorage.getItem("isLoggedIn") || false,
    role: localStorage.getItem("role") || "",
    data: localStorage.getItem('data') != undefined ? JSON.parse(localStorage.getItem('data')) : {}
}

export const createAccountByThunk = createAsyncThunk("/auth/signup", async(data) => {
    try{
        const res = axiosInstance.post("user/register", data)
        toast.promise(res,{
            loading: "Wait! creating your account",
            success: (data) => {
                data?.data?.message
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
                data?.data?.message || "Login successful"
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
                    data?.data?.message
                },
                error: "Failed to logout"
            })
        }catch(err){
            toast.error(e?.response?.data?.message)
        }
})

export const updateProfile = createAsyncThunk("/user/update/profile", async (data) => {
    try {
        const res = axiosInstance.put(`user//updateuser/${data[0]}`, data[1]);
        toast.promise(res, {
            loading: "Wait! profile update in progress...",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to update profile"
        });
        return (await res).data;
    } catch(error) {
        toast.error(error?.response?.data?.message);
    }
})


export const getUserData = createAsyncThunk("/user/details", async () => {
    try {
        const res = axiosInstance.get("user/me");
        return (await res).data;
    } catch(error) {
        toast.error(error.message);
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
        .addCase(getUserData.fulfilled, (state, action) => {
            if(!action?.payload?.user) return;
            localStorage.setItem("data", JSON.stringify(action?.payload?.user));
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("role", action?.payload?.user?.role);
            state.isLoggedIn = true;
            state.data = action?.payload?.user;
            state.role = action?.payload?.user?.role
        });
    }
})

export default authSlice.reducer
export const {} = authSlice.actions
