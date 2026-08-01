import { useState } from 'react'
import NavBar, { type Page } from './components/NavBar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import InstitutionPage from './pages/InstitutionPage'
import PraticienPage from './pages/PraticienPage'
import FormationPage from './pages/FormationPage'
import ExpositionPage from './pages/ExpositionPage'
import EtudiantsPage from './pages/EtudiantsPage'
import PatientsPage from './pages/PatientsPage'
import AnnuairePage from './pages/AnnuairePage'
import GeolocalisationPage from './pages/GeolocalisationPage'
import ActualitesPage from './pages/ActualitesPage'
import ComptePage from './pages/ComptePage'

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')

  const handleNavigate = (page: Page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />
      case 'institution':
        return <InstitutionPage />
      case 'praticien':
        return <PraticienPage />
      case 'formation':
        return <FormationPage />
      case 'exposition':
        return <ExpositionPage />
      case 'etudiants':
        return <EtudiantsPage />
      case 'patients':
        return <PatientsPage onNavigate={handleNavigate} />
      case 'annuaire':
        return <AnnuairePage />
      case 'geolocal':
        return <GeolocalisationPage />
      case 'actualites':
        return <ActualitesPage />
      case 'compte':
        return <ComptePage />
      default:
        return <HomePage onNavigate={handleNavigate} />
    }
  }

  const showFooter = currentPage !== 'compte'

  return (
    <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NavBar currentPage={currentPage} onNavigate={handleNavigate} />
      <main style={{ flex: 1 }}>
        {renderPage()}
      </main>
      {showFooter && <Footer onNavigate={handleNavigate} />}
    </div>
  )
}
