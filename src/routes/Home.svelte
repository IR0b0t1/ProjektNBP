<script>
  import { push } from "svelte-spa-router";
  import { onMount } from "svelte";

  let games = [];
  let nextPageUrl = null;
  let prevPageUrl = null;
  let currentPage = 1;

  function getUrlForPage(page) {
    return `https://api.rawg.io/api/games?key=de4d513680fd4e698af5f40511424237&page=${page}`;
  }

  async function fetchGames(url) {
    try {
      const response = await fetch(url || getUrlForPage(currentPage));
      const data = await response.json();
      games = data.results.slice(0, 20);
      nextPageUrl = data.next;
      prevPageUrl = data.previous;
    } catch (error) {
      console.error("Error fetching games:", error);
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
      fetchGames(nextPageUrl);
    }
  }

  function goToPreviousPage() {
    if (prevPageUrl) {
      currentPage--;
      localStorage.setItem("currentPage", currentPage.toString());
      fetchGames(prevPageUrl);
    }
  }

  function goToFirstPage() {
    currentPage = 1;
    localStorage.setItem("currentPage", "1");
    fetchGames();
  }

  onMount(() => {
    const savedPage = localStorage.getItem("currentPage");
    if (savedPage) {
      currentPage = parseInt(savedPage, 10);
    }
    fetchGames();
  });
</script>

<main>
  <h1>Popular Games</h1>
  <div class="game-preview">
    <div class="game-grid">
      {#each games as game}
        <div class="game-card" on:click={() => navigateToGameDetail(game.id)}>
          <img src={game.background_image} alt={game.name} />
          <h2>{game.name}</h2>
        </div>
      {/each}
    </div>
  </div>

  <div class="pagination-buttons">
    <button on:click={goToFirstPage}>First</button>
    <button on:click={goToPreviousPage} disabled={!prevPageUrl}>Previous</button
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
    font-family: Arial, sans-serif;
  }

  h1 {
    font-size: 36px;
    color: #66c0f4;
    font-weight: bold;
    margin-bottom: 20px;
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
    border-bottom: 2px solid #66c0f4;
  }

  .game-card h2 {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.8);
    padding: 10px;
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
    transition: background 0.3s ease-in-out;
  }

  .pagination-buttons button:hover {
    background: #88d5ff;
  }

  .pagination-buttons button:disabled {
    background: #444;
    color: #bbb;
    cursor: not-allowed;
  }
</style>
