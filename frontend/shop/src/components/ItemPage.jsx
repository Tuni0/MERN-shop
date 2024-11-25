import React, { useEffect, useState, useContext } from "react";
import { ThemeContext } from "../App.jsx";
import { BasketContext } from "../App.jsx"; // Import BasketContext
import { color, motion } from "motion/react";
import axios from "axios";
import { StarIcon } from "@heroicons/react/24/outline";
import { Radio, RadioGroup } from "@headlessui/react";
import { UserLoginContext } from "../App.jsx";

const reviews = { href: "#", average: 4, totalCount: 117 };

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const colors = [
  { name: "white", class: "bg-white", selectedClass: "ring-gray-400" },
  { name: "black", class: "bg-black", selectedClass: "ring-gray-400" },
  { name: "grey", class: "bg-gray-400", selectedClass: "ring-gray-400" },
  { name: "blue", class: "bg-blue-400", selectedClass: "ring-gray-400" },
  { name: "green", class: "bg-green-400", selectedClass: "ring-gray-400" },
  { name: "red", class: "bg-red-400", selectedClass: "ring-gray-400" },
  { name: "yellow", class: "bg-yellow-400", selectedClass: "ring-gray-400" },
  { name: "purple", class: "bg-purple-400", selectedClass: "ring-gray-400" },
];

const sizes = [
  { name: "xxs", inStock: false },
  { name: "xs", inStock: true },
  { name: "s", inStock: true },
  { name: "m", inStock: true },
  { name: "l", inStock: true },
  { name: "xxl", inStock: true },
  { name: "xxxl", inStock: true },
];
function ItemPage() {
  const { theme } = useContext(ThemeContext);
  const { setIsBasket } = useContext(BasketContext); // Use BasketContext
  const [products, setProducts] = useState([]);
  const [selectedColor, setSelectedColor] = useState();
  const [selectedSize, setSelectedSize] = useState();
  const { user } = useContext(UserLoginContext); // Ensure setUser is defined
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const number = window.location.pathname.split("/")[2];
    axios
      .get(`http://localhost:3006/products/${number}`)
      .then((result) => {
        console.log(result.data[0]);
        setProducts(result.data[0]);
        console.log(products);
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const number = window.location.pathname.split("/")[2];
    if (selectedColor === undefined || selectedSize === undefined) {
      alert("Please select a color and a size");
      return;
    }
    axios
      .post(`http://localhost:3006/products/${number}/basket`, {
        selectedColor,
        selectedSize,
      })
      .then((result) => {
        console.log(result.data[0]);
        setIsBasket(true); // Update BasketContext
        console.log(products);
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  };

  return (
    <div
      className={`bg-white dark:bg-neutral-900 ${
        theme === "dark" ? "dark" : ""
      } `}
    >
      <div className="mx-auto  px-4 py-16 sm:px-6 sm:py-24  lg:px-8 flex w-full ">
        <h2 className="sr-only">Products</h2>

        <div className="inline-block lg:flex lg:flex-1 lg:flex-row ">
          <div className="">
            <img
              alt={products.img_alt}
              src={products.img_src}
              className="aspect-square max-w-screen-md rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
            />
          </div>
          <div className="flex flex-col mt-12 lg:mt-0">
            <div className=" p-8 px-24 ">
              <p className=" text-justify dark:text-white">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
              </p>
            </div>
            <div className="flex flex-col p-8 px-24 ">
              {/* Reviews */}
              <div className="mt-6">
                <h3 className="sr-only">Reviews</h3>
                <div className="flex items-center">
                  <div className="flex items-center ">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        aria-hidden="true"
                        className={classNames(
                          reviews.average > rating
                            ? "text-gray-900 dark:text-gray-200"
                            : "text-gray-200 dark:text-gray-600",
                          "size-5 shrink-0"
                        )}
                      />
                    ))}
                  </div>
                  <p className="sr-only">{reviews.average} out of 5 stars</p>
                  <a
                    href={reviews.href}
                    className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    {reviews.totalCount} reviews
                  </a>
                </div>
              </div>

              <form className="mt-10" onSubmit={(e) => handleSubmit(e)}>
                {/* Colors */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 text-left">
                    Color
                  </h3>

                  <fieldset aria-label="Choose a color" className="mt-4">
                    <RadioGroup
                      value={selectedColor}
                      onChange={setSelectedColor}
                      className="flex items-center space-x-3"
                    >
                      {colors.map((color) => (
                        <Radio
                          key={color.name}
                          value={color}
                          aria-label={color.name}
                          className={classNames(
                            color.selectedClass,
                            "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none data-[checked]:ring-2 data-[focus]:data-[checked]:ring data-[focus]:data-[checked]:ring-offset-1"
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={classNames(
                              color.class,
                              "size-8 rounded-full border border-black/10"
                            )}
                          />
                        </Radio>
                      ))}
                    </RadioGroup>
                  </fieldset>
                </div>

                {/* Sizes */}
                <div className="mt-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">Size</h3>
                    <a
                      href="#"
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Size guide
                    </a>
                  </div>

                  <fieldset aria-label="Choose a size" className="mt-4">
                    <RadioGroup
                      value={selectedSize}
                      onChange={setSelectedSize}
                      className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4"
                    >
                      {sizes.map((size) => (
                        <Radio
                          key={size.name}
                          value={size}
                          disabled={!size.inStock}
                          className={classNames(
                            size.inStock
                              ? "cursor-pointer bg-white dark:bg-neutral-900 text-gray-900 shadow-sm"
                              : "cursor-not-allowed bg-gray-50 dark:bg-neutral-800 text-gray-200",
                            "group relative flex items-center justify-center rounded-md border px-4 py-3 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none data-[focus]:ring-2 data-[focus]:ring-indigo-500 sm:flex-1 sm:py-6 dark:text-white dark:hover:bg-neutral-800 dark:focus:ring-neutral-800"
                          )}
                        >
                          <span>{size.name}</span>
                          {size.inStock ? (
                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute -inset-px rounded-md border-2 border-transparent group-data-[focus]:border group-data-[checked]:border-indigo-500"
                            />
                          ) : (
                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200"
                            >
                              <svg
                                stroke="currentColor"
                                viewBox="0 0 100 100"
                                preserveAspectRatio="none"
                                className="absolute inset-0 size-full stroke-2 text-gray-200"
                              >
                                <line
                                  x1={0}
                                  x2={100}
                                  y1={100}
                                  y2={0}
                                  vectorEffect="non-scaling-stroke"
                                />
                              </svg>
                            </span>
                          )}
                        </Radio>
                      ))}
                    </RadioGroup>
                  </fieldset>
                </div>

                <button
                  type="submit"
                  className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-violet-600 px-8 py-3 text-base font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                >
                  Add to basket
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ItemPage;
