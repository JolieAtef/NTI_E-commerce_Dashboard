import React from "react";
import { Login } from "../Login/Login";

export function ProtectedLogin({children}){
    let token = localStorage.getItem("token")
    return token? children :<Login/>
}