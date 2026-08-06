import { useState, useEffect, useRef } from 'react'
import { CalendarDays, MapPin, Building2, ArrowRight, CheckCircle2, Globe, Mail } from 'lucide-react'

const API_BASE = ''

function urlFichier(chemin: string | null | undefined) {
  if (!chemin) return null
  return chemin.startsWith('http') ? chemin : `${API_BASE}${chemin}`
}

function adapterExposant(e: any) {
  return {
    id: e.id,
    nom: e.nom,
    pays: e.pays,
    categorie: e.categorie,
    produits: (e.produits || '').split(',').map((p: string) => p.trim()).filter(Boolean),
    stand: e.stand,
    contact: e.contact_email,
    logoUrl: urlFichier(e.logo),
    photoStandUrl: urlFichier(e.photo_stand),
  }
}

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
  const [exposants, setExposants] = useState<any[]>([])
  const [catFilter, setCatFilter] = useState('Tous')
  const catalogueRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch(`${API_BASE}/api/exposants/`)
      .then((res) => res.json())
      .then((data) => setExposants(data.map(adapterExposant)))
      .catch((err) => console.error('Erreur API exposants :', err))
  }, [])

  const filtered = catFilter === 'Tous' ? exposants : exposants.filter((e) => e.categorie === catFilter)

  // --- Formulaire de réservation de stand ---
  const [formulaireOuvert, setFormulaireOuvert] = useState(false)
  const [reservation, setReservation] = useState({
    nom_entreprise: '', email: '', telephone: '', pays: '', categorie_souhaitee: categories[1], message: '',
  })
  const [envoiEnCours, setEnvoiEnCours] = useState(false)
  const [messageReservation, setMessageReservation] = useState('')
  const [erreurReservation, setErreurReservation] = useState('')

  function updateReservation(champ: string, valeur: string) {
    setReservation((prev) => ({ ...prev, [champ]: valeur }))
  }

  async function handleReserverStand() {
    setErreurReservation('')
    setEnvoiEnCours(true)
    try {
      const res = await fetch(`${API_BASE}/api/reserver-stand/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservation),
      })
      const data = await res.json()
      if (!res.ok) {
        const premiereErreur = Object.values(data)[0]
        setErreurReservation(Array.isArray(premiereErreur) ? String(premiereErreur[0]) : 'Une erreur est survenue.')
        return
      }
      setMessageReservation(data.message)
      setReservation({ nom_entreprise: '', email: '', telephone: '', pays: '', categorie_souhaitee: categories[1], message: '' })
    } catch (err) {
      setErreurReservation('Impossible de contacter le serveur.')
    } finally {
      setEnvoiEnCours(false)
    }
  }

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      {/* Header */}
      <div className="relative overflow-hidden px-6 py-16">
        <div className="absolute inset-0" style={{ backgroundImage: "url('/page-header-bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #2A1A0E 0%, #5C2A0E 100%)', opacity: 0.45 }} />
        <div className="relative max-w-7xl mx-auto">
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
              className="px-4 py-2 rounded-lg flex items-center gap-2"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}
            >
              <CalendarDays size={16} /> 14–16 Novembre 2025
            </div>
            <div
              className="px-4 py-2 rounded-lg flex items-center gap-2"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}
            >
              <MapPin size={16} /> Palais des Congrès, Ouagadougou
            </div>
            <div
              className="px-4 py-2 rounded-lg flex items-center gap-2"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}
            >
              <Building2 size={16} /> 28 stands d'exposition
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
              onClick={() => { setFormulaireOuvert((v) => !v); setMessageReservation('') }}
              className="px-6 py-3 rounded-lg text-sm font-semibold text-white cursor-pointer hover:opacity-90 transition-all flex items-center gap-1.5"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              Réserver un stand <ArrowRight size={16} />
            </button>
            <button
              onClick={() => catalogueRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-3 rounded-lg text-sm font-semibold cursor-pointer transition-all"
              style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
            >
              Catalogue exposants
            </button>
          </div>
        </div>

        {formulaireOuvert && (
          <div className="rounded-2xl p-8 mb-12" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <h3 className="text-lg font-bold mb-5" style={{ fontFamily: 'var(--font-heading)' }}>Demande de réservation de stand</h3>

            {messageReservation ? (
              <p className="text-sm p-4 rounded-lg flex items-center gap-2" style={{ backgroundColor: '#E8F5EC', color: '#2A6B3E' }}>
                <CheckCircle2 size={16} className="flex-shrink-0" /> {messageReservation}
              </p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--muted-foreground)' }}>Nom de l'entreprise</label>
                    <input value={reservation.nom_entreprise} onChange={(e) => updateReservation('nom_entreprise', e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none" style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)' }} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--muted-foreground)' }}>Pays</label>
                    <input value={reservation.pays} onChange={(e) => updateReservation('pays', e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none" style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)' }} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--muted-foreground)' }}>Email</label>
                    <input type="email" value={reservation.email} onChange={(e) => updateReservation('email', e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none" style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)' }} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--muted-foreground)' }}>Téléphone</label>
                    <input value={reservation.telephone} onChange={(e) => updateReservation('telephone', e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none" style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)' }} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--muted-foreground)' }}>Catégorie souhaitée</label>
                    <select value={reservation.categorie_souhaitee} onChange={(e) => updateReservation('categorie_souhaitee', e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none" style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)' }}>
                      {categories.slice(1).map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--muted-foreground)' }}>Message (produits, besoins spécifiques...)</label>
                    <textarea value={reservation.message} onChange={(e) => updateReservation('message', e.target.value)} rows={3} className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none resize-none" style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)' }} />
                  </div>
                </div>

                {erreurReservation && <p className="text-xs mb-3" style={{ color: '#B33A3A' }}>{erreurReservation}</p>}

                <button
                  onClick={handleReserverStand}
                  disabled={envoiEnCours}
                  className="px-6 py-3 rounded-lg text-sm font-semibold text-white cursor-pointer hover:opacity-90 transition-all"
                  style={{ backgroundColor: 'var(--accent)', opacity: envoiEnCours ? 0.6 : 1 }}
                >
                  {envoiEnCours ? 'Envoi...' : 'Envoyer la demande'}
                </button>
              </>
            )}
          </div>
        )}

        {/* Filter */}
        <div ref={catalogueRef} className="flex items-center justify-between mb-6 flex-wrap gap-4">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((e) => (
            <div
              key={e.id}
              className="rounded-xl overflow-hidden hover:-translate-y-0.5 hover:shadow-lg transition-all cursor-pointer group flex flex-col sm:flex-row"
              style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <div className={`p-6 ${e.photoStandUrl ? 'sm:w-3/5' : 'w-full'}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  {e.logoUrl ? (
                    <img
                      src={e.logoUrl}
                      alt={`Logo ${e.nom}`}
                      className="w-10 h-10 rounded-lg object-contain bg-white border"
                      style={{ borderColor: 'var(--border)' }}
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: 'var(--primary)' }}
                    >
                      {e.stand}
                    </div>
                  )}
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
              {e.logoUrl && (
                <div
                  className="inline-block text-xs font-semibold px-2 py-0.5 rounded mb-2"
                  style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}
                >
                  Stand {e.stand}
                </div>
              )}
              <h3
                className="font-bold text-sm mb-1"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {e.nom}
              </h3>
              <p className="text-xs mb-3 flex items-center gap-1" style={{ color: 'var(--muted-foreground)' }}>
                <Globe size={12} /> {e.pays}
              </p>
              <div className="space-y-1 mb-4">
                {e.produits.map((p: string) => (
                  <div key={p} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--secondary)' }} />
                    {p}
                  </div>
                ))}
              </div>
              <div className="text-xs flex items-center gap-1" style={{ color: 'var(--muted-foreground)' }}>
                <Mail size={12} /> {e.contact}
              </div>
              </div>
              {e.photoStandUrl && (
                <img
                  src={e.photoStandUrl}
                  alt={`Stand ${e.nom}`}
                  className="w-full h-48 sm:w-2/5 sm:h-auto object-cover flex-shrink-0"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
