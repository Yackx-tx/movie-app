"use client"

import { useEffect, useRef } from "react"
import { X } from "lucide-react"

interface TrailerModalProps {
  trailerId: string
  onClose: () => void
}

const TrailerModal = ({ trailerId, onClose }: TrailerModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    document.addEventListener("mousedown", handleClickOutside)

    // Disable body scroll
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.removeEventListener("mousedown", handleClickOutside)

      // Re-enable body scroll
      document.body.style.overflow = "auto"
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl" ref={modalRef}>
        <button
          className="absolute -top-12 right-0 text-white hover:text-red-500 transition-colors duration-200"
          onClick={onClose}
          aria-label="Close trailer"
        >
          <X size={28} />
        </button>
        <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg">
          <iframe
            src={`https://www.youtube.com/embed/${trailerId}?autoplay=1`}
            title="Movie Trailer"
            className="absolute top-0 left-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  )
}

export default TrailerModal

