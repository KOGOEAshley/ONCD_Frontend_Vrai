import { useState, useEffect } from 'react'
import {
  ClipboardList, GraduationCap, Building2, Phone, MapPin, Smile, CalendarDays,
  CheckCircle2, Download, Handshake, Wallet, UserCheck, Mic, ArrowRight,
} from 'lucide-react'

const parcours = [
  { annee: 'PACES / L1', titre: 'Première Année', desc: "Tronc commun des études de santé. Concours d'accès aux études de chirurgie dentaire." },
  { annee: 'D1', titre: 'Deuxième Année', desc: 'Introduction aux sciences fondamentales dentaires : anatomie, histologie, odontologie conservatrice.' },
  { annee: 'D2', titre: 'Troisième Année', desc: 'Premières vacations cliniques. Apprentissage des techniques de soins sous supervision.' },
  { annee: 'D3', titre: 'Quatrième Année', desc: 'Approfondissement clinique : prothèse, orthodontie, parodontologie, urgences.' },
  { annee: 'D4', titre: 'Cinquième Année (Thèse)', desc: "Soutenance de la thèse d'exercice pour l'obtention du diplôme de Chirurgien-Dentiste." },
  { annee: 'Internat', titre: 'Internat (optionnel)', desc: 'Spécialisation en chirurgie orale, orthodontie ou médecine buccale (3 ans).' },
]

const ressources = [
  { titre: "Guide d'installation libérale", type: 'PDF', taille: '2.1 Mo' },
  { titre: 'Procédure d\'inscription à l\'Ordre', type: 'PDF', taille: '450 Ko' },
  { titre: 'Modèle de CV professionnel dentiste', type: 'DOCX', taille: '120 Ko' },
  { titre: 'Charte des droits et obligations de l\'étudiant', type: 'PDF', taille: '890 Ko' },
  { titre: 'Formulaire de validation de stage', type: 'DOCX', taille: '210 Ko' },
]

function adapterStage(s: any) {
  return {
    id: s.id,
    etablissement: s.etablissement,
    ville: s.ville,
    specialite: s.specialite,
    places: s.places_restantes,
    periode: s.periode,
    niveau: s.niveau_requis,
  }
}


