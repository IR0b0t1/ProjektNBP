<script>
    import { push } from "svelte-spa-router";
    import { onMount } from "svelte";

    let games = [];
    let nextPageUrl = null;
    let prevPageUrl = null;
    let currentPage = 1;
    let searchTerm = "";
    let searchType = "";
    let searchId = "";
    let searchName = "";

    function getUrlForPage(page, query = "", type = "", id = "") {
        const base = `https://api.rawg.io/api/games?key=de4d513680fd4e698af5f40511424237&page=${page}`;
        if (query) {
            return `${base}&search=${encodeURIComponent(query)}`;
        } else if (type && id) {
            return `${base}&${type}=${id}`;
        }
        return base;
    }

    async function fetchGames(query = "", type = "", id = "") {
        try {
            const url = getUrlForPage(currentPage, query, type, id);
            const response = await fetch(url);
            const data = await response.json();

            games = data.results;
            nextPageUrl = data.next;
            prevPageUrl = data.previous;
        } catch (error) {
            console.error("Error fetching games:", error);
        }
    }

    async function fetchName(type, id) {
        try {
            const url = `https://api.rawg.io/api/${type}/${id}?key=de4d513680fd4e698af5f40511424237`;
            const response = await fetch(url);
            const data = await response.json();
            searchName = data.name;
        } catch (error) {
            console.error("Error fetching name:", error);
        }
    }

    function navigateToGameDetail(gameId) {
        localStorage.setItem("currentPage", currentPage.toString());
        push(`/game/${gameId}`);
    }

    function goToNextPage() {
        if (nextPageUrl) {
            currentPage++;
            localStorage.setItem("currentPage", currentPage.toString());
            fetchGames(searchTerm, searchType, searchId);
        }
    }

    function goToPreviousPage() {
        if (prevPageUrl) {
            currentPage--;
            localStorage.setItem("currentPage", currentPage.toString());
            fetchGames(searchTerm, searchType, searchId);
        }
    }

    function goToFirstPage() {
        currentPage = 1;
        localStorage.setItem("currentPage", "1");
        fetchGames(searchTerm, searchType, searchId);
    }

    function loadSearchResults() {
        const hash = window.location.hash;
        const urlParams = new URLSearchParams(hash.split("?")[1]);
        searchTerm = urlParams.get("q") || "";
        searchType = urlParams.get("store")
            ? "stores"
            : urlParams.get("genre")
              ? "genres"
              : urlParams.get("platform")
                ? "platforms"
                : "";
        searchId =
            urlParams.get("store") ||
            urlParams.get("genre") ||
            urlParams.get("platform") ||
            "";

        if (searchType && searchId) {
            fetchName(searchType, searchId);
        }

        fetchGames(searchTerm, searchType, searchId);
    }

    onMount(() => {
        const savedPage = localStorage.getItem("currentPage");
        if (savedPage) {
            currentPage = parseInt(savedPage, 10);
        }
        loadSearchResults();
        window.addEventListener("popstate", loadSearchResults);
    });
</script>

<main>
    <h1>
        {searchTerm
            ? `Search Results for "${searchTerm}"`
            : searchType
              ? `Search Results for ${searchName}`
              : "Popular Games"}
    </h1>
    <div class="game-preview">
        <div class="game-grid">
            {#each games as game}
                <div
                    class="game-card"
                    on:click={() => navigateToGameDetail(game.id)}
                >
                    <img src={game.background_image} alt={game.name} />
                    <h2>{game.name}</h2>
                </div>
            {/each}
        </div>
    </div>

    <div class="pagination-buttons">
        <button on:click={goToFirstPage}>First</button>
        <button on:click={goToPreviousPage} disabled={!prevPageUrl}
            >Previous</button
        >
        <button on:click={goToNextPage} disabled={!nextPageUrl}>Next</button>
    </div>
</main>

<style>
    main {
        text-align: center;
        padding: 20px;
        background: linear-gradient(to right, #1b2838, #0f1722);
        color: #dcdcdc;
        font-family: "Arial", sans-serif;
    }

    h1 {
        font-size: 36px;
        color: #66c0f4;
        font-weight: bold;
        margin-bottom: 20px;
        text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7);
    }

    .game-preview {
        display: flex;
        justify-content: center;
    }

    .game-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 20px;
        padding: 10px;
        width: 90%;
        max-width: 1200px;
        margin: auto;
    }

    .game-card {
        position: relative;
        border-radius: 10px;
        overflow: hidden;
        cursor: pointer;
        transition:
            transform 0.3s,
            box-shadow 0.3s;
        background: rgba(255, 255, 255, 0.1);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
    }

    .game-card:hover {
        transform: scale(1.08);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6);
    }

    .game-card img {
        width: 100%;
        height: 250px;
        object-fit: cover;
        border-bottom: 3px solid #66c0f4;
    }

    .game-card h2 {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.8);
        padding: 12px;
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        color: #66c0f4;
        border-radius: 0 0 10px 10px;
    }

    .pagination-buttons {
        margin-top: 30px;
        display: flex;
        justify-content: center;
        gap: 15px;
    }

    .pagination-buttons button {
        background: #66c0f4;
        color: #1b2838;
        font-weight: bold;
        border: none;
        padding: 12px 20px;
        cursor: pointer;
        border-radius: 5px;
        transition:
            background 0.3s ease-in-out,
            transform 0.2s;
    }

    .pagination-buttons button:hover {
        background: #88d5ff;
        transform: scale(1.05);
    }

    .pagination-buttons button:disabled {
        background: #444;
        color: #bbb;
        cursor: not-allowed;
        transform: none;
    }
</style>
