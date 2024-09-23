import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import toast from "react-hot-toast"
import axiosInstance from "../../Helpers/axiosinstance"

const initialState = {
    key:"",
    subscription_id:"",
    isPaymentVerified: localStorage.getItem("verified") === undefined ? false : localStorage.getItem("verified"),
    allPayments: {},
    finalMonths: {},
    monthlySalesRecord: []
}

export const getRazorpayKey = createAsyncThunk("/razorpay/getKey",async() => {
    try{
        const res = await axiosInstance.get("/payments/razorpay-key")
        return res.data
    }catch(err){
        toast.err("Failed to load data")
    }
})

export const purchaseCourseBundle = createAsyncThunk("/purchaseCourse",async() => {
    try{
        const res = await axiosInstance.post("/payments/subscribe")
        //console.log("this is resdata => ", res.data)
        return res.data
    }catch(err){
        toast.error(err?.response?.data?.message)
    }
})

export const verifyUserPayment = createAsyncThunk("/payment/verify", async(data) => {
    try{
        const res = await axiosInstance.post("/payments/verify",{
            razorpay_payment_id: data.razorpay_payment_id,
            razorpay_signature: data.razorpay_signature,
            razorpay_subscription_id: data.razorpay_subscription_id
        })
        //console.log("this is resdata => ", res.data)
        return res.data
    }catch(err){
        toast.error(err?.response?.data?.message)
    }
})

export const getPaymentsRecord = createAsyncThunk("/payments/record", async() => {
    try{
        const res = axiosInstance.get("/payments?count=100")
        toast.promise(res,{
            loading: "Getting the payment records",
            success:(data) => {
                return data?.data?.message
            },
            error: "Failed to get payment records"
        })
        return (await res).data
    }catch(err){
        toast.error("Operation faild")
    }
})

export const cancelCourseBundle = createAsyncThunk("/cancelCourse",async() => {
    try{
        //console.log("Cancellation initiated");
        const res = axiosInstance.post("/payments/unsubscription")
        //console.log("this is response",res)
        toast.promise(res,{
            loading: "Unsubscribing the bundle...",
            success: "Bundle unsubscibed successfully",
            error: "Failed to unsubscribe"
        })
        return (await res).data
    }catch(err){
        toast.error(err?.response?.data?.message)
    }
})

const razorpaySlice = createSlice({
    name:"razorpay",
    initialState,
    reducers:{},
    extraReducers:(builder) => {
        builder
        .addCase(getRazorpayKey.fulfilled,(state,action) => {
            state.key = action?.payload?.key
        })
        .addCase(purchaseCourseBundle.fulfilled,(state,action) => {
            state.subscription_id = action?.payload?.subscription_id
        })
        .addCase(verifyUserPayment.fulfilled,(state,action) => {
            toast.success(action?.payload?.message)
            state.isPaymentVerified = action?.payload?.success
            localStorage.setItem("verified",JSON.stringify(action?.payload?.success))
        })
        .addCase(verifyUserPayment.rejected,(state,action) => {
            toast.success(action?.payload?.message)
            state.isPaymentVerified = action?.payload?.success
        })
        .addCase(getPaymentsRecord.fulfilled,(state,action) => {
            state.allPayments = action?.payload?.subscriptions
            state.finalMonths = action?.payload?.finalMonths
            state.monthlySalesRecord = action?.payload?.monthlySalesRecord
        })
        //add for testing...
        // .addCase(cancelCourseBundle.fulfilled, (state, action) => {
        //     state.subscription_id = ""; // Clear the subscription ID
        //     toast.success(action?.payload?.message || "Subscription canceled successfully");
        // })
    }
})

export default razorpaySlice.reducer