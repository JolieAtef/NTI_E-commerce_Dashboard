import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export function ProductItem(){
    const {id} = useParams()
    const [product , setProduct]=useState({})
     let[categories , setCategories]=useState([])
     let[subCategories , setSubCategories]=useState([])
     let[brands , setBrands]=useState([])

    useEffect(()=>{
      getProductDetails()
      fetchCategories()
      fetchSubCategories()
      fetchBrands()
    },[])
  
    function getProductDetails(){
        axios.get(`https://nti-ecommerce.vercel.app/api/v1/products/${id}`).then((res)=>{
            setProduct(res.data.Product)
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
  
    return(
        <>
     <div className="max-w-6xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-8 bg-white shadow-lg rounded-2xl p-6">
             
        <div className="flex justify-center items-center">
          <img
            src={product.imageCover}
            alt={product.title}
            className="w-full max-h-[400px] object-cover rounded-xl"
          />
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-gray-800">
            {product.title}
          </h1>
          <p className="text-gray-600">
            {product.description}
          </p>
          <div className="text-xl font-semibold text-green-600">
            ${product.price}
          </div>
          <div className="text-sm text-gray-500">
            Stock:{" "}
            <span
              className={`font-medium ${
                product.stock > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mt-4">
            <p>
              <span className="font-semibold">Category:</span>{" "}
              {categories.find((category)=>category._id==product.category)?.name||"test"}
            </p>
            <p>
              <span className="font-semibold">SubCategory:</span>{" "}
              {subCategories.find((subCategory)=>subCategory._id==product.subCategory)?.name||"test"}
            </p>
            <p>
              <span className="font-semibold">Brand:</span>{" "}
              {brands.find((brand)=>brand._id==product.category)?.name||"test"}
            </p>
          </div>


        </div>
      </div>
    </div>
        </>
    )
}