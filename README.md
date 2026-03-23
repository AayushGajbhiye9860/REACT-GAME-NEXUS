# Game Nexus

A full-stack game discovery platform built with React and Vite. Browse, search, and explore games across multiple genres with AI-powered descriptions, real-time data from external game APIs, and user authentication backed by Firebase.

Live demo: [game-nexus.vercel.app](https://game-nexus.vercel.app)

---

## Features

- Browse and search games using the RAWG Video Games Database API
- Free-to-play game listings via the FreeToGame API
- AI-generated game descriptions powered by Google Gemini
- User authentication with Firebase Auth
- Persistent data storage with Firestore
- Retro arcade-inspired UI with a Sapphire and Gold color palette
- Smooth animations and transitions using Framer Motion
- Fully responsive layout for desktop and mobile

---

## Tech Stack

**Frontend**
- React 18
- Vite
- Tailwind CSS
- shadcn/ui
- Framer Motion

**Backend and Services**
- Firebase Authentication
- Cloud Firestore
- RAWG Video Games Database API
- FreeToGame API
- Google Gemini API

**Deployment**
- Vercel

---

## Project Structure

```
REACT-GAME-NEXUS/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm or yarn
- A Firebase project with Authentication and Firestore enabled
- API keys for RAWG and Google Gemini

### Installation

1. Clone the repository

```bash
git clone https://github.com/AayushGajbhiye9860/REACT-GAME-NEXUS.git
cd REACT-GAME-NEXUS
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

Create a `.env` file in the root directory and add the following:

```env
VITE_RAWG_API_KEY=your_rawg_api_key
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

---

## API Keys

- **RAWG API** — Get your free key at [rawg.io/apidocs](https://rawg.io/apidocs)
- **Google Gemini API** — Available via [Google AI Studio](https://aistudio.google.com)
- **Firebase** — Set up a project at [console.firebase.google.com](https://console.firebase.google.com)

---

## Deployment

This project is deployed on Vercel. To deploy your own instance:

1. Push the repository to GitHub
2. Import the project on [vercel.com](https://vercel.com)
3. Add all environment variables from your `.env` file in the Vercel dashboard
4. Deploy

Make sure the Vercel deployment is set to public access if you want the app to be accessible without authentication.

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

## Author

Aayush Gajbhiye  
First-year Engineering Student, AISSMS College of Engineering, Pune  
GitHub: [@AayushGajbhiye9860](https://github.com/AayushGajbhiye9860)
