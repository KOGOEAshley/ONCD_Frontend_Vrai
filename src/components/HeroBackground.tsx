import { useState, useEffect } from 'react'

// ============================================================
// CONFIGURATION DU FOND DU HERO — modifiez UNIQUEMENT ce bloc
// pour changer ce qui s'affiche derrière le titre de l'accueil.
//
// 3 formats possibles :
//
// 1) Une seule image :
//    { type: 'image', url: '/bg-dentiste.jpg' }
//
// 2) Un diaporama (plusieurs images qui défilent en fondu) :
//    { type: 'slideshow', urls: ['/bg1.jpg', '/bg2.jpg', '/bg3.jpg'], intervalMs: 5000 }
//    (intervalMs est facultatif, 5000 = 5 secondes entre chaque image)
//
// 3) Une vidéo (joue en boucle, sans son, automatiquement) :
//    { type: 'video', url: '/bg-video.mp4' }
// ============================================================

export type HeroBackgroundConfig =
  | { type: 'image'; url: string }
  | { type: 'slideshow'; urls: string[]; intervalMs?: number }
  | { type: 'video'; url: string; poster?: string }

export const HERO_BACKGROUND: HeroBackgroundConfig = {
  type: 'video',
  url: '/dentiste_video.mp4',
}

function ImageFond({ url }: { url: string }) {
  return (
    <div
      className="absolute inset-0 animate-wipe-reveal-left"
      style={{
        backgroundImage: `url('${url}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  )
}

function DiaporamaFond({ urls, intervalMs = 5000 }: { urls: string[]; intervalMs?: number }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (urls.length <= 1) return
    const minuteur = setInterval(() => {
      setIndex((i) => (i + 1) % urls.length)
    }, intervalMs)
    return () => clearInterval(minuteur)
  }, [urls, intervalMs])

  return (
    <div className="absolute inset-0 animate-wipe-reveal-left overflow-hidden">
      {urls.map((url, i) => (
        <div
          key={url}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            backgroundImage: `url('${url}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: i === index ? 1 : 0,
          }}
        />
      ))}
    </div>
  )
}

function VideoFond({ url, poster }: { url: string; poster?: string }) {
  return (
    <video
      className="absolute inset-0 w-full h-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      poster={poster}
    >
      <source src={url} />
    </video>
  )
}

export default function HeroBackground({ config = HERO_BACKGROUND }: { config?: HeroBackgroundConfig }) {
  if (config.type === 'image') return <ImageFond url={config.url} />
  if (config.type === 'slideshow') return <DiaporamaFond urls={config.urls} intervalMs={config.intervalMs} />
  if (config.type === 'video') return <VideoFond url={config.url} poster={config.poster} />
  return null
}