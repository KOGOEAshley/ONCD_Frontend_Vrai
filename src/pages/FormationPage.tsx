import { useState } from 'react'

const events = [
  {
    id: 1,
    type: 'Congrès',
    title: '18e Congrès National de Chirurgie Dentaire',
    date: '14–16 Nov 2025',
    location: 'Ouagadougou, Palais des Congrès',
    spots: 42,
    totalSpots: 300,
    price: '85 000 FCFA',
    tags: ['Implantologie', 'Endodontie', 'Parodontologie'],
    featured: true,
  },
  {
    id: 2,
    type: 'Atelier',
    title: 'Techniques d\'Anesthésie Loco-Régionale',
    date: '8 Sep 2025',
    location: 'Bobo-Dioulasso, CHU SS',
    spots: 3,
    totalSpots: 20,
    price: '45 000 FCFA',
    tags: ['Anesthésie', 'Pratique'],
    featured: false,
  },
  {
    id: 3,
    type: 'Webinaire',
    title: 'Radiologie Numérique & Cone Beam en Cabinet',
    date: '25 Août 2025',
    location: 'En ligne',
    spots: 120,
    totalSpots: 200,
    price: '15 000 FCFA',
    tags: ['Radiologie', 'Digital'],
    featured: false,
  },
  {
    id: 4,
    type: 'DPC',
    title: 'Gestion du Risque Infectieux en Odontologie',
    date: '12 Oct 2025',
    location: 'Ouagadougou, Siège ONCD',
    spots: 8,
    totalSpots: 30,
    price: 'Gratuit (membres)',
    tags: ['Hygiène', 'Réglementation'],
    featured: false,
  },
]

const elearning = [
  { title: 'Introduction à l\'Implantologie', duration: '4h30', level: 'Intermédiaire', enrolled: 124 },
  { title: 'Orthodontie Adulte: Protocoles Actuels', duration: '3h15', level: 'Avancé', enrolled: 89 },
  { title: 'Gestion du Patient Anxieux', duration: '2h00', level: 'Débutant', enrolled: 203 },
  { title: 'Déontologie & Éthique Professionnelle', duration: '1h30', level: 'Obligatoire', enrolled: 487 },
]

const typeColor: Record<string, { bg: string; text: string }> = {
  'Congrès': { bg: '#E8EDF5', text: '#2A3E6B' },
  'Atelier': { bg: '#E8F5EC', text: '#2A6B3E' },
  'Webinaire': { bg: '#F3E8FE', text: '#6B2A9B' },
  'DPC': { bg: '#FDEADE', text: '#C4622D' },
}

export default function FormationPage() {
  const [filter, setFilter] = useState<string>('Tous')
  const types = ['Tous', 'Congrès', 'Atelier', 'Webinaire', 'DPC']
  const filtered = filter === 'Tous' ? events : events.filter((e) => e.type === filter)

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#2A3E6B' }} className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
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
              style={{ background: 'linear-gradient(135deg, #0C4A5A 0%, #175E72 100%)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div className="p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full"
                      style={{ backgroundColor: 'var(--accent)', color: 'white' }}
                    >
                      ⭐ Événement Phare
                    </span>
                    <span className="text-white/60 text-xs">{event.date}</span>
                  </div>
                  <h2
                    className="text-2xl md:text-3xl font-bold text-white mb-3"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {event.title}
                  </h2>
                  <p className="text-white/65 text-sm mb-4">📍 {event.location}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {event.tags.map((tag) => (
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
                    className="px-6 py-3 rounded-lg font-semibold text-sm text-white cursor-pointer hover:opacity-90 transition-all"
                    style={{ backgroundColor: 'var(--accent)' }}
                  >
                    S'inscrire →
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
                <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>
                  📅 {event.date}
                </p>
                <p className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>
                  📍 {event.location}
                </p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {event.tags.map((tag) => (
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
                  <span className="text-xs" style={{ color: event.spots < 10 ? '#C4622D' : 'var(--muted-foreground)' }}>
                    {event.spots < 10 ? '🔴 ' : ''}{event.spots} places restantes
                  </span>
                  <button
                    className="text-xs font-semibold cursor-pointer"
                    style={{ color: 'var(--primary)' }}
                  >
                    Détails →
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
                key={m.title}
                className="flex items-center gap-4 p-5 rounded-xl hover:shadow-sm transition-all cursor-pointer"
                style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ backgroundColor: 'var(--muted)' }}
                >
                  🎬
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{m.title}</div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      ⏱ {m.duration}
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
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xs font-bold" style={{ color: 'var(--primary)' }}>
                    {m.enrolled}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>inscrits</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
