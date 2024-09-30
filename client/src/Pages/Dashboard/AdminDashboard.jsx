import { useDispatch, useSelector } from "react-redux"
import Homelayout from "../../Layouts/Homelayout"
import {ArcElement,BarElement,CategoryScale,Chart as ChartJs,Legend,LinearScale,Title,Tooltip} from "chart.js"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { getPaymentsRecord } from "../../Redux/Slices/RazorpaySlice"
import { getStatData } from "../../Redux/Slices/StatSlice"
import { deleteCourse, getAllCoursesThunk } from "../../Redux/Slices/CourseSlice"

ChartJs.register(ArcElement,BarElement,CategoryScale,Legend,LinearScale,Title,Tooltip)

function AdminDashboard() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {allUserCount,subscribedCount} = useSelector((state) => state.stat)
    const {allPayments,finalMonths,monthlySalesRecord} = useSelector((state) => state.razorpay)

    const userData = {
        labels:["Register user","Enrolled user"],
        dataSets:[
            {
                label: "User details",
                data: [allUserCount,subscribedCount],
                backgroundColor: ["yellow","green"],
                borderWidth: 1,
                borderColor: ["yellow","green"]
            }
        ]
    }

    const salesData = {
        labels:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
        fontColor: "white",
        dataSets:[
            {
                label: "Sales / Month",
                data: monthlySalesRecord,
                backgroundColor: ["rgb(255,99,132)"],
                borderWidth: 2,
                borderColor: ["white"]
            }
        ]
    }

    const myCourses = useSelector((state) => state?.course?.courseData)

    async function onCourseDelete(id) {
        if(window.confirm("Are you sure you want to delete the course ? ")){
            const res = await dispatch(deleteCourse(id))
            if(res?.payload?.success){
                await dispatch(getAllCourses())
            }
        }
    }

    useEffect(() => {
        (
            async() => {
                await dispatch(getAllCoursesThunk())
                await dispatch(getPaymentsRecord())
                await dispatch(getStatData())
            }
        )()
    },[])
  return (
    <Homelayout>

    </Homelayout>
  )
}

export default AdminDashboard