const API_KEY = import.meta.env.VITE_TMDB_API_KEY || "7596b34ab8046ab494321060aafbba12"
const BASE_URL = "https://api.themoviedb.org/3"

export interface Movie {
  id: number
  title: string
  poster_path: string
  backdrop_path: string
  overview: string
  release_date: string
  vote_average: number
  genres?: { id: number; name: string }[]
  runtime?: number
}

export interface Genre {
  id: number
  name: string
}

export interface Video {
  id: string
  key: string
  name: string
  site: string
  type: string
  official: boolean
}

export interface ApiResponse<T> {
  results: T[]
  page: number
  total_pages: number
  total_results: number
}

export async function fetchPopularMovies(page = 1): Promise<ApiResponse<Movie>> {
  try {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`)

    if (!response.ok) {
      throw new Error("Failed to fetch popular movies")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching popular movies:", error)
    return { results: [], page: 1, total_pages: 0, total_results: 0 }
  }
}

export async function fetchTopRatedMovies(page = 1): Promise<ApiResponse<Movie>> {
  try {
    const response = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=${page}`)

    if (!response.ok) {
      throw new Error("Failed to fetch top rated movies")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching top rated movies:", error)
    return { results: [], page: 1, total_pages: 0, total_results: 0 }
  }
}

export async function fetchMovieDetails(movieId: string): Promise<Movie | null> {
  try {
    const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`)

    if (!response.ok) {
      throw new Error("Failed to fetch movie details")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching movie details:", error)
    return null
  }
}

export async function fetchMovieVideos(movieId: string): Promise<Video[]> {
  try {
    const response = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`)

    if (!response.ok) {
      throw new Error("Failed to fetch movie videos")
    }

    const data = await response.json()
    return data.results
  } catch (error) {
    console.error("Error fetching movie videos:", error)
    return []
  }
}

export async function searchMovies(query: string, page = 1): Promise<ApiResponse<Movie>> {
  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`,
    )

    if (!response.ok) {
      throw new Error("Failed to search movies")
    }

    return await response.json()
  } catch (error) {
    console.error("Error searching movies:", error)
    return { results: [], page: 1, total_pages: 0, total_results: 0 }
  }
}

export async function fetchGenres(): Promise<Genre[]> {
  try {
    const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`)

    if (!response.ok) {
      throw new Error("Failed to fetch genres")
    }

    const data = await response.json()
    return data.genres
  } catch (error) {
    console.error("Error fetching genres:", error)
    return []
  }
}

export async function fetchMoviesByGenre(genreId: number, page = 1): Promise<ApiResponse<Movie>> {
  try {
    const response = await fetch(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&with_genres=${genreId}`,
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch movies for genre ${genreId}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching movies for genre ${genreId}:`, error)
    return { results: [], page: 1, total_pages: 0, total_results: 0 }
  }
}

export function getImageUrl(path: string, size = "w500"): string {
  if (!path) return "/placeholder.svg?height=400&width=300"
  return `https://image.tmdb.org/t/p/${size}${path}`
}

