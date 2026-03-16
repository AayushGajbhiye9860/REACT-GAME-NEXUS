import React from 'react';
import './AuthPage.css';
import Hyperspeed from '../Hyperspeed';
import { hyperspeedPresets } from '../HyperSpeedPresets';

const AuthPage = ({
  isSignUp,
  setIsSignUp,
  authEmail,
  setAuthEmail,
  authPassword,
  setAuthPassword,
  authUsername,
  setAuthUsername,
  authError,
  authSubmitting,
  handleSignInSubmit,
  handleCloseSignIn
}) => {
  return (
    <div className="auth-page-container">
      {/* Background Circuit SVG */}
      <svg className="auth-background-circuit" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
        {/* Top Left Circuit */}
        <path className="circuit-path" d="M 0 50 L 50 50 L 100 100 L 100 200 L 200 250 L 300 250" />
        <path className="circuit-path" d="M 0 70 L 40 70 L 90 120 L 90 220 L 190 270 L 280 270" />
        <rect className="circuit-node" x="90" y="40" width="20" height="20" rx="4" />
        <circle className="circuit-node-inner" cx="100" cy="50" r="3" />

        {/* Top Right Circuit */}
        <path className="circuit-path" d="M 1000 50 L 950 50 L 900 100 L 900 200 L 800 250 L 700 250" />
        <path className="circuit-path" d="M 1000 70 L 960 70 L 910 120 L 910 220 L 810 270 L 720 270" />
        <rect className="circuit-node" x="890" y="40" width="20" height="20" rx="4" />
        <circle className="circuit-node-inner" cx="900" cy="50" r="3" />

        {/* Bottom Left Circuit */}
        <path className="circuit-path" d="M 0 950 L 50 950 L 100 900 L 100 800 L 200 750 L 300 750" />
        <path className="circuit-path" d="M 0 930 L 40 930 L 90 880 L 90 780 L 190 730 L 280 730" />
        <rect className="circuit-node" x="90" y="940" width="20" height="20" rx="4" />
        <circle className="circuit-node-inner" cx="100" cy="950" r="3" />

        {/* Bottom Right Circuit */}
        <path className="circuit-path" d="M 1000 950 L 950 950 L 900 900 L 900 800 L 800 750 L 700 750" />
        <path className="circuit-path" d="M 1000 930 L 960 930 L 910 880 L 910 780 L 810 730 L 720 730" />
        <rect className="circuit-node" x="890" y="940" width="20" height="20" rx="4" />
        <circle className="circuit-node-inner" cx="900" cy="950" r="3" />
      </svg>

      <Hyperspeed effectOptions={hyperspeedPresets.one} />

      <div className="auth-card-new">
        <div className="auth-header-new">
          <div className="auth-logo-new">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="gx-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00A3FF" />
                  <stop offset="1" stopColor="#007AFF" />
                </linearGradient>
                <filter id="gx-glow" x="-4" y="-4" width="40" height="40" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feOffset/>
                  <feGaussianBlur stdDeviation="2"/>
                  <feComposite in2="hardAlpha" operator="out"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.639216 0 0 0 0 1 0 0 0 0.5 0"/>
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1_2"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1_2" result="shape"/>
                </filter>
              </defs>
              <g filter="url(#gx-glow)">
                <path d="M12 9H20C21.6569 9 23 10.3431 23 12V20C23 21.6569 21.6569 23 20 23H12C10.3431 23 9 21.6569 9 20V12C9 10.3431 10.3431 9 12 9Z" stroke="url(#gx-gradient)" strokeWidth="2" />
                <path d="M14 13L18 20" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M18 13L14 20" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M11 14C11 14 12 13 13.5 13" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </g>
            </svg>
          </div>
          <h1 className="auth-title-new">
            Welcome Back
          </h1>
          <p className="auth-subtitle-new">
            Don't have an account yet?{" "}
            <span className="auth-link-new" onClick={() => setIsSignUp(!isSignUp)}>
              Sing up
            </span>
          </p>
        </div>

        <form className="auth-form-new" onSubmit={handleSignInSubmit}>
          {isSignUp && (
            <div className="input-group-new">
              <span className="input-icon-new">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </span>
              <input
                type="text"
                className="input-new"
                placeholder="Username"
                value={authUsername}
                onChange={(e) => setAuthUsername(e.target.value)}
                required
              />
            </div>
          )}

          <div className="input-group-new">
            <span className="input-icon-new">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </span>
            <input
              type="email"
              className="input-new"
              placeholder="Email address"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group-new">
            <span className="input-icon-new">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </span>
            <input
              type="password"
              className="input-new"
              placeholder="Password"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              required
            />
          </div>

          {authError && <div style={{ color: '#ff4d4f', fontSize: '14px', marginTop: '4px' }}>{authError}</div>}

          <button className="auth-submit-new" type="submit" disabled={authSubmitting}>
            {authSubmitting ? "Processing..." : (isSignUp ? "Sign Up" : "Login")}
          </button>
        </form>

        <div className="auth-divider-new">OR</div>

        <div className="social-group-new">
          <button className="social-btn-new" type="button" aria-label="Apple Login">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.025-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z"/></svg>
          </button>
          <button className="social-btn-new" type="button" aria-label="Google Login">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          </button>
          <button className="social-btn-new" type="button" aria-label="X Login">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.493h2.039L6.486 3.24H4.298l13.311 17.406z"/></svg>
          </button>
        </div>

        <button className="auth-back-new" onClick={handleCloseSignIn}>
          ← Back to arcade
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
