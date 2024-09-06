import { useState } from "react"
import Homelayout from "../Layouts/Homelayout"
import { BsPersonCircle } from "react-icons/bs"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import {toast} from "react-hot-toast" 
import { createAccountByThunk } from "../Redux/Slices/Authslice"

function SignUp() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [previewImage,setPreviewImage] = useState("")

    const [signupData, setSignupData] = useState({
        fullName:"",
        email: "",
        password: "",
        avatar: ""
    })

    function handleUserInput(e){
        const {name,value} = e.target
        setSignupData({
            ...signupData, 
            [name]: value
        })
    }

    function getImage(e){
        e.preventDefault()

        //getting the image
        const uploadImage = e.target.files[0]

        if(uploadImage){
            setSignupData({
                ...signupData,
                avatar: uploadImage
            })
            const fileReader = new FileReader()
            fileReader.readAsDataURL(uploadImage)
            fileReader.addEventListener("load",() => {
                setPreviewImage(fileReader.result)
            })
        }
    }

    async function createAccount(e){
        e.preventDefault()
        if(!signupData.email || !signupData.password || !signupData.fullName){
            toast.error("Please fill all the details")
            return
        }
        if(signupData.fullName.length < 5){
            toast.error("Name should be atleast of 5 characters")
            return
        }
        if(!signupData.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)){
            toast.error("Invalid email id")
            return
        }
        if(!signupData.password.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)){
            toast.error("Password should be 6 to 16 character long with atleast a number and a special character")
            return
        }

        const formData = new FormData()
        formData.append("fullName",signupData.fullName)
        formData.append("email",signupData.email)
        formData.append("password",signupData.password)
        formData.append("avatar",signupData.avatar)

        const response = await dispatch(createAccountByThunk(formData))
        if(response?.payload?.success){
            navigate("/")
        }

        setSignupData({
            fullName:"",
            email: "",
            password: "",
            avatar: ""
        })
        setPreviewImage("")
    }

  return (
    <Homelayout>
        <div className="flex items-center justify-center h-[100vh]">
            <form noValidate onSubmit={createAccount} className="flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-96 shadow-[0_0_10px_black]">
                <h1 className="text-center text-2xl font-bold">Registartion Page</h1>

                <label htmlFor="image_uploads" className="cursor-pointer">
                    {previewImage? 
                        <img className="w-24 h-24 rounded-full m-auto" src={previewImage}/> :
                        <BsPersonCircle className="w-24 h-24 rounded-full m-auto"/>}
                </label>
                <input 
                    onChange={getImage} 
                    type="file" 
                    id="image_uploads" 
                    className="hidden" 
                    accept=".jpg, .jpeg, .png, .svg" 
                    name="image_uploads"
                />

                <div className="flex flex-col gap-1">
                    <label htmlFor="fullName" className="font-semibold"> Name </label>
                    <input
                        type="text"
                        required
                        name="fullName"
                        id="fullName"
                        placeholder="Enter your name..."
                        className="bg-transparent px-2 py-1 border"
                        onChange={handleUserInput}
                        value={signupData.fullName}
                    />
                </div>

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
                        value={signupData.email}
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
                        value={signupData.password}
                    />
                </div>

                <button type="submit" className="bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer mt-2">
                    Create account
                </button>

                <p className="text-center">
                    Already have an account ? <Link className="link text-accent cursor-pointer" to={"/login"}>Login</Link>
                </p>
            </form>
        </div>
    </Homelayout>
  )
}

export default SignUp