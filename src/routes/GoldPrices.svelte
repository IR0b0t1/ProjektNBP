<script>
    import { onMount } from "svelte";
    import Chart from "chart.js/auto";
    import { writable } from "svelte/store";

    let chart;
    let goldData = writable([]);
    let selectedDate = "";
    let goldAmount = writable(0);
    let buyPrice = writable(null);
    let currentPrice = writable(null);
    let profitOrLoss = writable(null);
    let timeRange = writable(30);
    let calculatedProfit = writable(null);
    let profitColor = writable("whitesmoke");

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0");
    let yyyy = today.getFullYear();

    // @ts-ignore
    today = `${yyyy}-${mm}-${dd}`;
    // @ts-ignore
    selectedDate = today;

    async function fetchGoldPrices(days) {
        const res = await fetch(
            `https://api.nbp.pl/api/cenyzlota/last/${days}?format=json`,
        );
        const data = await res.json();

        goldData.set(
            data.map((entry) => ({
                date: entry.data,
                price: entry.cena,
            })),
        );

        if (data.length > 0) {
            currentPrice.set(data[data.length - 1].cena);
        }

        drawChart();
    }

    function drawChart() {
        // @ts-ignore
        const ctx = document.getElementById("goldChart").getContext("2d");

        goldData.subscribe((data) => {
            if (chart) chart.destroy();

            chart = new Chart(ctx, {
                type: "line",
                data: {
                    labels: data.map((d) => d.date),
                    datasets: [
                        {
                            label: "Cena złota (PLN)",
                            data: data.map((d) => d.price),
                            borderColor: "gold",
                            backgroundColor: "rgba(255, 215, 0, 0.2)",
                            fill: true,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                },
            });
        });
    }

    async function calculateProfit() {
        goldData.subscribe((data) => {
            const found = data.find((d) => d.date === selectedDate);
            if (found) {
                buyPrice.set(found.price);
                const totalCost = found.price * $goldAmount;
                // @ts-ignore
                const currentValue = currentPrice * $goldAmount;
                profitOrLoss.set((currentValue - totalCost).toFixed(2));
            }
        });
    }

    async function calculateProfitByDate() {
        if (!selectedDate || $goldAmount <= 0) {
            alert("Proszę wybrać datę i wprowadzić ilość złota.");
            return;
        }
        console.log(selectedDate);

        const res = await fetch(
            `https://api.nbp.pl/api/cenyzlota/${selectedDate}/?format=json`,
        );
        const data = await res.json();
        console.log(data);

        if (data.length > 0) {
            const priceOnDate = data[0].cena;
            const totalCost = priceOnDate * $goldAmount;
            const currentValue = $currentPrice * $goldAmount;
            const profit = (currentValue - totalCost).toFixed(2);
            calculatedProfit.set(profit);
            buyPrice.set(priceOnDate);

            // @ts-ignore
            if (profit > 0) {
                profitColor.set("green");
                // @ts-ignore
            } else if (profit < 0) {
                profitColor.set("red");
            } else {
                profitColor.set("whitesmoke");
            }
        } else {
            calculatedProfit.set("Brak danych dla wybranej daty.");
            buyPrice.set(null);
            profitColor.set("whitesmoke");
        }
    }

    function updateTimeRange(days) {
        timeRange.set(days);
        fetchGoldPrices(days);
    }

    onMount(() => {
        updateTimeRange(7);
    });
</script>

<body>
    <h1>Cena Złota</h1>
    <div class="big-guy">
        <div class="charts">
            <div class="chart-container">
                <canvas id="goldChart"></canvas>
            </div>
            <div class="time-range-buttons">
                <button on:click={() => updateTimeRange(7)}>Tydzień</button>
                <button on:click={() => updateTimeRange(30)}>Miesiąc</button>
                <button on:click={() => updateTimeRange(90)}>Kwartał</button>
                <button on:click={() => updateTimeRange(180)}>Pół roku</button>
            </div>
        </div>
        <div class="calculator">
            <div class="info-container">
                <label for="buyDate">Wybierz datę zakupu:</label>
                <input
                    id="date"
                    type="date"
                    bind:value={selectedDate}
                    on:change={calculateProfit}
                />

                <label for="goldAmount">Ilość złota (w gramach):</label>
                <input
                    type="number"
                    bind:value={$goldAmount}
                    min="0"
                    on:input={calculateProfit}
                />

                {#if $buyPrice !== null}
                    <p class="gold">
                        Cena złota w dniu zakupu: {$buyPrice} PLN
                    </p>
                    <p class="gold">Aktualna cena: {$currentPrice} PLN</p>
                {/if}

                <button on:click={calculateProfitByDate}>Oblicz</button>

                {#if $calculatedProfit !== null}
                    <p style="color: {$profitColor};">
                        Zysk / Strata: {$calculatedProfit} PLN
                    </p>
                {/if}
            </div>
        </div>
    </div>
</body>

<style>
    body {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 20px;
        background: linear-gradient(to right, #1b2838, #0f1722);
        color: white;
        font-family: "Arial", sans-serif;
    }

    h1 {
        font-size: 36px;
        color: #66c0f4;
        font-weight: bold;
        margin-bottom: 20px;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    }

    .big-guy {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
    }

    .charts {
        width: 100%;
        max-width: 800px;
        margin-bottom: 20px;
    }

    .calculator {
        width: 100%;
        max-width: 800px;
        margin: 20px;
    }

    div {
        margin-bottom: 15px;
        width: 100%;
    }

    label {
        display: block;
        margin-bottom: 5px;
        color: #c0c0c0;
        font-size: 18px;
    }

    input,
    select {
        width: 100%;
        padding: 12px;
        font-size: 18px;
        border: 1px solid #66c0f4;
        border-radius: 5px;
        background-color: #1b2838;
        color: white;
    }

    input:focus,
    select:focus {
        outline: none;
        border-color: #66c0f4;
        box-shadow: 0 0 5px rgba(102, 192, 244, 0.5);
    }

    button {
        padding: 10px 20px;
        font-size: 18px;
        color: white;
        background-color: #66c0f4;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        width: 100%;
        margin-top: 10px;
    }

    button:hover {
        background-color: #4da6e6;
    }

    .chart-container {
        width: 100%;
        height: 400px; /* Set a fixed height for the chart */
        position: relative;
    }

    .info-container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .info-container p {
        font-size: 18px;
        margin: 5px 0;
    }

    .time-range-buttons {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-top: 20px;
    }

    .time-range-buttons button {
        background-color: gold;
    }

    .gold {
        color: whitesmoke;
    }

    canvas {
        width: 100% !important;
        height: 100% !important;
    }
</style>
