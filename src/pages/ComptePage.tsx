import { useState, useRef } from 'react'

const API_BASE = 'http://127.0.0.1:8000'

const REGIONS = [
  'Centre', 'Hauts-Bassins', 'Centre-Ouest', 'Centre-Nord', 'Sahel', 'Est',
  'Boucle du Mouhoun', 'Sud-Ouest', 'Centre-Sud', 'Nord', 'Centre-Est',
  'Cascades', 'Plateau Central',
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

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    emailInscription: '',
    telephone: '',
    ville: '',
    region: REGIONS[0],
    specialite: '',
    username: '',
    passwordInscription: '',
    passwordConfirm: '',
  })
  const [diplomeFile, setDiplomeFile] = useState<File | null>(null)

  const [photoEnvoi, setPhotoEnvoi] = useState(false)
  const [photoErreur, setPhotoErreur] = useState('')
  const photoInputRef = useRef<HTMLInputElement>(null)

  const [attestationChargement, setAttestationChargement] = useState(false)
  const [attestationErreur, setAttestationErreur] = useState('')

  function updateForm(champ: string, valeur: string) {
    setForm((prev) => ({ ...prev, [champ]: valeur }))
  }

  function getToken() {
    return localStorage.getItem('oncdbf_token')
  }

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
        setPraticien(await profilRes.json())
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
      if (diplomeFile) {
        donnees.append('diplome', diplomeFile)
      }

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
      <div style={{ fontFamily: 'var(--font-body)', backgroundColor: 'var(--background)' }} className="min-h-screen flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              ✦
            </div>
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
                    className="w-full py-3 rounded-lg font-semibold text-sm transition-all cursor-pointer"
                    style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}
                  >
                    Demander mon inscription →
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
                  className="w-full text-xs text-center cursor-pointer py-2"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  ← J'ai déjà un compte
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
            className="mb-8 p-5 rounded-xl text-sm"
            style={{ backgroundColor: '#FEF3E8', color: '#875A00', border: '1px solid #F0DDB8' }}
          >
            ✅ {messageSucces}
          </div>
        )}

        {enAttente ? (
          <div
            className="p-8 rounded-2xl text-center"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <div className="text-3xl mb-3">⏳</div>
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
                { label: 'Cotisation 2025', value: 'À jour', sub: 'Payé le 15 Jan 2025', icon: '✅', color: '#E8F5EC', textColor: '#2A6B3E' },
                { label: 'Heures DPC', value: '14 / 20h', sub: 'Objectif annuel', icon: '🎓', color: '#E8EDF5', textColor: '#2A3E6B' },
                { label: 'Prochain événement', value: 'Congrès ONCD', sub: '14–16 Nov 2025', icon: '📅', color: '#FEF3E8', textColor: '#875A00' },
              ].map((s) => (
                <div key={s.label} className="p-5 rounded-xl" style={{ backgroundColor: s.color }}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-semibold mb-2" style={{ color: s.textColor }}>{s.label}</div>
                      <div className="text-xl font-bold mb-1" style={{ color: s.textColor, fontFamily: 'var(--font-heading)' }}>{s.value}</div>
                      <div className="text-xs" style={{ color: `${s.textColor}99` }}>{s.sub}</div>
                    </div>
                    <span className="text-2xl">{s.icon}</span>
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
                      className="text-xs font-semibold cursor-pointer"
                      style={{ color: 'var(--primary)', opacity: attestationChargement ? 0.5 : 1 }}
                    >
                      {attestationChargement ? 'Génération...' : '↓ Télécharger'}
                    </button>
                  </div>

                  {[
                    { titre: 'Certificat de bonne conduite', date: 'Jan 2025' },
                    { titre: 'Reçu cotisation 2025', date: 'Jan 2025' },
                    { titre: 'Attestation de formation DPC — Anesthésie', date: 'Mar 2025' },
                  ].map((doc) => (
                    <div key={doc.titre} className="flex items-center justify-between p-4 rounded-xl opacity-50" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: '#999999' }}>PDF</div>
                        <div>
                          <div className="font-medium text-sm">{doc.titre}</div>
                          <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Bientôt disponible</div>
                        </div>
                      </div>
                      <button disabled className="text-xs font-semibold cursor-not-allowed" style={{ color: 'var(--muted-foreground)' }}>↓ Télécharger</button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-5" style={{ fontFamily: 'var(--font-heading)' }}>Mon Profil</h2>
                <div className="rounded-xl p-5 space-y-4" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
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

                  {[
                    { label: 'Spécialité', value: praticien?.specialite || '—' },
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
                  <button className="w-full mt-2 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-all" style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}>
                    Modifier mes informations
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}