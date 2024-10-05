import { useDispatch } from "react-redux"
import Homelayout from "../../Layouts/Homelayout"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import toast from "react-hot-toast"
import { changePassword } from "../../Redux/Slices/Authslice"
import { AiOutlineArrowLeft } from "react-icons/ai"

function ChangePassword() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [userPassword,setUserPassword] = useState({
        oldPassword: "",
        newPassword: ""
    })

    const handlePasswordChange = (e) => {
        const {name,value} = e.target
        setUserPassword({
            ...userPassword,
            [name] : value
        })
    }

    const handleOnSubmit = async(e) => {
        e.preventDefault();

        if(!userPassword.newPassword || !userPassword.oldPassword){
            toast.error("All field are mandatory")
            return
        }

        if(!userPassword.newPassword.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)){
            toast.error(
                "Minimum password length should be 8 with Uppercase, Lowercase, Number and Symbol"
              );
              return;
        }

        const res = await dispatch(changePassword(userPassword))

        setUserPassword({
            oldPassword: "",
            newPassword: ""
        })

        if(res?.payload?.success){
            navigate("/user/profile")
        }
    }
  return (
    <Homelayout>
        {/* forget password container */}
      <div className="flex items-center justify-center h-[100vh]">
        {/* forget password card */}
        <form
          onSubmit={handleOnSubmit}
          className="flex flex-col justify-center gap-6 rounded-lg p-4 text-white w-80 h-[26rem] shadow-[0_0_10px_black]"
        >
          <h1 className="text-center text-2xl font-bold">Change Password</h1>

          <div className="flex flex-col gap-1">
            <label className="text-lg font-semibold" htmlFor="oldPassword">
              Old Password
            </label>
            <input
              required
              type="password"
              name="oldPassword"
              id="oldPassword"
              placeholder="Enter your old password"
              className="bg-transparent px-2 py-1 border"
              value={userPassword.oldPassword}
              onChange={handlePasswordChange}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-lg font-semibold" htmlFor="newPassword">
              New Password
            </label>
            <input
              required
              type="password"
              name="newPassword"
              id="newPassword"
              placeholder="Enter your new password"
              className="bg-transparent px-2 py-1 border"
              value={userPassword.newPassword}
              onChange={handlePasswordChange}
            />
          </div>

          <Link to={"/user/profile"}>
            <p className="link text-accent cursor-pointer flex items-center justify-center w-full gap-2">
              <AiOutlineArrowLeft /> Back to Profile
            </p>
          </Link>

          <button
            className="w-full bg-yellow-600 hover:bg-yellow-700 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer"
            type="submit"
          >
            Change Password
          </button>
        </form>
      </div>
    </Homelayout>
  )
}

export default ChangePassword