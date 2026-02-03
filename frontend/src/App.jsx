import { Route, Routes } from "react-router-dom"
import { Home } from "./pages/home"
import { SignUp } from "./pages/signUp"
import PrivateRoute from "./components/privateRoute"
import { Login } from "./pages/login"
import { Profile } from "./pages/profile"

export function App(){
  return(
  <>
  <Routes>
    <Route path="/" element={
      <PrivateRoute>
        <Home/>
      </PrivateRoute>
    }/>
    <Route path="/profile" element={
      <PrivateRoute>
        <Profile/>
      </PrivateRoute>
    }/>
  <Route path="/signUp" element={<SignUp/>} />
  <Route path="/login" element={<Login/>} />
  </Routes>

  </>
  )
}

