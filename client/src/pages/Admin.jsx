import { useState, useEffect } from 'react'

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api'

// Question configuration for results form
const QUESTIONS = [
  { id: 'winner', label: 'Ganador', type: 'select', options: ['seahawks', 'patriots'] },
  { id: 'score', label: 'Marcador Final', type: 'score' },
  { id: 'mvp', label: 'MVP', type: 'text' },
  { id: 'first_score', label: 'Primer Anotador', type: 'select', options: ['seahawks', 'patriots'] },
  { id: 'gatorade_color', label: 'Color Gatorade', type: 'select', options: ['naranja', 'azul', 'amarillo', 'verde', 'rojo', 'morado', 'transparente'] },
  { id: 'anthem_duration', label: 'Duración Himno (seg)', type: 'number' },
  { id: 'halftime_guest', label: 'Invitado Halftime', type: 'select', options: ['Sí', 'No'] },
  { id: 'first_song', label: 'Primera Canción', type: 'text' },
  { id: 'best_commercial', label: 'Mejor Comercial', type: 'text' },
  { id: 'most_commercials', label: 'Más Comerciales', type: 'select', options: ['Cervezas', 'Autos', 'Tecnología', 'Comida rápida', 'Streaming'] },
]

export default function Admin() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('admin_api_key') || '')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [brands, setBrands] = useState([])
  const [selectedBrand, setSelectedBrand] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [results, setResults] = useState({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [activeTab, setActiveTab] = useState('leaderboard')
  const [connectSlug, setConnectSlug] = useState('')

  // New brand form
  const [newBrand, setNewBrand] = useState({
    slug: '',
    name: '',
    logoUrl: '',
    primaryColor: '#3B82F6',
    adminApiKey: '',
  })

  // Load brands on mount
  useEffect(() => {
    if (isAuthenticated) {
      loadBrands()
    }
  }, [isAuthenticated])

  // Load leaderboard when brand changes
  useEffect(() => {
    if (selectedBrand) {
      loadLeaderboard()
      loadResults()
    }
  }, [selectedBrand])

  const loadBrands = async () => {
    try {
      const defaultBrand = await fetch(`${API_BASE}/default/brand-info`).then(r => r.ok ? r.json() : null).catch(() => null)
      if (defaultBrand) {
        setBrands([defaultBrand])
        setSelectedBrand(defaultBrand)
      }
    } catch (err) {
      console.error('Error loading brands:', err)
    }
  }

  const loadLeaderboard = async () => {
    if (!selectedBrand) return
    try {
      const response = await fetch(`${API_BASE}/${selectedBrand.slug}/leaderboard`)
      const data = await response.json()
      setLeaderboard(data)
    } catch (err) {
      console.error('Error loading leaderboard:', err)
    }
  }

  const loadResults = async () => {
    if (!selectedBrand) return
    try {
      const response = await fetch(`${API_BASE}/${selectedBrand.slug}/admin/results`)
      const data = await response.json()
      setResults(data || {})
    } catch (err) {
      console.error('Error loading results:', err)
      setResults({})
    }
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (apiKey.length >= 20) {
      localStorage.setItem('admin_api_key', apiKey)
      setIsAuthenticated(true)
    } else {
      setMessage({ type: 'error', text: 'API Key debe tener al menos 20 caracteres' })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_api_key')
    setApiKey('')
    setIsAuthenticated(false)
  }

  const handleResultChange = (questionId, value) => {
    setResults(prev => ({ ...prev, [questionId]: value }))
  }

  const handleScoreChange = (field, value) => {
    setResults(prev => ({
      ...prev,
      score: { ...(prev.score || {}), [field]: value }
    }))
  }

  const saveResults = async () => {
    if (!selectedBrand) return
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch(`${API_BASE}/${selectedBrand.slug}/admin/results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({ results }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Error guardando resultados')
      }

      setMessage({ type: 'success', text: 'Resultados guardados correctamente' })
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setLoading(false)
    }
  }

  const calculateScores = async () => {
    if (!selectedBrand) return
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch(`${API_BASE}/${selectedBrand.slug}/admin/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Error calculando puntuaciones')
      }

      const data = await response.json()
      setMessage({ type: 'success', text: `Puntuaciones calculadas: ${data.updated} participantes actualizados` })
      loadLeaderboard()
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setLoading(false)
    }
  }

  const createBrand = async (e) => {
    e.preventDefault()
    setMessage({
      type: 'info',
      text: `Para crear la marca, ejecuta este SQL en tu base de datos (Railway → Postgres → Data → Query):\n\nINSERT INTO brands (id, slug, name, logo_url, primary_color, admin_api_key, is_active, predictions_lock_at, created_at)\nVALUES (\n  gen_random_uuid(),\n  '${newBrand.slug}',\n  '${newBrand.name}',\n  ${newBrand.logoUrl ? `'${newBrand.logoUrl}'` : 'NULL'},\n  '${newBrand.primaryColor}',\n  '${newBrand.adminApiKey}',\n  true,\n  '2026-02-08 18:30:00-08',\n  NOW()\n);`
    })
  }

  const testBrandConnection = async () => {
    if (!connectSlug) return
    try {
      const response = await fetch(`${API_BASE}/${connectSlug}/brand-info`)
      if (response.ok) {
        const brand = await response.json()
        if (!brands.find(b => b.slug === brand.slug)) {
          setBrands(prev => [...prev, brand])
        }
        setSelectedBrand(brand)
        setConnectSlug('')
        setMessage({ type: 'success', text: `Marca "${brand.name}" conectada` })
      } else {
        setMessage({ type: 'error', text: `Marca "${connectSlug}" no encontrada` })
      }
    } catch (err) {
      setMessage({ type: 'error', text: `Error conectando con marca "${connectSlug}"` })
    }
  }

  // Login screen
  if (!isAuthenticated) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginCard}>
          <h1 style={styles.loginTitle}>🏈 Panel Admin</h1>
          <p style={styles.loginSubtitle}>Super Bowl LX Quiniela</p>

          <form onSubmit={handleLogin}>
            <div style={styles.formGroup}>
              <label style={styles.label}>API Key de Administrador</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Ingresa tu API Key..."
                style={styles.input}
              />
            </div>

            <button type="submit" style={styles.btnPrimary}>
              Ingresar
            </button>
          </form>

          {message && (
            <div style={{...styles.message, ...(message.type === 'error' ? styles.messageError : styles.messageSuccess)}}>
              {message.text}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Main admin panel
  return (
    <div style={styles.panel}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.headerTitle}>🏈 Panel Admin</h1>
          {selectedBrand && (
            <span style={styles.currentBrand}>{selectedBrand.name}</span>
          )}
        </div>
        <button onClick={handleLogout} style={styles.btnLogout}>
          Cerrar Sesión
        </button>
      </header>

      <div style={styles.layout}>
        {/* Sidebar */}
        <aside style={styles.sidebar}>
          <h3 style={styles.sidebarTitle}>Marcas</h3>

          <div style={styles.brandList}>
            {brands.map(brand => (
              <button
                key={brand.slug}
                style={{
                  ...styles.brandItem,
                  ...(selectedBrand?.slug === brand.slug ? styles.brandItemActive : {})
                }}
                onClick={() => setSelectedBrand(brand)}
              >
                <span style={{...styles.brandColor, background: brand.primaryColor}} />
                <span style={styles.brandName}>{brand.name}</span>
                <span style={styles.brandSlug}>/{brand.slug}</span>
              </button>
            ))}
          </div>

          <div style={styles.addBrandSection}>
            <h4 style={styles.addBrandTitle}>Conectar otra marca</h4>
            <div style={styles.connectBrand}>
              <input
                type="text"
                placeholder="slug (ej: cocacola)"
                value={connectSlug}
                onChange={(e) => setConnectSlug(e.target.value)}
                style={styles.connectInput}
              />
              <button onClick={testBrandConnection} style={styles.connectBtn}>
                Conectar
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main style={styles.main}>
          {/* Tabs */}
          <div style={styles.tabs}>
            {['leaderboard', 'results', 'create'].map(tab => (
              <button
                key={tab}
                style={{
                  ...styles.tab,
                  ...(activeTab === tab ? styles.tabActive : {})
                }}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'leaderboard' && '📊 Leaderboard'}
                {tab === 'results' && '🏆 Resultados'}
                {tab === 'create' && '➕ Nueva Marca'}
              </button>
            ))}
          </div>

          {/* Message */}
          {message && (
            <div style={{
              ...styles.messageBox,
              ...(message.type === 'error' ? styles.messageError : message.type === 'success' ? styles.messageSuccess : styles.messageInfo)
            }}>
              <pre style={styles.messagePre}>{message.text}</pre>
              <button onClick={() => setMessage(null)} style={styles.messageClose}>×</button>
            </div>
          )}

          {/* Leaderboard Tab */}
          {activeTab === 'leaderboard' && (
            <div style={styles.tabContent}>
              <div style={styles.tabHeader}>
                <h2 style={styles.tabTitle}>Leaderboard - {selectedBrand?.name || 'Selecciona una marca'}</h2>
                <button onClick={loadLeaderboard} style={styles.btnRefresh}>🔄 Actualizar</button>
              </div>

              {leaderboard.length === 0 ? (
                <div style={styles.emptyState}>No hay participantes aún</div>
              ) : (
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>#</th>
                      <th style={styles.th}>Participante</th>
                      <th style={styles.th}>Puntos</th>
                      <th style={styles.th}>Aciertos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((p, i) => (
                      <tr key={p.id}>
                        <td style={styles.td}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</td>
                        <td style={styles.td}>
                          <span style={styles.avatar}>{p.avatar}</span>
                          <span>{p.name}</span>
                        </td>
                        <td style={{...styles.td, ...styles.score}}>{p.score}</td>
                        <td style={styles.td}>{p.correctPredictions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Results Tab */}
          {activeTab === 'results' && (
            <div style={styles.tabContent}>
              <div style={styles.tabHeader}>
                <h2 style={styles.tabTitle}>Ingresar Resultados - {selectedBrand?.name || 'Selecciona una marca'}</h2>
              </div>

              <div style={styles.resultsForm}>
                {QUESTIONS.map(q => (
                  <div key={q.id} style={styles.resultField}>
                    <label style={styles.resultLabel}>{q.label}</label>

                    {q.type === 'select' && (
                      <select
                        value={results[q.id] || ''}
                        onChange={(e) => handleResultChange(q.id, e.target.value)}
                        style={styles.select}
                      >
                        <option value="">Seleccionar...</option>
                        {q.options.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    )}

                    {q.type === 'text' && (
                      <input
                        type="text"
                        value={results[q.id] || ''}
                        onChange={(e) => handleResultChange(q.id, e.target.value)}
                        placeholder={`Ingresa ${q.label.toLowerCase()}...`}
                        style={styles.input}
                      />
                    )}

                    {q.type === 'number' && (
                      <input
                        type="number"
                        value={results[q.id] || ''}
                        onChange={(e) => handleResultChange(q.id, e.target.value)}
                        placeholder="0"
                        style={styles.input}
                      />
                    )}

                    {q.type === 'score' && (
                      <div style={styles.scoreInputs}>
                        <div style={styles.scoreTeam}>
                          <span style={styles.scoreTeamLabel}>Seahawks</span>
                          <input
                            type="number"
                            value={results.score?.team1 || ''}
                            onChange={(e) => handleScoreChange('team1', e.target.value)}
                            placeholder="0"
                            style={{...styles.input, width: 80, textAlign: 'center'}}
                          />
                        </div>
                        <span style={styles.scoreVs}>-</span>
                        <div style={styles.scoreTeam}>
                          <span style={styles.scoreTeamLabel}>Patriots</span>
                          <input
                            type="number"
                            value={results.score?.team2 || ''}
                            onChange={(e) => handleScoreChange('team2', e.target.value)}
                            placeholder="0"
                            style={{...styles.input, width: 80, textAlign: 'center'}}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                <div style={styles.resultsActions}>
                  <button onClick={saveResults} disabled={loading} style={styles.btnSave}>
                    {loading ? 'Guardando...' : '💾 Guardar Resultados'}
                  </button>
                  <button onClick={calculateScores} disabled={loading} style={styles.btnCalculate}>
                    {loading ? 'Calculando...' : '🧮 Calcular Puntuaciones'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Create Brand Tab */}
          {activeTab === 'create' && (
            <div style={styles.tabContent}>
              <div style={styles.tabHeader}>
                <h2 style={styles.tabTitle}>Crear Nueva Marca</h2>
              </div>

              <form onSubmit={createBrand} style={styles.createForm}>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Slug (URL)</label>
                    <input
                      type="text"
                      value={newBrand.slug}
                      onChange={(e) => setNewBrand(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                      placeholder="cocacola"
                      required
                      style={styles.input}
                    />
                    <small style={styles.small}>Se usará en: tudominio.com/{newBrand.slug || 'slug'}</small>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Nombre</label>
                    <input
                      type="text"
                      value={newBrand.name}
                      onChange={(e) => setNewBrand(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Quiniela Coca-Cola"
                      required
                      style={styles.input}
                    />
                  </div>
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>URL del Logo (opcional)</label>
                    <input
                      type="url"
                      value={newBrand.logoUrl}
                      onChange={(e) => setNewBrand(prev => ({ ...prev, logoUrl: e.target.value }))}
                      placeholder="https://ejemplo.com/logo.png"
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Color Primario</label>
                    <div style={styles.colorInput}>
                      <input
                        type="color"
                        value={newBrand.primaryColor}
                        onChange={(e) => setNewBrand(prev => ({ ...prev, primaryColor: e.target.value }))}
                        style={styles.colorPicker}
                      />
                      <input
                        type="text"
                        value={newBrand.primaryColor}
                        onChange={(e) => setNewBrand(prev => ({ ...prev, primaryColor: e.target.value }))}
                        style={{...styles.input, flex: 1}}
                      />
                    </div>
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>API Key del Admin (mínimo 20 caracteres)</label>
                  <input
                    type="text"
                    value={newBrand.adminApiKey}
                    onChange={(e) => setNewBrand(prev => ({ ...prev, adminApiKey: e.target.value }))}
                    placeholder="clave_secreta_para_esta_marca_2026"
                    required
                    minLength={20}
                    style={styles.input}
                  />
                  <small style={styles.small}>Esta clave se usará para administrar esta marca</small>
                </div>

                <button type="submit" style={styles.btnCreate}>
                  Generar SQL para crear marca
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

// Inline styles
const styles = {
  loginContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    padding: 20,
  },
  loginCard: {
    background: '#1e1e2e',
    borderRadius: 16,
    padding: 40,
    width: '100%',
    maxWidth: 400,
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
  },
  loginTitle: {
    margin: '0 0 8px',
    fontSize: 28,
    color: '#fff',
  },
  loginSubtitle: {
    margin: '0 0 30px',
    color: '#888',
  },
  panel: {
    minHeight: '100vh',
    background: '#0d0d15',
    color: '#fff',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    background: '#1a1a2e',
    borderBottom: '1px solid #333',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  headerTitle: {
    margin: 0,
    fontSize: 20,
  },
  currentBrand: {
    padding: '4px 12px',
    background: '#3b82f6',
    borderRadius: 20,
    fontSize: 14,
  },
  btnLogout: {
    padding: '8px 16px',
    border: '1px solid #444',
    borderRadius: 6,
    background: 'transparent',
    color: '#aaa',
    cursor: 'pointer',
  },
  layout: {
    display: 'flex',
    minHeight: 'calc(100vh - 60px)',
  },
  sidebar: {
    width: 280,
    background: '#1a1a2e',
    padding: 20,
    borderRight: '1px solid #333',
  },
  sidebarTitle: {
    margin: '0 0 16px',
    fontSize: 14,
    textTransform: 'uppercase',
    color: '#888',
  },
  brandList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  brandItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    border: '1px solid #333',
    borderRadius: 8,
    background: 'transparent',
    color: '#fff',
    cursor: 'pointer',
    textAlign: 'left',
  },
  brandItemActive: {
    borderColor: '#3b82f6',
    background: 'rgba(59,130,246,0.1)',
  },
  brandColor: {
    width: 12,
    height: 12,
    borderRadius: '50%',
  },
  brandName: {
    flex: 1,
    fontWeight: 500,
  },
  brandSlug: {
    fontSize: 12,
    color: '#666',
  },
  addBrandSection: {
    marginTop: 30,
    paddingTop: 20,
    borderTop: '1px solid #333',
  },
  addBrandTitle: {
    margin: '0 0 12px',
    fontSize: 13,
    color: '#888',
  },
  connectBrand: {
    display: 'flex',
    gap: 8,
  },
  connectInput: {
    flex: 1,
    padding: '8px 12px',
    border: '1px solid #333',
    borderRadius: 6,
    background: '#0d0d15',
    color: '#fff',
    fontSize: 14,
  },
  connectBtn: {
    padding: '8px 12px',
    border: 'none',
    borderRadius: 6,
    background: '#3b82f6',
    color: '#fff',
    cursor: 'pointer',
    fontSize: 14,
  },
  main: {
    flex: 1,
    padding: 24,
  },
  tabs: {
    display: 'flex',
    gap: 8,
    marginBottom: 24,
  },
  tab: {
    padding: '10px 20px',
    border: '1px solid #333',
    borderRadius: 8,
    background: 'transparent',
    color: '#888',
    cursor: 'pointer',
    fontSize: 14,
  },
  tabActive: {
    borderColor: '#3b82f6',
    background: 'rgba(59,130,246,0.1)',
    color: '#3b82f6',
  },
  messageBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    padding: 16,
    borderRadius: 8,
    fontSize: 14,
  },
  messagePre: {
    margin: 0,
    whiteSpace: 'pre-wrap',
    fontFamily: 'monospace',
    fontSize: 13,
  },
  messageClose: {
    background: 'none',
    border: 'none',
    color: 'inherit',
    cursor: 'pointer',
    fontSize: 18,
    padding: 0,
    marginLeft: 16,
  },
  message: {
    marginTop: 20,
    padding: '12px 16px',
    borderRadius: 8,
    fontSize: 14,
  },
  messageError: {
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    color: '#f87171',
  },
  messageSuccess: {
    background: 'rgba(34,197,94,0.1)',
    border: '1px solid rgba(34,197,94,0.3)',
    color: '#4ade80',
  },
  messageInfo: {
    background: 'rgba(59,130,246,0.1)',
    border: '1px solid rgba(59,130,246,0.3)',
    color: '#60a5fa',
  },
  tabContent: {
    background: '#1a1a2e',
    borderRadius: 12,
    padding: 24,
  },
  tabHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  tabTitle: {
    margin: 0,
    fontSize: 18,
  },
  btnRefresh: {
    padding: '8px 16px',
    border: '1px solid #333',
    borderRadius: 6,
    background: 'transparent',
    color: '#fff',
    cursor: 'pointer',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#666',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    borderBottom: '1px solid #333',
    color: '#888',
    fontWeight: 500,
    fontSize: 13,
    textTransform: 'uppercase',
  },
  td: {
    padding: '12px 16px',
    borderBottom: '1px solid #333',
  },
  avatar: {
    fontSize: 24,
    marginRight: 12,
  },
  score: {
    fontWeight: 700,
    fontSize: 18,
    color: '#3b82f6',
  },
  resultsForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  resultField: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  resultLabel: {
    color: '#888',
    fontSize: 14,
  },
  formGroup: {
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  label: {
    display: 'block',
    marginBottom: 8,
    color: '#aaa',
    fontSize: 14,
  },
  input: {
    padding: '12px 16px',
    border: '1px solid #333',
    borderRadius: 8,
    background: '#0d0d15',
    color: '#fff',
    fontSize: 16,
  },
  select: {
    padding: '12px 16px',
    border: '1px solid #333',
    borderRadius: 8,
    background: '#0d0d15',
    color: '#fff',
    fontSize: 16,
  },
  scoreInputs: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  scoreTeam: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  scoreTeamLabel: {
    fontSize: 12,
    color: '#888',
  },
  scoreVs: {
    fontSize: 24,
    color: '#666',
    marginTop: 20,
  },
  resultsActions: {
    display: 'flex',
    gap: 16,
    marginTop: 20,
    paddingTop: 20,
    borderTop: '1px solid #333',
  },
  btnSave: {
    flex: 1,
    padding: 16,
    border: 'none',
    borderRadius: 8,
    background: '#3b82f6',
    color: '#fff',
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
  },
  btnCalculate: {
    flex: 1,
    padding: 16,
    border: 'none',
    borderRadius: 8,
    background: '#10b981',
    color: '#fff',
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
  },
  btnPrimary: {
    width: '100%',
    padding: 14,
    border: 'none',
    borderRadius: 8,
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    color: '#fff',
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 20,
  },
  createForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  small: {
    color: '#666',
    fontSize: 12,
  },
  colorInput: {
    display: 'flex',
    gap: 12,
  },
  colorPicker: {
    width: 50,
    height: 44,
    padding: 4,
    cursor: 'pointer',
    border: '1px solid #333',
    borderRadius: 8,
  },
  btnCreate: {
    padding: 16,
    border: 'none',
    borderRadius: 8,
    background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
    color: '#fff',
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
  },
}
