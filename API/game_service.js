import { fetchGamesFromGD } from './gamedistribution.js';
import { fetchGamesFromFTG } from './freetogame.js';

/**
 * Unified fetch for all games
 */
export async function fetchGames(totalAmount = 500) {
    const half = Math.ceil(totalAmount / 2);
    
    // Fetch from separate files
    const [gdGames, ftgGames] = await Promise.all([
        fetchGamesFromGD(half),
        fetchGamesFromFTG(half)
    ]);

    const combined = [...gdGames, ...ftgGames];
    return combined.slice(0, totalAmount);
}

/**
 * Unified search for games across all sources
 */
export async function searchGames(query, amount = 100) {
    const allGames = await fetchGames(200);

    if (!query) return allGames.slice(0, amount);

    const lowerQuery = query.toLowerCase();
    return allGames.filter(game =>
        game.Title.toLowerCase().includes(lowerQuery) ||
        (game.Category && game.Category.some(c => c.toLowerCase().includes(lowerQuery)))
    ).slice(0, amount);
}
