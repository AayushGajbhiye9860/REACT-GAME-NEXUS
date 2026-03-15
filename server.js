import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { dbConnector } from './db_connector.js';

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// Register
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const existingUser = await dbConnector.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await dbConnector.createUser({
      username,
      email,
      password: hashedPassword
    });

    res.status(201).json({ 
      message: 'User created successfully', 
      user: { id: newUser.id, username, email } 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await dbConnector.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (match) {
      res.json({ 
        message: 'Login successful', 
        user: { id: user.id, username: user.username, email: user.email } 
      });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Save a clicked game
app.post('/save-game', async (req, res) => {
  const { userId, gameTitle, gameUrl, gameImage } = req.body;

  if (!userId || !gameTitle || !gameUrl) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const savedGame = await dbConnector.saveGame({
      userId,
      game_title: gameTitle,
      game_url: gameUrl,
      game_image: gameImage
    });
    res.status(201).json({ message: 'Game saved successfully', id: savedGame.id });
  } catch (err) {
    console.error('Error saving game:', err);
    res.status(500).json({ error: 'Database error while saving game' });
  }
});

// Get user's played games
app.get('/user-games/:userId', async (req, res) => {
  const userId = req.params.userId;
  
  try {
    const games = await dbConnector.getSavedGames(userId);
    res.json(games);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
