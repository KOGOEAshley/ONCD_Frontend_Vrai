import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

function adapterClinique(c: any) {
  return {
    id: c.id,
    nom: c.nom,
    adresse: c.adresse,
    ville: c.ville,
    region: c.region,
    telephone: c.telephone,
    horaires: c.horaires,
    urgences: c.est_de_garde,
    specialites: (c.praticiens || []).map((p: any) => p.specialite),
    lat: Number(c.latitude),
    lng: Number(c.longitude),
  }
}

// Crée un pin coloré personnalisé, dans le même esprit visuel que la maquette d'origine
function creerIcone(couleur: string, urgence: boolean) {
  return L.divIcon({
    className: '',
    html: `<div style="width:26px;height:26px;border-radius:50%;background:${couleur};
            border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);
            display:flex;align-items:center;justify-content:center;
            color:white;font-weight:bold;font-size:13px;">${urgence ? '+' : '•'}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  })
}

export default function GeolocalisationPage() {
  const [cliniques, setCliniques] = useState<any[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [searchVille, setSearchVille] = useState('')

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/cliniques/')
      .then((res) => res.json())
      .then((data) => setCliniques(data.map(adapterClinique)))
      .catch((err) => console.error('Erreur API cliniques :', err))
  }, [])

  const selectedClinique = cliniques.find((c) => c.id === selected)
  const filtered = cliniques.filter(
    (c) => !searchVille || c.ville.toLowerCase().includes(searchVille.toLowerCase())
  )

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#1C2B3A' }} className="px-6 py-14">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#7BAFD4' }}>
            Carte Interactive
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-3"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Géolocalisation des Cliniques
          </h1>
          <p className="text-white/60 text-base">
            Localisez les cabinets dentaires et cliniques les plus proches de chez vous.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ minHeight: '600px' }}>
          {/* Sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <input
              type="text"
              placeholder="Rechercher par ville..."
              value={searchVille}
              onChange={(e) => setSearchVille(e.target.value)}
              className="px-4 py-2.5 rounded-lg text-sm outline-none"
              style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                color: 'var(--foreground)',
              }}
            />
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              {filtered.length} établissement{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}
            </p>
            <div className="space-y-2 overflow-y-auto" style={{ maxHeight: '500px' }}>
              {filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelected(c.id)}
                  className="w-full text-left p-4 rounded-xl transition-all cursor-pointer"
                  style={{
                    backgroundColor: selected === c.id ? 'var(--primary)' : 'var(--card)',
                    border: `1px solid ${selected === c.id ? 'transparent' : 'var(--border)'}`,
                    color: selected === c.id ? 'white' : 'inherit',
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold text-sm leading-snug">{c.nom}</div>
                      <div
                        className="text-xs mt-0.5"
                        style={{ color: selected === c.id ? 'rgba(255,255,255,0.65)' : 'var(--muted-foreground)' }}
                      >
                        {c.ville} · {c.region}
                      </div>
                    </div>
                    {c.urgences && (
                      <span
                        className="text-xs px-1.5 py-0.5 rounded flex-shrink-0"
                        style={{
                          backgroundColor: selected === c.id ? 'rgba(196,98,45,0.3)' : '#FDEADE',
                          color: selected === c.id ? '#FFAA80' : '#C4622D',
                        }}
                      >
                        Urgences
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Map area */}
          <div className="lg:col-span-2">
            {/* Vraie carte interactive (Leaflet + OpenStreetMap) */}
            <div
              className="rounded-2xl overflow-hidden relative"
              style={{ height: '420px', border: '1px solid var(--border)' }}
            >
              <MapContainer
                center={[12.2, -1.5]}
                zoom={7}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
                {cliniques.map((c) => (
                  <Marker
                    key={c.id}
                    position={[c.lat, c.lng]}
                    icon={creerIcone(
                      selected === c.id ? 'var(--accent)' : c.urgences ? 'var(--primary)' : 'var(--secondary)',
                      c.urgences
                    )}
                    eventHandlers={{ click: () => setSelected(c.id) }}
                  >
                    <Popup>
                      <strong>{c.nom}</strong>
                      <br />
                      {c.adresse}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
              {/* Légende */}
              <div
                className="absolute bottom-4 right-4 text-xs p-3 rounded-lg space-y-1.5"
                style={{ backgroundColor: 'rgba(255,255,255,0.92)', zIndex: 1000 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--primary)' }} />
                  <span>Urgences disponibles</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--secondary)' }} />
                  <span>Cabinet standard</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
                  <span>Sélectionné</span>
                </div>
              </div>
            </div>

            {/* Selected clinic detail */}
            {selectedClinique && (
              <div
                className="mt-4 p-6 rounded-xl"
                style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3
                      className="text-lg font-bold mb-1"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {selectedClinique.nom}
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      📍 {selectedClinique.adresse}
                    </p>
                  </div>
                  {selectedClinique.urgences && (
                    <span
                      className="text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: '#FDEADE', color: '#C4622D' }}
                    >
                      🚨 Urgences 24h
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--muted-foreground)' }}>
                      Téléphone
                    </div>
                    <div className="font-medium text-sm">{selectedClinique.telephone}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--muted-foreground)' }}>
                      Horaires
                    </div>
                    <div className="font-medium text-sm">{selectedClinique.horaires}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--muted-foreground)' }}>
                      Région
                    </div>
                    <div className="font-medium text-sm">{selectedClinique.region}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--muted-foreground)' }}>
                      Spécialités
                    </div>
                    <div className="font-medium text-sm">{selectedClinique.specialites.join(', ')}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
