import React from "react"

const GamePreviewCard = () => {
    return (
        <div className="hero-visual">
            <div className="hero-card-main">
                <div className="hero-card-status-bar">
                    <div className="hero-card-status-left">
                        <div className="status-dot"></div>
                        <span style={{ fontFamily: "var(--font-accent)", letterSpacing: "0.1em" }}>Live Session #429</span>
                    </div>
                    <span style={{ fontFamily: "var(--font-accent)" }}>00:12:45</span>
                </div>

                <div className="hero-game-preview">
                    <div className="hero-game-inner">
                        <div className="game-board">
                           {/* Enemies */}
                            <div className="enemy-dot" style={{ top: "20%", left: "30%" }}></div>
                            <div className="enemy-dot" style={{ top: "15%", left: "60%" }}></div>
                            <div className="enemy-dot" style={{ top: "25%", left: "75%" }}></div>
                            
                            {/* Laser */}
                            <div className="laser"></div>
                            
                            {/* Ship */}
                            <div className="ship">
                                <span style={{ fontSize: "14px", transform: "rotate(-90deg)" }}>🚀</span>
                                <div className="ship-flames"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="hero-card-title-row">
                    <h3 className="hero-card-title" style={{ fontFamily: "var(--font-secondary)", textTransform: "uppercase" }}>Stellar Strike</h3>
                    <div style={{ display: "flex", gap: "4px" }}>
                        <span style={{ fontSize: "12px", color: "var(--bright-yellow)" }}>★</span>
                        <span style={{ fontSize: "12px", color: "var(--bright-yellow)" }}>★</span>
                        <span style={{ fontSize: "12px", color: "var(--bright-yellow)" }}>★</span>
                        <span style={{ fontSize: "12px", color: "var(--bright-yellow)" }}>★</span>
                        <span style={{ fontSize: "12px", color: "var(--silver)" }}>★</span>
                    </div>
                </div>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--silver)", fontFamily: "var(--font-accent)", textTransform: "uppercase" }}>RPG / Arcade</span>
                    <button className="nav-cta-btn" style={{ padding: "8px 16px", fontSize: "0.8rem", height: "auto" }}>Launch</button>
                </div>
            </div>
        </div>
    )
}

export default GamePreviewCard
