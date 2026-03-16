import React from "react";
import style from "./AuthLayout.module.css"
import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return <>
     <Outlet/>
  </>
}