<script>
    import { onMount } from "svelte";
    import Chart from "chart.js/auto";
    import { writable } from "svelte/store";

    let chart;
    let goldData = writable([]);
    let selectedDate = "";
    let goldAmount = writable(0); // Ilość złota w gramach
    let buyPrice = writable(null);
    let currentPrice = writable(null);
    let profitOrLoss = writable(null);
    let timeRange = writable(30);
    let calculatedProfit = writable(null); // Zysk lub strata z obliczeń według daty
    let profitColor = writable("black"); // Kolor tekstu dla zysku lub straty

    async function fetchGoldPrices(days) {
        const res = await fetch(`https://api.nbp.pl/api/cenyzlota/last/${days}?format=json`);
        const data = await res.json();
        
        goldData.set(data.map(entry => ({
            date: entry.data,
            price: entry.cena
        })));

        if (data.length > 0) {
            currentPrice.set(data[data.length - 1].cena);
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
                        label: "Cena złota (PLN)",
                        data: data.map(d => d.price),
                        borderColor: "gold",
                        backgroundColor: "rgba(255, 215, 0, 0.2)",
                        fill: true
                    }]
                }
            });
        });
    }

    async function calculateProfit() {
        goldData.subscribe(data => {
            const found = data.find(d => d.date === selectedDate);
            if (found) {
                buyPrice.set(found.price);
                const totalCost = found.price * $goldAmount; // Łączny koszt zakupu
                const currentValue = currentPrice * $goldAmount; // Aktualna wartość
                profitOrLoss.set((currentValue - totalCost).toFixed(2));
            }
        });
    }

    async function calculateProfitByDate() {
        if (!selectedDate || $goldAmount <= 0) {
            alert("Proszę wybrać datę i wprowadzić ilość złota.");
            return;
        }

        const res = await fetch(`https://api.nbp.pl/api/cenyzlota/${selectedDate}`);
        const data = await res.json();

        if (data.length > 0) {
            const priceOnDate = data[0].cena;
            const totalCost = priceOnDate * $goldAmount; // Łączny koszt zakupu
            const currentValue = $currentPrice * $goldAmount; // Aktualna wartość
            const profit = (currentValue - totalCost).toFixed(2);
            calculatedProfit.set(profit);
            buyPrice.set(priceOnDate);

            // Ustaw kolor w zależności od wyniku
            if (profit > 0) {
                profitColor.set("green");
            } else if (profit < 0) {
                profitColor.set("red");
            } else {
                profitColor.set("black");
            }
        } else {
            calculatedProfit.set("Brak danych dla wybranej daty.");
            buyPrice.set(null);
            profitColor.set("black");
        }
    }

    function updateTimeRange(days) {
        timeRange.set(days);
        fetchGoldPrices(days);
    }

    onMount(() => fetchGoldPrices(1));
</script>

<h1>Cena Złota</h1>
<div style="display: flex;">
    <div style="width: 40%;">
        <canvas id="goldChart"></canvas>
    </div>
    <div>
        <label for="buyDate">Wybierz datę zakupu:</label>
        <input type="date" bind:value={selectedDate} on:change={calculateProfit} />
        
        <label for="goldAmount">Ilość złota (w gramach):</label>
        <input type="number" bind:value={$goldAmount} min="0" on:input={calculateProfit} />

        {#if $buyPrice !== null}
            <p>Cena złota w dniu zakupu: {$buyPrice} PLN</p>
            <p>Aktualna cena: {$currentPrice} PLN</p>
            <p>Twój wynik: {$profitOrLoss} PLN</p>
        {/if}

        <button on:click={calculateProfitByDate}>Oblicz</button>

        {#if $calculatedProfit !== null}
            <p style="color: {$profitColor};">Zysk / Strata: {$calculatedProfit} PLN</p>
        {/if}
    </div>
</div>

<div style="display: flex; justify-content: center; gap: 10px; margin-top: 20px;">
    <button style="background-color: gold;" on:click={() => updateTimeRange(7)}>7 dni</button>
    <button style="background-color: gold;" on:click={() => updateTimeRange(30)}>30 dni</button>
    <button style="background-color: gold;" on:click={() => updateTimeRange(90)}>3 miesiące</button>
</div>
