import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

function RecureAuth({allowedRole}) {
    const {isLoggedIn,role} = useSelector((state) => state.auth)
  return isLoggedIn && allowedRole.find((myrole) => myrole === role) ? (
    <Outlet/>
  ): isLoggedIn ? (<Navigate to={"/denied"}/>) : (<Navigate to={"/login"}/>)
}

export default RecureAuth