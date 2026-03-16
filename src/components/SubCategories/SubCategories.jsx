import React, { useEffect, useState } from "react";
import style from "./SubCategories.module.css"
import { initFlowbite } from "flowbite";
import axios from "axios";
import { useForm } from "react-hook-form";
import {z} from "zod"
import { zodResolver } from "@hookform/resolvers/zod";

const schema= z.object({
  name:z.string().min(3,"Subcategory name must be at least 3 character").max(30,"Subcategory name must be at most 30 character"),
  category:z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Subcategory Id")
})

export function SubCategories() {
  let[categories , setCategories]=useState([])
  let[subCategories , setSubCategories]=useState([])
  let[isModelOpen , setIsModelOpen]= useState(false)
  let[isEdit , setIsEdit]= useState(false)
  let[currentSubCategory ,setCurrentSubCategory]=useState({})

  let{ register , handleSubmit , formState ,setValue ,reset}= useForm({
    defaultValues:{
      name:"",
      category:""
    },resolver: zodResolver(schema)
  })

  useEffect(()=>{
    fetchCategories()
    fetchSubCategories()
    initFlowbite()

  },[])

  function fetchCategories(){
    axios.get("https://nti-ecommerce.vercel.app/api/v1/categories",{
      headers:localStorage.getItem("token")
    }).then((res)=>{
      setCategories(res.data.categories)
    }).catch((err)=>{
      console.log(err)
    })
} 

  function fetchSubCategories(){
      axios.get("https://nti-ecommerce.vercel.app/api/v1/subCategories",{
        headers:localStorage.getItem("token")
      }).then((res)=>{
       
       setSubCategories(res.data.categories)
      }).catch((err)=>{
        console.log(err)
      })
  } 

  function openModel(subCategory){
       setIsModelOpen(true)
       if(subCategory){
          setIsEdit(true)
          setCurrentSubCategory(subCategory)
          setValue("name",subCategory.name)
          setValue("category",subCategory.category)
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
      axios.put(`https://nti-ecommerce.vercel.app/api/v1/subCategories/${currentSubCategory._id}`,data.name).then((res=>{
         console.log(res.data)
         fetchSubCategories()
      })).catch((err)=>{
        console.log(err)
      }).finally(
        reset(),
        closeModel(),
      )
     }else{
       axios.post("https://nti-ecommerce.vercel.app/api/v1/subCategories",data).then((res=>{
          console.log(res.data)
          fetchSubCategories()
       })).catch((err)=>{
         console.log(err)
       }).finally(
         closeModel(),
         reset()
       )
     }
  }

  function deleteSubCategory(id){
    axios.delete(`https://nti-ecommerce.vercel.app/api/v1/subCategories/${id}`).then((res=>{
      console.log(res.data)
      fetchSubCategories()
   })).catch((err)=>{
     console.log(err)
   })
 }

  return <>

    <div className="heading flex  flex-col md:flex-row gap-5 justify-between items-center p-5">
      <h2 className="text-3xl font-semibold ">SubCategories Management</h2>
      <button onClick={()=>openModel(null)} type="button" className="text-white bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-700 hover:bg-gradient-to-br focus:outline-none shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5 cursor-pointer"><i className="fa-solid fa-plus mr-1.5"></i>Add SubCategory</button>
    </div>
    

<div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default m-5">
    <table className="w-full text-sm text-left rtl:text-right text-body shadow">
        <thead className="text-md text-body bg-gray-100 border-b border-default-medium ">
            <tr>
                <th scope="col" className="px-6 py-3 font-medium ">
                    SubCategory Name
                </th>
                <th scope="col" className="px-6 py-3 font-medium ">
                    Category Name
                </th>
                <th scope="col" className="px-6 py-3 font-medium ">
                    Last Update
                </th>
                <th scope="col" className="px-6 py-3 font-medium">         
                </th>
            </tr>
        </thead>
        <tbody>
          {subCategories.map((subCategory)=>
           (<tr className="bg-neutral-primary-soft border-b border-default hover:bg-neutral-secondary-medium  group" key={subCategory._id}>
                <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                    {subCategory.name}
                </th>
                <th className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                    {categories.find((category)=>category._id==subCategory.category)?.name}
                </th>
                <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                    {subCategory.updatedAt.split("T")[0]}
                </th>
                <th className="px-6 py-4">
               <div className="btns flex gap-3.5 transition-all duration-200">
                <button onClick={()=>openModel(subCategory)} type="button" className="text-body bg-neutral-primary-soft border border-default hover:bg-neutral-secondary-medium hover:text-cyan-600 hover:shadow-cyan-600/60  hover:-translate-y-1 transition-all duration-300 focus:ring-4 focus:ring-neutral-tertiary-soft shadow  leading-5 rounded-full text-xl p-3 focus:outline-none cursor-pointer"><i className="fa-regular fa-pen-to-square"></i></button>
                <button onClick={()=>deleteSubCategory(subCategory._id)} type="button" className="text-body bg-neutral-primary-soft border border-default hover:bg-neutral-secondary-medium hover:text-red-600 hover:shadow-red-600/60 hover:-translate-y-1 transition-all duration-300 focus:ring-4 focus:ring-neutral-tertiary-soft shadow  leading-5 rounded-full text-xl p-3 focus:outline-none cursor-pointer"><i className="fa-regular fa-trash-can"></i></button>
                </div>
                </th>
            </tr>
          ))}
       
        </tbody>
    </table>
</div>





{isModelOpen &&

<div className="flex overflow-y-auto overflow-x-hidden  bg-gray-800/85 z-100 fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-neutral-primary-soft border border-default rounded-base shadow-sm p-4 md:p-6">
            <div className="flex items-center justify-between border-b border-default pb-4 md:pb-5">
                <h3 className="text-lg font-medium text-heading">
                {isEdit?"Edit subcategory":"Create new subcategory"}
                </h3>
                <button onClick={closeModel} type="button" className="text-body bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base text-sm w-9 h-9 ms-auto inline-flex justify-center items-center" data-modal-hide="crud-modal">
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6"/></svg>
                    <span  className="sr-only">Close modal</span>
                </button>
            </div>
            <form onSubmit={handleSubmit(submit)}>    
                    <div className="col-span-2 mt-4">
                        <label htmlFor="name" className="block mb-2.5 text-sm font-medium text-heading">SubCategory Name</label>
                        <input {...register("name")} type="text" name="name" id="name" className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="Type subcategory name" />
                        {formState.errors.name &&<p className="text-sm text-red-500">{formState.errors.name.message}</p>}
                    </div>


                    <label for="default" class="block mb-2.5 text-sm font-medium text-heading mt-4">Select Category</label>
                       <select {...register("category")} id="default" class="block w-full px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body mb-4">
                           <option selected>Choose a Category</option>
                           { categories.map((category)=>(<option value={category._id}>{category.name}</option>))} 
                           {formState.errors.category &&<p className="text-sm text-red-500">{formState.errors.category.message}</p>}          
                          </select>   
                 

                <div className="flex items-center space-x-4 border-t border-default pt-4 md:pt-6">    
                   <button type="submit" className="text-white bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-700 hover:bg-gradient-to-br focus:outline-none shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5 cursor-pointer block mx-auto cursor-pointer">{isEdit?"Edit subcategory":"Add new subcategory"}</button>
                </div>
            </form>
        </div>
    </div>
</div> 
}
  </>
}