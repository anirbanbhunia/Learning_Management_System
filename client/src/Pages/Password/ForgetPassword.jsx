import { useDispatch } from "react-redux"
import Homelayout from "../../Layouts/Homelayout"
import toast from "react-hot-toast"
import { forgotPassword } from "../../Redux/Slices/Authslice"
import { Link } from "react-router-dom"
import { useState } from "react"

function ForgetPassword() {
    const dispatch = useDispatch()

    const [email,setEmail] = useState("")

    const handleSubmit = async(e) => {
        e.preventDefault();

        if(!email){
            toast.error("All fields are mandatory");
            return;
        }
        if(!email.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g)){
            toast.error("Invalid email id");
            return;
        }

        const res = await dispatch(forgotPassword(email))
        setEmail("")
    }
  return (
    <Homelayout>
        {/* forget password container */}
      <div className="flex items-center justify-center h-[100vh]">
        {/* forget password card */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center gap-6 rounded-lg p-4 text-white w-80 h-[26rem] shadow-[0_0_10px_black]"
        >
          <h1 className="text-center text-2xl font-bold">Forget Password</h1>

          <p>
            Enter your registered email, we will send you a verification link on
            your registered email from which you can reset your password
          </p>

          <div className="flex flex-col gap-1">
            <input
              required
              type="email"
              name="email"
              id="email"
              placeholder="Enter your registered email"
              className="bg-transparent px-2 py-1 border"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <button
            className="w-full bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer"
            type="submit"
          >
            Get Verification Link
          </button>

          <p className="text-center">
            Already have an account ?{" "}
            <Link to={"/login"} className="link text-accent cursor-pointer">
              Login
            </Link>
          </p>
        </form>
      </div>
    </Homelayout>
  )
}

export default ForgetPassword