import { useState, useEffect } from "react"
import { fetchGames, searchGames } from "./API/game_service"
import Grainient from "./components/Grainient/Grainient"
import GamePreviewCard from "./components/GamePreviewCard"
import LandingPage from "./components/LandingPage"

// Custom backend base URL
const API_BASE_URL = "http://localhost:3001"

function App() {
  const [query, setQuery] = useState("")
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedGame, setSelectedGame] = useState(null)
  const [activeCategory, setActiveCategory] = useState("All")
  const [activeTab, setActiveTab] = useState("discover") // discover | trending | new
  const [showSignIn, setShowSignIn] = useState(false)
  const [authEmail, setAuthEmail] = useState("")
  const [authPassword, setAuthPassword] = useState("")
  const [authRemember, setAuthRemember] = useState(true)
  const [authError, setAuthError] = useState("")
  const [authSubmitting, setAuthSubmitting] = useState(false)
  const [user, setUser] = useState(null)
  const [isSignUp, setIsSignUp] = useState(false)
  const [authUsername, setAuthUsername] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showLanding, setShowLanding] = useState(true)

  // Password strength: 0 = empty, 1 = weak, 2 = medium, 3 = strong
  function getPasswordStrength(pwd) {
    if (!pwd) return 0
    let score = 0
    if (pwd.length >= 8) score++
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) score++
    if (/[^A-Za-z0-9]/.test(pwd)) score++
    return score
  }
  const pwdStrength = getPasswordStrength(authPassword)

  // Initial load
  useEffect(() => {
    async function loadInitialGames() {
      setLoading(true)
      try {
        const initialGames = await fetchGames(500)
        setGames(initialGames || [])
      } catch (err) {
        console.error("Failed to fetch initial games", err)
      } finally {
        setLoading(false)
      }
    }
    loadInitialGames()
    
    // Check if user is logged in (from local storage for simple persistence)
    const storedUser = localStorage.getItem("gameNexusUser")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error("Failed to parse stored user", e)
      }
    }
  }, [])

  async function handleSearch(e) {
    if (e && e.preventDefault) e.preventDefault()
    setLoading(true)
    setActiveCategory("All")
    setActiveTab("discover")
    try {
      const results = await searchGames(query)
      setGames(results || [])
    } catch (err) {
      console.error("Failed to fetch games", err)
    } finally {
      setLoading(false)
    }
  }

  async function handleGameClick(game) {
    setSelectedGame(game)
    
    // Save to Database if user is logged in
    if (user && user.id) {
      try {
        const imageAsset = game.Asset && game.Asset.length > 0 ? game.Asset[0] : null
        await fetch(`${API_BASE_URL}/save-game`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            gameTitle: game.Title,
            gameUrl: game.Url,
            gameImage: imageAsset
          })
        })
      } catch (err) {
        console.error("Failed to save game to history:", err)
      }
    }
  }

  function closeModal() {
    setSelectedGame(null)
  }

  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeModal()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Build category chips from loaded games
  const categorySet = new Set()
  games.forEach((game) => {
    if (Array.isArray(game.Category)) {
      game.Category.forEach((c) => categorySet.add(c))
    }
  })
  const categories = Array.from(categorySet).slice(0, 8)

  // Tab logic: discover / trending / new drops
  let tabGames = games
  if (activeTab === "trending") {
    // Show a dedicated "trending" view with the most‑played games
    tabGames = [...games]
      .filter((g) => typeof g.Plays === "number")
      .sort((a, b) => {
        const aPlays = typeof a.Plays === "number" ? a.Plays : 0
        const bPlays = typeof b.Plays === "number" ? b.Plays : 0
        return bPlays - aPlays
      })
      .slice(0, 24) // top 24 trending games
  } else if (activeTab === "new") {
    tabGames = [...games].reverse()
  }

  const displayedGames =
    activeCategory === "All"
      ? tabGames
      : tabGames.filter((game) =>
        Array.isArray(game.Category)
          ? game.Category.includes(activeCategory)
          : false
      )

  function handleNavClick(tab) {
    setActiveTab(tab)
    setActiveCategory("All")
  }

  function handleOpenSignIn() {
    setShowSignIn(true)
  }

  function handleCloseSignIn() {
    setShowSignIn(false)
    setAuthError("")
  }

  async function handleSignInSubmit(e) {
    e.preventDefault()
    setAuthError("")
    
    if (isSignUp && !authUsername) {
      setAuthError("Please enter a username.")
      return
    }

    if (!authEmail || !authPassword) {
      setAuthError("Please enter both email and password.")
      return
    }
    setAuthSubmitting(true)
    
    try {
      const endpoint = isSignUp ? "/register" : "/login"
      const bodyParams = isSignUp 
        ? { username: authUsername, email: authEmail, password: authPassword }
        : { email: authEmail, password: authPassword }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bodyParams)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed")
      }

      // Success
      setUser(data.user)
      if (authRemember) {
        localStorage.setItem("gameNexusUser", JSON.stringify(data.user))
      }
      handleCloseSignIn()
    } catch (err) {
      setAuthError(err.message || "Something went wrong. Please try again.")
    } finally {
      setAuthSubmitting(false)
    }
  }

  async function handleSignOut() {
    setUser(null)
    localStorage.removeItem("gameNexusUser")
  }

  return (
    <div className="app-shell">
      {showLanding ? (
        <LandingPage onEnter={() => setShowLanding(false)} />
      ) : (
        <>
          <div className="antigravity-container">
            <Grainient
              color1="#4a154d"
              color2="#8d1b9a"
              color3="#1f8ef1"
              timeSpeed={0.25}
              colorBalance={0}
              warpStrength={0.75}
              warpFrequency={5}
              warpSpeed={3}
              warpAmplitude={50}
              blendAngle={0}
              blendSoftness={0.05}
              rotationAmount={500}
              noiseScale={2}
              grainAmount={0.01}
              grainScale={2}
              grainAnimated={false}
              contrast={1.5}
              gamma={1}
              saturation={1}
              centerX={0}
              centerY={0}
              zoom={0.9}
            />
          </div>
          {/* Top navigation */}
          <header className="page">
            <div className="logo">
              <div className="logo-mark">
                <div className="logo-icon"></div>
              </div>
              <div>
                <div className="logo-text-main">GAME NEXUS</div>
                <div className="logo-text-sub">Retro Arcade System</div>
              </div>
            </div>
            <nav>
              <a href="#" className={activeTab === "discover" ? "active" : ""} onClick={() => handleNavClick("discover")}>Discover</a>
              <a href="#" className={activeTab === "trending" ? "active" : ""} onClick={() => handleNavClick("trending")}>Trending</a>
              <a href="#" className={activeTab === "new" ? "active" : ""} onClick={() => handleNavClick("new")}>New Drops</a>
            </nav>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <button className="nav-cta-btn" onClick={user ? handleSignOut : handleOpenSignIn}>
                {user ? "Sign out" : "Login"}
              </button>
            </div>
          </header>

          {showSignIn ? (
            <main className="auth-main">
              <section className="auth-shell">
                <div className="auth-card">
                  {/* Logo badge */}
                  <div className="auth-logo-badge">
                    <div className="auth-logo-mark">GX</div>
                    <span className="auth-logo-name">Game Nexus</span>
                  </div>
                  <div className="auth-card-header">
                    <h1 className="auth-title">
                      {isSignUp ? "Create your account." : "Welcome back, gamer."}
                    </h1>
                    <p className="auth-subtitle">
                      {isSignUp
                        ? "Join the network to sync favorites, keep your history, and pick up right where you left off."
                        : "Sign in to sync favorites, keep your history, and pick up right where you left off."}
                    </p>
                  </div>
                  <form className="auth-form" onSubmit={handleSignInSubmit}>
                    {isSignUp && (
                      <label className="auth-label">
                        Username
                        <input
                          type="text"
                          className="auth-input"
                          value={authUsername}
                          onChange={(e) => setAuthUsername(e.target.value)}
                          placeholder="GamerTag123"
                        />
                      </label>
                    )}
                    <label className="auth-label">
                      Email
                      <input
                        type="email"
                        className="auth-input"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        placeholder="you@example.gg"
                      />
                    </label>
                    <label className="auth-label">
                      Password
                      <div className="auth-input-wrap">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="auth-input"
                          value={authPassword}
                          onChange={(e) => setAuthPassword(e.target.value)}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          className="auth-eye-btn"
                          onClick={() => setShowPassword(v => !v)}
                          tabIndex={-1}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                              <line x1="1" y1="1" x2="23" y2="23"/>
                            </svg>
                          ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                              <circle cx="12" cy="12" r="3"/>
                            </svg>
                          )}
                        </button>
                      </div>
                      {isSignUp && authPassword && (
                        <div className="auth-strength">
                          <div className="auth-strength-bar" data-strength={pwdStrength} />
                        </div>
                      )}
                    </label>
                    <div className="auth-row">
                      <label className="auth-remember">
                        <input
                          type="checkbox"
                          checked={authRemember}
                          onChange={(e) => setAuthRemember(e.target.checked)}
                        />
                        <span>Keep me signed in on this device</span>
                      </label>
                      <button type="button" className="auth-link">
                        Forgot password?
                      </button>
                    </div>
                    {authError && <div className="auth-error">{authError}</div>}
                    <button
                      className="auth-submit"
                      type="submit"
                      disabled={authSubmitting}
                    >
                      {authSubmitting ? (isSignUp ? "Creating account..." : "Signing you in...") : (isSignUp ? "Sign up" : "Sign in")}
                    </button>
                    <div className="auth-divider">
                      <span />
                      <span>or continue with</span>
                      <span />
                    </div>
                    <div className="auth-social-row">
                      <button type="button" className="auth-social" disabled>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Google
                      </button>
                      <button type="button" className="auth-social" disabled>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#5865F2"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
                        Discord
                      </button>
                      <button type="button" className="auth-social" disabled>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#107C10"><path d="M4.102 21.033C6.211 22.881 8.977 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12c0 3.338 1.366 6.363 3.583 8.538l-.026-.024.545.519zm1.404-1.39l-.642-.614C3.17 17.416 2 14.839 2 12 2 6.477 6.477 2 12 2s10 4.477 10 10c0 5.419-4.327 9.837-9.716 9.996L12 22c-2.54 0-4.863-.929-6.647-2.461l.153.104z"/></svg>
                        Xbox
                      </button>
                    </div>
                    <p className="auth-footer-text">
                      {isSignUp ? "Already have an account?" : "New here?"}{" "}
                      <span className="auth-link-text" onClick={() => setIsSignUp(!isSignUp)}>
                        {isSignUp ? "Sign in" : "Create a free account"}
                      </span>
                    </p>
                  </form>
                  <button
                    type="button"
                    className="auth-back-link"
                    onClick={handleCloseSignIn}
                  >
                    ← Back to arcade
                  </button>
                </div>
              </section>
            </main>
          ) : (
            <main className="page">
              <section className="hero">
                <div className="hero-copy">
                  <div className="hero-badge-row">
                    <div className="hero-badge">
                      <div className="hero-badge-pulse"></div>
                      <span>100% Free Arcade</span>
                    </div>
                    <div className="hero-badge" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                      <span>Fast Loading</span>
                    </div>
                  </div>

                  <h1 className="hero-title">
                    Jump into the Ultimate Arcade experience.
                  </h1>
                  <p className="hero-tagline">
                    Discover over <strong>{games.length || "500+"} games</strong> instantly. 
                    No downloads, no lag. Just pure, unadulterated gameplay right in your browser.
                  </p>

                  <div className="hero-cta-row">
                    <button className="btn-primary">
                      Start Playing
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                    <button className="btn-secondary" onClick={() => document.getElementById("search-input")?.focus()}>
                      Find a Game
                    </button>
                  </div>
                </div>

                <GamePreviewCard />
              </section>

              <section style={{ marginTop: "40px" }}>
                <form className="search-container" onSubmit={handleSearch} style={{ maxWidth: "800px", margin: "0 auto 40px" }}>
                  <input
                    id="search-input"
                    className="search-input"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by title, genre, or keyword..."
                    style={{ background: "rgba(11, 16, 32, 0.8)", border: "1px solid var(--border-subtle)" }}
                  />
                  <button className="search-button" type="submit" disabled={loading}>
                    {loading ? "Searching..." : "Search"}
                  </button>
                </form>
              </section>

              {categories.length > 0 && (
                <div className="filter-bar">
                  <span className="filter-label">Browse by genre</span>
                  <div className="filter-chips">
                    <button
                      type="button"
                      className={
                        activeCategory === "All"
                          ? "filter-chip filter-chip-active"
                          : "filter-chip"
                      }
                      onClick={() => setActiveCategory("All")}
                    >
                      All
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        className={
                          activeCategory === cat
                            ? "filter-chip filter-chip-active"
                            : "filter-chip"
                        }
                        onClick={() => setActiveCategory(cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <section>
                {loading && (
                  <div className="loader-container">
                    <div className="loader"></div>
                    <p>Booting up the arcade...</p>
                  </div>
                )}

                {!loading && displayedGames.length === 0 && (
                  <div className="empty-state">
                    No games found. Try a different title or genre.
                  </div>
                )}

                {!loading && displayedGames.length > 0 && (
                  <div className="results-meta">
                    <span className="results-count">
                      Showing {displayedGames.length} game
                      {displayedGames.length !== 1 ? "s" : ""}{" "}
                      {activeCategory !== "All" && `in ${activeCategory}`}
                    </span>
                  </div>
                )}

                {/* Grid view of games */}
                <div className="games-grid">
                  {displayedGames.map((game) => {
                    const imageAsset =
                      game.Asset && game.Asset.length > 0 ? game.Asset[0] : null

                    return (
                      <div
                        key={game.Url}
                        className="game-card"
                        onClick={() => handleGameClick(game)}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="game-image-container">
                          {imageAsset ? (
                            <img
                              src={imageAsset}
                              alt={game.Title}
                              className="game-image"
                            />
                          ) : (
                            <div
                              style={{
                                background: "var(--card)",
                                width: "100%",
                                height: "100%",
                              }}
                            ></div>
                          )}
                          <span className="play-now-badge">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              style={{ marginRight: "4px" }}
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                            Play now
                          </span>
                        </div>
                        <div className="game-content">
                          <h3 className="game-title">{game.Title}</h3>
                          {game.Category && (
                            <div className="genres">
                              {game.Category.slice(0, 3).map((c, i) => (
                                <span key={i} className="genre-tag">
                                  {c}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="game-meta">
                            <button
                              type="button"
                              className="play-now-button"
                              onClick={() => handleGameClick(game)}
                            >
                              Play now
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            </main>
          )}

          {/* Playable Game Modal */}
          {selectedGame && !showSignIn && (
            <div className="modal-overlay" onClick={closeModal} style={{ padding: 0 }}>
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: "100vw",
                  height: "100vh",
                  maxWidth: "100vw",
                  borderRadius: 0,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "1rem 1.5rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                    background: "var(--bg-dark)",
                  }}
                >
                  <h2 className="modal-title" style={{ margin: 0 }}>
                    {selectedGame.Title}
                  </h2>
                  <button
                    className="modal-close"
                    onClick={closeModal}
                    style={{ position: "static" }}
                  >
                    ✕
                  </button>
                </div>

                <div
                  style={{
                    flex: 1,
                    backgroundColor: "#000",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <iframe
                    src={selectedGame.Url}
                    title={selectedGame.Title}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allow="autoplay; fullscreen; microphone;"
                    style={{ display: "block" }}
                  ></iframe>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default App