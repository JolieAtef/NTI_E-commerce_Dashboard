import React, { useEffect, useState } from "react";
import style from "./Categories.module.css"
import { initFlowbite } from "flowbite";
import axios from "axios";
import { useForm } from "react-hook-form";
import {z} from "zod"
import { zodResolver } from "@hookform/resolvers/zod";

const schema= z.object({
  name:z.string().min(3,"category name must be at least 3 character").max(30,"category name must be at most 30 character"),
  image:z.any().optional()
})

export function Categories() {

  let[categories , setCategories]=useState([])
  let[isModelOpen , setIsModelOpen]= useState(false)
  let[isEdit , setIsEdit]= useState(false)
  let[currentCategory ,setCurrentCategory]=useState({})

  let{ register , handleSubmit , formState ,setValue ,reset}= useForm({
    defaultValues:{
      name:"",
      image:null
    },resolver: zodResolver(schema)
  })

  useEffect(()=>{
    fetchCategories()
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

  function openModel(category){
       setIsModelOpen(true)
       if(category){
          setIsEdit(true)
          setCurrentCategory(category)
          setValue("name",category.name)
       }else{
          setIsEdit(false)
          reset()
       }
  }

  function closeModel(){
      setIsModelOpen(false)
  }

  function submit(data){

     let formData= new FormData()
     formData.append("name",data.name)
     if(data.image && data.image[0]){
      formData.append("image", data.image[0])
     }
     
     if(isEdit){
      axios.put(`https://nti-ecommerce.vercel.app/api/v1/categories/${currentCategory._id}`,formData).then((res=>{
         console.log(res.data)
         fetchCategories()
      })).catch((err)=>{
        console.log(err)
      }).finally(
        reset(),
        closeModel(),
      )
     }else{
       axios.post("https://nti-ecommerce.vercel.app/api/v1/categories",formData).then((res=>{
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

  function deleteCategory(id){
    axios.delete(`https://nti-ecommerce.vercel.app/api/v1/categories/${id}`).then((res=>{
      console.log(res.data)
      fetchCategories()
   })).catch((err)=>{
     console.log(err)
   })
 }

  return <>

    <div className="heading flex  flex-col md:flex-row gap-5 justify-between items-center p-5">
      <h2 className="text-3xl font-semibold ">Categories Management</h2>
      <button onClick={()=>openModel(null)} type="button" className="text-white bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-700 hover:bg-gradient-to-br focus:outline-none shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5 cursor-pointer"><i className="fa-solid fa-plus mr-1.5"></i>Add Category</button>
    </div>
    

<div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default m-5">
    <table className="w-full text-sm text-left rtl:text-right text-body shadow">
        <thead className="text-md text-body bg-gray-100 border-b border-default-medium ">
            <tr>
                <th scope="col" className="px-6 py-3 font-medium ">
                    Category Name
                </th>
                <th scope="col" className="px-6 py-3 font-medium ">
                    Category Image
                </th>
                <th scope="col" className="px-6 py-3 font-medium ">
                    Last Update
                </th>
                <th scope="col" className="px-6 py-3 font-medium">         
                </th>
            </tr>
        </thead>
        <tbody>
          {categories.map((category)=>
            <tr className="bg-neutral-primary-soft border-b border-default hover:bg-neutral-secondary-medium  group" key={category._id}>
                <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                    {category.name}
                </th>
                <th className="px-6 py-4">
                    <img className="w-45 h-35 rounded " src={category.image}></img>
                </th>
                <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                    {category.updatedAt.split("T")[0]}
                </th>
                <th className="px-6 py-4">
               <div className="btns flex gap-3.5 transition-all duration-200">
                <button onClick={()=>openModel(category)} type="button" className="text-body bg-neutral-primary-soft border border-default hover:bg-neutral-secondary-medium hover:text-cyan-600 hover:shadow-cyan-600/60  hover:-translate-y-1 transition-all duration-300 focus:ring-4 focus:ring-neutral-tertiary-soft shadow  leading-5 rounded-full text-xl p-3 focus:outline-none cursor-pointer"><i className="fa-regular fa-pen-to-square"></i></button>
                <button onClick={()=>deleteCategory(category._id)} type="button" className="text-body bg-neutral-primary-soft border border-default hover:bg-neutral-secondary-medium hover:text-red-600 hover:shadow-red-600/60 hover:-translate-y-1 transition-all duration-300 focus:ring-4 focus:ring-neutral-tertiary-soft shadow  leading-5 rounded-full text-xl p-3 focus:outline-none cursor-pointer"><i className="fa-regular fa-trash-can"></i></button>
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
                {isEdit?"Edit category":"Create new category"}
                </h3>
                <button onClick={closeModel} type="button" className="text-body bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base text-sm w-9 h-9 ms-auto inline-flex justify-center items-center" data-modal-hide="crud-modal">
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6"/></svg>
                    <span  className="sr-only">Close modal</span>
                </button>
            </div>
            <form onSubmit={handleSubmit(submit)}>    
                    <div className="col-span-2 mt-4">
                        <label htmlFor="name" className="block mb-2.5 text-sm font-medium text-heading">Name</label>
                        <input {...register("name")} type="text" name="name" id="name" className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="Type category name" />
                        {formState.errors.name &&<p className="text-sm text-red-500">{formState.errors.name.message}</p>}
                    </div>
                    
                  <div className="flex items-center justify-center w-full my-4 ">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 bg-neutral-secondary-medium border border-dashed border-default-strong rounded-base cursor-pointer hover:bg-neutral-tertiary-medium">
                    <div className="flex flex-col items-center justify-center text-body pt-5 pb-6">
                    <svg className="w-8 h-8 mb-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h3a3 3 0 0 0 0-6h-.025a5.56 5.56 0 0 0 .025-.5A5.5 5.5 0 0 0 7.207 9.021C7.137 9.017 7.071 9 7 9a4 4 0 1 0 0 8h2.167M12 19v-9m0 0-2 2m2-2 2 2"/></svg>
                    <p className="mb-2 text-sm"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                  </div>
                  <input {...register("image")} id="dropzone-file" type="file" className="hidden" />
                  {formState.errors.image &&<p className="text-sm text-red-500">{formState.errors.image.message}</p>}
                 </label>
                </div>

                <div className="flex items-center space-x-4 border-t border-default pt-4 md:pt-6">    
                   <button type="submit" className="text-white bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-700 hover:bg-gradient-to-br focus:outline-none shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5 cursor-pointer block mx-auto cursor-pointer">{isEdit?"Edit category":"Add new category"}</button>
                </div>
            </form>
        </div>
    </div>
</div> 

}
  </>
}