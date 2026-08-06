import { useState, useEffect, useRef } from 'react'
import type { Page } from '../components/NavBar'
import {
  ClipboardList, CreditCard, Building2, FileText, BookMarked, Megaphone,
  AlertTriangle, ArrowRight, Download, Lock,
} from 'lucide-react'

const API_BASE = ''

function urlFichier(chemin: string) {
  return chemin.startsWith('http') ? chemin : `${API_BASE}${chemin}`
}

function formaterDateCourte(dateIso: string) {
  const d = new Date(dateIso)
  return d.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
}

function adapterDocument(doc: any) {
  return {
    id: doc.id,
    title: doc.titre,
    type: doc.type_fichier,
    size: doc.taille_affichee,
    updated: formaterDateCourte(doc.date_maj),
    url: urlFichier(doc.fichier),
  }
}

const tabs = [
  { id: 'inscription', label: "Inscription & Cotisations" },
  { id: 'installation', label: "Règles d'Installation" },
  { id: 'juridique', label: "Modèles Juridiques" },
  { id: 'attestations', label: "Mes Attestations" },
]

const services = [
  {
    icon: ClipboardList,
    title: "Inscription au Tableau",
    desc: "Procédure complète d'inscription, pièces justificatives requises, délais de traitement.",
    badge: "Démarche",
    badgeColor: '#E8EDF5',
    badgeText: '#2A3E6B',
    tab: 'inscription',
  },
  {
    icon: CreditCard,
    title: "Cotisations Annuelles",
    desc: "Paiement en ligne sécurisé, suivi de vos règlements, téléchargement des reçus fiscaux.",
    badge: "Finance",
    badgeColor: '#E8F5EC',
    badgeText: '#2A6B3E',
    tab: 'inscription',
  },
  {
    icon: Building2,
    title: "Ouverture de Cabinet",
    desc: "Dossier de création, normes d'équipement obligatoires, autorisation d'exercice en libéral.",
    badge: "Installation",
    badgeColor: '#FEF3E8',
    badgeText: '#875A00',
    tab: 'installation',
  },
  {
    icon: FileText,
    title: "Contrats & Modèles",
    desc: "Bibliothèque de modèles : contrat de collaboration, contrat de remplacement, bail professionnel.",
    badge: "Juridique",
    badgeColor: '#FDEADE',
    badgeText: '#C4622D',
    tab: 'juridique',
  },
  {
    icon: BookMarked,
    title: "Attestations & Certificats",
    desc: "Attestation d'inscription, certificat de bonne conduite, relevé de formation DPC.",
    badge: "Documents",
    badgeColor: '#F3E8FE',
    badgeText: '#6B2A9B',
    tab: 'attestations',
  },
  {
    icon: Megaphone,
    title: "Publicité Professionnelle",
    desc: "Règles de communication autorisée, signalétique, référencement sur l'annuaire officiel.",
    badge: "Déontologie",
    badgeColor: '#E8F0FE',
    badgeText: '#1A3D8B',
    tab: 'installation',
  },
]

function adapterBareme(b: any) {
  return {
    id: b.id,
    category: b.secteur_display,
    montant: `${b.montant.toLocaleString('fr-FR')} FCFA`,
    echeance: `31 Mars ${new Date().getFullYear()}`,
  }
}

