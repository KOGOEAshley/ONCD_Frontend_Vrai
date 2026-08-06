import { useState, useEffect } from 'react'
import type { Page } from '../components/NavBar'
import CompteurAnime from '../components/CompteurAnime'
import {
  Stethoscope, GraduationCap, Users, MapPin, Landmark, Smile,
  CalendarDays, Store, BarChart3, Newspaper, ArrowRight,
} from 'lucide-react'

interface HomePageProps {
  onNavigate: (page: Page) => void
}

const profileCards = [
  {
    id: 'praticien' as Page,
    icon: Stethoscope,
    title: 'Je suis Praticien',
    subtitle: 'Chirurgien-Dentiste',
    description: 'Gérez vos démarches administratives, cotisations et accédez aux ressources professionnelles.',
    cta: 'Espace Praticien',
    bg: '#0C4A5A',
    accent: '#1A7A8E',
  },
  {
    id: 'etudiants' as Page,
    icon: GraduationCap,
    title: "Je suis Étudiant",
    subtitle: 'Interne / Futur Dentiste',
    description: 'Parcours universitaire, gestion des stages et préparation à l\'exercice professionnel.',
    cta: 'Espace Étudiants',
    bg: '#2A3E6B',
    accent: '#4A6FA5',
  },
  {
    id: 'patients' as Page,
    icon: Users,
    title: 'Je suis Patient',
    subtitle: 'Grand Public',
    description: 'Trouvez un dentiste certifié, conseils de prévention et urgences bucco-dentaires.',
    cta: 'Espace Patients',
    bg: '#5C2A0E',
    accent: '#C4622D',
  },
]

const stats = [
  { value: '487', label: 'Praticiens inscrits', icon: Stethoscope },
  { value: '13', label: 'Régions couvertes', icon: MapPin },
  { value: '34', label: 'Ans d\'existence', icon: Landmark },
  { value: '1 200+', label: 'Patients par an', icon: Smile },
]

