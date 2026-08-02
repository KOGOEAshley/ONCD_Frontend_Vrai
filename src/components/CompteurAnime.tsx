import { useEffect, useRef, useState } from 'react'

interface CompteurAnimeProps {
  valeur: string // ex: "487", "1 200+", "13 / 13"
  dureeMs?: number
}

function extraireNombre(valeur: string): { nombre: number; avant: string; apres: string } | null {
  const correspondance = valeur.match(/[\d\s]+/)
  if (!correspondance) return null

  const brut = correspondance[0]
  const nombre = parseInt(brut.replace(/\s/g, ''), 10)
  if (isNaN(nombre)) return null

  const avant = valeur.slice(0, correspondance.index)
  const apres = valeur.slice((correspondance.index || 0) + brut.length)
  return { nombre, avant, apres }
}

function formaterMilliers(n: number): string {
  return n.toLocaleString('fr-FR').replace(/,/g, ' ')
}

export default function CompteurAnime({ valeur, dureeMs = 1200 }: CompteurAnimeProps) {
  const [affichage, setAffichage] = useState(valeur)
  const conteneurRef = useRef<HTMLSpanElement>(null)
  const dejaLance = useRef(false)

  useEffect(() => {
    const analyse = extraireNombre(valeur)
    if (!analyse) {
      setAffichage(valeur)
      return
    }
    const { nombre, avant, apres } = analyse

    const observateur = new IntersectionObserver(
      ([entree]) => {
        if (entree.isIntersecting && !dejaLance.current) {
          dejaLance.current = true
          const debut = performance.now()

          function animer(maintenant: number) {
            const progression = Math.min((maintenant - debut) / dureeMs, 1)
            const progressionAdoucie = 1 - Math.pow(1 - progression, 3)
            const valeurActuelle = Math.round(nombre * progressionAdoucie)

            setAffichage(`${avant}${formaterMilliers(valeurActuelle)}${apres}`)

            if (progression < 1) {
              requestAnimationFrame(animer)
            }
          }

          requestAnimationFrame(animer)
        }
      },
      { threshold: 0.3 }
    )

    if (conteneurRef.current) {
      observateur.observe(conteneurRef.current)
    }

    return () => observateur.disconnect()
  }, [valeur, dureeMs])

  return <span ref={conteneurRef}>{affichage}</span>
}