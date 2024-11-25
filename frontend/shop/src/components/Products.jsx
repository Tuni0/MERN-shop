import React from "react";
import { useContext } from "react";
import { ThemeContext } from "../App.jsx";
import { color, motion } from "motion/react";
import cat from "../assets/cat.jpeg";

const products = [
  {
    id: 1,
    name: "Product 1",
    description: "This is a description of product 1",
    imgSrc: cat,
    href: "/products/1",
    imgAlt: "This is a description of product 1",
    quantity: 10,
    price: "100$",
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is a description of product 2",
    imgSrc: cat,
    href: "/products/2",
    imgAlt: "This is a description of product 2",
    quantity: 20,
    price: "100$",
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is a description of product 3",
    imgSrc: cat,
    href: "/products/3",
    imgAlt: "This is a description of product 3",
    quantity: 30,
    price: "100$",
  },
  {
    id: 4,
    name: "Product 4",
    description: "This is a description of product 1",
    imgSrc: cat,
    href: "/products/4",
    imgAlt: "This is a description of product 4",
    quantity: 10,
    price: "100$",
  },
  {
    id: 5,
    name: "Product 5",
    description: "This is a description of product 2",
    imgSrc: cat,
    href: "/products/5",
    imgAlt: "This is a description of product 5",
    quantity: 20,
    price: "100$",
  },
  {
    id: 6,
    name: "Product 6",
    description: "This is a description of product 3",
    imgSrc: cat,
    href: "/products/6",
    imgAlt: "This is a description of product 6",
    quantity: 30,
    price: "100$",
  },
];

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

function Products() {
  const { theme } = useContext(ThemeContext);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 flex w-full ">
        <h2 className="sr-only">Products</h2>
        <div className="flex flex-1 ">
          <div className="">
            <div className="mt-10 space-y-10">
              <fieldset className=" pr-8">
                <legend className="text-sm font-semibold text-gray-900 text-start">
                  Color
                </legend>
                <div className="mt-6 space-y-2">
                  {colors.map((color) => (
                    <div className="relative flex gap-x-3 ">
                      <div className="flex h-6 items-center ">
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
        </div>

        <div className="flex">
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 p-8">
            {products.map((product) => (
              <a key={product.id} href={product.href} className="group">
                <img
                  alt={product.imgAlt}
                  src={product.imgSrc}
                  className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
                />
                <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">
                  {product.price}
                </p>
                <p className="mt-1 text-lg font-medium text-gray-900">
                  {product.quantity}
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
