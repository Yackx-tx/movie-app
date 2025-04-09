import { Link } from "react-router-dom"
import { Play } from "lucide-react"
import { type Movie, getImageUrl } from "../services/api"

interface HeroSectionProps {
  movie: Movie
}

const HeroSection = ({ movie }: HeroSectionProps) => {
  return (
    <div
      className="relative h-[70vh] min-h-[500px] mb-12 rounded-xl overflow-hidden"
      style={{
        backgroundImage: `url(${getImageUrl(movie.backdrop_path, "original")})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

      <div className="relative h-full flex flex-col justify-end p-6 md:p-12 max-w-3xl">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">{movie.title}</h1>
        <p className="text-gray-200 mb-6 line-clamp-3 text-sm md:text-base drop-shadow-md">{movie.overview}</p>
        <div className="flex flex-wrap gap-4">
          <Link
            to={`/movie/${movie.id}`}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-md font-medium transition-colors duration-200"
          >
            <Play size={20} />
            <span>Watch Trailer</span>
          </Link>
          <Link
            to={`/movie/${movie.id}`}
            className="flex items-center bg-gray-800/80 hover:bg-gray-700 text-white px-5 py-3 rounded-md font-medium transition-colors duration-200"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HeroSection

