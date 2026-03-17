import React from "react";
import style from "./Login.module.css"
import { useForm } from "react-hook-form";
import {z} from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {Link , useNavigate } from "react-router-dom";
import toast , { Toaster } from "react-hot-toast";

let schema = z.object({  
   email:z.string().email(),
   password:z.string().regex(/^[a-zA-Z0-9]{3,30}$/).max(30,"password must be at most 30 character")
})


export function Login() {
   
  let navigate = useNavigate()
   let{ register , handleSubmit , formState ,setValue ,reset}= useForm({
      defaultValues:{
        email:"",
        password:""
      },resolver: zodResolver(schema)
  })

  function SignIn(data){
    axios.post("https://nti-ecommerce.vercel.app/api/v1/auth/signIn",data).then((res)=>{
          localStorage.setItem("token", res.data.token)
          navigate("/categories")
    }).catch((err)=> {
      console.log(err)
      toast.error("Login failed")
    })
  }

  return <>
    
<main className="flex justify-center items-center min-h-screen bg-cyan-50 ">
<form className="max-w-lg mx-auto border-2 border-gray-300 shadow rounded-2xl w-2/5 p-10 bg-white/70 " onSubmit={handleSubmit(SignIn) }>
<h2 className="text-2xl text-center mb-6 font-semibold">Login To Your Account</h2>

  <div className="relative z-0 w-full mb-10 group ">
      <input {...register("email")} type="email" id="floating_email" className=" block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer" />
      <label htmlFor="floating_email" className="absolute text-lg text-body duration-300 transform -translate-y-8 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-10 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Email</label>
      {formState.errors.email&&<p className="text-sm text-red-500">{formState.errors.email.message}</p>}
  </div>
  <div className="relative z-0 w-full mb-10 group">
      <input {...register("password")} type="password" id="floating_password" className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer" />
      <label htmlFor="floating_password" className="absolute text-lg text-body duration-300 transform -translate-y-8 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-10 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Password</label>
      {formState.errors.password&&<p className="text-sm text-red-500">{formState.errors.password.message}</p>}
  </div>
  <button type="submit" className="text-white bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-700 hover:bg-gradient-to-br focus:outline-none shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5 cursor-pointer w-3/4 m-auto block">Login</button>
  <Link to="/register" className="text-center block mt-5 text-blue-500">create new account</Link>
</form>
<Toaster position="top-right"/>
</main>

  </>
}