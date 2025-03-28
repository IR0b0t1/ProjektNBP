<script>
    import { onMount } from "svelte";
    import axios from "axios";
    import Chart from "chart.js/auto";

    let chart;
    let availableCurrencies = [];
    let selectedCurrencyCode = "";
    let customCurrencies = [];
    let chartData = {
        labels: ["Average Rate"],
        datasets: [],
    };

    // @ts-ignore
    const defaultCurrencyCodes = [];

    const fetchRates = async () => {
        try {
            const response = await axios.get(
                "https://api.nbp.pl/api/exchangerates/tables/A?format=json",
            );
            const rates = response.data[0].rates;
            availableCurrencies = rates.map((rate) => rate.code);
            updateChartData(rates);
        } catch (error) {
            console.error("Błąd podczas pobierania kursów walut:", error);
        }
    };

    const addCustomCurrency = () => {
        if (
            selectedCurrencyCode &&
            !customCurrencies.includes(selectedCurrencyCode)
        ) {
            customCurrencies.push(selectedCurrencyCode);
            selectedCurrencyCode = "";
            fetchRates();
        }
    };

    // @ts-ignore
    const removeCurrency = (code) => {
        customCurrencies = customCurrencies.filter(
            (currency) => currency !== code,
        );
        updateChartData();
    };

    const updateChartData = (rates = []) => {
        chartData.datasets = customCurrencies.map((code) => {
            const rate = rates.find((r) => r.code === code);
            return {
                label: `Kurs ${code}`,
                data: rate ? [rate.mid] : [0],
                backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.2)`,
                borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
                borderWidth: 1,
            };
        });
        drawChart();
    };

    const drawChart = () => {
        // @ts-ignore
        const ctx = document.getElementById("currencyChart").getContext("2d");

        if (chart) chart.destroy();

        chart = new Chart(ctx, {
            type: "bar",
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    };

    onMount(() => {
        fetchRates();
        const interval = setInterval(fetchRates, 3600000);
        return () => clearInterval(interval);
    });
</script>

<main>
    <h1>Kursy walut NBP</h1>

    <div class="add-currency">
        <button class="refresh" on:click={fetchRates}>Odśwież kursy</button>
        <select bind:value={selectedCurrencyCode}>
            <option value="" disabled selected>Wybierz walutę</option>
            {#each availableCurrencies as code}
                <option value={code}>{code}</option>
            {/each}
        </select>
        <button on:click={addCustomCurrency}>Dodaj walutę</button>
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
    }

    main {
        margin-top: 64px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .add-currency {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 10px;
        margin-bottom: 20px;
    }

    .refresh {
        margin: 10px;
    }

    h1 {
        font-size: 36px;
        color: #66c0f4;
        font-weight: bold;
        margin-bottom: 20px;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    }

    div {
        margin-bottom: 15px;
        width: 100%;
        max-width: 600px;
    }

    label {
        display: block;
        margin-bottom: 5px;
        color: #c0c0c0;
        font-size: 18px;
    }

    select {
        width: 100%;
        padding: 12px;
        font-size: 18px;
        border: 1px solid #66c0f4;
        border-radius: 5px;
        background-color: #1b2838;
        color: white;
        margin-bottom: 10px;
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
</style>
