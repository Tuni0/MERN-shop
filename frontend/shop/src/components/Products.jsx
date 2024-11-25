import React, { useEffect, useState, useMemo } from "react";
import { useContext } from "react";
import { ThemeContext } from "../App.jsx";
import { color, motion } from "motion/react";
import axios from "axios";
import { HeartIcon } from "@heroicons/react/24/outline";
import { BsBasket2 } from "react-icons/bs";
import { UserLoginContext } from "../App.jsx";
import { BasketContext } from "../App.jsx";

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
  const { user } = useContext(UserLoginContext);
  const { isBasket, setIsBasket } = useContext(BasketContext); // Use BasketContext

  const selectedColor = "white";
  const selectedSize = "m";

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios
      .get("http://localhost:3006/products")
      .then((result) => {
        console.log(result.data);
        if (JSON.stringify(result.data) !== JSON.stringify(products)) {
          setProducts(result.data);
        }
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  }, []);

  const handleHeartClick = (id) => {
    console.log("Heart clicked for product with id:", id);
  };
  const handleBasketClick = (e, id) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to add items to the basket!");
      return;
    } else {
      axios
        .post(`http://localhost:3006/products/${id}/basket`, {
          selectedColor,
          selectedSize,
        })
        .then((result) => {
          console.log(result.data[0]);
          setIsBasket(true);
        })
        .catch((err) => {
          console.log("Error:", err);
        });
    }
  };

  return (
    <div
      className={`bg-white dark:bg-neutral-900 ${
        theme === "dark" ? "dark" : ""
      } `}
    >
      <div className="mx-auto  px-4 py-16 sm:px-6 sm:py-24  lg:px-8 flex w-full ">
        <h2 className="sr-only">Products</h2>
        <div className="flex flex-1 flex-col ">
          <div className="">
            <div className="mt-10 space-y-10">
              <fieldset className=" pr-8">
                <legend className="text-sm font-semibold text-gray-900 dark:text-white text-start">
                  Color
                </legend>
                <div className="mt-6 space-y-2">
                  {colors.map((color) => (
                    <div key={color.name} className="relative flex gap-x-3 ">
                      <div className="relative flex gap-x-3 items-center">
                        <input
                          id={color.name}
                          name={color.name}
                          type="checkbox"
                          className="size-4 rounded border-gray-300 text-violet-600 focus:ring-violet-600"
                        />
                      </div>

                      <div className="text-sm/6 ">
                        <label
                          htmlFor={color.name}
                          className=" text-gray-500 dark:text-gray-200"
                        >
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
                <legend className="text-sm font-semibold text-gray-900 text-start dark:text-white">
                  Size
                </legend>
                <div className="mt-6 space-y-2">
                  {sizes.map((size) => (
                    <div
                      key={size.key}
                      className="relative flex gap-x-3 items-center"
                    >
                      <div className="relative flex gap-x-3 ">
                        <input
                          id={size.key}
                          name={size.size}
                          type="checkbox"
                          className="size-4 rounded border-gray-300 text-violet-600 focus:ring-violet-600"
                        />
                      </div>

                      <div className="text-sm/6 ">
                        <label
                          htmlFor={size.size}
                          className=" text-gray-500 dark:text-gray-200"
                        >
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
              <div key={product.idproducts} className="group">
                <div className="relative group">
                  <a href={`products/${product.idproducts}`}>
                    <img
                      alt={product.img_alt}
                      src={product.img_src}
                      className="z-0 relative aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
                    />
                  </a>
                  <button
                    className="absolute z-20 top-2 right-16 flex items-center justify-center bg-white rounded-full p-1 shadow-md hover:bg-gray-200"
                    onClick={() => handleHeartClick(product.idproducts)}
                    onMouseEnter={(e) =>
                      e.currentTarget.parentElement.classList.remove(
                        "group-hover:opacity-75"
                      )
                    }
                    onMouseLeave={(e) =>
                      e.currentTarget.parentElement.classList.add(
                        "group-hover:opacity-75"
                      )
                    }
                  >
                    <HeartIcon
                      className="h-6 w-6 text-gray-900"
                      aria-hidden="true"
                    />
                  </button>
                  <button
                    className="absolute z-20 top-2 right-2 flex items-center justify-center bg-white rounded-full p-1 shadow-md hover:bg-gray-200"
                    onClick={(e) => handleBasketClick(e, product.idproducts)}
                    onMouseEnter={(e) =>
                      e.currentTarget.parentElement.classList.remove(
                        "group-hover:opacity-75"
                      )
                    }
                    onMouseLeave={(e) =>
                      e.currentTarget.parentElement.classList.add(
                        "group-hover:opacity-75"
                      )
                    }
                  >
                    <BsBasket2
                      className="h-6 w-6 text-gray-900"
                      aria-hidden="true"
                    />
                  </button>
                </div>
                <a href={`products/${product.idproducts}`}>
                  <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
                  <p className="mt-1 text-lg text-gray-900 text-left">
                    {product.description}
                  </p>
                  <p className="mt-1 text-lg font-medium text-gray-900 text-left">
                    {product.price} $
                  </p>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Products;
