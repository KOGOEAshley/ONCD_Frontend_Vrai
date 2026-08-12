import { useState, useRef, useEffect } from 'react'
import {
  Home, Landmark, Stethoscope, GraduationCap, Store, BookOpen, Users,
  BarChart3, MapPin, Newspaper, Lock, Menu, X, ChevronDown,
} from 'lucide-react'

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

const navItems: { label: string; page: Page; icon: typeof Home }[] = [
  { label: 'Accueil', page: 'home', icon: Home },
  { label: 'Institution', page: 'institution', icon: Landmark },
  { label: 'Praticiens', page: 'praticien', icon: Stethoscope },
  { label: 'Formation', page: 'formation', icon: GraduationCap },
  { label: 'Exposition', page: 'exposition', icon: Store },
  { label: 'Étudiants', page: 'etudiants', icon: BookOpen },
  { label: 'Patients', page: 'patients', icon: Users },
  { label: 'Annuaire', page: 'annuaire', icon: BarChart3 },
  { label: 'Carte', page: 'geolocal', icon: MapPin },
  { label: 'Actualités', page: 'actualites', icon: Newspaper },
]

export default function NavBar({ currentPage, onNavigate }: NavBarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Ferme le menu "Plus" si on clique n'importe où en dehors de lui
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
            <button
              onClick={() => onNavigate('compte')}
              className="text-xs text-white bg-white/10 hover:bg-white/20 transition-colors px-3 py-1 rounded-full cursor-pointer"
            >
              <Lock size={12} className="inline mr-1 -mt-0.5" />
              Espace Membre
            </button>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img
              src="/logo-oncdbf.png"
              alt="Logo ONCD Burkina"
              className="w-10 h-10 rounded-full shadow-md object-contain bg-white"
            />
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
                className={`text-sm px-3 py-2 rounded-md transition-all cursor-pointer ${
                  currentPage === item.page
                    ? 'bg-white/20 text-white font-semibold'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="text-sm px-3 py-2 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer flex items-center gap-1"
              >
                Plus <ChevronDown size={14} />
              </button>
              {dropdownOpen && (
                <div
                  className="absolute right-0 top-full mt-1 w-48 rounded-lg shadow-xl py-1 z-50"
                  style={{ backgroundColor: 'var(--primary)', border: '1px solid rgba(255,255,255,0.15)' }}
                >
                  {navItems.slice(7).map((item) => (
                    <button
                      key={item.page}
                      onClick={() => { onNavigate(item.page); setDropdownOpen(false) }}
                      className="w-full text-left text-xs px-4 py-2.5 text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <item.icon size={14} />
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
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
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
                <item.icon size={16} />
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
