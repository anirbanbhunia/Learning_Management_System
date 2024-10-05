import { useDispatch } from "react-redux"
import Homelayout from "../../Layouts/Homelayout"
import { useNavigate, useParams } from "react-router-dom"
import { useState } from "react"
import { resetPassword } from "../../Redux/Slices/Authslice"
import toast from "react-hot-toast"

function ResetPassword() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [data,setData] = useState({
        password: "",
        confirmPassword: "",
        resetToken: useParams().resetToken
    })

    const handleUserInput = (e) => {
        const {value,name} = e.target
        setData({
            ...data,
            [name]: value
        })
    }

    const handleFormSubmit = async(e) => {
        e.preventDefault()

        if(!data.password || !data.confirmPassword || !data.resetToken){
            toast.error("All fields are mandatory");
            return;
        }

        if(!data.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)){
            toast.error(
                "Minimum password length should be 8 with Uppercase, Lowercase, Number and Symbol"
              );
              return;
        }

        if(data.password !== data.confirmPassword){
            toast.error("Both password should be same");
            return;
        }

        const res = await dispatch(resetPassword(data))

        if(res?.payload?.success){
            navigate("/login")
        }
    }
  return (
    <Homelayout>
        <div
        className="flex items-center justify-center h-[100vh]"
      >
        {/* forget password card */}
        <form onSubmit={handleFormSubmit} className="flex flex-col justify-center gap-6 rounded-lg p-4 text-white w-80 h-[26rem] shadow-[0_0_10px_black]">
          <h1 className="text-center text-2xl font-bold">Reset Password</h1>

          <div className="flex flex-col gap-1">
            <label className="text-lg font-semibold" htmlFor="email">
              New Password
            </label>
            <input
              required
              type="password"
              name="password"
              id="password"
              placeholder="Enter your new password"
              className="bg-transparent px-2 py-1 border"
              value={data.password}
              onChange={handleUserInput}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-lg font-semibold" htmlFor="cnfPassword">
              Confirm New Password
            </label>
            <input
              required
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Confirm your new password"
              className="bg-transparent px-2 py-1 border"
              value={data.confirmPassword}
              onChange={handleUserInput}
            />
          </div>

          <button
            className="w-full bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer"
            type="submit"
          >
            Reset Password
          </button>
        </form>
      </div>
    </Homelayout>
  )
}

export default ResetPassword