export default function PraticienPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const [activeTab, setActiveTab] = useState('inscription')
  const tabsRef = useRef<HTMLDivElement>(null)
  const [documentsJuridiques, setDocumentsJuridiques] = useState<any[]>([])
  const [cotisations, setCotisations] = useState<any[]>([])

  useEffect(() => {
    fetch(`${API_BASE}/api/bibliotheque/`)
      .then((res) => res.json())
      .then((data) =>
        setDocumentsJuridiques(
          data.filter((d: any) => d.categorie === 'juridique').map(adapterDocument)
        )
      )
      .catch((err) => console.error('Erreur API bibliothèque :', err))
  }, [])

  useEffect(() => {
    fetch(`${API_BASE}/api/bareme-cotisations/`)
      .then((res) => res.json())
      .then((data) => setCotisations(data.map(adapterBareme)))
      .catch((err) => console.error('Erreur API barème :', err))
  }, [])

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      <div className="relative overflow-hidden px-6 py-16">
        <div className="absolute inset-0" style={{ backgroundImage: "url('/page-header-bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0" style={{ backgroundColor: '#0C4A5A', opacity: 0.45 }} />
        <div className="relative max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#90C4A0' }}>
            Espace Professionnel
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Espace Praticien
          </h1>
          <p className="text-white/65 text-lg max-w-2xl">
            Gérez vos démarches administratives, accédez aux ressources juridiques et réglementaires de la profession.
          </p>
        </div>
      </div>

      <div
        className="px-6 py-3 text-sm flex items-center gap-3"
        style={{ backgroundColor: '#FEF3E8', borderBottom: '1px solid #F6D5AF' }}
      >
        <div className="max-w-7xl mx-auto w-full flex items-center gap-3">
          <AlertTriangle size={16} style={{ color: '#875A00' }} className="flex-shrink-0" />
          <span style={{ color: '#875A00' }}>
            <strong>Rappel :</strong> La date limite de renouvellement de cotisation 2025 est le 31 mars. Après cette date, des pénalités s'appliquent.
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8" style={{ fontFamily: 'var(--font-heading)' }}>
            Vos services en ligne
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s) => (
              <div
                key={s.title}
                onClick={() => {
                  setActiveTab(s.tab)
                  tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                className="p-6 rounded-xl cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all group"
                style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: s.badgeColor }}>
                    <s.icon size={18} style={{ color: s.badgeText }} />
                  </div>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: s.badgeColor, color: s.badgeText }}
                  >
                    {s.badge}
                  </span>
                </div>
                <h3 className="font-semibold text-sm mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  {s.title}
                </h3>
                <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--muted-foreground)' }}>
                  {s.desc}
                </p>
                <span className="text-xs font-semibold group-hover:underline flex items-center gap-1" style={{ color: 'var(--primary)' }}>
                  Accéder <ArrowRight size={12} />
                </span>
              </div>
            ))}
          </div>
        </div>

        <div ref={tabsRef}>
          <div className="flex gap-1 p-1 rounded-xl mb-8 flex-wrap" style={{ backgroundColor: 'var(--muted)' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="px-4 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                style={{
                  backgroundColor: activeTab === tab.id ? 'var(--card)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--primary)' : 'var(--muted-foreground)',
                  boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'inscription' && (
            <div>
              <h3 className="text-xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
                Barème des Cotisations 2025
              </h3>
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
                      <th className="text-left px-6 py-3.5 text-xs font-semibold">Catégorie</th>
                      <th className="text-left px-6 py-3.5 text-xs font-semibold">Montant</th>
                      <th className="text-left px-6 py-3.5 text-xs font-semibold">Échéance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cotisations.map((row, i) => (
                      <tr
                        key={row.id}
                        style={{ backgroundColor: i % 2 === 0 ? 'var(--card)' : 'var(--muted)' }}
                      >
                        <td className="px-6 py-4 font-medium text-sm">{row.category}</td>
                        <td className="px-6 py-4 font-semibold text-sm" style={{ color: 'var(--primary)' }}>
                          {row.montant}
                        </td>
                        <td className="px-6 py-4 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                          {row.echeance}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                className="mt-6 px-6 py-3 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 cursor-pointer flex items-center gap-1.5"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                Payer ma cotisation en ligne <ArrowRight size={16} />
              </button>
            </div>
          )}

          {activeTab === 'installation' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
                Conditions d'Installation
              </h3>
              {[
                {
                  num: '01',
                  title: 'Diplôme reconnu',
                  desc: "Être titulaire d'un diplôme de Chirurgien-Dentiste reconnu par le Burkina Faso ou équivalence validée.",
                },
                {
                  num: '02',
                  title: "Inscription au Tableau de l'Ordre",
                  desc: "Fournir le dossier complet (diplôme, casier judiciaire, photos, formulaire d'inscription) et s'acquitter de la cotisation.",
                },
                {
                  num: '03',
                  title: 'Normes du cabinet',
                  desc: 'Respecter les normes d\'équipement (fauteuil dentaire, stérilisation, rayonnement X) conformément à l\'arrêté ministériel 2025.',
                },
                {
                  num: '04',
                  title: "Autorisation d'exercice",
                  desc: "Obtenir l'autorisation du Ministère de la Santé après visite de conformité du cabinet.",
                },
              ].map((step) => (
                <div
                  key={step.num}
                  className="flex gap-5 p-5 rounded-xl"
                  style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ backgroundColor: 'var(--primary)', fontFamily: 'var(--font-heading)' }}
                  >
                    {step.num}
                  </div>
                  <div>
                    <div className="font-semibold text-sm mb-1">{step.title}</div>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'juridique' && (
            <div>
              <h3 className="text-xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
                Bibliothèque Juridique
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documentsJuridiques.length === 0 ? (
                  <p className="text-sm md:col-span-2" style={{ color: 'var(--muted-foreground)' }}>
                    Aucun document disponible pour le moment.
                  </p>
                ) : (
                  documentsJuridiques.map((doc) => (
                    
                     <a key={doc.id}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 rounded-xl cursor-pointer hover:shadow-sm transition-all"
                      style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                          style={{ backgroundColor: doc.type === 'PDF' ? '#C4622D' : '#0C4A5A' }}
                        >
                          {doc.type}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{doc.title}</div>
                          <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                            {doc.size} · Mis à jour {doc.updated}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-semibold" style={{ color: 'var(--primary)' }}>
                        <Download size={16} />
                      </span>
                    </a>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'attestations' && (
            <div>
              <h3 className="text-xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
                Mes Attestations
              </h3>
              <div
                className="rounded-xl p-8 text-center"
                style={{ backgroundColor: 'var(--muted)', border: '1px dashed var(--border)' }}
              >
                <Lock size={36} className="mx-auto mb-4" style={{ color: 'var(--muted-foreground)' }} />
                <p className="font-semibold mb-2">Connexion requise</p>
                <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>
                  Connectez-vous à votre espace membre pour accéder à vos attestations personnelles.
                </p>
                <button
                  onClick={() => onNavigate('compte')}
                  className="px-6 py-3 rounded-lg text-sm font-semibold text-white cursor-pointer"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  Se connecter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}