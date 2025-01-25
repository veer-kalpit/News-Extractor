"use client";

import { useState } from "react";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";

interface NavbarProps {
  onSearchToggle: () => void; // Function to notify the parent about search toggle
}

const Navbar: React.FC<NavbarProps> = ({ onSearchToggle }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo with Badge */}
          <div className="flex-shrink-0">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => window.location.reload()} // Refresh the page
            >
              <h1 className="text-2xl font-bold text-white tracking-wide">
                NEWS{" "}
                <span className="bg-yellow-400 text-gray-900 px-2 py-1 rounded-full text-lg font-medium">
                  EXTRACTOR
                </span>
              </h1>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 text-white">
            <Link href="/profilePage">
              <p className="hover:text-yellow-400 cursor-pointer">Profile</p>
            </Link>
            <Link href="/about">
              <p className="hover:text-yellow-400 cursor-pointer">About</p>
            </Link>
            <Link href="/contact">
              <p className="hover:text-yellow-400 cursor-pointer">Contact</p>
            </Link>
            {/* Search Icon */}
            <button
              onClick={onSearchToggle}
              className="text-white hover:text-yellow-400 focus:outline-none"
            >
              <FaSearch className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              className="text-white hover:text-yellow-400 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800">
          <div className="space-y-1 px-4 pt-2 pb-3 text-white">
            <Link href="/profilePage">
              <p className="block hover:bg-gray-600 hover:text-yellow-400 px-3 py-2 rounded-md">
                Profile Page
              </p>
            </Link>
            <Link href="/about">
              <p className="block hover:bg-gray-600 hover:text-yellow-400 px-3 py-2 rounded-md">
                About
              </p>
            </Link>
            <Link href="/contact">
              <p className="block hover:bg-gray-600 hover:text-yellow-400 px-3 py-2 rounded-md">
                Contact
              </p>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
