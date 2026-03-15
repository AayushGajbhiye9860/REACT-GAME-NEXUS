import { readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DB_PATH = join(__dirname, 'db.json');

const INITIAL_DATA = {
    users: [],
    saved_games: []
};

async function readDB() {
    try {
        const data = await readFile(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        if (err.code === 'ENOENT') {
            await writeFile(DB_PATH, JSON.stringify(INITIAL_DATA, null, 2));
            return INITIAL_DATA;
        }
        throw err;
    }
}

async function writeDB(data) {
    await writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

export const dbConnector = {
    async getUsers() {
        const data = await readDB();
        return data.users;
    },

    async findUserByEmail(email) {
        const users = await this.getUsers();
        return users.find(u => u.email === email);
    },

    async createUser(user) {
        const data = await readDB();
        const newUser = {
            id: Date.now(), // Simple unique ID
            ...user
        };
        data.users.push(newUser);
        await writeDB(data);
        return newUser;
    },

    async getSavedGames(userId) {
        const data = await readDB();
        return data.saved_games
            .filter(g => g.user_id === parseInt(userId))
            .sort((a, b) => new Date(b.played_at) - new Date(a.played_at));
    },

    async saveGame(gameData) {
        const data = await readDB();
        const newGame = {
            id: Date.now(),
            played_at: new Date().toISOString(),
            ...gameData,
            user_id: parseInt(gameData.userId)
        };
        delete newGame.userId; // normalize to underscore
        data.saved_games.push(newGame);
        await writeDB(data);
        return newGame;
    }
};
