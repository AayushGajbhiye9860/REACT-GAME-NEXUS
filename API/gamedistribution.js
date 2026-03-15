export async function fetchGamesFromGD(amount = 250) {
    try {
        const response = await fetch(
            `https://catalog.api.gamedistribution.com/api/v2.0/rss/All/?amount=${amount}&format=json`
        );
        const data = await response.json();
        return data.map(game => ({
            Title: game.Title,
            Url: game.Url,
            Asset: game.Asset || [],
            Category: game.Category || [],
            Source: 'GameDistribution'
        }));
    } catch (error) {
        console.error("Error from GameDistribution:", error);
        return [];
    }
}
