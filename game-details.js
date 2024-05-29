document.addEventListener("DOMContentLoaded", () => {
    const loaderEl = document.getElementById("js-preloader");
    const gameId = new URLSearchParams(window.location.search).get("gameId");

    if (!gameId) {
        console.error("Fehler: Spiel-ID nicht gefunden.");
        return;
    }

    const APIKEY = "1818ea3bd3e2460da268a13c7c0d7292"; // Ersetzen Sie dies durch Ihren tatsächlichen API-Schlüssel
    const url = `https://api.rawg.io/api/games/${gameId}?key=${APIKEY}`;

    function loadGameDetails(apiUrl) {
        if (loaderEl) {
            loaderEl.classList.remove("loaded");
        }

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Netzwerkantwort war nicht ok.');
                }
                return response.json();
            })
            .then(game => {
                const gameTitleEl = document.querySelector(".game-title");
                const gameDescriptionEl = document.querySelector(".game-description");
                const gameReleaseDateEl = document.querySelector(".game-release-date");
                const gameRatingEl = document.querySelector(".game-rating");
                const gamePlatformsEl = document.querySelector(".game-platforms");
                const gameImageEl = document.querySelector(".game-image");

                if (gameTitleEl) gameTitleEl.textContent = game.name;
                if (gameDescriptionEl) gameDescriptionEl.innerHTML = game.description_raw; // `description_raw` is more suitable for text content
                if (gameReleaseDateEl) gameReleaseDateEl.textContent = game.released;
                if (gameRatingEl) gameRatingEl.textContent = game.rating;
                if (gamePlatformsEl) gamePlatformsEl.textContent = game.parent_platforms.map(pl => pl.platform.name).join(", ");
                if (gameImageEl) gameImageEl.setAttribute('src', game.background_image);
                if (gameImageEl) gameImageEl.setAttribute('alt', `${game.name} image`);

                if (loaderEl) {
                    loaderEl.classList.add("loaded");
                }
            })
            .catch(error => {
                console.error("Ein Fehler ist aufgetreten:", error);
                if (loaderEl) {
                    loaderEl.classList.add("loaded");
                }
                alert("Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.");
            });
    }

    // Initiales Laden der Spieldetails
    loadGameDetails(url);
});
