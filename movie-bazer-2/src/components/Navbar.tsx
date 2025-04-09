"use client"

import type React from "react"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Search, Menu, X } from "lucide-react"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
      setIsMenuOpen(false)
    }
  }

  return (
    <header className="bg-black sticky top-0 z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-red-600">Movie Bazer</h1>
            </Link>
          </div>

          <div className="md:hidden">
            <button
              className="text-white p-2"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <nav
            className={`
            fixed md:relative top-0 right-0 md:top-auto md:right-auto
            h-full md:h-auto w-3/4 md:w-auto max-w-xs md:max-w-none
            bg-black md:bg-transparent
            transform ${isMenuOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}
            transition-transform duration-300 ease-in-out
            md:flex md:items-center md:space-x-8
            z-50 md:z-auto
            p-6 md:p-0
            flex flex-col md:flex-row
            space-y-6 md:space-y-0
          `}
          >
            {isMenuOpen && (
              <button
                className="absolute top-4 right-4 md:hidden text-white"
                onClick={toggleMenu}
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            )}

            <ul className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
              <li>
                <Link
                  to="/"
                  className="text-white hover:text-red-500 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/genres"
                  className="text-white hover:text-red-500 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Genres
                </Link>
              </li>
            </ul>

            <form
              className="mt-6 md:mt-0 flex items-center bg-gray-900 rounded-md overflow-hidden"
              onSubmit={handleSearch}
            >
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-white px-4 py-2 w-full focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Search"
                className="bg-red-600 hover:bg-red-700 text-white p-2 transition-colors duration-200"
              >
                <Search size={20} />
              </button>
            </form>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Navbar

