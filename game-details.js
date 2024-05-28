document.addEventListener("DOMContentLoaded", () => {
    const gameDetailsEl = document.getElementById("game-details");
    const backButtonEl = document.getElementById("back-button");
    const APIKEY = "1818ea3bd3e2460da268a13c7c0d7292"; // Ersetzen Sie dies durch Ihren tatsächlichen API-Schlüssel
  
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('gameId');
  
    if (gameId) {
      const gameDetailsUrl = `https://api.rawg.io/api/games/${gameId}?key=${APIKEY}`;
  
      fetch(gameDetailsUrl)
        .then(response => response.json())
        .then(game => {
          const gameDetailsHTML = `
            <h1>${game.name}</h1>
            <img src="${game.background_image}" alt="${game.name}">
            <p>${game.description}</p>
            <ul>
              <li>Released: ${game.released}</li>
              <li>Rating: ${game.rating}</li>
              <li>Platforms: ${game.platforms.map(p => p.platform.name).join(', ')}</li>
            </ul>
            <div>
            ${game.short_screenshots ? game.short_screenshots.map(screenshot => `<img src="${screenshot.image}" alt="Screenshot">`).join('') : ''}
            </div>
          `;
          
          gameDetailsEl.innerHTML = gameDetailsHTML;

          // Zurück-Button hinzufügen
          const previousUrl = document.referrer; // Zugriff auf die vorherige URL
          backButtonEl.setAttribute('href', previousUrl); // Setzen Sie den Link des Zurück-Buttons auf die vorherige URL
        })
        .catch(error => {
          console.error("Ein Fehler ist aufgetreten:", error);
          gameDetailsEl.innerHTML = "<p>Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.</p>";
        });
    } else {
      gameDetailsEl.innerHTML = "<p>Kein Spiel ausgewählt.</p>";
    }
  });
