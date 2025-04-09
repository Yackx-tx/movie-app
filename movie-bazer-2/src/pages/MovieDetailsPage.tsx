"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Play, Star, Clock, Calendar } from "lucide-react"
import { fetchMovieDetails, fetchMovieVideos, getImageUrl, type Movie, type Video } from "../services/api"
import LoadingSpinner from "../components/LoadingSpinner"
import TrailerModal from "../components/TrailerModal"

const MovieDetailsPage = () => {
  const { id } = useParams<{ id: string }>()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showTrailer, setShowTrailer] = useState(false)
  const [selectedTrailerId, setSelectedTrailerId] = useState<string | null>(null)

  useEffect(() => {
    const loadMovieData = async () => {
      if (!id) return

      setLoading(true)
      setError(null)

      try {
        // Fetch movie details
        const movieData = await fetchMovieDetails(id)
        setMovie(movieData)

        // Fetch movie videos
        const videosData = await fetchMovieVideos(id)
        setVideos(videosData)
      } catch (err) {
        setError("Failed to load movie details. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadMovieData()
    // Scroll to top when navigating to this page
    window.scrollTo(0, 0)
  }, [id])

  const openTrailer = (videoId: string) => {
    setSelectedTrailerId(videoId)
    setShowTrailer(true)
  }

  const closeTrailer = () => {
    setShowTrailer(false)
  }

  const getTrailer = () => {
    // First look for official trailers
    const officialTrailer = videos.find(
      (video) => video.type === "Trailer" && video.official && video.site === "YouTube",
    )

    // If no official trailer, look for any trailer
    const anyTrailer = videos.find((video) => video.type === "Trailer" && video.site === "YouTube")

    // If no trailer at all, look for any video
    const anyVideo = videos.find((video) => video.site === "YouTube")

    return officialTrailer || anyTrailer || anyVideo
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <LoadingSpinner />
        <p className="mt-4 text-gray-400">Loading movie details...</p>
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="bg-gray-900 rounded-lg p-8 max-w-2xl mx-auto text-center my-12">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
        <p className="text-gray-300 mb-6">{error || "Movie not found"}</p>
        <Link
          to="/"
          className="inline-block bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md transition-colors duration-200"
        >
          Back to Home
        </Link>
      </div>
    )
  }

  const trailer = getTrailer()

  return (
    <div className="relative">
      {/* Backdrop Image */}
      <div
        className="absolute top-0 left-0 right-0 h-[500px] -mx-4 z-0"
        style={{
          backgroundImage: movie.backdrop_path ? `url(${getImageUrl(movie.backdrop_path, "original")})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          {/* Poster and Trailer Button */}
          <div className="md:sticky md:top-24 self-start">
            <div className="rounded-lg overflow-hidden shadow-2xl">
              <img
                src={getImageUrl(movie.poster_path, "w500") || "/placeholder.svg?height=750&width=500"}
                alt={`${movie.title} poster`}
                className="w-full"
              />
            </div>

            {trailer && (
              <button
                className="w-full mt-4 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-md font-medium transition-colors duration-200"
                onClick={() => openTrailer(trailer.key)}
              >
                <Play size={20} />
                <span>Watch Trailer</span>
              </button>
            )}
          </div>

          {/* Movie Info */}
          <div className="text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{movie.title}</h1>

            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
              {movie.release_date && (
                <div className="flex items-center text-gray-300">
                  <Calendar size={16} className="mr-1" />
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                </div>
              )}

              {movie.runtime && (
                <div className="flex items-center text-gray-300">
                  <Clock size={16} className="mr-1" />
                  <span>
                    {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                  </span>
                </div>
              )}

              <div className="flex items-center">
                <Star size={16} className="text-yellow-500 mr-1" />
                <span>{movie.vote_average.toFixed(1)}</span>
              </div>
            </div>

            {movie.genres && (
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map((genre) => (
                  <span key={genre.id} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-2">Overview</h3>
              <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
            </div>

            {videos.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Videos</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {videos.slice(0, 4).map((video) => (
                    <div
                      key={video.id}
                      className="relative rounded-lg overflow-hidden cursor-pointer group"
                      onClick={() => openTrailer(video.key)}
                    >
                      <img
                        src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                        alt={video.name}
                        className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Play size={40} className="text-red-600" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black p-2">
                        <p className="text-white text-sm truncate">{video.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Link
              to="/"
              className="inline-block bg-gray-800 hover:bg-gray-700 text-white px-5 py-2 rounded-md transition-colors duration-200"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      {showTrailer && selectedTrailerId && <TrailerModal trailerId={selectedTrailerId} onClose={closeTrailer} />}
    </div>
  )
}

export default MovieDetailsPage

