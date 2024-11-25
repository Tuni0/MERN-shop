import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { ThemeContext } from "../App.jsx";
import { color, motion } from "motion/react";
import cat from "../assets/cat.jpeg";
import axios from "axios";

const colors = [
  { name: "white", color: "White" },
  { name: "black", color: "Black" },
  { name: "grey", color: "Grey" },
  { name: "blue", color: "Blue" },
  { name: "green", color: "Green" },
  { name: "red", color: "Red" },
  { name: "yellow", color: "Yellow" },
  { name: "purple", color: "Purple" },
];

const sizes = [
  { key: 1, size: "xxs" },
  { key: 2, size: "xs" },
  { key: 3, size: "s" },
  { key: 4, size: "m" },
  { key: 5, size: "l" },
  { key: 6, size: "xl" },
  { key: 7, size: "xxl" },
  { key: 8, size: "xxxl" },
];

function Products() {
  const { theme } = useContext(ThemeContext);
  const [products, setProducts] = useState([]);

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios
      .get("http://localhost:3006/products")
      .then((result) => {
        console.log(result.data);
        setProducts(result.data);
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  }, []);

  return (
    <div className="bg-white">
      <div className="mx-auto  px-4 py-16 sm:px-6 sm:py-24  lg:px-8 flex w-full ">
        <h2 className="sr-only">Products</h2>
        <div className="flex flex-1 flex-col">
          <div className="">
            <div className="mt-10 space-y-10">
              <fieldset className=" pr-8">
                <legend className="text-sm font-semibold text-gray-900 text-start">
                  Color
                </legend>
                <div className="mt-6 space-y-2">
                  {colors.map((color) => (
                    <div key={color.name} className="relative flex gap-x-3 ">
                      <div className="relative flex gap-x-3 ">
                        <input
                          id={color.name}
                          name={color.name}
                          type="checkbox"
                          className="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>

                      <div className="text-sm/6 ">
                        <label htmlFor={color.name} className=" text-gray-500">
                          {color.color}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </fieldset>
              <hr></hr>
            </div>
          </div>

          <div className="">
            <div className="mt-10 space-y-10">
              <fieldset className=" pr-8">
                <legend className="text-sm font-semibold text-gray-900 text-start">
                  Size
                </legend>
                <div className="mt-6 space-y-2">
                  {sizes.map((size) => (
                    <div key={size.key} className="relative flex gap-x-3 ">
                      <div className="relative flex gap-x-3 ">
                        <input
                          id={size.key}
                          name={size.size}
                          type="checkbox"
                          className="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>

                      <div className="text-sm/6 ">
                        <label htmlFor={size.size} className=" text-gray-500">
                          {size.size}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </fieldset>
              <hr></hr>
            </div>
          </div>
        </div>

        <div className="flex">
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 p-8">
            {products.map((product) => (
              <a
                key={product.idproducts}
                href={`products/${product.key}`}
                className="group"
              >
                <img
                  alt={product.img_alt}
                  src={product.img_src}
                  className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
                />
                <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
                <p className="mt-1 text-lg  text-gray-900 text-left">
                  {product.description}
                </p>
                <p className="mt-1 text-lg font-medium text-gray-900 text-left">
                  {product.price} $
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Products;
