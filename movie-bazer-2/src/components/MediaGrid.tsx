import type { ReactNode } from "react"
import LoadingSpinner from "./LoadingSpinner"

interface MediaGridProps {
  children: ReactNode
  loading?: boolean
  title?: string
}

const MediaGrid = ({ children, loading = false, title }: MediaGridProps) => {
  return (
    <div className="mb-10">
      {title && <h2 className="text-2xl font-bold mb-6 text-white">{title}</h2>}

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <LoadingSpinner />
          <p className="mt-4 text-gray-400">Loading movies...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">{children}</div>
      )}
    </div>
  )
}

export default MediaGrid

