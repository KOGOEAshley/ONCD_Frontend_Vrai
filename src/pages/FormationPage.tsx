import { useState, useEffect } from 'react'
import { Star, MapPin, ArrowRight, CalendarDays, Circle, Video, Clock3 } from 'lucide-react'

const MOIS_COURTS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']

function formaterPlageDates(dateDebut: string, dateFin: string | null) {
  const d1 = new Date(dateDebut)
  if (!dateFin || dateFin === dateDebut) {
    return `${d1.getDate()} ${MOIS_COURTS[d1.getMonth()]} ${d1.getFullYear()}`
  }
  const d2 = new Date(dateFin)
  if (d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear()) {
    return `${d1.getDate()}–${d2.getDate()} ${MOIS_COURTS[d1.getMonth()]} ${d1.getFullYear()}`
  }
  return `${d1.getDate()} ${MOIS_COURTS[d1.getMonth()]} – ${d2.getDate()} ${MOIS_COURTS[d2.getMonth()]} ${d2.getFullYear()}`
}

function adapterEvenement(e: any) {
  return {
    id: e.id,
    type: e.categorie,
    title: e.titre,
    date: formaterPlageDates(e.date_debut, e.date_fin),
    location: e.lieu,
    spots: e.places_restantes,
    totalSpots: e.places_totales,
    price: e.prix,
    tags: (e.tags || '').split(',').map((t: string) => t.trim()).filter(Boolean),
    featured: e.featured,
  }
}

function adapterModule(m: any) {
  return {
    id: m.id,
    title: m.titre,
    duration: m.duree,
    level: m.niveau,
    enrolled: m.nombre_inscrits,
    lienVideo: m.lien_video,
  }
}

const typeColor: Record<string, { bg: string; text: string }> = {
  'Congrès': { bg: '#E8EDF5', text: '#2A3E6B' },
  'Atelier': { bg: '#E8F5EC', text: '#2A6B3E' },
  'Webinaire': { bg: '#F3E8FE', text: '#6B2A9B' },
  'DPC': { bg: '#FDEADE', text: '#C4622D' },
}

