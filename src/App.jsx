import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import { AuthLayout } from './components/AuthLayout/AuthLayout'
import {Login} from "./components/Login/Login"
import {Register} from "./components/Register/Register"
import {BlankLayout} from "./components/BlankLayout/BlankLayout"
import {Categories} from "./components/Categories/Categories"
import {SubCategories} from "./components/SubCategories/SubCategories"
import {Products} from "./components/Products/Products"
import {Brands} from "./components/Brands/Brands"
import {Coupons} from "./components/Coupons/Coupons"
import {Orders} from "./components/Orders/Orders"
import { ProtectedLogin } from './components/protectedRouters/ProtectedLogin'

let routes = createBrowserRouter([
  {path:"/",element:<AuthLayout/>, children:[
    {path:"/", element:<Login/> },
    {path:"/register", element:<Register/> }
  ]},
  {path:"/",element:<ProtectedLogin><BlankLayout/></ProtectedLogin>, children:[
    {path:"/categories" , element: <Categories/> },
    {path:"/subcategories" , element: <SubCategories/> },
    {path:"/products" , element: <Products/> },
    {path:"/brands" , element: <Brands/> },
    {path:"/coupons" , element: <Coupons/> },
    {path:"/orders" , element: <Orders/> }
  ]},
 
])

function App() {
  

  return (
    <>
      <RouterProvider router={routes}></RouterProvider>
    </>
  )
}

export default App