function formaterDateCourte(dateIso: string) {
  const d = new Date(dateIso)
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

function adapterNews(a: any) {
  return {
    date: formaterDateCourte(a.date_publication),
    category: a.categorie,
    title: a.titre,
    excerpt: a.extrait,
  }
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [news, setNews] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/actualites/')
      .then((res) => res.json())
      .then((data) => setNews(data.slice(0, 3).map(adapterNews)))
      .catch((err) => console.error('Erreur API actualités :', err))
  }, [])

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: 'var(--primary)', minHeight: '540px' }}
      >
        {/* Photo en plein fond, balayage révélé de gauche à droite */}
        <div
          className="absolute inset-0 animate-wipe-reveal-left"
          style={{
            backgroundImage: "url('/bg-dentiste.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* Dégradé sombre côté texte, plus léger côté compteurs, pour garder tout lisible */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, rgba(14,79,102,0.55) 0%, rgba(14,79,102,0.35) 45%, rgba(14,79,102,0.1) 100%)',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          <div>
            <div
              className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full mb-6"
              style={{ backgroundColor: 'rgba(196,98,45,0.2)', color: '#E8956A', border: '1px solid rgba(196,98,45,0.3)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              Inscriptions ouvertes — Congrès 2025
            </div>
            <h1
              className="text-5xl lg:text-6xl font-bold leading-tight text-white mb-6"
              style={{ fontFamily: 'var(--font-heading)', textShadow: '0 2px 12px rgba(0,0,0,0.35)' }}
            >
              Ensemble pour
              <br />
              <span style={{ color: '#E8956A' }}>la santé bucco-</span>
              <br />
              dentaire
            </h1>
            <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-lg">
              L'Ordre National des Chirurgiens-Dentistes du Burkina Faso — régulation, formation et promotion de la santé orale depuis 1985.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('annuaire')}
                className="px-6 py-3 rounded-lg font-semibold text-white text-sm transition-all hover:opacity-90 cursor-pointer flex items-center gap-1.5"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                Trouver un dentiste <ArrowRight size={16} />
              </button>
              <button
                onClick={() => onNavigate('institution')}
                className="px-6 py-3 rounded-lg font-semibold text-sm transition-all cursor-pointer"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                Notre institution
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="relative flex items-center p-6 animate-slide-in-right">
            <div className="grid grid-cols-2 gap-3 w-full">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg p-3.5 backdrop-blur-sm"
                  style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}
                >
                  <stat.icon size={18} className="text-white/70 mb-1.5" strokeWidth={1.75} />
                  <div
                    className="text-xl font-bold text-white mb-0.5"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {<CompteurAnime valeur={stat.value} />}
                  </div>
                  <div className="text-xs text-white/60 leading-tight">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Profile access cards */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-10 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {profileCards.map((card) => (
            <button
              key={card.id}
              onClick={() => onNavigate(card.id)}
              className="text-left rounded-2xl p-6 cursor-pointer group transition-all hover:-translate-y-1 hover:shadow-2xl"
              style={{ backgroundColor: card.bg, border: `1px solid ${card.accent}30` }}
            >
              <card.icon className="w-8 h-8 mb-4 text-white" strokeWidth={1.75} />
              <div className="text-lg font-bold text-white mb-0.5" style={{ fontFamily: 'var(--font-heading)' }}>
                {card.title}
              </div>
              <div className="text-xs font-medium mb-3" style={{ color: card.accent === '#C4622D' ? '#E8956A' : '#90C4A0' }}>
                {card.subtitle}
              </div>
              <p className="text-sm text-white/60 leading-relaxed mb-5">{card.description}</p>
              <div
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white group-hover:gap-2.5 transition-all"
              >
                {card.cta} <ArrowRight size={14} />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Quick access row */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="flex flex-wrap gap-3 justify-center">
          {[
            { label: 'Événements & Congrès', page: 'formation' as Page, icon: CalendarDays },
            { label: 'Exposition Dentaire', page: 'exposition' as Page, icon: Store },
            { label: 'Annuaire des Dentistes', page: 'annuaire' as Page, icon: BarChart3 },
            { label: 'Localiser une Clinique', page: 'geolocal' as Page, icon: MapPin },
            { label: 'Actualités Médicales', page: 'actualites' as Page, icon: Newspaper },
          ].map((item) => (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all hover:shadow-md cursor-pointer"
              style={{
                backgroundColor: 'var(--card)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
              }}
            >
              <item.icon size={16} />
              {item.label}
            </button>
          ))}
        </div>
      </section>

      {/* News section */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--accent)' }}>
              Dernières nouvelles
            </p>
            <h2 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
              Actualités de l'Ordre
            </h2>
          </div>
          <button
            onClick={() => onNavigate('actualites')}
            className="text-sm font-medium text-primary cursor-pointer flex items-center gap-1"
            style={{ color: 'var(--primary)' }}
          >
            Toutes les actualités <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((item) => (
            <article
              key={item.title}
              className="rounded-xl overflow-hidden group cursor-pointer hover:-translate-y-0.5 transition-all hover:shadow-lg"
              style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <div
                className="h-2"
                style={{
                  backgroundColor:
                    item.category === 'Formation'
                      ? 'var(--secondary)'
                      : item.category === 'Alerte sanitaire'
                      ? '#E05F2A'
                      : 'var(--primary)',
                }}
              />
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor:
                        item.category === 'Formation'
                          ? '#E8F5EC'
                          : item.category === 'Alerte sanitaire'
                          ? '#FDEADE'
                          : '#E8EDF5',
                      color:
                        item.category === 'Formation'
                          ? '#2A6B3E'
                          : item.category === 'Alerte sanitaire'
                          ? '#C4622D'
                          : '#2A3E6B',
                    }}
                  >
                    {item.category}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    {item.date}
                  </span>
                </div>
                <h3
                  className="font-semibold text-sm leading-snug mb-2"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {item.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                  {item.excerpt}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div
          className="rounded-2xl p-10 md:p-14 text-center"
          style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, #175E72 100%)',
          }}
        >
          <h2
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Rejoignez l'Ordre National
          </h2>
          <p className="text-white/70 mb-8 max-w-xl mx-auto text-sm leading-relaxed">
            Inscrivez-vous ou renouvelez votre adhésion pour bénéficier de tous les services de l'Ordre — formation continue, attestations, annuaire officiel.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => onNavigate('compte')}
              className="px-8 py-3.5 rounded-lg font-semibold text-sm transition-all hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: 'var(--accent)', color: 'white' }}
            >
              S'inscrire à l'Ordre
            </button>
            <button
              onClick={() => onNavigate('institution')}
              className="px-8 py-3.5 rounded-lg font-semibold text-sm transition-all cursor-pointer"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              En savoir plus
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}