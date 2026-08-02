import type { Page } from './NavBar'
import { MapPin, Phone, Mail, ArrowRight } from 'lucide-react'

interface FooterProps {
  onNavigate: (page: Page) => void
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer style={{ backgroundColor: '#071E26', color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-body)' }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/logo-oncdbf.png"
                alt="Logo ONCD Burkina"
                className="w-10 h-10 rounded-full bg-white"
              />
              <div>
                <div className="text-white font-semibold text-sm" style={{ fontFamily: 'var(--font-heading)' }}>
                  ONCD Burkina
                </div>
                <div className="text-white/40 text-xs">Depuis 1985</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-white/60">
              Ordre National des Chirurgiens-Dentistes du Burkina Faso. Régulation, formation et défense de la profession.
            </p>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-widest text-xs">
              Institution
            </h4>
            <ul className="space-y-2 text-sm text-white/60">
              {[
                ['Notre histoire', 'institution'],
                ['Gouvernance', 'institution'],
                ['Déontologie', 'institution'],
                ['Textes officiels', 'institution'],
              ].map(([label, page]) => (
                <li key={label}>
                  <button
                    onClick={() => onNavigate(page as Page)}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-widest text-xs">
              Espaces
            </h4>
            <ul className="space-y-2 text-sm text-white/60">
              {[
                ['Praticiens', 'praticien'],
                ['Étudiants', 'etudiants'],
                ['Grand public', 'patients'],
                ['Formation continue', 'formation'],
              ].map(([label, page]) => (
                <li key={label}>
                  <button
                    onClick={() => onNavigate(page as Page)}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-widest text-xs">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li className="flex items-center gap-2"><MapPin size={14} /> Ouagadougou, Burkina Faso</li>
              <li className="flex items-center gap-2"><Phone size={14} /> +226 25 30 XX XX</li>
              <li className="flex items-center gap-2"><Mail size={14} /> contact@oncd-bf.org</li>
              <li className="pt-2">
                <button
                  onClick={() => onNavigate('compte')}
                  className="text-xs px-4 py-2 rounded-full text-white cursor-pointer transition-colors flex items-center gap-1.5"
                  style={{ backgroundColor: 'var(--accent)' }}
                >
                  Espace Membre <ArrowRight size={14} />
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/30">
          <p>© 2025 ONCD Burkina Faso. Tous droits réservés.</p>
          <div className="flex gap-6">
            <span className="hover:text-white/60 cursor-pointer transition-colors">Mentions légales</span>
            <span className="hover:text-white/60 cursor-pointer transition-colors">Politique de confidentialité</span>
            <span className="hover:text-white/60 cursor-pointer transition-colors">Accessibilité</span>
          </div>
        </div>
      </div>
    </footer>
  )
}