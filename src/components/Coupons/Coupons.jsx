import React, { useEffect, useState } from "react";
import style from "./Coupons.module.css"
import { initFlowbite } from "flowbite";
import axios from "axios";
import { useForm } from "react-hook-form";
import {z} from "zod"
import { zodResolver } from "@hookform/resolvers/zod";

const schema= z.object({
  code:z.string().min(3,"coupon code must be at least 3 character").max(20,"coupon code must be at most 20 character"),
  expires:z.coerce.date(),
  discount:z.coerce.number().min(0).max(100)
})

export function Coupons() {
  let[coupons , setCoupons]=useState([])
  let[isModelOpen , setIsModelOpen]= useState(false)
  let[isEdit , setIsEdit]= useState(false)
  let[currentCoupon ,setCurrentCoupon]=useState({})

  let{ register , handleSubmit , formState ,setValue ,reset}= useForm({
    defaultValues:{
      code:"",
      expires:undefined,
      discount:0
    },resolver: zodResolver(schema)
  })

  useEffect(()=>{
    fetchCoupons()
    initFlowbite()
  },[])

  function fetchCoupons(){
      axios.get("https://nti-ecommerce.vercel.app/api/v1/Coupons",{
        headers:localStorage.getItem("token")
      }).then((res)=>{
       setCoupons(res.data.coupons)
      }).catch((err)=>{
        console.log(err)
      })
  } 

  function openModel(coupon){
       setIsModelOpen(true)
       if(coupon){
          setIsEdit(true)
          setCurrentCoupon(coupon)
          setValue("code",coupon.code)
          setValue("expires",coupon.expires)
          setValue("discount",coupon.discount)

       }else{
          setIsEdit(false)
          reset()
       }
  }

  function closeModel(){
      setIsModelOpen(false)
  }

  function submit(data){

     if(isEdit){
      let {code , ...data}= data
      axios.put(`https://nti-ecommerce.vercel.app/api/v1/Coupons/${currentCoupon._id}`,data).then((res=>{
         console.log(res.data)
         fetchCoupons()
      })).catch((err)=>{
        console.log(err)
      }).finally(
        reset(),
        closeModel(),
      )
     }else{ 
       axios.post("https://nti-ecommerce.vercel.app/api/v1/Coupons",data).then((res=>{
          console.log(res.data)
          fetchCategories()
       })).catch((err)=>{
         console.log(err)
       }).finally(
         closeModel(),
         reset()
       )
     }
  }

  function deleteCoupons(id){
    axios.delete(`https://nti-ecommerce.vercel.app/api/v1/Coupons/${id}`).then((res=>{
      console.log(res.data)
      fetchCoupons()
   })).catch((err)=>{
     console.log(err)
   })
 }

  return <>

    <div className="heading flex  flex-col md:flex-row gap-5 justify-between items-center p-5">
      <h2 className="text-3xl font-semibold ">Coupons Management</h2>
      <button onClick={()=>openModel(null)} type="button" className="text-white bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-700 hover:bg-gradient-to-br focus:outline-none shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5 cursor-pointer"><i className="fa-solid fa-plus mr-1.5"></i>Add Coupon</button>
    </div>
    

<div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default m-5">
    <table className="w-full text-sm text-left rtl:text-right text-body shadow">
        <thead className="text-md text-body bg-gray-100 border-b border-default-medium ">
            <tr>
                <th scope="col" className="px-6 py-3 font-medium ">
                    Coupon Code
                </th>
                <th scope="col" className="px-6 py-3 font-medium ">
                   Expires In 
                </th>
                <th scope="col" className="px-6 py-3 font-medium ">
                    Discount
                </th>
                <th scope="col" className="px-6 py-3 font-medium">         
                </th>
            </tr>
        </thead>
        <tbody>
          {coupons.map((coupon)=>
            <tr className="bg-neutral-primary-soft border-b border-default hover:bg-neutral-secondary-medium  group" key={category._id}>
                <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                    {coupon.code}
                </th>
                <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                    {coupon.expires.split("T")[0]}
                </th>
                <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                    {coupon.discount}
                </th>
                <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                    {coupon.updatedAt.split("T")[0]}
                </th>
                <th className="px-6 py-4">
               <div className="btns flex gap-3.5 transition-all duration-200">
                <button onClick={()=>openModel(coupon)} type="button" className="text-body bg-neutral-primary-soft border border-default hover:bg-neutral-secondary-medium hover:text-cyan-600 hover:shadow-cyan-600/60  hover:-translate-y-1 transition-all duration-300 focus:ring-4 focus:ring-neutral-tertiary-soft shadow  leading-5 rounded-full text-xl p-3 focus:outline-none cursor-pointer"><i className="fa-regular fa-pen-to-square"></i></button>
                <button onClick={()=>deleteCoupons(coupon._id)} type="button" className="text-body bg-neutral-primary-soft border border-default hover:bg-neutral-secondary-medium hover:text-red-600 hover:shadow-red-600/60 hover:-translate-y-1 transition-all duration-300 focus:ring-4 focus:ring-neutral-tertiary-soft shadow  leading-5 rounded-full text-xl p-3 focus:outline-none cursor-pointer"><i className="fa-regular fa-trash-can"></i></button>
                </div>
                </th>
            </tr>
          )}
       
        </tbody>
    </table>
</div>





{isModelOpen &&

<div className="flex overflow-y-auto overflow-x-hidden  bg-gray-800/85 z-100 fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-neutral-primary-soft border border-default rounded-base shadow-sm p-4 md:p-6">
            <div className="flex items-center justify-between border-b border-default pb-4 md:pb-5">
                <h3 className="text-lg font-medium text-heading">
                {isEdit?"Edit coupon":"Create new coupon"}
                </h3>
                <button onClick={closeModel} type="button" className="text-body bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base text-sm w-9 h-9 ms-auto inline-flex justify-center items-center" data-modal-hide="crud-modal">
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6"/></svg>
                    <span  className="sr-only">Close modal</span>
                </button>
            </div>
            <form onSubmit={handleSubmit(submit)}>    
                    <div className="col-span-2 mt-4">
                        <label htmlFor="code" className="block mb-2.5 text-sm font-medium text-heading">Coupon Code</label>
                        <input {...register("code")} type="text" name="code" id="code" className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="Type coupon code" />
                        {formState.errors.code &&<p className="text-sm text-red-500">{formState.errors.code.message}</p>}
                    </div>
                    <div className="col-span-2 mt-4">
                        <label htmlFor="expires" className="block mb-2.5 text-sm font-medium text-heading">Expires In</label>
                        <input {...register("expires")} type="date" name="expires" id="expires" className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="" />
                        {formState.errors.expires &&<p className="text-sm text-red-500">{formState.errors.expires.message}</p>}
                    </div>
                    <div className="col-span-2 mt-4">
                        <label htmlFor="discount" className="block mb-2.5 text-sm font-medium text-heading">Discount</label>
                        <input {...register("discount")} type="number" name="discount" id="discount" className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="" />
                        {formState.errors.discount &&<p className="text-sm text-red-500">{formState.errors.discount.message}</p>}
                    </div>
                    
                  

                <div className="flex items-center space-x-4 border-t border-default pt-4 md:pt-6">    
                   <button type="submit" className="text-white bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-700 hover:bg-gradient-to-br focus:outline-none shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5 cursor-pointer block mx-auto cursor-pointer">{isEdit?"Edit coupon":"Add new coupon"}</button>
                </div>
            </form>
        </div>
    </div>
</div> 

}
  </>
}