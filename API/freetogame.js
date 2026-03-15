export async function fetchGamesFromFTG(amount = 250) {
    try {
        const response = await fetch(
            `https://www.freetogame.com/api/games`
        );
        const data = await response.json();
        
        return data.slice(0, amount).map(game => ({
            Title: game.title,
            Url: game.game_url,
            Asset: [game.thumbnail],
            Category: [game.genre, game.platform],
            Source: 'FreeToGame'
        }));
    } catch (error) {
        console.error("Error from FreeToGame:", error);
        return [];
    }
}
