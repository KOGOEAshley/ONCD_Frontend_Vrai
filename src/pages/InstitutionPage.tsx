import { useState, useEffect } from 'react'
import { Scale, ClipboardList, GraduationCap, Handshake, Globe, BarChart3 } from 'lucide-react'

const API_BASE = ''

function urlFichier(chemin: string | null | undefined) {
  if (!chemin) return null
  return chemin.startsWith('http') ? chemin : `${API_BASE}${chemin}`
}

function adapterMembre(m: any) {
  return {
    id: m.id,
    name: m.nom,
    role: m.fonction,
    region: m.region,
    photoUrl: urlFichier(m.photo),
  }
}

const missions = [
  {
    icon: Scale,
    title: 'Régulation de la Profession',
    desc: "Vérification des titres et aptitudes des praticiens, inscription au tableau de l'Ordre, contrôle de l'exercice légal.",
  },
  {
    icon: ClipboardList,
    title: 'Déontologie & Éthique',
    desc: "Élaboration et mise à jour du code de déontologie, gestion des litiges entre praticiens et patients, instances disciplinaires.",
  },
  {
    icon: GraduationCap,
    title: 'Formation Continue',
    desc: 'Organisation de congrès, ateliers et programmes DPC pour maintenir le haut niveau de compétences des praticiens.',
  },
  {
    icon: Handshake,
    title: 'Représentation Institutionnelle',
    desc: 'Représentation de la profession auprès des pouvoirs publics, des organisations internationales et des partenaires.',
  },
  {
    icon: Globe,
    title: 'Santé Publique',
    desc: "Promotion de la santé bucco-dentaire nationale, campagnes de sensibilisation, partenariats avec le Ministère de la Santé.",
  },
  {
    icon: BarChart3,
    title: 'Annuaire Officiel',
    desc: 'Tenue du tableau officiel des chirurgiens-dentistes inscrits et habilités à exercer sur le territoire burkinabè.',
  },
]

const timeline = [
  { year: '1985', event: "Création de l'Ordre National des Chirurgiens-Dentistes" },
  { year: '1992', event: 'Adoption du premier Code de Déontologie Dentaire' },
  { year: '2001', event: 'Premier Congrès National de Chirurgie Dentaire — Ouagadougou' },
  { year: '2010', event: 'Lancement du programme de formation continue obligatoire' },
  { year: '2018', event: "Partenariat avec l'UNECD Afrique de l'Ouest" },
  { year: '2022', event: 'Déploiement de la plateforme numérique de gestion des membres' },
  { year: '2025', event: "18e Congrès National & refonte du portail de l'Ordre" },
]

export default function InstitutionPage() {
  const [governance, setGovernance] = useState<any[]>([])

  useEffect(() => {
    fetch(`${API_BASE}/api/conseil/`)
      .then((res) => res.json())
      .then((data) => setGovernance(data.map(adapterMembre)))
      .catch((err) => console.error('Erreur API conseil :', err))
  }, [])

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      {/* Header */}
      <div className="relative overflow-hidden px-6 py-16">
        <div className="absolute inset-0" style={{ backgroundImage: "url('/page-header-bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0" style={{ backgroundColor: 'var(--primary)', opacity: 0.45 }} />
        <div className="relative max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#E8956A' }}>
            Qui sommes-nous ?
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            L'Institution
          </h1>
          <p className="text-white/65 text-lg max-w-2xl leading-relaxed">
            L'Ordre National des Chirurgiens-Dentistes du Burkina Faso est l'instance représentative officielle de la profession, reconnue par l'État.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Missions */}
        <div className="mb-20">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--accent)' }}>
            Nos missions
          </p>
          <h2 className="text-3xl font-bold mb-10" style={{ fontFamily: 'var(--font-heading)' }}>
            Ce que nous faisons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {missions.map((m) => (
              <div
                key={m.title}
                className="p-6 rounded-xl"
                style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <m.icon size={30} className="mb-4" style={{ color: 'var(--primary)' }} strokeWidth={1.75} />
                <h3 className="font-semibold text-sm mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  {m.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Governance */}
        <div className="mb-20">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--accent)' }}>
            Gouvernance
          </p>
          <h2 className="text-3xl font-bold mb-8" style={{ fontFamily: 'var(--font-heading)' }}>
            Conseil de l'Ordre
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {governance.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-4 p-5 rounded-xl"
                style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
              >
                {member.photoUrl ? (
                  <img
                    src={member.photoUrl}
                    alt={member.name}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                    style={{ backgroundColor: 'var(--primary)' }}
                  >
                    {member.name.split(' ').pop()?.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="font-semibold text-sm">{member.name}</div>
                  <div className="text-xs font-medium" style={{ color: 'var(--accent)' }}>
                    {member.role}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    Région {member.region}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--accent)' }}>
            Notre histoire
          </p>
          <h2 className="text-3xl font-bold mb-10" style={{ fontFamily: 'var(--font-heading)' }}>
            40 ans de la profession
          </h2>
          <div className="relative">
            <div
              className="absolute left-16 top-0 bottom-0 w-px"
              style={{ backgroundColor: 'var(--border)' }}
            />
            <div className="space-y-6">
              {timeline.map((item) => (
                <div key={item.year} className="flex items-start gap-6">
                  <div
                    className="w-12 text-right flex-shrink-0 font-bold text-sm pt-0.5"
                    style={{ color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}
                  >
                    {item.year}
                  </div>
                  <div className="relative flex-shrink-0 mt-1.5">
                    <div
                      className="w-4 h-4 rounded-full border-2 relative z-10"
                      style={{ backgroundColor: 'var(--accent)', borderColor: 'var(--background)' }}
                    />
                  </div>
                  <div
                    className="text-sm pb-6"
                    style={{ color: 'var(--muted-foreground)', paddingLeft: '0.25rem' }}
                  >
                    {item.event}
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
