import type { Page } from '../components/NavBar'
import {
  Sparkles, Waves, Apple, CalendarDays, BarChart3, MapPin, ArrowRight,
  ClipboardList, PenLine, Lock,
} from 'lucide-react'

interface PatientsPageProps {
  onNavigate: (page: Page) => void
}

const conseils = [
  {
    icon: Sparkles,
    title: 'Brossage quotidien',
    desc: '2 fois par jour, 2 minutes, avec une brosse à poils souples. Remplacez votre brosse tous les 3 mois.',
    color: '#E8F5EC',
    textColor: '#0C4A5A',
  },
  {
    icon: Waves,
    title: 'Fil dentaire',
    desc: 'Utilisez le fil dentaire au moins une fois par jour pour éliminer la plaque entre les dents inaccessibles à la brosse.',
    color: '#E8EDF5',
    textColor: '#1A3D6B',
  },
  {
    icon: Apple,
    title: 'Alimentation',
    desc: 'Réduisez les sucres raffinés et les boissons acides. Privilégiez les fruits frais, légumes et produits laitiers.',
    color: '#FEF3E8',
    textColor: '#5A2E00',
  },
  {
    icon: CalendarDays,
    title: 'Consultation régulière',
    desc: 'Consultez votre dentiste tous les 6 mois, même sans douleur. La prévention est moins coûteuse que le traitement.',
    color: '#FDEADE',
    textColor: '#7A3010',
  },
]

const urgences = [
  {
    situation: 'Douleur intense',
    conseil: 'Appelez votre dentiste en urgence. En dehors des heures, rendez-vous aux urgences du CHU.',
    niveau: 'Urgent',
  },
  {
    situation: 'Dent cassée',
    conseil: 'Conservez le fragment dans du lait ou de la salive. Consultez dans les 2h.',
    niveau: 'Urgent',
  },
  {
    situation: 'Dent délogée (avulsée)',
    conseil: "Replacez délicatement si possible ou conservez dans du lait. Consultez IMMÉDIATEMENT.",
    niveau: 'Critique',
  },
  {
    situation: 'Saignement gingival',
    conseil: 'Appuyez avec une compresse propre 15 min. Si persistant, consultez.',
    niveau: 'Modéré',
  },
  {
    situation: 'Gonflement de la joue',
    conseil: 'Peut indiquer un abcès. Consultez dans les 24h, appliquez une poche de froid.',
    niveau: 'Urgent',
  },
]

const niveauStyle: Record<string, { bg: string; text: string }> = {
  Critique: { bg: '#FDEADE', text: '#C4622D' },
  Urgent: { bg: '#FEF3E8', text: '#875A00' },
  Modéré: { bg: '#E8F5EC', text: '#2A6B3E' },
}

export default function PatientsPage({ onNavigate }: PatientsPageProps) {
  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      {/* Header */}
      <div className="relative overflow-hidden px-6 py-16">
        <div className="absolute inset-0" style={{ backgroundImage: "url('/page-header-bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0" style={{ backgroundColor: '#5C2A0E', opacity: 0.45 }} />
        <div className="relative max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#E8956A' }}>
            Information Citoyenne
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Espace Grand Public
          </h1>
          <p className="text-white/65 text-lg max-w-2xl">
            Trouvez un dentiste certifié, informez-vous sur la prévention bucco-dentaire et les protocoles d'urgence.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Find a dentist CTA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div
            className="rounded-2xl p-8 cursor-pointer hover:shadow-xl transition-all group"
            onClick={() => onNavigate('annuaire')}
            style={{ backgroundColor: 'var(--primary)', color: 'white' }}
          >
            <BarChart3 size={36} className="mb-4" strokeWidth={1.75} />
            <h2
              className="text-2xl font-bold mb-3"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Annuaire des Dentistes
            </h2>
            <p className="text-white/70 text-sm mb-5 leading-relaxed">
              Consultez la liste officielle de tous les chirurgiens-dentistes certifiés du Burkina Faso, filtrée par région et spécialité.
            </p>
            <span className="text-sm font-semibold group-hover:underline flex items-center gap-1">
              Rechercher un dentiste <ArrowRight size={14} />
            </span>
          </div>
          <div
            className="rounded-2xl p-8 cursor-pointer hover:shadow-xl transition-all group"
            onClick={() => onNavigate('geolocal')}
            style={{ backgroundColor: '#2A3E6B', color: 'white' }}
          >
            <MapPin size={36} className="mb-4" strokeWidth={1.75} />
            <h2
              className="text-2xl font-bold mb-3"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Cliniques à Proximité
            </h2>
            <p className="text-white/70 text-sm mb-5 leading-relaxed">
              Localisez les cabinets dentaires et cliniques les plus proches de votre position sur la carte interactive.
            </p>
            <span className="text-sm font-semibold group-hover:underline flex items-center gap-1">
              Voir la carte <ArrowRight size={14} />
            </span>
          </div>
        </div>

        {/* Prevention */}
        <div className="mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--accent)' }}>
            Prévention
          </p>
          <h2 className="text-3xl font-bold mb-8" style={{ fontFamily: 'var(--font-heading)' }}>
            Conseils Bucco-Dentaires
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {conseils.map((c) => (
              <div
                key={c.title}
                className="p-6 rounded-xl"
                style={{ backgroundColor: c.color }}
              >
                <c.icon size={28} className="mb-3" style={{ color: c.textColor }} strokeWidth={1.75} />
                <h3
                  className="font-bold text-sm mb-2"
                  style={{ fontFamily: 'var(--font-heading)', color: c.textColor }}
                >
                  {c.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: `${c.textColor}CC` }}>
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Urgencies */}
        <div className="mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--accent)' }}>
            Urgences
          </p>
          <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            Que faire en cas d'urgence ?
          </h2>
          <p className="text-sm mb-8" style={{ color: 'var(--muted-foreground)' }}>
            Numéro d'urgence dentaire ONCD : <strong style={{ color: 'var(--accent)' }}>+226 25 XX XX XX</strong> (24h/24)
          </p>
          <div className="space-y-3">
            {urgences.map((u) => (
              <div
                key={u.situation}
                className="flex items-start gap-5 p-5 rounded-xl"
                style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 mt-0.5"
                  style={{
                    backgroundColor: niveauStyle[u.niveau].bg,
                    color: niveauStyle[u.niveau].text,
                  }}
                >
                  {u.niveau}
                </span>
                <div>
                  <div className="font-semibold text-sm mb-1">{u.situation}</div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                    {u.conseil}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Droits des patients */}
        <div
          className="rounded-2xl p-8"
          style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)' }}
        >
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
            Vos Droits en tant que Patient
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: ClipboardList,
                title: "Droit à l'information",
                desc: "Vous avez le droit d'être informé clairement sur votre état de santé, les traitements proposés et leurs coûts.",
              },
              {
                icon: PenLine,
                title: 'Consentement éclairé',
                desc: 'Aucun acte médical ne peut être réalisé sans votre consentement explicite et informé.',
              },
              {
                icon: Lock,
                title: 'Confidentialité',
                desc: 'Vos données médicales sont protégées par le secret professionnel. Elles ne peuvent être partagées sans votre accord.',
              },
            ].map((d) => (
              <div key={d.title}>
                <d.icon size={26} className="mb-3" style={{ color: 'var(--primary)' }} strokeWidth={1.75} />
                <h3
                  className="font-semibold text-sm mb-2"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {d.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                  {d.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
