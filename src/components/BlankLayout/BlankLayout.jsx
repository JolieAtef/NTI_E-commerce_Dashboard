import React, { useEffect } from "react";
import style from "./BlankLayout.module.css"
import { initFlowbite } from "flowbite";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

export function BlankLayout() {
   let navigate = useNavigate()
  useEffect(()=>{
    initFlowbite()
  },[])

function SignOut(){
  localStorage.removeItem("token")
  navigate("/")
}
return <>
<nav className="fixed top-0 z-50 w-full bg-cyan-50 border-b border-default px-5 py-1 ">
  <div className="px-3 py-3 lg:px-5 lg:pl-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center justify-start rtl:justify-end">
        <button data-drawer-target="top-bar-sidebar" data-drawer-toggle="top-bar-sidebar" aria-controls="top-bar-sidebar" type="button" className="sm:hidden text-heading bg-transparent box-border border border-transparent hover:bg-neutral-secondary-medium focus:ring-4 focus:ring-neutral-tertiary font-medium leading-5 rounded-base text-sm p-2 focus:outline-none">
            <span className="sr-only">Open sidebar</span>
            <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
       <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h10"/>
   </svg>
         </button>
        <span className="flex items-center gap-1.5 ms-2 md:me-24">
          <svg className="w-7 h-7 transition duration-75 text-cyan-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6.025A7.5 7.5 0 1 0 17.975 14H10V6.025Z"/><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.5 3c-.169 0-.334.014-.5.025V11h7.975c.011-.166.025-.331.025-.5A7.5 7.5 0 0 0 13.5 3Z"/></svg>
          <span className="self-center text-2xl font-bold whitespace-nowrap dark:text-white">Dashboard</span>
        </span>
      </div>
      <div className="flex items-center">
          <div className="flex items-center ms-3">
            <div>
              <button type="button" className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" aria-expanded="false" data-dropdown-toggle="dropdown-user">
                <span className="sr-only">Open user menu</span>
                <img className="w-8 h-8 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="user photo"/>
              </button>
            </div>
            <div className="z-50 hidden bg-neutral-primary-medium border border-default-medium rounded-base shadow-lg w-44" id="dropdown-user">
              <div className="px-4 py-3 border-b border-default-medium" role="none">
                <p className="text-sm font-medium text-heading" role="none">
                  Neil Sims
                </p>
                <p className="text-sm text-body truncate" role="none">
                  neil.sims@flowbite.com
                </p>
              </div>
              <ul className="p-2 text-sm text-body font-medium" role="none">
              <li>
                  <button href="#" onClick={SignOut} className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded" role="menuitem">Sign out</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
    </div>
  </div>
</nav>

<aside id="top-bar-sidebar" className="fixed top-0 left-0 z-40 w-64 h-full transition-transform -translate-x-full sm:translate-x-0  " aria-label="Sidebar">
   <div className="h-full px-3 py-4 overflow-y-auto border-e border-default">
      <ul className="space-y-2 font-medium pt-15">
         <li>
            <NavLink to="/categories" className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-cyan-600 group">
               <span className="ms-3">Categories</span>
            </NavLink>
         </li>
         <li>
            <NavLink to="/subcategories" className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-cyan-600 group">
               <span className="ms-3">SubCategories</span>
            </NavLink>
         </li>
         <li>
            <NavLink to="/brands" className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-cyan-600 group">
               <span className="ms-3">Brands</span>
            </NavLink>
         </li>
         <li>
            <NavLink to="/products" className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-cyan-600 group">
               <span className="ms-3">Products</span>
            </NavLink>
         </li>
         <li>
            <NavLink to="/coupons" className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-cyan-600 group">
               <span className="ms-3">Coupons</span>
            </NavLink>
         </li>
         <li>
            <NavLink to="/orders" className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-cyan-600 group">
               <span className="ms-3">Orders</span>
            </NavLink>
         </li>
         
      </ul>
   </div>
</aside>

<div className="p-5 sm:ml-64 mt-14">  
     <Outlet/>
</div>
    
  </>
}




