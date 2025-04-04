<script>
    import { onMount } from "svelte";
    import axios from "axios";
    import Chart from "chart.js/auto";

    let chart;
    let availableCurrencies = [];
    let currencies = [];
    let selectedCurrencyCode = "";
    let customCurrencies = [];
    let chartData = {
        labels: [],
        datasets: [],
    };

    const fetchRates = async () => {
        try {
            const response = await axios.get(
                "https://api.nbp.pl/api/exchangerates/tables/A?format=json",
            );
            const rates = response.data[0].rates;
            availableCurrencies = rates.map((rate) => rate.code);
            currencies = rates.map((rate) => rate.currency);
        } catch (error) {
            console.error("Błąd podczas pobierania kursów walut:", error);
        }
    };

    const addCustomCurrency = async () => {
        if (
            selectedCurrencyCode &&
            !customCurrencies.includes(selectedCurrencyCode)
        ) {
            customCurrencies.push(selectedCurrencyCode);
            selectedCurrencyCode = "";
            await updateChartData();
        }
    };

    const clearChart = () => {
        customCurrencies = [];
        chartData = { labels: [], datasets: [] };
        drawChart();
    };

    const fetchHistoricalData = async (code) => {
        try {
            const response = await axios.get(
                `https://api.nbp.pl/api/exchangerates/rates/A/${code}/last/30?format=json`,
            );
            return response.data.rates.map((rate) => ({
                date: rate.effectiveDate,
                value: rate.mid,
            }));
        } catch (error) {
            console.error(`Błąd podczas pobierania danych dla ${code}:`, error);
            return [];
        }
    };

    const updateChartData = async () => {
        const datasets = [];
        let labels = [];

        for (const code of customCurrencies) {
            const history = await fetchHistoricalData(code);
            if (history.length > 0) {
                if (labels.length === 0) {
                    labels = history.map((h) => h.date);
                }

                datasets.push({
                    label: `Kurs ${code}`,
                    data: history.map((h) => h.value),
                    fill: false,
                    borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
                    tension: 0.3,
                });
            }
        }

        chartData = { labels, datasets };
        drawChart();
    };

    const drawChart = () => {
        // @ts-ignore
        const ctx = document.getElementById("currencyChart").getContext("2d");

        if (chart) chart.destroy();

        chart = new Chart(ctx, {
            type: "line",
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: false },
                    x: { ticks: { autoSkip: true, maxTicksLimit: 30 } },
                },
            },
        });
    };

    onMount(() => {
        fetchRates();
    });
</script>

<main>
    <h1>Kursy walut NBP (ostatnie 30 dni)</h1>

    <div class="add-currency">
        <select bind:value={selectedCurrencyCode}>
            <option value="" disabled selected>Wybierz walutę</option>
            {#each availableCurrencies as code}
                <option value={code}>{code}</option>
            {/each}
        </select>
        <div class="button-div">
            <button class="refresh" on:click={fetchRates}>Odśwież kursy</button>

            <button on:click={addCustomCurrency}>Dodaj walutę</button>
            <button on:click={clearChart}>Wyczyść wykres</button>
        </div>
    </div>

    {#if customCurrencies.length > 0}
        <div class="chart-container">
            <canvas id="currencyChart"></canvas>
        </div>
    {:else}
        <p class="no-data">
            Brak dodanych walut. Wybierz walutę z listy i kliknij "Dodaj
            walutę".
        </p>
    {/if}
</main>

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
        height: 100vh;
    }

    main {
        margin-top: 64px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background: linear-gradient(to right, #1b2838, #0f1722);
    }

    .add-currency {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 10px;
        margin-bottom: 20px;
    }

    button {
        margin: 10px 0;
        width: 200px;
    }

    h1 {
        font-size: 36px;
        color: #66c0f4;
        font-weight: bold;
        margin-bottom: 20px;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    }

    select {
        padding: 12px;
        font-size: 18px;
        border: 1px solid #66c0f4;
        border-radius: 5px;
        background-color: #1b2838;
        color: white;
        margin: 10px;
        width: 200px;
    }

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
        transition:
            background-color 0.3s ease,
            transform 0.3s ease;
        margin: 20px;
    }

    button:hover {
        background-color: #4da6e6;
        transform: scale(1.05);
    }

    .chart-container {
        width: 100%;
        max-width: 800px;
        height: 400px;
        position: relative;
        margin-top: 20px;
        border: 1px solid #66c0f4;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    canvas {
        width: 100% !important;
        height: 100% !important;
    }

    .no-data {
        color: whitesmoke;
        font-size: 18px;
        margin-top: 20px;
    }

    .button-div {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
