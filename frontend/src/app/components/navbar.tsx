"use client";

import { useState } from "react";
import Link from "next/link";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/homepage">
              <p className="text-2xl font-bold tracking-wide hover:text-yellow-400">
                News Extractor
              </p>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <Link href="/profilePage">
              <p className="hover:text-yellow-400">Profile</p>
            </Link>
            <Link href="/about">
              <p className="hover:text-yellow-400">About</p>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              className="text-black hover:text-yellow-400 focus:outline-none"
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
        <div className="md:hidden">
          <div className="space-y-1 px-2 pt-2 pb-3">
            <Link href="/profilePage">
              <p className="block text-black hover:bg-gray-600 hover:text-yellow-400 px-3 py-2 rounded-md">
                Profile Page
              </p>
            </Link>
            <Link href="/about">
              <p className="block text-black hover:bg-gray-600 hover:text-yellow-400 px-3 py-2 rounded-md">
                About
              </p>
            </Link>
            <Link href="/contact">
              <p className="block text-black hover:bg-gray-600 hover:text-yellow-400 px-3 py-2 rounded-md">
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
