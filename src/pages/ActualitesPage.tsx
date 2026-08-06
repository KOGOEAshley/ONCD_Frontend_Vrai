import { useState, useEffect } from 'react'
import { Star, Clock3, ArrowRight } from 'lucide-react'

function formaterDate(dateIso: string) {
  const d = new Date(dateIso)
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function adapterActualite(a: any) {
  return {
    id: a.id,
    categorie: a.categorie,
    titre: a.titre,
    date: formaterDate(a.date_publication),
    extrait: a.extrait,
    contenu: a.contenu,
    auteur: a.auteur,
    lecture: a.temps_lecture,
    aLaUne: a.a_la_une,
  }
}

const catColor: Record<string, { bg: string; text: string }> = {
  Formation: { bg: '#E8F5EC', text: '#2A6B3E' },
  Réglementation: { bg: '#E8EDF5', text: '#2A3E6B' },
  'Alerte sanitaire': { bg: '#FDEADE', text: '#C4622D' },
  'Santé publique': { bg: '#FEF3E8', text: '#875A00' },
  International: { bg: '#F3E8FE', text: '#6B2A9B' },
  Déontologie: { bg: '#E8F0FE', text: '#1A3D8B' },
}

export default function ActualitesPage() {
  const [articles, setArticles] = useState<any[]>([])
  const [cat, setCat] = useState('Tous')
  const allCats = ['Tous', ...Array.from(new Set(articles.map((a) => a.categorie)))]

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/actualites/')
      .then((res) => res.json())
      .then((data) => setArticles(data.map(adapterActualite)))
      .catch((err) => console.error('Erreur API actualités :', err))
  }, [])

  const filtered = cat === 'Tous' ? articles : articles.filter((a) => a.categorie === cat)
  const uneArticle = articles.find((a) => a.aLaUne) || articles[0]

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      {/* Header */}
      <div className="relative overflow-hidden px-6 py-16">
        <div className="absolute inset-0" style={{ backgroundImage: "url('/page-header-bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0" style={{ backgroundColor: '#1C1A17', opacity: 0.25 }} />
        <div className="relative max-w-7xl mx-auto">
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
        {uneArticle && (
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
                  className="text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"
                  style={{ backgroundColor: '#E8F5EC', color: '#2A6B3E' }}
                >
                  <Star size={12} /> À la une
                </span>
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  {uneArticle.date}
                </span>
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {uneArticle.titre}
              </h2>
              <p className="text-sm leading-relaxed mb-6 max-w-3xl" style={{ color: 'var(--muted-foreground)' }}>
                {uneArticle.contenu || uneArticle.extrait}
              </p>
              <button className="text-sm font-semibold cursor-pointer flex items-center gap-1" style={{ color: 'var(--primary)' }}>
                Lire l'article complet <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

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
                  <span className="text-xs flex items-center gap-1" style={{ color: 'var(--muted-foreground)' }}>
                    <Clock3 size={12} /> {a.lecture}
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
                  <span className="text-xs font-semibold group-hover:underline flex items-center gap-1" style={{ color: 'var(--primary)' }}>
                    Lire <ArrowRight size={12} />
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
