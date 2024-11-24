import { useState } from "react";
import Logo from "../assets/logo.png";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const products = ["Product A", "Product B", "Product C"]; // Replace with your actual products
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleProductSelect = (product: string) => {
    setSelectedProduct(product);
    setDropdownOpen(false);
  };
  return (
    <div>
      <div className="bg-white">
        <div className="flex-col flex">
          <div className="w-full border-b-2 border-gray-200">
            <div className="bg-white h-16 justify-between items-center mx-auto px-4 flex">
              {/* Logo */}
              <div>
                <img src={Logo} className="block h-16 w-auto" alt="Logo" />
              </div>
              {/* Responsive Search Box */}
              <div className="relative flex-1 lg:ml-40 mx-4">
                <p className="pl-3 items-center flex absolute inset-y-0 left-0 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </p>
                <input
                  placeholder="Type to search"
                  type="search"
                  className="border border-gray-300 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm w-full rounded-lg py-2 pl-10 pr-3
                  sm:w-48 md:w-64 lg:w-80 xl:w-[30rem] transition-all"
                />
              </div>

              {/* project switcher */}
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="bg-gray-100 border border-gray-300 text-sm text-gray-700 rounded-lg px-3 py-1 flex items-center space-x-2 hover:bg-gray-200 transition"
                >
                  <span>{selectedProduct}</span>
                  <svg
                    className={`w-4 h-4 transform transition ${
                      dropdownOpen ? "rotate-180" : "rotate-0"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg border border-gray-200 z-50">
                    {products.map((product) => (
                      <p
                        key={product}
                        onClick={() => handleProductSelect(product)}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        {product}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              {/* Add Project Button */}
              <button
                onClick={() => console.log("Add Project")}
                className="text-indigo-600 text-sm flex items-center space-x-1 hover:text-indigo-700 transition ml-2"
              >
                <svg
                  className="w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>

              {/* Icons and User Info */}
              <div className="md:space-x-6 justify-end items-center ml-auto flex space-x-3 ml-2">
                {/* Notifications */}
                <div className="relative">
                  <p
                    className="pt-1 pr-1 pb-1 pl-1 bg-white text-gray-700 rounded-full transition-all duration-200
                hover:text-gray-900 focus:outline-none hover:bg-gray-100"
                  >
                    <span className="justify-center items-center flex">
                      <svg
                        className="w-6 h-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                    </span>
                  </p>
                  <p
                    className="px-1.5 py-0.5 font-semibold text-xs items-center bg-indigo-600 text-white rounded-full inline-flex
                absolute -top-px -right-1"
                  >
                    2
                  </p>
                </div>

                {/* User Info */}
                <div className="justify-center items-center flex relative">
                  <img
                    src="https://static01.nyt.com/images/2019/11/08/world/08quebec/08quebec-superJumbo.jpg"
                    className="object-cover h-9 w-9 rounded-full mr-2 bg-gray-300"
                    alt="User Avatar"
                  />
                  <p className="font-semibold text-sm">Marrie Currie</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
