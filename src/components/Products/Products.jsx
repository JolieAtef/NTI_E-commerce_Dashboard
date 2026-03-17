import React, { useEffect, useState } from "react";
import style from "./Products.module.css"
import { initFlowbite } from "flowbite";
import axios from "axios";
import { useForm } from "react-hook-form";
import {z} from "zod"
import { zodResolver } from "@hookform/resolvers/zod";

const schema= z.object({
  title:z.string().min(3,"title must be at least 3 character").max(30,"title must be at most 30 character"),
  price:z.number(),
  description:z.string().min(5,"description must be at least 5 character"),
  stock:z.number(),
  category:z.string().regex(/^[0-9a-fA-F]{24}$/),
  subCategory:z.string().regex(/^[0-9a-fA-F]{24}$/),
  brand:z.string().regex(/^[0-9a-fA-F]{24}$/),
  imageCover:z.string().optional(),
  images:z.array(z.string()).optional()
  
})

export function Products() {
  let[products , setProducts]=useState([])
  let[categories , setCategories]=useState([])
  let[subCategories , setSubCategories]=useState([])
  let[brands , setBrands]=useState([])
  let[isModelOpen , setIsModelOpen]= useState(false)
  let[isEdit , setIsEdit]= useState(false)
  let[currentProduct ,setCurrentProduct]=useState({})

  let{ register , handleSubmit , formState ,setValue ,reset}= useForm({
    defaultValues:{
      title:"",
      price:0,
      description:"",
      stock:0,
     category:"",
     subCategory:"",
     brand:"",
    imageCover:"",
    images:[""]
    },resolver: zodResolver(schema)
  })

  useEffect(()=>{
    fetchProducts()
    fetchCategories()
    fetchSubCategories()
    fetchBrands()
    initFlowbite()
  },[])

  function fetchProducts(){
    axios.get("https://nti-ecommerce.vercel.app/api/v1/products",{
      headers:localStorage.getItem("token")
    }).then((res)=>{
     setProducts(res.data.Products)
    }).catch((err)=>{
      console.log(err)
    })
} 

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

function fetchBrands(){
  axios.get("https://nti-ecommerce.vercel.app/api/v1/brands",{
    headers:localStorage.getItem("token")
  }).then((res)=>{
   setBrands(res.data.brands)
  }).catch((err)=>{
    console.log(err)
  })
} 

  function openModel(product){
       setIsModelOpen(true)
       if(product){
          setIsEdit(true)
          setCurrentProduct(product)
          setValue("title",product.title)
          //set rest
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
     formData.append("title",data.title)
     formData.append("price",data.price)
     formData.append("description",data.description)
     formData.append("stock",data.stock)
     formData.append("category",data.category)
     formData.append("subCategory",data.subCategory)
     formData.append("brand",data.brand)
     if(data.imageCover && data.imageCover[0]){
      formData.append("imageCover", data.image[0])
     }
     if(data.images && data.images.length > 0){
      for (let i = 0; i < data.images.length; i++) {
        formData.append("images", data.images[i]);
      }
     }
     
     if(isEdit){
      axios.put(`https://nti-ecommerce.vercel.app/api/v1/products/${currentCategory._id}`,formData).then((res=>{
         console.log(res.data)
         fetchProducts()
      })).catch((err)=>{
        console.log(err)
      }).finally(
        reset(),
        closeModel(),
      )
     }else{
       axios.post("https://nti-ecommerce.vercel.app/api/v1/products",formData).then((res=>{
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

  function deleteProduct(id){
    axios.delete(`https://nti-ecommerce.vercel.app/api/v1/products/${id}`).then((res=>{
      console.log(res.data)
      fetchCategories()
   })).catch((err)=>{
     console.log(err)
   })
 }

  return <>

    <div className="heading flex  flex-col md:flex-row gap-5 justify-between items-center p-5">
      <h2 className="text-3xl font-semibold ">Products Management</h2>
      <button onClick={()=>openModel(null)} type="button" className="text-white bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-700 hover:bg-gradient-to-br focus:outline-none shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5 cursor-pointer"><i className="fa-solid fa-plus mr-1.5"></i>Add Product</button>
    </div>
    

<div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default m-5">
    <table className="w-full text-sm text-left rtl:text-right text-body shadow">
        <thead className="text-md text-body bg-gray-100 border-b border-default-medium ">
            <tr>
               <th scope="col" className="px-6 py-3 font-medium ">
                    Product Image
                </th>
                <th scope="col" className="px-6 py-3 font-medium ">
                    Title
                </th>
                <th scope="col" className="px-6 py-3 font-medium ">
                   Description
                </th>
                <th scope="col" className="px-6 py-3 font-medium ">
                    Price
                </th>
                <th scope="col" className="px-6 py-3 font-medium ">
                    Stock
                </th>
                <th scope="col" className="px-6 py-3 font-medium ">
                 Category
                </th>
                <th scope="col" className="px-6 py-3 font-medium ">
                 SubCategory
                </th>
                <th scope="col" className="px-6 py-3 font-medium ">
                 Brand
                </th>
                
                <th scope="col" className="px-6 py-3 font-medium">         
                </th>
            </tr>
        </thead>
        <tbody>
          {products.map((product)=>
            <tr className="bg-neutral-primary-soft border-b border-default hover:bg-neutral-secondary-medium  group" key={product._id}>
                <th className="px-6 py-4">
                    <img className="w-45 h-35 rounded" src={product.imageCover}></img>
                </th>
                <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                    {product.title}
                </th>
                <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                    {product.description}
                </th>
                <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                    {product.price}
                </th>
                <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                    {product.stock}
                </th>
                <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                {categories.find((category)=>category._id==product.category)?.name}
                </th>
                <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                {subCategories.find((subCategory)=>subCategory._id==product.subCategory)?.name}
                </th>
                <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                 {brands.find((brand)=>brand._id==product.brand)?.name}
                </th>
                <th className="px-6 py-4">
               <div className="btns flex gap-3.5 transition-all duration-200">
                <button onClick={()=>openModel(product)} type="button" className="text-body bg-neutral-primary-soft border border-default hover:bg-neutral-secondary-medium hover:text-cyan-600 hover:shadow-cyan-600/60  hover:-translate-y-1 transition-all duration-300 focus:ring-4 focus:ring-neutral-tertiary-soft shadow  leading-5 rounded-full text-xl p-3 focus:outline-none cursor-pointer"><i className="fa-regular fa-pen-to-square"></i></button>
                <button onClick={()=>deleteProduct(product._id)} type="button" className="text-body bg-neutral-primary-soft border border-default hover:bg-neutral-secondary-medium hover:text-red-600 hover:shadow-red-600/60 hover:-translate-y-1 transition-all duration-300 focus:ring-4 focus:ring-neutral-tertiary-soft shadow  leading-5 rounded-full text-xl p-3 focus:outline-none cursor-pointer"><i className="fa-regular fa-trash-can"></i></button>
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
        <div className="relative bg-neutral-primary-soft border border-default rounded-base shadow-sm p-4 md:p-6 ">
            <div className="flex items-center justify-between border-b border-default pb-4 md:pb-5 "  >
                <h3 className="text-lg font-medium text-heading">
                {isEdit?"Edit product":"Create new product"}
                </h3>
                <button onClick={closeModel} type="button" className="text-body bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base text-sm w-9 h-9 ms-auto inline-flex justify-center items-center" data-modal-hide="crud-modal">
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6"/></svg>
                    <span  className="sr-only">Close modal</span>
                </button>
            </div>
            <form onSubmit={handleSubmit(submit)}> 

            <div class="grid gap-4 grid-cols-2 py-4 md:py-6">
                    <div class="col-span-2">
                        <label for="name" class="block mb-2.5 text-sm font-medium text-heading">Name</label>
                        <input type="text" name="name" id="name" class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="Type product Title" />
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="price" class="block mb-2.5 text-sm font-medium text-heading">Price</label>
                        <input type="number" name="price" id="price" class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="$2999" />
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="category" class="block mb-2.5 text-sm font-medium text-heading">Category</label>
                        <select id="category" class="block w-full px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand px-3 py-2.5 shadow-xs placeholder:text-body">
                            <option selected="">Select category</option>
                            {categories.map((category)=><option value={category._id}>{category.name}</option>)}         
                        </select>
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="category" class="block mb-2.5 text-sm font-medium text-heading">SubCategory</label>
                        <select id="category" class="block w-full px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand px-3 py-2.5 shadow-xs placeholder:text-body">
                            <option selected="">Select subCategory</option>
                           {subCategories.map((subCategory)=><option value={subCategory._id}>{subCategory.name}</option>)}         
                        </select>
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label for="category" class="block mb-2.5 text-sm font-medium text-heading">Brand</label>
                        <select id="category" class="block w-full px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand px-3 py-2.5 shadow-xs placeholder:text-body">
                            <option selected="">Select brand</option>
                           {brands.map((brand)=><option value={brand._id}>{brand.name}</option>)}         
                        </select>
                    </div>
                    <div class="col-span-2">
                        <label for="description" class="block mb-2.5 text-sm font-medium text-heading">Product Description</label>
                        <textarea id="description" rows="4" class="block bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full p-3.5 shadow-xs placeholder:text-body" placeholder="Write product description here"></textarea>                    
                    </div>
                    <div class="col-span-2">
                        <label for="description" class="block mb-2.5 text-sm font-medium text-heading">Product Description</label>
                        <textarea id="description" rows="4" class="block bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full p-3.5 shadow-xs placeholder:text-body" placeholder="Write product description here"></textarea>                    
                    </div>

                </div>
                    <label  class="block mb-2.5 text-sm font-medium text-heading">Cover Image</label>
                    <div className="flex items-center justify-center w-full my-4 ">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 bg-neutral-secondary-medium border border-dashed border-default-strong rounded-base cursor-pointer hover:bg-neutral-tertiary-medium">
                    <div className="flex flex-col items-center justify-center text-body pt-5 pb-6">
                    <svg className="w-8 h-8 mb-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h3a3 3 0 0 0 0-6h-.025a5.56 5.56 0 0 0 .025-.5A5.5 5.5 0 0 0 7.207 9.021C7.137 9.017 7.071 9 7 9a4 4 0 1 0 0 8h2.167M12 19v-9m0 0-2 2m2-2 2 2"/></svg>
                    <p className="mb-2 text-sm"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                  </div>
                  <input {...register("imageCover")} id="dropzone-file" type="file" className="hidden" />
                  {formState.errors.image &&<p className="text-sm text-red-500">{formState.errors.image.message}</p>}
                 </label>
                </div>

                <div class="flex items-center space-x-4 border-t border-default pt-4 md:pt-6">
                <div className="flex items-center space-x-4 border-t border-default pt-4 md:pt-6">    
                   <button type="submit" className="text-white bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-700 hover:bg-gradient-to-br focus:outline-none shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5 cursor-pointer block mx-auto cursor-pointer">{isEdit?"Edit product":"Add new product"}</button>
                </div>
                </div>

            </form>
        </div>
    </div>
</div> 

}
  </>
}