export default function EtudiantsPage() {
  const [tab, setTab] = useState('parcours')
  const tabs = [
    { id: 'parcours', label: 'Parcours Universitaire' },
    { id: 'stages', label: 'Gestion des Stages' },
    { id: 'ressources', label: 'Ressources' },
    { id: 'vie', label: 'Vie Étudiante' },
  ]

  const [stages, setStages] = useState<any[]>([])

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/stages/')
      .then((res) => res.json())
      .then((data) => setStages(data.map(adapterStage)))
      .catch((err) => console.error('Erreur API stages :', err))
  }, [])

  // --- Formulaire de candidature ---
  const [candidatureOuverte, setCandidatureOuverte] = useState<number | null>(null)
  const [candidature, setCandidature] = useState({ nom: '', prenom: '', email: '', telephone: '', niveau_actuel: '', message: '' })
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [envoiEnCours, setEnvoiEnCours] = useState(false)
  const [messageCandidature, setMessageCandidature] = useState('')
  const [erreurCandidature, setErreurCandidature] = useState('')

  function updateCandidature(champ: string, valeur: string) {
    setCandidature((prev) => ({ ...prev, [champ]: valeur }))
  }

  function ouvrirCandidature(stageId: number) {
    setCandidatureOuverte((prev) => (prev === stageId ? null : stageId))
    setMessageCandidature('')
    setErreurCandidature('')
  }

  async function handlePostulerStage(stageId: number) {
    setErreurCandidature('')
    setEnvoiEnCours(true)
    try {
      const donnees = new FormData()
      donnees.append('stage', String(stageId))
      donnees.append('nom', candidature.nom)
      donnees.append('prenom', candidature.prenom)
      donnees.append('email', candidature.email)
      donnees.append('telephone', candidature.telephone)
      donnees.append('niveau_actuel', candidature.niveau_actuel)
      donnees.append('message', candidature.message)
      if (cvFile) donnees.append('cv', cvFile)

      const res = await fetch('http://127.0.0.1:8000/api/postuler-stage/', {
        method: 'POST',
        body: donnees,
      })
      const data = await res.json()
      if (!res.ok) {
        const premiereErreur = Object.values(data)[0]
        setErreurCandidature(Array.isArray(premiereErreur) ? String(premiereErreur[0]) : 'Une erreur est survenue.')
        return
      }
      setMessageCandidature(data.message)
      setCandidature({ nom: '', prenom: '', email: '', telephone: '', niveau_actuel: '', message: '' })
      setCvFile(null)
    } catch (err) {
      setErreurCandidature('Impossible de contacter le serveur.')
    } finally {
      setEnvoiEnCours(false)
    }
  }

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      {/* Header */}
      <div className="relative overflow-hidden px-6 py-16">
        <div className="absolute inset-0" style={{ backgroundImage: "url('/page-header-bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0" style={{ backgroundColor: '#2A3E6B', opacity: 0.45 }} />
        <div className="relative max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#90A8D4' }}>
            Futurs Chirurgiens-Dentistes
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Espace Étudiants & Internes
          </h1>
          <p className="text-white/65 text-lg max-w-2xl">
            Tout ce dont vous avez besoin pour réussir votre parcours et préparer votre entrée dans la profession.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Quick links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: ClipboardList, label: "M'inscrire à l'Ordre", sub: 'Dès l\'obtention du diplôme' },
            { icon: GraduationCap, label: 'Bourse & Aides', sub: 'Fonds de soutien étudiant' },
            { icon: Building2, label: 'Trouver un Stage', sub: '15 terrains disponibles' },
            { icon: Phone, label: 'Aide & Conseil', sub: 'Référent étudiant ONCD' },
          ].map((item) => (
            <div
              key={item.label}
              className="p-5 rounded-xl cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all"
              style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <item.icon size={24} className="mb-2" style={{ color: 'var(--primary)' }} strokeWidth={1.75} />
              <div className="font-semibold text-sm">{item.label}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                {item.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl mb-8 flex-wrap" style={{ backgroundColor: 'var(--muted)' }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="px-4 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
              style={{
                backgroundColor: tab === t.id ? 'var(--card)' : 'transparent',
                color: tab === t.id ? 'var(--primary)' : 'var(--muted-foreground)',
                boxShadow: tab === t.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'parcours' && (
          <div>
            <h2 className="text-2xl font-bold mb-8" style={{ fontFamily: 'var(--font-heading)' }}>
              Cursus Dentaire au Burkina Faso
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {parcours.map((p, i) => (
                <div
                  key={p.annee}
                  className="p-6 rounded-xl"
                  style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: 'var(--primary)' }}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-bold text-xs" style={{ color: 'var(--accent)' }}>
                        {p.annee}
                      </div>
                      <div className="font-semibold text-sm">{p.titre}</div>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'stages' && (
          <div>
            <h2 className="text-2xl font-bold mb-8" style={{ fontFamily: 'var(--font-heading)' }}>
              Terrains de Stage Disponibles
            </h2>
            <div className="space-y-4">
              {stages.map((s) => (
                <div
                  key={s.id}
                  className="p-6 rounded-xl"
                  style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <div className="font-semibold text-sm mb-1">{s.etablissement}</div>
                      <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        <span className="inline-flex items-center gap-1"><MapPin size={12} /> {s.ville}</span>
                        {' · '}
                        <span className="inline-flex items-center gap-1"><Smile size={12} /> {s.specialite}</span>
                        {' · '}
                        <span className="inline-flex items-center gap-1"><CalendarDays size={12} /> {s.periode}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-center">
                        <div className="font-bold text-lg" style={{ color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                          {s.places}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>places</div>
                      </div>
                      <span
                        className="text-xs px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}
                      >
                        {s.niveau}
                      </span>
                      <button
                        onClick={() => ouvrirCandidature(s.id)}
                        className="px-4 py-2 rounded-lg text-xs font-semibold text-white cursor-pointer hover:opacity-90 transition-all"
                        style={{ backgroundColor: 'var(--primary)' }}
                      >
                        Postuler
                      </button>
                    </div>
                  </div>

                  {candidatureOuverte === s.id && (
                    <div className="mt-5 pt-5" style={{ borderTop: '1px solid var(--border)' }}>
                      {messageCandidature ? (
                        <p className="text-sm p-4 rounded-lg flex items-center gap-2" style={{ backgroundColor: '#E8F5EC', color: '#2A6B3E' }}>
                          <CheckCircle2 size={16} className="flex-shrink-0" /> {messageCandidature}
                        </p>
                      ) : (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                            <input placeholder="Prénom" value={candidature.prenom} onChange={(e) => updateCandidature('prenom', e.target.value)} className="px-3.5 py-2.5 rounded-lg text-sm outline-none" style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)' }} />
                            <input placeholder="Nom" value={candidature.nom} onChange={(e) => updateCandidature('nom', e.target.value)} className="px-3.5 py-2.5 rounded-lg text-sm outline-none" style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)' }} />
                            <input type="email" placeholder="Email" value={candidature.email} onChange={(e) => updateCandidature('email', e.target.value)} className="px-3.5 py-2.5 rounded-lg text-sm outline-none" style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)' }} />
                            <input placeholder="Téléphone" value={candidature.telephone} onChange={(e) => updateCandidature('telephone', e.target.value)} className="px-3.5 py-2.5 rounded-lg text-sm outline-none" style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)' }} />
                            <input placeholder="Niveau actuel (ex: D3)" value={candidature.niveau_actuel} onChange={(e) => updateCandidature('niveau_actuel', e.target.value)} className="px-3.5 py-2.5 rounded-lg text-sm outline-none md:col-span-2" style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)' }} />
                            <div className="md:col-span-2">
                              <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--muted-foreground)' }}>CV (facultatif)</label>
                              <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setCvFile(e.target.files?.[0] || null)} className="w-full text-xs px-3.5 py-2.5 rounded-lg outline-none" style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)' }} />
                            </div>
                            <textarea placeholder="Message (facultatif)" value={candidature.message} onChange={(e) => updateCandidature('message', e.target.value)} rows={2} className="px-3.5 py-2.5 rounded-lg text-sm outline-none resize-none md:col-span-2" style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)' }} />
                          </div>
                          {erreurCandidature && <p className="text-xs mb-3" style={{ color: '#B33A3A' }}>{erreurCandidature}</p>}
                          <button
                            onClick={() => handlePostulerStage(s.id)}
                            disabled={envoiEnCours}
                            className="px-5 py-2.5 rounded-lg text-xs font-semibold text-white cursor-pointer hover:opacity-90 transition-all"
                            style={{ backgroundColor: 'var(--primary)', opacity: envoiEnCours ? 0.6 : 1 }}
                          >
                            {envoiEnCours ? 'Envoi...' : 'Envoyer ma candidature'}
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'ressources' && (
          <div>
            <h2 className="text-2xl font-bold mb-8" style={{ fontFamily: 'var(--font-heading)' }}>
              Documents & Ressources
            </h2>
            <div className="space-y-3">
              {ressources.map((r) => (
                <div
                  key={r.titre}
                  className="flex items-center justify-between p-5 rounded-xl cursor-pointer hover:shadow-sm transition-all"
                  style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: r.type === 'PDF' ? '#C4622D' : '#0C4A5A' }}
                    >
                      {r.type}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{r.titre}</div>
                      <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        {r.taille}
                      </div>
                    </div>
                  </div>
                  <button className="text-sm font-semibold cursor-pointer flex items-center gap-1" style={{ color: 'var(--primary)' }}>
                    <Download size={14} /> Télécharger
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'vie' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Association des Étudiants Dentistes du Burkina',
                icon: Handshake,
                desc: "L'AEDB représente les étudiants en chirurgie dentaire. Activités, entraide, défense des droits.",
                cta: 'Rejoindre l\'AEDB',
              },
              {
                title: 'Aide Financière & Bourses',
                icon: Wallet,
                desc: "Le Fonds de Solidarité de l'ONCD accorde des aides ponctuelles aux étudiants en difficulté financière.",
                cta: 'Demander une aide',
              },
              {
                title: 'Mentorat Professionnel',
                icon: UserCheck,
                desc: "Chaque étudiant en D4 peut bénéficier d'un praticien mentor pour l'accompagner dans son installation.",
                cta: 'Trouver un mentor',
              },
              {
                title: 'Congrès Junior & Cas Cliniques',
                icon: Mic,
                desc: 'Concours de présentation de cas cliniques réservé aux étudiants, intégré au Congrès National.',
                cta: 'Participer 2025',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-xl"
                style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <item.icon size={28} className="mb-4" style={{ color: 'var(--accent)' }} strokeWidth={1.75} />
                <h3 className="font-bold text-sm mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  {item.title}
                </h3>
                <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--muted-foreground)' }}>
                  {item.desc}
                </p>
                <button className="text-xs font-semibold cursor-pointer flex items-center gap-1" style={{ color: 'var(--primary)' }}>
                  {item.cta} <ArrowRight size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
