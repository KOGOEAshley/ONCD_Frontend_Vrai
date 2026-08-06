import { useState, useRef, useEffect } from 'react'
import {
  ArrowRight, ArrowLeft, CheckCircle2, GraduationCap, CalendarDays,
  Download, Video, Play, Clock,
} from 'lucide-react'

const API_BASE = 'http://127.0.0.1:8000'

const REGIONS = [
  'Centre', 'Hauts-Bassins', 'Centre-Ouest', 'Centre-Nord', 'Sahel', 'Est',
  'Boucle du Mouhoun', 'Sud-Ouest', 'Centre-Sud', 'Nord', 'Centre-Est',
  'Cascades', 'Plateau Central',
]

const SECTEURS = [
  { valeur: 'liberal', label: 'Chirurgien-Dentiste libéral' },
  { valeur: 'secteur_public', label: 'Salarié secteur public' },
  { valeur: 'secteur_prive', label: 'Salarié secteur privé' },
  { valeur: 'mixte', label: 'Exercice mixte' },
]

const inputStyle = {
  backgroundColor: 'var(--muted)',
  border: '1px solid var(--border)',
  color: 'var(--foreground)',
}

function urlFichier(chemin: string | null | undefined) {
  if (!chemin) return null
  return chemin.startsWith('http') ? chemin : `${API_BASE}${chemin}`
}

