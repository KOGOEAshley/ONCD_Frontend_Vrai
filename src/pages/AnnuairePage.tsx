import { useState, useEffect } from 'react'
import { Building2, MapPin, Phone } from 'lucide-react'

const regions = [
  { name: 'Centre', count: 198, pct: 41 },
  { name: 'Hauts-Bassins', count: 87, pct: 18 },
  { name: 'Centre-Ouest', count: 34, pct: 7 },
  { name: 'Centre-Nord', count: 28, pct: 6 },
  { name: 'Sahel', count: 18, pct: 4 },
  { name: 'Est', count: 22, pct: 5 },
  { name: 'Boucle du Mouhoun', count: 24, pct: 5 },
  { name: 'Sud-Ouest', count: 14, pct: 3 },
  { name: 'Centre-Sud', count: 17, pct: 3 },
  { name: 'Nord', count: 19, pct: 4 },
  { name: 'Centre-Est', count: 16, pct: 3 },
  { name: 'Cascades', count: 8, pct: 2 },
  { name: 'Plateau Central', count: 2, pct: 0 },
]

const SECTEUR_LABELS: Record<string, string> = {
  liberal: 'Libéral',
  secteur_public: 'Public',
  secteur_prive: 'Privé',
  mixte: 'Mixte',
}

// Traduit les champs de l'API Django (nom, prenom, telephone, date_inscription...)
// vers le format attendu par ce composant (name, phone, inscrit...)
function adapterPraticien(p: any) {
  return {
    id: p.id,
    name: `Dr. ${p.prenom} ${p.nom}`,
    specialite: p.specialite,
    region: p.region,
    ville: p.ville,
    cabinet: p.numero_inscription,
    phone: p.telephone,
    secteur: p.secteur,
    secteurLabel: SECTEUR_LABELS[p.secteur] || p.secteur,
    inscrit: p.date_inscription ? new Date(p.date_inscription).getFullYear() : null,
  }
}

export default function AnnuairePage() {
  const [dentists, setDentists] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [regionFilter, setRegionFilter] = useState('Toutes')
  const [secteurFilter, setSecteurFilter] = useState('Tous')

  useEffect(() => {
    fetch('/api/praticiens/')
      .then((res) => res.json())
      .then((data) => setDentists(data.map(adapterPraticien)))
      .catch((err) => console.error('Erreur API praticiens :', err))
  }, [])

  const filtered = dentists.filter((d) => {
    const q = search.toLowerCase()
    const matchSearch =
      !q || d.name.toLowerCase().includes(q) || d.ville.toLowerCase().includes(q) || d.specialite.toLowerCase().includes(q)
    const matchRegion = regionFilter === 'Toutes' || d.region === regionFilter
    const matchSecteur = secteurFilter === 'Tous' || d.secteur === secteurFilter
    return matchSearch && matchRegion && matchSecteur
  })

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      {/* Header */}
      <div className="relative overflow-hidden px-6 py-16">
        <div className="absolute inset-0" style={{ backgroundImage: "url('/page-header-bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0" style={{ backgroundColor: '#1C2B3A', opacity: 0.25 }} />
        <div className="relative max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#7BAFD4' }}>
            Annuaire Officiel
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Dentistes du Burkina Faso
          </h1>
          <p className="text-white/65 text-lg max-w-2xl">
            Tableau officiel des 487 chirurgiens-dentistes inscrits à l'Ordre, habilités à exercer sur le territoire national.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Praticiens inscrits', value: '487', sub: 'au 01/07/2025' },
            { label: 'Libéraux', value: '342', sub: '70% des inscrits' },
            { label: 'Secteur public', value: '98', sub: '20% des inscrits' },
            { label: 'Régions couvertes', value: '13 / 13', sub: 'Couverture totale' },
          ].map((s) => (
            <div
              key={s.label}
              className="p-5 rounded-xl text-center"
              style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <div
                className="text-2xl font-bold mb-1"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}
              >
                {s.value}
              </div>
              <div className="text-xs font-semibold mb-0.5">{s.label}</div>
              <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                {s.sub}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: regional chart */}
          <div>
            <h2 className="text-lg font-bold mb-5" style={{ fontFamily: 'var(--font-heading)' }}>
              Répartition par Région
            </h2>
            <div
              className="rounded-xl p-5 space-y-3"
              style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            >
              {regions.map((r) => (
                <div key={r.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">{r.name}</span>
                    <span className="text-xs font-bold" style={{ color: 'var(--primary)' }}>
                      {r.count}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${r.pct}%`,
                        backgroundColor: r.pct > 30 ? 'var(--accent)' : r.pct > 10 ? 'var(--primary)' : 'var(--secondary)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: directory */}
          <div className="lg:col-span-2">
            {/* Search & filters */}
            <div className="flex flex-wrap gap-3 mb-6">
              <input
                type="text"
                placeholder="Rechercher un dentiste, ville, spécialité..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 min-w-64 px-4 py-2.5 rounded-lg text-sm outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  color: 'var(--foreground)',
                }}
              />
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="px-3 py-2.5 rounded-lg text-xs cursor-pointer"
                style={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  color: 'var(--foreground)',
                }}
              >
                <option value="Toutes">Toutes régions</option>
                {regions.map((r) => (
                  <option key={r.name} value={r.name}>
                    {r.name}
                  </option>
                ))}
              </select>
              <select
                value={secteurFilter}
                onChange={(e) => setSecteurFilter(e.target.value)}
                className="px-3 py-2.5 rounded-lg text-xs cursor-pointer"
                style={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  color: 'var(--foreground)',
                }}
              >
                <option value="Tous">Tous secteurs</option>
                <option value="liberal">Libéral</option>
                <option value="secteur_public">Public</option>
                <option value="secteur_prive">Privé</option>
                <option value="mixte">Mixte</option>
              </select>
            </div>

            <p className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>
              {filtered.length} résultat{filtered.length !== 1 ? 's' : ''} · Données officielles ONCD
            </p>

            <div className="space-y-3">
              {filtered.map((d) => (
                <div
                  key={d.id}
                  className="p-5 rounded-xl hover:shadow-md transition-all cursor-pointer group"
                  style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                      style={{ backgroundColor: 'var(--primary)' }}
                    >
                      {d.name.split(' ').slice(-1)[0].charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-semibold text-sm">{d.name}</div>
                          <div className="text-xs font-medium" style={{ color: 'var(--accent)' }}>
                            {d.specialite}
                          </div>
                        </div>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor: d.secteur === 'liberal' ? '#E8F5EC' : '#E8EDF5',
                            color: d.secteur === 'liberal' ? '#2A6B3E' : '#2A3E6B',
                          }}
                        >
                          {d.secteurLabel}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                        <span className="text-xs flex items-center gap-1" style={{ color: 'var(--muted-foreground)' }}>
                          <Building2 size={12} /> {d.cabinet}
                        </span>
                        <span className="text-xs flex items-center gap-1" style={{ color: 'var(--muted-foreground)' }}>
                          <MapPin size={12} /> {d.ville}, {d.region}
                        </span>
                        <span className="text-xs flex items-center gap-1" style={{ color: 'var(--muted-foreground)' }}>
                          <Phone size={12} /> {d.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