export default function FormationPage() {
  const [events, setEvents] = useState<any[]>([])
  const [filter, setFilter] = useState<string>('Tous')
  const types = ['Tous', 'Congrès', 'Atelier', 'Webinaire', 'DPC']

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/evenements/')
      .then((res) => res.json())
      .then((data) => setEvents(data.map(adapterEvenement)))
      .catch((err) => console.error('Erreur API événements :', err))
  }, [])
  const filtered = filter === 'Tous' ? events : events.filter((e) => e.type === filter)

  const [elearning, setElearning] = useState<any[]>([])
  const [messageModule, setMessageModule] = useState<Record<number, string>>({})

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/modules-elearning/')
      .then((res) => res.json())
      .then((data) => setElearning(data.map(adapterModule)))
      .catch((err) => console.error('Erreur API modules e-learning :', err))
  }, [])

  async function handleInscrireModule(moduleId: number) {
    const token = localStorage.getItem('oncdbf_token')
    if (!token) {
      setMessageModule((prev) => ({ ...prev, [moduleId]: 'Connectez-vous à votre espace membre pour vous inscrire.' }))
      return
    }
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/modules-elearning/${moduleId}/inscrire/`, {
        method: 'POST',
        headers: { Authorization: `Token ${token}` },
      })
      const data = await res.json()
      if (!res.ok) {
        setMessageModule((prev) => ({ ...prev, [moduleId]: data.detail || "Erreur lors de l'inscription." }))
        return
      }
      setMessageModule((prev) => ({ ...prev, [moduleId]: data.message }))
      // Met à jour le compteur d'inscrits affiché sans recharger toute la page
      setElearning((prev) =>
        prev.map((m) => (m.id === moduleId ? { ...m, enrolled: m.enrolled + 1 } : m))
      )
    } catch (err) {
      setMessageModule((prev) => ({ ...prev, [moduleId]: 'Impossible de contacter le serveur.' }))
    }
  }

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      {/* Header */}
      <div className="relative overflow-hidden px-6 py-16">
        <div className="absolute inset-0" style={{ backgroundImage: "url('/page-header-bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0" style={{ backgroundColor: '#2A3E6B', opacity: 0.25 }} />
        <div className="relative max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#90A8D4' }}>
            Développement Professionnel
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Formation Continue & Événements
          </h1>
          <p className="text-white/65 text-lg max-w-2xl">
            Congrès, ateliers pratiques, e-learning et programmes DPC pour maintenir et développer vos compétences cliniques.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Featured event */}
        {events
          .filter((e) => e.featured)
          .map((event) => (
            <div
              key={event.id}
              className="rounded-2xl mb-12 overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #9A4EAE 0%, #175E72 100%)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div className="p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"
                      style={{ backgroundColor: 'var(--accent)', color: 'white' }}
                    >
                      <Star size={12} /> Événement Phare
                    </span>
                    <span className="text-white/60 text-xs">{event.date}</span>
                  </div>
                  <h2
                    className="text-2xl md:text-3xl font-bold text-white mb-3"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {event.title}
                  </h2>
                  <p className="text-white/65 text-sm mb-4 flex items-center gap-1.5"><MapPin size={14} /> {event.location}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {event.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div>
                      <div className="text-white/50 text-xs mb-0.5">Places restantes</div>
                      <div className="text-white font-bold">{event.spots} / {event.totalSpots}</div>
                    </div>
                    <div>
                      <div className="text-white/50 text-xs mb-0.5">Tarif membre</div>
                      <div className="text-white font-bold">{event.price}</div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3 min-w-40">
                  <button
                    className="px-6 py-3 rounded-lg font-semibold text-sm text-white cursor-pointer hover:opacity-90 transition-all flex items-center justify-center gap-1.5"
                    style={{ backgroundColor: 'var(--accent)' }}
                  >
                    S'inscrire <ArrowRight size={16} />
                  </button>
                  <button
                    className="px-6 py-3 rounded-lg font-semibold text-sm cursor-pointer transition-all"
                    style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
                  >
                    Programme
                  </button>
                </div>
              </div>
              {/* Progress bar */}
              <div className="mx-8 md:mx-10 mb-8">
                <div className="flex justify-between text-xs text-white/50 mb-1.5">
                  <span>Taux de remplissage</span>
                  <span>{Math.round(((event.totalSpots - event.spots) / event.totalSpots) * 100)}%</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: 'var(--accent)',
                      width: `${Math.round(((event.totalSpots - event.spots) / event.totalSpots) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}

        {/* Event filters */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
            Prochains Événements
          </h2>
          <div className="flex gap-2 flex-wrap">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer"
                style={{
                  backgroundColor: filter === t ? 'var(--primary)' : 'var(--muted)',
                  color: filter === t ? 'white' : 'var(--muted-foreground)',
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {filtered.map((event) => (
            <div
              key={event.id}
              className="rounded-xl overflow-hidden hover:-translate-y-0.5 hover:shadow-lg transition-all cursor-pointer"
              style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: typeColor[event.type]?.bg ?? '#F5F5F5',
                      color: typeColor[event.type]?.text ?? '#333',
                    }}
                  >
                    {event.type}
                  </span>
                  <span className="text-xs font-bold" style={{ color: 'var(--primary)' }}>
                    {event.price}
                  </span>
                </div>
                <h3
                  className="font-semibold text-sm leading-snug mb-2"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {event.title}
                </h3>
                <p className="text-xs mb-1 flex items-center gap-1" style={{ color: 'var(--muted-foreground)' }}>
                  <CalendarDays size={12} /> {event.date}
                </p>
                <p className="text-xs mb-4 flex items-center gap-1" style={{ color: 'var(--muted-foreground)' }}>
                  <MapPin size={12} /> {event.location}
                </p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {event.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded"
                      style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs flex items-center gap-1" style={{ color: event.spots < 10 ? '#C4622D' : 'var(--muted-foreground)' }}>
                    {event.spots < 10 && <Circle size={8} fill="#C4622D" stroke="none" />}
                    {event.spots} places restantes
                  </span>
                  <button
                    className="text-xs font-semibold cursor-pointer flex items-center gap-1"
                    style={{ color: 'var(--primary)' }}
                  >
                    Détails <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* E-learning */}
        <div>
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
            E-Learning — Modules en ligne
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {elearning.map((m) => (
              <div
                key={m.id}
                className="p-5 rounded-xl hover:shadow-sm transition-all"
                style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'var(--muted)' }}
                  >
                    <Video size={20} style={{ color: 'var(--primary)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{m.title}</div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs flex items-center gap-1" style={{ color: 'var(--muted-foreground)' }}>
                        <Clock3 size={12} /> {m.duration}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: m.level === 'Obligatoire' ? '#FDEADE' : 'var(--muted)',
                          color: m.level === 'Obligatoire' ? '#C4622D' : 'var(--muted-foreground)',
                        }}
                      >
                        {m.level}
                      </span>
                    </div>
                    {m.lienVideo && (
                      <a
                        href={m.lienVideo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold mt-1 inline-block"
                        style={{ color: 'var(--primary)' }}
                      >
                        ▶ Voir la vidéo
                      </a>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-bold" style={{ color: 'var(--primary)' }}>
                      {m.enrolled}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>inscrits</div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    {messageModule[m.id] || ''}
                  </span>
                  <button
                    onClick={() => handleInscrireModule(m.id)}
                    className="text-xs font-semibold cursor-pointer px-4 py-1.5 rounded-full text-white flex-shrink-0"
                    style={{ backgroundColor: 'var(--primary)' }}
                  >
                    S'inscrire
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