export default function ComptePage() {
  const [mode, setMode] = useState<'login' | 'inscription'>('login')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [praticien, setPraticien] = useState<any>(null)
  const [erreur, setErreur] = useState('')
  const [messageSucces, setMessageSucces] = useState('')
  const [chargement, setChargement] = useState(false)

  // --- Connexion ---
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // --- Inscription ---
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    emailInscription: '',
    telephone: '',
    ville: '',
    region: REGIONS[0],
    specialite: '',
    secteur: SECTEURS[0].valeur,
    username: '',
    passwordInscription: '',
    passwordConfirm: '',
  })
  const [diplomeFile, setDiplomeFile] = useState<File | null>(null)

  // --- Upload photo (Mon Profil) ---
  const [photoEnvoi, setPhotoEnvoi] = useState(false)
  const [photoErreur, setPhotoErreur] = useState('')
  const photoInputRef = useRef<HTMLInputElement>(null)

  const [attestationChargement, setAttestationChargement] = useState(false)
  const [attestationErreur, setAttestationErreur] = useState('')

  const [formations, setFormations] = useState<any[]>([])
  const [cotisation, setCotisation] = useState<any>(null)
  const [formationEnCours, setFormationEnCours] = useState<number | null>(null)
  const [formationsErreur, setFormationsErreur] = useState('')

  const [modules, setModules] = useState<any[]>([])
  const [modulesErreur, setModulesErreur] = useState('')
  const [moduleEnCours, setModuleEnCours] = useState<number | null>(null)

  const [modeEdition, setModeEdition] = useState(false)
  const [editForm, setEditForm] = useState({ telephone: '', email: '', ville: '', region: '', specialite: '' })
  const [editErreur, setEditErreur] = useState('')
  const [editChargement, setEditChargement] = useState(false)

  function updateForm(champ: string, valeur: string) {
    setForm((prev) => ({ ...prev, [champ]: valeur }))
  }

  function getToken() {
    return localStorage.getItem('oncdbf_token')
  }

  // Restaure automatiquement la session si un token valide existe déjà
  // (évite d'avoir à se reconnecter à chaque changement de page)
  useEffect(() => {
    const token = getToken()
    if (!token) return

    fetch(`${API_BASE}/api/mon-profil/`, {
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Session expirée')
        return res.json()
      })
      .then((donneesPraticien) => {
        setPraticien(donneesPraticien)
        setIsLoggedIn(true)
        if (donneesPraticien.statut === 'actif') {
          fetchMesFormations()
          fetchMaCotisation()
          fetchMesModules()
        }
      })
      .catch(() => {
        localStorage.removeItem('oncdbf_token')
      })
  }, [])

  async function handleLogin() {
    setErreur('')
    setChargement(true)
    try {
      const res = await fetch(`${API_BASE}/api/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
      })

      if (!res.ok) {
        setErreur('Identifiant ou mot de passe incorrect.')
        setChargement(false)
        return
      }

      const data = await res.json()
      localStorage.setItem('oncdbf_token', data.token)

      const profilRes = await fetch(`${API_BASE}/api/mon-profil/`, {
        headers: { Authorization: `Token ${data.token}` },
      })

      if (profilRes.ok) {
        const donneesPraticien = await profilRes.json()
        setPraticien(donneesPraticien)
        if (donneesPraticien.statut === 'actif') {
          fetchMesFormations()
          fetchMaCotisation()
          fetchMesModules()
        }
      }

      setIsLoggedIn(true)
    } catch (err) {
      setErreur('Impossible de contacter le serveur. Vérifiez que le backend tourne.')
    } finally {
      setChargement(false)
    }
  }

  async function handleInscription() {
    setErreur('')
    setChargement(true)

    if (form.passwordInscription !== form.passwordConfirm) {
      setErreur('Les mots de passe ne correspondent pas.')
      setChargement(false)
      return
    }
    if (form.passwordInscription.length < 6) {
      setErreur('Le mot de passe doit contenir au moins 6 caractères.')
      setChargement(false)
      return
    }
    if (!diplomeFile) {
      setErreur('Veuillez joindre votre diplôme ou CV pour soumettre votre dossier.')
      setChargement(false)
      return
    }

    try {
      // FormData (et non JSON) car on envoie potentiellement un fichier (diplôme)
      const donnees = new FormData()
      donnees.append('username', form.username)
      donnees.append('password', form.passwordInscription)
      donnees.append('nom', form.nom)
      donnees.append('prenom', form.prenom)
      donnees.append('email', form.emailInscription)
      donnees.append('telephone', form.telephone)
      donnees.append('ville', form.ville)
      donnees.append('region', form.region)
      donnees.append('specialite', form.specialite)
      donnees.append('secteur', form.secteur)
      if (diplomeFile) {
        donnees.append('diplome', diplomeFile)
      }

      // Pas de header "Content-Type" ici : le navigateur le génère lui-même
      // avec la bonne "boundary" pour un envoi multipart/form-data
      const res = await fetch(`${API_BASE}/api/inscription/`, {
        method: 'POST',
        body: donnees,
      })

      const data = await res.json()

      if (!res.ok) {
        const premiereErreur = Object.values(data)[0]
        setErreur(Array.isArray(premiereErreur) ? String(premiereErreur[0]) : 'Une erreur est survenue.')
        setChargement(false)
        return
      }

      localStorage.setItem('oncdbf_token', data.token)
      setPraticien(data.praticien)
      setMessageSucces(data.message)
      setIsLoggedIn(true)
    } catch (err) {
      setErreur('Impossible de contacter le serveur. Vérifiez que le backend tourne.')
    } finally {
      setChargement(false)
    }
  }

  async function handlePhotoUpload(fichier: File) {
    setPhotoErreur('')
    setPhotoEnvoi(true)
    try {
      const donnees = new FormData()
      donnees.append('photo', fichier)

      const res = await fetch(`${API_BASE}/api/mon-profil/`, {
        method: 'PATCH',
        headers: { Authorization: `Token ${getToken()}` },
        body: donnees,
      })

      if (!res.ok) {
        setPhotoErreur("Échec de l'envoi de la photo.")
        return
      }

      setPraticien(await res.json())
    } catch (err) {
      setPhotoErreur('Impossible de contacter le serveur.')
    } finally {
      setPhotoEnvoi(false)
    }
  }

  async function handleDownloadAttestation() {
    setAttestationErreur('')
    setAttestationChargement(true)
    try {
      const res = await fetch(`${API_BASE}/api/mon-attestation/`, {
        headers: { Authorization: `Token ${getToken()}` },
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setAttestationErreur(data?.detail || "Impossible de générer l'attestation.")
        return
      }

      // Le PDF arrive en "blob" (données binaires) : on crée un lien de téléchargement temporaire
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const lien = document.createElement('a')
      lien.href = url
      lien.download = `attestation_${praticien?.numero_inscription || 'oncdbf'}.pdf`
      document.body.appendChild(lien)
      lien.click()
      lien.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setAttestationErreur('Impossible de contacter le serveur.')
    } finally {
      setAttestationChargement(false)
    }
  }

  async function fetchMesFormations() {
    setFormationsErreur('')
    try {
      const res = await fetch(`${API_BASE}/api/mes-formations/`, {
        headers: { Authorization: `Token ${getToken()}` },
      })
      if (res.ok) {
        setFormations(await res.json())
      }
    } catch (err) {
      setFormationsErreur('Impossible de charger vos formations.')
    }
  }

  async function fetchMaCotisation() {
    try {
      const res = await fetch(`${API_BASE}/api/ma-cotisation/`, {
        headers: { Authorization: `Token ${getToken()}` },
      })
      if (res.ok) {
        setCotisation(await res.json())
      }
    } catch (err) {
      // silencieux : la carte affichera simplement "—" si l'appel échoue
    }
  }

  async function fetchMesModules() {
    setModulesErreur('')
    try {
      const res = await fetch(`${API_BASE}/api/mes-modules/`, {
        headers: { Authorization: `Token ${getToken()}` },
      })
      if (res.ok) {
        setModules(await res.json())
      }
    } catch (err) {
      setModulesErreur('Impossible de charger vos modules.')
    }
  }

  async function handleTerminerModule(inscriptionId: number) {
    setModuleEnCours(inscriptionId)
    try {
      const res = await fetch(`${API_BASE}/api/terminer-module/${inscriptionId}/`, {
        method: 'POST',
        headers: { Authorization: `Token ${getToken()}` },
      })
      if (res.ok) {
        const misAJour = await res.json()
        setModules((prev) => prev.map((m) => (m.id === misAJour.id ? misAJour : m)))
      } else {
        setModulesErreur('Impossible de mettre à jour ce module.')
      }
    } catch (err) {
      setModulesErreur('Impossible de contacter le serveur.')
    } finally {
      setModuleEnCours(null)
    }
  }

  async function handleDownloadFormation(participationId: number, nomFormation: string) {
    setFormationEnCours(participationId)
    try {
      const res = await fetch(`${API_BASE}/api/mon-attestation-formation/${participationId}/`, {
        headers: { Authorization: `Token ${getToken()}` },
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setFormationsErreur(data?.detail || "Impossible de générer cette attestation.")
        return
      }

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const lien = document.createElement('a')
      lien.href = url
      lien.download = `attestation_${nomFormation}.pdf`.replace(/\s+/g, '_')
      document.body.appendChild(lien)
      lien.click()
      lien.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setFormationsErreur('Impossible de contacter le serveur.')
    } finally {
      setFormationEnCours(null)
    }
  }

  function startEdit() {
    setEditForm({
      telephone: praticien?.telephone || '',
      email: praticien?.email || '',
      ville: praticien?.ville || '',
      region: praticien?.region || REGIONS[0],
      specialite: praticien?.specialite || '',
    })
    setEditErreur('')
    setModeEdition(true)
  }

  async function handleSaveProfil() {
    setEditErreur('')
    setEditChargement(true)
    try {
      const donnees = new FormData()
      donnees.append('telephone', editForm.telephone)
      donnees.append('email', editForm.email)
      donnees.append('ville', editForm.ville)
      donnees.append('region', editForm.region)
      donnees.append('specialite', editForm.specialite)

      const res = await fetch(`${API_BASE}/api/mon-profil/`, {
        method: 'PATCH',
        headers: { Authorization: `Token ${getToken()}` },
        body: donnees,
      })

      if (!res.ok) {
        setEditErreur('Impossible de sauvegarder les modifications.')
        return
      }

      setPraticien(await res.json())
      setModeEdition(false)
    } catch (err) {
      setEditErreur('Impossible de contacter le serveur.')
    } finally {
      setEditChargement(false)
    }
  }

  function handleLogout() {
    localStorage.removeItem('oncdbf_token')
    setPraticien(null)
    setIsLoggedIn(false)
    setMessageSucces('')
    setEmail('')
    setPassword('')
  }

  if (!isLoggedIn) {
    return (
      <div style={{ fontFamily: 'var(--font-body)' }} className="relative min-h-screen flex items-center justify-center px-4 py-10 overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: "url('/page-header-bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0" style={{ backgroundColor: 'var(--background)', opacity: 0.3 }} />
        <div className="relative w-full max-w-md">
          <div className="text-center mb-8">
            <img
              src="/logo-oncdbf.png"
              alt="Logo ONCD Burkina"
              className="w-14 h-14 rounded-full mx-auto mb-4 bg-white"
            />
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              Espace Membre
            </h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              {mode === 'login' ? 'Accédez à votre espace personnel ONCD' : "Demandez votre inscription à l'Ordre"}
            </p>
          </div>

          <div
            className="rounded-2xl p-8"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
          >
            {mode === 'login' ? (
              <>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--muted-foreground)' }}>
                      Nom d'utilisateur ou Email
                    </label>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--muted-foreground)' }}>
                      Mot de passe
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
                      style={inputStyle}
                    />
                  </div>
                </div>

                {erreur && (
                  <p className="text-xs mb-4 text-center" style={{ color: '#B33A3A' }}>
                    {erreur}
                  </p>
                )}

                <button
                  onClick={handleLogin}
                  disabled={chargement}
                  className="w-full py-3.5 rounded-lg font-semibold text-sm text-white transition-all hover:opacity-90 cursor-pointer mb-4"
                  style={{ backgroundColor: 'var(--primary)', opacity: chargement ? 0.6 : 1 }}
                >
                  {chargement ? 'Connexion...' : 'Se connecter'}
                </button>

                <div className="mt-2 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
                  <p className="text-xs text-center mb-3" style={{ color: 'var(--muted-foreground)' }}>
                    Pas encore inscrit à l'Ordre ?
                  </p>
                  <button
                    onClick={() => { setMode('inscription'); setErreur('') }}
                    className="w-full py-3 rounded-lg font-semibold text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}
                  >
                    Demander mon inscription <ArrowRight size={16} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-3.5 mb-6">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--muted-foreground)' }}>Prénom</label>
                      <input value={form.prenom} onChange={(e) => updateForm('prenom', e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--muted-foreground)' }}>Nom</label>
                      <input value={form.nom} onChange={(e) => updateForm('nom', e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--muted-foreground)' }}>Email</label>
                    <input type="email" value={form.emailInscription} onChange={(e) => updateForm('emailInscription', e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
                  </div>

                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--muted-foreground)' }}>Téléphone</label>
                    <input value={form.telephone} onChange={(e) => updateForm('telephone', e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--muted-foreground)' }}>Ville</label>
                      <input value={form.ville} onChange={(e) => updateForm('ville', e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--muted-foreground)' }}>Région</label>
                      <select value={form.region} onChange={(e) => updateForm('region', e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none" style={inputStyle}>
                        {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--muted-foreground)' }}>Spécialité</label>
                    <input value={form.specialite} onChange={(e) => updateForm('specialite', e.target.value)} placeholder="Ex: Odontologie générale" className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
                  </div>

                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--muted-foreground)' }}>Secteur d'exercice</label>
                    <select value={form.secteur} onChange={(e) => updateForm('secteur', e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none" style={inputStyle}>
                      {SECTEURS.map((s) => <option key={s.valeur} value={s.valeur}>{s.label}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--muted-foreground)' }}>
                      Diplôme / CV <span style={{ color: '#B33A3A' }}>*</span> <span style={{ fontWeight: 400 }}>(PDF ou image, pour vérification du dossier)</span>
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      required
                      onChange={(e) => setDiplomeFile(e.target.files?.[0] || null)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg outline-none"
                      style={inputStyle}
                    />
                    {diplomeFile && (
                      <p className="text-[11px] mt-1" style={{ color: 'var(--muted-foreground)' }}>
                        Fichier sélectionné : {diplomeFile.name}
                      </p>
                    )}
                  </div>

                  <div className="pt-2" style={{ borderTop: '1px solid var(--border)' }} />

                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--muted-foreground)' }}>Nom d'utilisateur (connexion)</label>
                    <input value={form.username} onChange={(e) => updateForm('username', e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--muted-foreground)' }}>Mot de passe</label>
                      <input type="password" value={form.passwordInscription} onChange={(e) => updateForm('passwordInscription', e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--muted-foreground)' }}>Confirmer</label>
                      <input type="password" value={form.passwordConfirm} onChange={(e) => updateForm('passwordConfirm', e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
                    </div>
                  </div>
                </div>

                {erreur && (
                  <p className="text-xs mb-4 text-center" style={{ color: '#B33A3A' }}>
                    {erreur}
                  </p>
                )}

                <button
                  onClick={handleInscription}
                  disabled={chargement}
                  className="w-full py-3.5 rounded-lg font-semibold text-sm text-white transition-all hover:opacity-90 cursor-pointer mb-4"
                  style={{ backgroundColor: 'var(--primary)', opacity: chargement ? 0.6 : 1 }}
                >
                  {chargement ? 'Envoi...' : 'Envoyer ma demande'}
                </button>

                <button
                  onClick={() => { setMode('login'); setErreur('') }}
                  className="w-full text-xs text-center cursor-pointer py-2 flex items-center justify-center gap-1"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  <ArrowLeft size={14} /> J'ai déjà un compte
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  const enAttente = praticien?.statut === 'en_attente'
  const photoUrl = urlFichier(praticien?.photo)

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      {/* Dashboard header */}
      <div style={{ backgroundColor: 'var(--primary)' }} className="px-6 py-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {photoUrl ? (
              <img src={photoUrl} alt="Photo de profil" className="w-14 h-14 rounded-full object-cover border-2" style={{ borderColor: 'rgba(255,255,255,0.3)' }} />
            ) : (
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                {praticien ? `${praticien.prenom?.[0] || ''}${praticien.nom?.[0] || ''}` : '—'}
              </div>
            )}
            <div>
              <p className="text-white/60 text-xs mb-1">Bienvenue,</p>
              <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                {praticien ? `Dr. ${praticien.prenom} ${praticien.nom}` : 'Dr. —'}
              </h1>
              <p className="text-white/60 text-sm">
                {praticien
                  ? enAttente
                    ? 'Dossier en cours de validation'
                    : `N° ${praticien.numero_inscription} · ${praticien.specialite}`
                  : ''}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs px-4 py-2 rounded-full cursor-pointer"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}
          >
            Déconnexion
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {messageSucces && (
          <div
            className="mb-8 p-5 rounded-xl text-sm flex items-center gap-2"
            style={{ backgroundColor: '#FEF3E8', color: '#875A00', border: '1px solid #F0DDB8' }}
          >
            <CheckCircle2 size={18} className="flex-shrink-0" /> {messageSucces}
          </div>
        )}

        {enAttente ? (
          <div
            className="p-8 rounded-2xl text-center"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <Clock size={40} className="mx-auto mb-3" style={{ color: 'var(--accent)' }} />
            <h2 className="text-lg font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              Votre demande est en cours d'examen
            </h2>
            <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--muted-foreground)' }}>
              Le secrétariat de l'Ordre va vérifier votre dossier (diplôme inclus). Vous recevrez
              un numéro d'inscription officiel et un accès complet à votre espace membre une fois
              votre demande validée.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              {[
                (() => {
                  const statutInfo: Record<string, { color: string; textColor: string }> = {
                    payee: { color: '#E8F5EC', textColor: '#2A6B3E' },
                    en_attente: { color: '#E8EDF5', textColor: '#2A3E6B' },
                    en_retard: { color: '#FDEADE', textColor: '#C4622D' },
                  }
                  const infos = cotisation && cotisation.generee
                    ? statutInfo[cotisation.statut] || statutInfo.en_attente
                    : statutInfo.en_attente

                  let valeur = '—'
                  let sousTexte = 'Chargement...'
                  if (cotisation) {
                    if (!cotisation.generee) {
                      valeur = 'Non générée'
                      sousTexte = "Contactez le secrétariat de l'Ordre"
                    } else if (cotisation.statut === 'payee') {
                      valeur = 'À jour'
                      sousTexte = cotisation.date_paiement ? `Payé le ${cotisation.date_paiement}` : 'Payée'
                    } else if (cotisation.statut === 'en_retard') {
                      valeur = 'En retard'
                      sousTexte = `Échéance dépassée (${cotisation.date_echeance})`
                    } else {
                      valeur = 'En attente'
                      sousTexte = `${cotisation.montant?.toLocaleString('fr-FR')} FCFA avant le ${cotisation.date_echeance}`
                    }
                  }

                  return {
                    label: `Cotisation ${cotisation?.annee || new Date().getFullYear()}`,
                    value: valeur,
                    sub: sousTexte,
                    icon: CheckCircle2,
                    color: infos.color,
                    textColor: infos.textColor,
                  }
                })(),
                { label: 'Heures DPC', value: '14 / 20h', sub: 'Objectif annuel', icon: GraduationCap, color: '#E8EDF5', textColor: '#2A3E6B' },
                { label: 'Prochain événement', value: 'Congrès ONCD', sub: '14–16 Nov 2025', icon: CalendarDays, color: '#FEF3E8', textColor: '#875A00' },
              ].map((s) => (
                <div key={s.label} className="p-5 rounded-xl" style={{ backgroundColor: s.color }}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-semibold mb-2" style={{ color: s.textColor }}>{s.label}</div>
                      <div className="text-xl font-bold mb-1" style={{ color: s.textColor, fontFamily: 'var(--font-heading)' }}>{s.value}</div>
                      <div className="text-xs" style={{ color: `${s.textColor}99` }}>{s.sub}</div>
                    </div>
                    <s.icon size={22} style={{ color: s.textColor }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-xl font-bold mb-5" style={{ fontFamily: 'var(--font-heading)' }}>Mes Documents</h2>
                {attestationErreur && (
                  <p className="text-xs mb-3" style={{ color: '#B33A3A' }}>{attestationErreur}</p>
                )}
                <div className="space-y-3">
                  {/* Attestation réelle, générée par le serveur */}
                  <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: '#C4622D' }}>PDF</div>
                      <div>
                        <div className="font-medium text-sm">Attestation d'inscription</div>
                        <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                          N° {praticien?.numero_inscription}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleDownloadAttestation}
                      disabled={attestationChargement}
                      className="text-xs font-semibold cursor-pointer flex items-center gap-1"
                      style={{ color: 'var(--primary)', opacity: attestationChargement ? 0.5 : 1 }}
                    >
                      {attestationChargement ? 'Génération...' : <><Download size={14} /> Télécharger</>}
                    </button>
                  </div>

                  {/* Documents pas encore développés : affichés mais désactivés, pour rester honnête */}
                  {formationsErreur && (
                    <p className="text-xs mb-1" style={{ color: '#B33A3A' }}>{formationsErreur}</p>
                  )}

                  {formations.length === 0 ? (
                    <div className="p-4 rounded-xl text-xs text-center" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                      Aucune formation suivie pour le moment.
                    </div>
                  ) : (
                    formations.map((p) => (
                      <div key={p.id} className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: '#6C3082' }}>PDF</div>
                          <div>
                            <div className="font-medium text-sm">{p.formation.nom}</div>
                            <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                              {p.heures_obtenues}h · {p.formation.date_debut}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDownloadFormation(p.id, p.formation.nom)}
                          disabled={formationEnCours === p.id}
                          className="text-xs font-semibold cursor-pointer flex items-center gap-1"
                          style={{ color: 'var(--primary)', opacity: formationEnCours === p.id ? 0.5 : 1 }}
                        >
                          {formationEnCours === p.id ? 'Génération...' : <><Download size={14} /> Télécharger</>}
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <h2 className="text-xl font-bold mb-5 mt-10" style={{ fontFamily: 'var(--font-heading)' }}>Mes Modules E-Learning</h2>
                {modulesErreur && (
                  <p className="text-xs mb-3" style={{ color: '#B33A3A' }}>{modulesErreur}</p>
                )}
                <div className="space-y-3">
                  {modules.length === 0 ? (
                    <div className="p-4 rounded-xl text-xs text-center" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                      Aucun module suivi pour le moment. Inscrivez-vous depuis la page "Formation".
                    </div>
                  ) : (
                    modules.map((m) => (
                      <div key={m.id} className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--muted)' }}><Video size={16} /></div>
                          <div>
                            <div className="font-medium text-sm">{m.module.titre}</div>
                            <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                              {m.module.duree} · {m.module.niveau}
                            </div>
                            {m.module.lien_video && (
                              <a
                                href={m.module.lien_video}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-semibold flex items-center gap-1"
                                style={{ color: 'var(--primary)' }}
                              >
                                <Play size={12} /> Voir la vidéo
                              </a>
                            )}
                          </div>
                        </div>
                        {m.termine ? (
                          <span className="text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1" style={{ backgroundColor: '#E8F5EC', color: '#2A6B3E' }}>
                            <CheckCircle2 size={14} /> Terminé
                          </span>
                        ) : (
                          <button
                            onClick={() => handleTerminerModule(m.id)}
                            disabled={moduleEnCours === m.id}
                            className="text-xs font-semibold cursor-pointer px-3 py-1.5 rounded-full text-white"
                            style={{ backgroundColor: 'var(--primary)', opacity: moduleEnCours === m.id ? 0.5 : 1 }}
                          >
                            {moduleEnCours === m.id ? '...' : 'Marquer terminé'}
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-5" style={{ fontFamily: 'var(--font-heading)' }}>Mon Profil</h2>
                <div className="rounded-xl p-5 space-y-4" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                  {/* Photo de profil */}
                  <div className="flex items-center gap-3 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
                    {photoUrl ? (
                      <img src={photoUrl} alt="Photo de profil" className="w-14 h-14 rounded-full object-cover" />
                    ) : (
                      <div className="w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}>
                        {praticien ? `${praticien.prenom?.[0] || ''}${praticien.nom?.[0] || ''}` : '—'}
                      </div>
                    )}
                    <div>
                      <input
                        ref={photoInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const fichier = e.target.files?.[0]
                          if (fichier) handlePhotoUpload(fichier)
                        }}
                      />
                      <button
                        onClick={() => photoInputRef.current?.click()}
                        disabled={photoEnvoi}
                        className="text-xs font-semibold cursor-pointer"
                        style={{ color: 'var(--primary)' }}
                      >
                        {photoEnvoi ? 'Envoi...' : 'Changer la photo'}
                      </button>
                      {photoErreur && <p className="text-[11px] mt-1" style={{ color: '#B33A3A' }}>{photoErreur}</p>}
                    </div>
                  </div>

                  {modeEdition ? (
                    <>
                      <div className="space-y-3">
                        <div>
                          <label className="text-[11px] font-semibold mb-1 block" style={{ color: 'var(--muted-foreground)' }}>Spécialité</label>
                          <input value={editForm.specialite} onChange={(e) => setEditForm((p) => ({ ...p, specialite: e.target.value }))} className="w-full px-3 py-2 rounded-lg text-xs outline-none" style={inputStyle} />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold mb-1 block" style={{ color: 'var(--muted-foreground)' }}>Ville</label>
                          <input value={editForm.ville} onChange={(e) => setEditForm((p) => ({ ...p, ville: e.target.value }))} className="w-full px-3 py-2 rounded-lg text-xs outline-none" style={inputStyle} />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold mb-1 block" style={{ color: 'var(--muted-foreground)' }}>Région</label>
                          <select value={editForm.region} onChange={(e) => setEditForm((p) => ({ ...p, region: e.target.value }))} className="w-full px-3 py-2 rounded-lg text-xs outline-none" style={inputStyle}>
                            {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold mb-1 block" style={{ color: 'var(--muted-foreground)' }}>Téléphone</label>
                          <input value={editForm.telephone} onChange={(e) => setEditForm((p) => ({ ...p, telephone: e.target.value }))} className="w-full px-3 py-2 rounded-lg text-xs outline-none" style={inputStyle} />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold mb-1 block" style={{ color: 'var(--muted-foreground)' }}>Email</label>
                          <input type="email" value={editForm.email} onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))} className="w-full px-3 py-2 rounded-lg text-xs outline-none" style={inputStyle} />
                        </div>
                      </div>

                      {editErreur && <p className="text-[11px]" style={{ color: '#B33A3A' }}>{editErreur}</p>}

                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={handleSaveProfil}
                          disabled={editChargement}
                          className="flex-1 py-2.5 rounded-lg text-xs font-semibold cursor-pointer text-white"
                          style={{ backgroundColor: 'var(--primary)', opacity: editChargement ? 0.6 : 1 }}
                        >
                          {editChargement ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                        <button
                          onClick={() => setModeEdition(false)}
                          disabled={editChargement}
                          className="flex-1 py-2.5 rounded-lg text-xs font-semibold cursor-pointer"
                          style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                        >
                          Annuler
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {[
                        { label: 'Spécialité', value: praticien?.specialite || '—' },
                        { label: 'Secteur', value: SECTEURS.find((s) => s.valeur === praticien?.secteur)?.label || '—' },
                        { label: 'Ville', value: praticien?.ville || '—' },
                        { label: 'Région', value: praticien?.region || '—' },
                        { label: 'Téléphone', value: praticien?.telephone || '—' },
                        { label: 'Email', value: praticien?.email || '—' },
                      ].map((row) => (
                        <div key={row.label} className="flex justify-between items-center">
                          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{row.label}</span>
                          <span className="text-xs font-semibold text-right">{row.value}</span>
                        </div>
                      ))}
                      <button
                        onClick={startEdit}
                        className="w-full mt-2 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-all"
                        style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                      >
                        Modifier mes informations
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
