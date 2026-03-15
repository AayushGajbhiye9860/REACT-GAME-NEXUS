import { motion } from "motion/react"
import Grainient from "./Grainient/Grainient"
import OrbitImages from "./OrbitImages/OrbitImages"

const LandingPage = ({ onEnter }) => {
  const orbitAssets = [
    "/assets/joystick.png",
    "/assets/heart.png",
    "/assets/cabinet.png",
    "/assets/star.png",
    "/assets/ufo.png"
  ]

  return (
    <div className="landing-container">
      <div className="landing-bg">
        <Grainient
          color1="#4a154d"
          color2="#8d1b9a"
          color3="#1f8ef1"
        timeSpeed={0.05}
        colorBalance={0}
        warpStrength={0.4}
        warpFrequency={0.8}
        warpSpeed={0.6}
        warpAmplitude={8}
        blendAngle={0}
        blendSoftness={0.15}
        rotationAmount={0}
        noiseScale={2.5}
        grainAmount={0.08}
        grainScale={1.2}
        contrast={1.4}
        zoom={0.9}
        />
      </div>

      <motion.div
        className="landing-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <motion.div
          className="landing-logo-badge"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="landing-logo-mark">
            <span className="logo-gx">GX</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          <OrbitImages
            images={orbitAssets}
            radiusX={550}
            radiusY={180}
            duration={25}
            itemSize={90}
            responsive={true}
            baseWidth={1200}
            rotation={0}
            centerContent={
              <h1 className="landing-title">
                <span className="title-top">WELCOME TO</span>
                <div className="title-main-wrap">
                  <span className="title-main">GAME</span>
                  <span className="title-main">NEXUS</span>
                </div>
              </h1>
            }
          />
          <p className="landing-subtitle">
            The ultimate retro arcade experience, reimagined for the modern era.
          </p>
        </motion.div>

        <motion.button
          className="landing-enter-btn"
          onClick={onEnter}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <span>ENTER THE ARCADE</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </motion.button>
      </motion.div>

      <div className="landing-footer">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          EST. 2026 • RETRO ARCADE NETWORK
        </motion.span>
      </div>
    </div>
  )
}

export default LandingPage
