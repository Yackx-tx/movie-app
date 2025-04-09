"use client"

import { useState, useEffect } from "react"
import { fetchGenres, fetchMoviesByGenre, type Genre, type Movie } from "../services/api"
import MediaGrid from "../components/MediaGrid"
import MovieCard from "../components/MovieCard"
import LoadingSpinner from "../components/LoadingSpinner"

const GenresPage = () => {
  const [genres, setGenres] = useState<Genre[]>([])
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null)
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMovies, setLoadingMovies] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    const loadGenres = async () => {
      setLoading(true)
      try {
        const genresData = await fetchGenres()
        setGenres(genresData)
        if (genresData.length > 0) {
          setSelectedGenre(genresData[0])
        }
      } catch (error) {
        console.error("Failed to load genres:", error)
      } finally {
        setLoading(false)
      }
    }

    loadGenres()
  }, [])

  useEffect(() => {
    if (!selectedGenre) return

    const loadMoviesByGenre = async () => {
      setLoadingMovies(true)
      try {
        const data = await fetchMoviesByGenre(selectedGenre.id, page)
        setMovies((prev) => (page === 1 ? data.results : [...prev, ...data.results]))
        setTotalPages(data.total_pages)
      } catch (error) {
        console.error(`Failed to load movies for genre ${selectedGenre.name}:`, error)
      } finally {
        setLoadingMovies(false)
      }
    }

    loadMoviesByGenre()
  }, [selectedGenre, page])

  const handleGenreChange = (genre: Genre) => {
    setSelectedGenre(genre)
    setPage(1)
    setMovies([])
  }

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <LoadingSpinner />
        <p className="mt-4 text-gray-400">Loading genres...</p>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse by Genre</h1>
        <p className="text-gray-400">Discover movies by your favorite genre</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {genres.map((genre) => (
          <button
            key={genre.id}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200
              ${
                selectedGenre?.id === genre.id ? "bg-red-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }
            `}
            onClick={() => handleGenreChange(genre)}
          >
            {genre.name}
          </button>
        ))}
      </div>

      {selectedGenre && (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-white">{selectedGenre.name} Movies</h2>

          {loadingMovies && movies.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              <LoadingSpinner />
              <p className="mt-4 text-gray-400">Loading movies...</p>
            </div>
          ) : (
            <>
              <MediaGrid>
                {movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </MediaGrid>

              {movies.length === 0 && !loadingMovies && (
                <div className="bg-gray-900 rounded-lg p-8 text-center my-12">
                  <p className="text-gray-300">No movies found for this genre.</p>
                </div>
              )}

              {page < totalPages && (
                <div className="flex justify-center mt-8 mb-12">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMovies}
                    className={`
                      px-6 py-3 rounded-md font-medium
                      ${
                        loadingMovies
                          ? "bg-gray-700 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700 transition-colors duration-200"
                      }
                      text-white
                    `}
                  >
                    {loadingMovies ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default GenresPage

