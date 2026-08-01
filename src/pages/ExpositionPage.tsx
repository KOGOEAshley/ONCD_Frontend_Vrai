import { useState } from 'react'

const exposants = [
  {
    id: 1,
    nom: 'DentaCare Africa',
    pays: 'Côte d\'Ivoire',
    categorie: 'Équipements',
    produits: ['Fauteuils dentaires', 'Unités de soins', 'Turbines'],
    stand: 'A-12',
    contact: 'info@dentacareafrica.com',
  },
  {
    id: 2,
    nom: 'PharmaDent BF',
    pays: 'Burkina Faso',
    categorie: 'Pharmacie',
    produits: ['Anesthésiques', 'Matériaux d\'obturation', 'Antiseptiques'],
    stand: 'B-03',
    contact: 'contact@pharmadent.bf',
  },
  {
    id: 3,
    nom: 'Siemens Healthineers',
    pays: 'Allemagne',
    categorie: 'Imagerie',
    produits: ['Radiologie numérique', 'Cone Beam CT', 'Logiciels d\'imagerie'],
    stand: 'C-01',
    contact: 'dental@siemens.com',
  },
  {
    id: 4,
    nom: 'ProLabo BF',
    pays: 'Burkina Faso',
    categorie: 'Prothèse',
    produits: ['Couronnes céramique', 'Bridges', 'Prothèses amovibles'],
    stand: 'B-15',
    contact: 'prolabo@gmail.com',
  },
  {
    id: 5,
    nom: 'ImplantPro West Africa',
    pays: 'Sénégal',
    categorie: 'Implants',
    produits: ['Implants titanium', 'Piliers prothétiques', 'Membranes régénératives'],
    stand: 'A-06',
    contact: 'contact@implantpro-wa.sn',
  },
  {
    id: 6,
    nom: 'Dentsply Sirona',
    pays: 'États-Unis',
    categorie: 'Instrumentation',
    produits: ['Instruments rotatifs', 'Fouloirs', 'Matériaux composites'],
    stand: 'C-08',
    contact: 'africa@dentsply.com',
  },
]

const categories = ['Tous', 'Équipements', 'Pharmacie', 'Imagerie', 'Prothèse', 'Implants', 'Instrumentation']

const catColor: Record<string, { bg: string; text: string }> = {
  'Équipements': { bg: '#E8EDF5', text: '#2A3E6B' },
  'Pharmacie': { bg: '#E8F5EC', text: '#2A6B3E' },
  'Imagerie': { bg: '#F3E8FE', text: '#6B2A9B' },
  'Prothèse': { bg: '#FEF3E8', text: '#875A00' },
  'Implants': { bg: '#FDEADE', text: '#C4622D' },
  'Instrumentation': { bg: '#E8F0FE', text: '#1A3D8B' },
}

export default function ExpositionPage() {
  const [catFilter, setCatFilter] = useState('Tous')
  const filtered = catFilter === 'Tous' ? exposants : exposants.filter((e) => e.categorie === catFilter)

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      {/* Header */}
      <div
        style={{ background: 'linear-gradient(135deg, #2A1A0E 0%, #5C2A0E 100%)' }}
        className="px-6 py-16"
      >
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#E8956A' }}>
            Innovation & Équipements
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Exposition & Matériel Dentaire
          </h1>
          <p className="text-white/65 text-lg max-w-2xl">
            Vitrine des innovations biomédicales du Congrès ONCD 2025. Rencontrez les fournisseurs et découvrez les dernières technologies.
          </p>
          <div className="mt-6 flex gap-4 flex-wrap text-sm">
            <div
              className="px-4 py-2 rounded-lg"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}
            >
              📅 14–16 Novembre 2025
            </div>
            <div
              className="px-4 py-2 rounded-lg"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}
            >
              📍 Palais des Congrès, Ouagadougou
            </div>
            <div
              className="px-4 py-2 rounded-lg"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}
            >
              🏢 28 stands d'exposition
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Become an exhibitor CTA */}
        <div
          className="rounded-2xl p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6"
          style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)' }}
        >
          <div>
            <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              Vous êtes fournisseur ou distributeur ?
            </h2>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Réservez votre stand pour le Congrès ONCD 2025. Tarifs à partir de 150 000 FCFA.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <button
              className="px-6 py-3 rounded-lg text-sm font-semibold text-white cursor-pointer hover:opacity-90 transition-all"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              Réserver un stand →
            </button>
            <button
              className="px-6 py-3 rounded-lg text-sm font-semibold cursor-pointer transition-all"
              style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
            >
              Catalogue exposants
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
            Exposants 2025
          </h2>
          <div className="flex gap-2 flex-wrap">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCatFilter(c)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer"
                style={{
                  backgroundColor: catFilter === c ? 'var(--primary)' : 'var(--muted)',
                  color: catFilter === c ? 'white' : 'var(--muted-foreground)',
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((e) => (
            <div
              key={e.id}
              className="p-6 rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all cursor-pointer group"
              style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  {e.stand}
                </div>
                <span
                  className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: catColor[e.categorie]?.bg ?? '#F5F5F5',
                    color: catColor[e.categorie]?.text ?? '#333',
                  }}
                >
                  {e.categorie}
                </span>
              </div>
              <h3
                className="font-bold text-sm mb-1"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {e.nom}
              </h3>
              <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>
                🌍 {e.pays}
              </p>
              <div className="space-y-1 mb-4">
                {e.produits.map((p) => (
                  <div key={p} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--secondary)' }} />
                    {p}
                  </div>
                ))}
              </div>
              <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                ✉️ {e.contact}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
