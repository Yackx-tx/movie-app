import { Link } from "react-router-dom"
import { Star } from "lucide-react"
import { type Movie, getImageUrl } from "../services/api"

interface MovieCardProps {
  movie: Movie
}

const MovieCard = ({ movie }: MovieCardProps) => {
  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-red-900/30 transition-all duration-300 hover:-translate-y-1 h-full">
      <Link to={`/movie/${movie.id}`} className="block h-full">
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={getImageUrl(movie.poster_path) || "/placeholder.svg?height=400&width=300"}
            alt={`${movie.title} poster`}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-2 right-2 flex items-center bg-black/70 text-white px-2 py-1 rounded-md text-sm">
            <Star size={14} className="text-yellow-500 mr-1" />
            <span>{movie.vote_average.toFixed(1)}</span>
          </div>
        </div>
        <div className="p-3">
          <h3 className="font-medium text-white truncate">{movie.title}</h3>
          <p className="text-gray-400 text-sm mt-1">
            {movie.release_date ? new Date(movie.release_date).getFullYear() : "Unknown"}
          </p>
        </div>
      </Link>
    </div>
  )
}

export default MovieCard

