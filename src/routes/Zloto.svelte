<script>
    import { onMount } from "svelte";
    import Chart from "chart.js/auto";
    import { writable } from "svelte/store";

    let chart;
    let goldData = writable([]);
    let selectedDate = "";
    let buyPrice = writable(null);
    let currentPrice = writable(null);
    let profitOrLoss = writable(null);

    // Pobranie danych z API
    async function fetchGoldPrices() {
        const res = await fetch("https://api.metals.live/v1/spot/gold");
        const data = await res.json();
        
        goldData.set(data.map(entry => ({
            date: new Date(entry.timestamp * 1000).toISOString().split("T")[0],
            price: entry.price
        })));

        // Ustawienie aktualnej ceny złota
        if (data.length > 0) {
            currentPrice.set(data[data.length - 1].price);
        }

        drawChart();
    }

    function drawChart() {
        const ctx = document.getElementById("goldChart").getContext("2d");
        
        goldData.subscribe(data => {
            if (chart) chart.destroy();

            chart = new Chart(ctx, {
                type: "line",
                data: {
                    labels: data.map(d => d.date),
                    datasets: [{
                        label: "Cena złota (USD)",
                        data: data.map(d => d.price),
                        borderColor: "gold",
                        backgroundColor: "rgba(255, 215, 0, 0.2)",
                        fill: true
                    }]
                }
            });
        });
    }

    function calculateProfit() {
        goldData.subscribe(data => {
            const found = data.find(d => d.date === selectedDate);
            if (found) {
                buyPrice.set(found.price);
                profitOrLoss.set((currentPrice - found.price).toFixed(2));
            }
        });
    }

    onMount(fetchGoldPrices);
</script>

<h1>Cena Złota</h1>
<canvas id="goldChart"></canvas>

<div>
    <label for="buyDate">Wybierz datę zakupu:</label>
    <input type="date" bind:value={selectedDate} on:change={calculateProfit} />

    {#if buyPrice !== null}
        <p>Cena złota w dniu zakupu: {buyPrice} USD</p>
        <p>Aktualna cena: {currentPrice} USD</p>
        <p>Twój wynik: {profitOrLoss} USD</p>
    {/if}
</div>
