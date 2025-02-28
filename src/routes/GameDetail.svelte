<script>
    import { onMount } from "svelte";
    import { push } from "svelte-spa-router";
    import Chart from "chart.js/auto";

    export let params;

    let gameDetails = {};
    let chartInstance = null;

    async function fetchGameDetails() {
        try {
            const response = await fetch(
                `https://api.rawg.io/api/games/${params.id}?key=de4d513680fd4e698af5f40511424237`,
            );
            const data = await response.json();
            gameDetails = data;
            createChart();
        } catch (error) {
            console.error("Error fetching game details:", error);
        }
    }

    function createChart() {
        if (chartInstance) {
            chartInstance.destroy();
        }

        const canvas = document.getElementById("ratingsChart");
        if (canvas instanceof HTMLCanvasElement) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                const ratings = gameDetails.ratings || [];
                const labels = ratings.map((rating) => rating.title);
                const dataValues = ratings.map((rating) => rating.percent);

                chartInstance = new Chart(ctx, {
                    type: "pie",
                    data: {
                        labels,
                        datasets: [
                            {
                                data: dataValues,
                                backgroundColor: [
                                    "#4caf50",
                                    "#2196f3",
                                    "#ffeb3b",
                                    "#f44336",
                                ],
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: "bottom",
                            },
                        },
                    },
                });
            }
        }
    }

    function goBackToGames() {
        const savedPage = localStorage.getItem("currentPage") || "1";
        push(`/?page=${savedPage}`);
    }

    onMount(() => {
        fetchGameDetails();
    });
</script>

<main>
    <div class="container">
        <div class="header">
            <button class="back-button" on:click={goBackToGames}>
                Back to Games
            </button>
            <h1>{gameDetails.name}</h1>
        </div>
        <div>
            <div class="game-data">
                <img
                    src={gameDetails.background_image}
                    alt={gameDetails.name}
                />
                <p class="description-p">{gameDetails.description_raw}</p>
            </div>
            <ul>
                <li>Released: {gameDetails.released}</li>
                <li>Rating: {gameDetails.rating}</li>
                <li>
                    Genres: {gameDetails.genres
                        ?.map((genre) => genre.name)
                        .join(", ")}
                </li>
            </ul>
            <div class="metacritic">
                <p>Metacritic score: {gameDetails.metacritic}</p>
            </div>
            <canvas id="ratingsChart"></canvas>
            <div class="requirements">
                <h3>System Requirements</h3>
                <p>
                    {gameDetails.platforms?.find(
                        (p) => p.platform.slug === "pc",
                    )?.requirements?.minimum || "No data available"}
                </p>
            </div>
        </div>
    </div>
</main>

<style>
    main {
        text-align: left;
        background: linear-gradient(to right, #1b2838, #0f1722);
        color: #dcdcdc;
        padding: 20px;
        font-family: Arial, sans-serif;
    }

    .container {
        max-width: 900px;
        margin: auto;
        padding: 20px;
        background: rgba(0, 0, 0, 0.7);
        border-radius: 10px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
    }

    .header {
        position: relative;
        padding: 20px 0;
        text-align: center;
    }

    h1 {
        font-size: 36px;
        font-family: "Arial Black", sans-serif;
        color: #66c0f4;
    }

    .back-button {
        display: block;
        padding: 12px 24px;
        background: #66c0f4;
        color: #1b2838;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background 0.3s ease-in-out;
        font-weight: bold;
        position: absolute;
        left: 0;
        top: 20px;
    }

    .back-button:hover {
        background: #88d5ff;
    }

    .game-data {
        display: flex;
        flex-direction: row;
        gap: 20px;
        align-items: flex-start;
    }

    .description-p {
        width: 50%;
        padding: 20px;
        line-height: 1.5;
        font-size: 16px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 5px;
    }

    img {
        width: 50%;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
    }

    ul {
        list-style-type: none;
        padding: 0;
        margin: 20px 0;
    }

    li {
        padding: 10px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 5px;
        margin: 5px 0;
    }

    .metacritic {
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        padding: 10px;
        margin-top: 20px;
        background: #66c0f4;
        color: #1b2838;
        border-radius: 5px;
        display: inline-block;
    }

    canvas {
        max-width: 400px;
        margin: 20px auto;
        display: block;
    }

    .requirements {
        text-align: center;
        margin-top: 20px;
        padding: 20px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 5px;
    }

    .requirements h3 {
        color: #66c0f4;
    }
</style>
