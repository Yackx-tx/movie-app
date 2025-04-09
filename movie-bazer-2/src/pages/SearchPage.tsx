"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { searchMovies, type Movie } from "../services/api"
import MediaGrid from "../components/MediaGrid"
import MovieCard from "../components/MovieCard"
import LoadingSpinner from "../components/LoadingSpinner"

const SearchPage = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get("query") || ""

  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalResults, setTotalResults] = useState(0)

  useEffect(() => {
    if (!query) return

    const performSearch = async () => {
      setLoading(true)
      try {
        const data = await searchMovies(query, page)
        setMovies((prev) => (page === 1 ? data.results : [...prev, ...data.results]))
        setTotalPages(data.total_pages)
        setTotalResults(data.total_results)
      } catch (error) {
        console.error("Search failed:", error)
      } finally {
        setLoading(false)
      }
    }

    performSearch()
  }, [query, page])

  // Reset page when query changes
  useEffect(() => {
    setPage(1)
    setMovies([])
  }, [query])

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1)
    }
  }

  if (!query) {
    return (
      <div className="py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">Search Movies</h1>
          <p className="text-gray-400">Use the search bar above to find movies</p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Search Results</h1>
        <p className="text-gray-400">
          {totalResults > 0
            ? `Found ${totalResults} results for "${query}"`
            : loading
              ? "Searching..."
              : `No results found for "${query}"`}
        </p>
      </div>

      {loading && movies.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <LoadingSpinner />
          <p className="mt-4 text-gray-400">Searching for movies...</p>
        </div>
      ) : (
        <>
          <MediaGrid>
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </MediaGrid>

          {movies.length === 0 && !loading && (
            <div className="bg-gray-900 rounded-lg p-8 text-center my-12">
              <p className="text-gray-300 mb-2">No movies found matching your search.</p>
              <p className="text-gray-400">Try different keywords or check for typos.</p>
            </div>
          )}

          {page < totalPages && (
            <div className="flex justify-center mt-8 mb-12">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className={`
                  px-6 py-3 rounded-md font-medium
                  ${
                    loading
                      ? "bg-gray-700 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700 transition-colors duration-200"
                  }
                  text-white
                `}
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default SearchPage

