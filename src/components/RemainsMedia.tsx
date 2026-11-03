import type { SyntheticEvent } from 'react'
import Image from 'react-bootstrap/Image'
import { DEFAULT_REMAIN_IMAGE, DEFAULT_REMAIN_VIDEO } from '../modules/remains'

interface RemainsImageProps {
  imageUrl: string
  title: string
  className?: string
}

export function RemainsImage({ imageUrl, title, className }: RemainsImageProps) {
  function handleImageError(event: SyntheticEvent<HTMLImageElement>) {
    const image = event.currentTarget
    if (image.getAttribute('src') !== DEFAULT_REMAIN_IMAGE) {
      image.src = DEFAULT_REMAIN_IMAGE
    }
  }

  return (
    <Image
      className={className}
      src={imageUrl.trim() || DEFAULT_REMAIN_IMAGE}
      alt={title}
      onError={handleImageError}
    />
  )
}

interface RemainsVideoProps {
  videoUrl: string
  title: string
}

export function RemainsVideo({ videoUrl, title }: RemainsVideoProps) {
  function handleVideoError(event: SyntheticEvent<HTMLVideoElement>) {
    const video = event.currentTarget
    if (video.getAttribute('src') !== DEFAULT_REMAIN_VIDEO) {
      video.src = DEFAULT_REMAIN_VIDEO
      video.load()
    }
  }

  return (
    <video
      key={videoUrl}
      className="remains-video"
      src={videoUrl.trim() || DEFAULT_REMAIN_VIDEO}
      aria-label={`Видео образца: ${title}`}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      onError={handleVideoError}
    />
  )
}
