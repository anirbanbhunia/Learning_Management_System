import { useState } from "react"
import Homelayout from "../Layouts/Homelayout"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import {toast} from "react-hot-toast" 
import { loginThunk } from "../Redux/Slices/Authslice"

function Login() {

    const dispatch = useDispatch()
    const navigate = useNavigate()


    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    })

    function handleUserInput(e){
        const {name,value} = e.target
        setLoginData({
            ...loginData, 
            [name]: value
        })
    }

    async function onLogin(e){
        e.preventDefault()
        if(!loginData.email || !loginData.password){
            toast.error("Please fill all the details")
            return
        }

        const response = await dispatch(loginThunk(loginData))
        if(response?.payload?.success){
            navigate("/")
        }

        setLoginData({
            email: "",
            password: "",
        })
    }

  return (
    <Homelayout>
        <div className="flex items-center justify-center h-[100vh]">
            <form noValidate onSubmit={onLogin} className="flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-96 shadow-[0_0_10px_black]">
                <h1 className="text-center text-2xl font-bold">Login Page</h1>

                <div className="flex flex-col gap-1">
                    <label htmlFor="email" className="font-semibold"> Email </label>
                    <input
                        type="email"
                        required
                        name="email"
                        id="email"
                        placeholder="Enter your email..."
                        className="bg-transparent px-2 py-1 border"
                        onChange={handleUserInput}
                        value={loginData.email}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="password" className="font-semibold"> Password </label>
                    <input
                        type="password"
                        required
                        name="password"
                        id="password"
                        placeholder="Enter your password..."
                        className="bg-transparent px-2 py-1 border"
                        onChange={handleUserInput}
                        value={loginData.password}
                    />
                </div>

                <button type="submit" className="bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer mt-2">
                    Login
                </button>

                <p className="text-center">
                    Donot have an account ? <Link className="link text-accent cursor-pointer" to={"/signup"}>Signup</Link>
                </p>
            </form>
        </div>
    </Homelayout>
  )
}

export default Login