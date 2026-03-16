import { useState, useEffect } from "react"
import { fetchGames, searchGames } from "./API/game_service"
import Grainient from "./components/Grainient/Grainient"
import GamePreviewCard from "./components/GamePreviewCard"
import LandingPage from "./components/LandingPage"
import MagicBento from "./components/MagicBento"
import AuthPage from "./components/AuthPage/AuthPage"
import TextCursor from "./components/TextCursor/TextCursor"

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
      <TextCursor text="GX" spacing={50} maxPoints={10} />
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
            <AuthPage
              isSignUp={isSignUp}
              setIsSignUp={setIsSignUp}
              authEmail={authEmail}
              setAuthEmail={setAuthEmail}
              authPassword={authPassword}
              setAuthPassword={setAuthPassword}
              authUsername={authUsername}
              setAuthUsername={setAuthUsername}
              authError={authError}
              authSubmitting={authSubmitting}
              handleSignInSubmit={handleSignInSubmit}
              handleCloseSignIn={handleCloseSignIn}
            />
          ) : (
            <main className="page">
              {activeTab === "discover" && (
                <>
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

                  <MagicBento />
                </>
              )}

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