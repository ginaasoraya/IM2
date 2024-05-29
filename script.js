document.addEventListener("DOMContentLoaded", () => {
    const gameList = document.querySelector(".gameList");
    const loaderEl = document.getElementById("js-preloader");
    const loadMoreGamesBtn = document.getElementById("loadMoreButton");
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const ratingDropdown = document.getElementById("ratingDropdown");
    let nextGameListUrl = null;

    console.log("gameList:", gameList);
    console.log("loaderEl:", loaderEl);
    console.log("loadMoreGamesBtn:", loadMoreGamesBtn);
    console.log("searchInput:", searchInput);
    console.log("searchButton:", searchButton);
    console.log("ratingDropdown:", ratingDropdown);

    if (!gameList || !loaderEl || !loadMoreGamesBtn || !searchInput || !searchButton || !ratingDropdown) {
        console.error("Ein oder mehrere benötigte DOM-Elemente wurden nicht gefunden.");
        return;
    }

    const APIKEY = "1818ea3bd3e2460da268a13c7c0d7292"; // Ersetzen Sie dies durch Ihren tatsächlichen API-Schlüssel
    let url = `https://api.rawg.io/api/games?key=${APIKEY}&dates=2022-01-01,2022-12-31&ordering=-added&page_size=50`; // 20 Spiele beim ersten Laden

    const getPlatformStr = (platforms) => {
        const platformStr = platforms.map(pl => pl.platform.name).join(", ");
        if (platformStr.length > 60) {
            return platformStr.substring(0, 60) + "...";
        }
        return platformStr;
    };

    function filterResults() {
        const searchTerm = searchInput.value.toLowerCase();
        const gameItems = document.querySelectorAll(".item");

        gameItems.forEach((item, index) => {
            const gameName = item.querySelector(".game-name").textContent.toLowerCase();
            if (gameName.includes(searchTerm)) {
                item.style.display = "block"; // Zeige das Spiel an, wenn es dem Suchbegriff entspricht
            } else {
                item.style.display = "none"; // Verstecke das Spiel, wenn es nicht dem Suchbegriff entspricht
            }
        });
    }

    function searchGames() {
        // Führe die Filterung nur durch, wenn der Suchbutton geklickt wird
        filterResults();
    }

    function loadGames(apiUrl = url) {
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
            .then(data => {
                nextGameListUrl = data.next ? data.next : null;
                const games = data.results;

                games.forEach(game => {
                    const gameItemEl = `
                        <div class="col-lg-3 col-md-6 col-sm-12">
                            <div class="item" data-game-id="${game.id}">
                                <img src="${game.background_image}" alt="${game.name} image">
                                <h4 class="game-name">${game.name}<br><span class="platforms">${getPlatformStr(game.parent_platforms)}</span></h4>
                                <ul>
                                    <li><i class="fa fa-star"></i> <span class="rating">${game.rating}</span></li>
                                    <li><i class="fa-regular fa-calendar"></i> <span class="date">${game.released}</span></li>
                                </ul>
                            </div>
                        </div>
                    `;
                    gameList.insertAdjacentHTML("beforeend", gameItemEl);
                });

                if (loaderEl) {
                    loaderEl.classList.add("loaded");
                }

                if (nextGameListUrl) {
                    loadMoreGamesBtn.parentElement.classList.remove("hidden");
                } else {
                    loadMoreGamesBtn.parentElement.classList.add("hidden");
                }

                // Event Listener für die Spiel-Items
                document.querySelectorAll('.item').forEach(item => {
                    item.addEventListener('click', function () {
                        const gameId = this.getAttribute('data-game-id');
                        if (gameId) {
                            window.location.href = `game-details.html?gameId=${gameId}`;
                        } else {
                            console.error("Fehler: Spiel-ID nicht gefunden");
                        }
                    });
                });
            })
            .catch(error => {
                console.error("Ein Fehler ist aufgetreten:", error);
                if (loaderEl) {
                    loaderEl.classList.add("loaded");
                }
                alert("Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.");
            });
    }

    // Initiales Laden der Spiele
    loadGames();

    // Event Listener für den "Suchen" Button
    searchButton.addEventListener("click", searchGames);

    // Event Listener für den "Mehr laden" Button
    loadMoreGamesBtn.addEventListener("click", () => {
        if (nextGameListUrl) {
            loadGames(nextGameListUrl);
        }
    });

    // Event Listener für das Bewertungs-Dropdown
    ratingDropdown.addEventListener("change", (event) => {
        const selectedRating = parseFloat(event.target.value);
        filterGamesByRating(selectedRating);
    });

    // Funktion zum Filtern der Spiele nach Bewertung
    function filterGamesByRating(selectedRating) {
        const gameItems = document.querySelectorAll(".item");
        gameItems.forEach((item) => {
            const rating = parseFloat(item.querySelector(".rating").textContent);
            if (isNaN(selectedRating) || selectedRating === 'all' || rating >= selectedRating) {
                item.style.display = "block"; // Zeige das Spiel an, wenn es die Bewertungskriterien erfüllt
            } else {
                item.style.display = "none"; // Verstecke das Spiel, wenn es die Bewertungskriterien nicht erfüllt
            }
        });
    }
});
