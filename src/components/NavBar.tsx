import { useState } from 'react'

type Page =
  | 'home'
  | 'institution'
  | 'praticien'
  | 'formation'
  | 'exposition'
  | 'etudiants'
  | 'patients'
  | 'annuaire'
  | 'geolocal'
  | 'actualites'
  | 'compte'

interface NavBarProps {
  currentPage: Page
  onNavigate: (page: Page) => void
}

const navItems: { label: string; page: Page; icon: string }[] = [
  { label: 'Accueil', page: 'home', icon: '🏠' },
  { label: 'Institution', page: 'institution', icon: '🏛️' },
  { label: 'Praticiens', page: 'praticien', icon: '🩺' },
  { label: 'Formation', page: 'formation', icon: '🎓' },
  { label: 'Exposition', page: 'exposition', icon: '🏛️' },
  { label: 'Étudiants', page: 'etudiants', icon: '📚' },
  { label: 'Patients', page: 'patients', icon: '👥' },
  { label: 'Annuaire', page: 'annuaire', icon: '📊' },
  { label: 'Carte', page: 'geolocal', icon: '📍' },
  { label: 'Actualités', page: 'actualites', icon: '📰' },
]

export default function NavBar({ currentPage, onNavigate }: NavBarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <nav
      style={{ fontFamily: 'var(--font-body)', backgroundColor: 'var(--primary)' }}
      className="sticky top-0 z-50 shadow-lg"
    >
      {/* Top bar */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between">
          <p className="text-white/60 text-xs">
            Ordre National des Chirurgiens-Dentistes du Burkina Faso
          </p>
          <div className="flex items-center gap-4">
            <span className="text-white/60 text-xs">+226 25 30 XX XX</span>
            <button
              onClick={() => onNavigate('compte')}
              className="text-xs text-white bg-white/10 hover:bg-white/20 transition-colors px-3 py-1 rounded-full cursor-pointer"
            >
              🔒 Espace Membre
            </button>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shadow-md"
              style={{ backgroundColor: 'var(--accent)', color: 'white' }}
            >
              ✦
            </div>
            <div className="leading-tight">
              <div
                className="text-white font-semibold text-sm"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                ONCD Burkina
              </div>
              <div className="text-white/50 text-xs">Chirurgiens-Dentistes</div>
            </div>
          </button>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.slice(0, 7).map((item) => (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={`text-xs px-3 py-2 rounded-md transition-all cursor-pointer ${
                  currentPage === item.page
                    ? 'bg-white/20 text-white font-semibold'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="relative">
              <button
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
                className="text-xs px-3 py-2 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                Plus ▾
              </button>
              {dropdownOpen && (
                <div
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                  className="absolute right-0 top-full mt-1 w-48 rounded-lg shadow-xl py-1 z-50"
                  style={{ backgroundColor: 'var(--primary)', border: '1px solid rgba(255,255,255,0.15)' }}
                >
                  {navItems.slice(7).map((item) => (
                    <button
                      key={item.page}
                      onClick={() => { onNavigate(item.page); setDropdownOpen(false) }}
                      className="w-full text-left text-xs px-4 py-2.5 text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-white/80 hover:text-white p-2 cursor-pointer"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-white/10 max-w-7xl mx-auto px-4 pb-4">
          <div className="grid grid-cols-2 gap-1 pt-3">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => { onNavigate(item.page); setMenuOpen(false) }}
                className={`flex items-center gap-2 text-xs px-3 py-2.5 rounded-md transition-all cursor-pointer ${
                  currentPage === item.page
                    ? 'bg-white/20 text-white font-semibold'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

export type { Page }
