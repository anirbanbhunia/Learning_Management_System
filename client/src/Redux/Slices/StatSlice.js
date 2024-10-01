import{createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import toast from "react-hot-toast"
import axiosInstance from "../../Helpers/axiosinstance.js"

const initialState = {
    allUserCount: 0,
    subscribedCount: 0
}

export const getStatData = createAsyncThunk("stats/get",async() => {
    try{
        const res = axiosInstance.get("/admin/stats/users")
        toast.promise(res,{
            loading: "Getting the stats...",
            success: (data) => {
                return data?.data?.message
            },
            error: "Failed to load data stats"
        })
        return (await res).data
    }catch(err){
        toast.error(err?.response?.data?.message)
    }
})

const statSlice = createSlice({
    name: "stat",
    initialState,
    reducers:{},
    extraReducers: (builder) => {
        builder
        .addCase(getStatData.fulfilled,(state,action) => {
            //console.log(action)
            state.allUserCount = action?.payload?.allUserCount
            state.subscribedCount = action?.payload?.subscribeUserCount
        })
    }
})

export default statSlice.reducer