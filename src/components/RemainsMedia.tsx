import type { SyntheticEvent } from 'react'
import Image from 'react-bootstrap/Image'
import { DEFAULT_REMAIN_IMAGE, DEFAULT_REMAIN_VIDEO, proxiedRemainMedia } from '../modules/remains'

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
      src={proxiedRemainMedia(imageUrl) || DEFAULT_REMAIN_IMAGE}
      alt={title}
      onError={handleImageError}
    />
  )
}

interface RemainsVideoProps {
  videoUrl: string
  title: string
  controls?: boolean
  className?: string
}

export function RemainsVideo({ videoUrl, title, controls = false, className = 'remains-video' }: RemainsVideoProps) {
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
      className={className}
      src={proxiedRemainMedia(videoUrl) || DEFAULT_REMAIN_VIDEO}
      aria-label={`Видео образца: ${title}`}
      controls={controls}
      autoPlay={!controls}
      muted
      loop={!controls}
      playsInline
      preload={controls ? 'metadata' : 'auto'}
      onError={handleVideoError}
    />
  )
}
