"use client"

import { useState, useEffect } from "react"
import { fetchPopularMovies, fetchTopRatedMovies, type Movie } from "../services/api"
import MediaGrid from "../components/MediaGrid"
import MovieCard from "../components/MovieCard"
import HeroSection from "../components/HeroSection"

const HomePage = () => {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([])
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([])
  const [loadingPopular, setLoadingPopular] = useState(true)
  const [loadingTopRated, setLoadingTopRated] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    const loadMovies = async () => {
      try {
        // Load popular movies
        setLoadingPopular(true)
        const popularData = await fetchPopularMovies(page)
        setPopularMovies((prev) => (page === 1 ? popularData.results : [...prev, ...popularData.results]))
        setTotalPages(popularData.total_pages)
        setLoadingPopular(false)

        // Load top rated movies
        setLoadingTopRated(true)
        const topRatedData = await fetchTopRatedMovies(1)
        setTopRatedMovies(topRatedData.results.slice(0, 10))
        setLoadingTopRated(false)
      } catch (error) {
        console.error("Failed to load movies:", error)
        setLoadingPopular(false)
        setLoadingTopRated(false)
      }
    }

    loadMovies()
  }, [page])

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1)
    }
  }

  return (
    <div>
      {popularMovies.length > 0 && <HeroSection movie={popularMovies[0]} />}

      <section className="mb-12">
        <MediaGrid loading={loadingTopRated} title="Top Rated Movies">
          {topRatedMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </MediaGrid>
      </section>

      <section>
        <MediaGrid loading={loadingPopular && page === 1} title="Popular Movies">
          {popularMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </MediaGrid>

        {page < totalPages && (
          <div className="flex justify-center mt-8 mb-12">
            <button
              onClick={handleLoadMore}
              disabled={loadingPopular}
              className={`
                px-6 py-3 rounded-md font-medium
                ${
                  loadingPopular
                    ? "bg-gray-700 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 transition-colors duration-200"
                }
                text-white
              `}
            >
              {loadingPopular ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

export default HomePage

