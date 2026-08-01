import { useState } from 'react'

const articles = [
  {
    id: 1,
    categorie: 'Formation',
    titre: '18e Congrès National de Chirurgie Dentaire — Programme définitif publié',
    date: '22 Juillet 2025',
    extrait: 'Le programme complet du congrès annuel est disponible. Cette édition met l\'accent sur l\'implantologie numérique, la parodontologie et la gestion du risque infectieux.',
    auteur: 'ONCD Communication',
    lecture: '3 min',
  },
  {
    id: 2,
    categorie: 'Réglementation',
    titre: 'Arrêté N°2025-047 : Nouvelles normes d\'équipement des cabinets dentaires',
    date: '15 Juillet 2025',
    extrait: 'Le Ministère de la Santé a promulgué un arrêté actualisant les exigences minimales d\'équipement pour l\'ouverture d\'un cabinet dentaire au Burkina Faso.',
    auteur: 'Secrétariat ONCD',
    lecture: '5 min',
  },
  {
    id: 3,
    categorie: 'Alerte sanitaire',
    titre: 'Mise en garde sur un produit d\'anesthésie contrefait signalé à Ouagadougou',
    date: '10 Juillet 2025',
    extrait: 'Des lots de lidocaïne ne répondant pas aux normes ont été repérés dans certaines officines. L\'ONCD recommande aux praticiens de ne s\'approvisionner qu\'auprès de distributeurs agréés.',
    auteur: 'Commission Scientifique ONCD',
    lecture: '2 min',
  },
  {
    id: 4,
    categorie: 'Santé publique',
    titre: 'Campagne nationale "Souris Burkina" : résultats du dépistage scolaire 2025',
    date: '4 Juillet 2025',
    extrait: '14 200 enfants examinés dans 8 régions. 62% présentent au moins une carie non soignée. L\'ONCD appelle à renforcer l\'accès aux soins dentaires pédiatriques.',
    auteur: 'Dr. Fatimata Ouédraogo',
    lecture: '6 min',
  },
  {
    id: 5,
    categorie: 'International',
    titre: 'L\'ONCD rejoint la Fédération Dentaire Internationale (FDI)',
    date: '28 Juin 2025',
    extrait: 'Le Burkina Faso est officiellement membre de la FDI depuis le 1er juillet 2025, ouvrant l\'accès aux programmes de coopération internationale et de formation.',
    auteur: 'Président ONCD',
    lecture: '4 min',
  },
  {
    id: 6,
    categorie: 'Déontologie',
    titre: 'Mise à jour du Code de Déontologie Dentaire 2025',
    date: '20 Juin 2025',
    extrait: 'La révision quinquennale du code intègre de nouvelles dispositions sur la télémédecine, la protection des données patients et la publicité professionnelle.',
    auteur: 'Conseil de l\'Ordre',
    lecture: '8 min',
  },
]

const allCats = ['Tous', ...Array.from(new Set(articles.map((a) => a.categorie)))]

const catColor: Record<string, { bg: string; text: string }> = {
  Formation: { bg: '#E8F5EC', text: '#2A6B3E' },
  Réglementation: { bg: '#E8EDF5', text: '#2A3E6B' },
  'Alerte sanitaire': { bg: '#FDEADE', text: '#C4622D' },
  'Santé publique': { bg: '#FEF3E8', text: '#875A00' },
  International: { bg: '#F3E8FE', text: '#6B2A9B' },
  Déontologie: { bg: '#E8F0FE', text: '#1A3D8B' },
}

export default function ActualitesPage() {
  const [cat, setCat] = useState('Tous')
  const filtered = cat === 'Tous' ? articles : articles.filter((a) => a.categorie === cat)

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#1C1A17' }} className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#B8A890' }}>
            Centre de Veille
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Actualités & Publications
          </h1>
          <p className="text-white/65 text-lg max-w-2xl">
            Informations médicales, scientifiques, réglementaires et alertes sanitaires pour la profession dentaire au Burkina Faso.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Featured */}
        <div
          className="rounded-2xl mb-12 overflow-hidden cursor-pointer hover:shadow-xl transition-all group"
          style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <div
            className="h-3"
            style={{ backgroundColor: '#C4622D' }}
          />
          <div className="p-8 md:p-10">
            <div className="flex items-center gap-3 mb-4">
              <span
                className="text-xs font-bold px-3 py-1 rounded-full"
                style={{ backgroundColor: '#E8F5EC', color: '#2A6B3E' }}
              >
                ⭐ À la une
              </span>
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                22 Juillet 2025
              </span>
            </div>
            <h2
              className="text-2xl md:text-3xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              18e Congrès National de Chirurgie Dentaire — Programme définitif publié
            </h2>
            <p className="text-sm leading-relaxed mb-6 max-w-3xl" style={{ color: 'var(--muted-foreground)' }}>
              Le programme complet du 18e Congrès National est disponible. Cette édition met l'accent sur l'implantologie numérique, la parodontologie régénérative, la gestion du risque infectieux et les nouvelles technologies d'imagerie en cabinet. Plus de 40 intervenants nationaux et internationaux seront présents.
            </p>
            <button className="text-sm font-semibold cursor-pointer" style={{ color: 'var(--primary)' }}>
              Lire l'article complet →
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
            Toutes les actualités
          </h2>
          <div className="flex gap-2 flex-wrap">
            {allCats.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer"
                style={{
                  backgroundColor: cat === c ? 'var(--primary)' : 'var(--muted)',
                  color: cat === c ? 'white' : 'var(--muted-foreground)',
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((a) => (
            <article
              key={a.id}
              className="rounded-xl overflow-hidden cursor-pointer hover:-translate-y-0.5 hover:shadow-lg transition-all group"
              style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <div
                className="h-1.5"
                style={{ backgroundColor: catColor[a.categorie]?.text ?? '#ccc' }}
              />
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: catColor[a.categorie]?.bg ?? '#F5F5F5',
                      color: catColor[a.categorie]?.text ?? '#333',
                    }}
                  >
                    {a.categorie}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    ⏱ {a.lecture}
                  </span>
                </div>
                <h3
                  className="font-semibold text-sm leading-snug mb-2"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {a.titre}
                </h3>
                <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--muted-foreground)' }}>
                  {a.extrait}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    {a.date}
                  </span>
                  <span className="text-xs font-semibold group-hover:underline" style={{ color: 'var(--primary)' }}>
                    Lire →
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
