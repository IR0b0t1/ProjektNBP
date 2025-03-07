<!-- src/CurrencyTable.svelte -->
<script>
    import { onMount } from "svelte";
    import axios from "axios";


    let currencies = [];
    const currencyCodes = [
        "USD",
        "EUR",
        "CHF",
        "GBP",
        "AUD",
        "CAD",
        "JPY",
        "NOK",
        "SEK",
        "DKK",
    ];

    const fetchRates = async () => {
        try {
            const response = await axios.get(
                "https://api.nbp.pl/api/exchangerates/tables/A?format=json",
            );
            const rates = response.data[0].rates;
            currencies = rates.filter((rate) =>
                currencyCodes.includes(rate.code),
            );
        } catch (error) {
            console.error("Błąd podczas pobierania kursów walut:", error);
        }
    };

    onMount(() => {
        fetchRates();
        const interval = setInterval(fetchRates, 3600000);
        return () => clearInterval(interval);
    });
</script>

<div>
    <h1>Kursy walut NBP</h1>
    <button on:click={fetchRates}>Odśwież kursy</button>
    {#if currencies.length > 0}
        <table>
            <thead>
                <tr>
                    <th>Waluta</th>
                    <th>Kurs średni</th>
                </tr>
            </thead>
            <tbody>
                {#each currencies as { code, currency, mid }}
                    <tr>
                        <td>{currency} ({code})</td>
                        <td>{mid}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    {:else}
        <p>Ładowanie kursów...</p>
    {/if}
</div>

<style>
    table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
    }
    th,
    td {
        padding: 8px;
        text-align: left;
        border: 1px solid #ddd;
    }
    th {
        background-color: #f4f4f4;
    }
    button {
        margin-top: 10px;
        padding: 10px 20px;
        background-color: #4caf50;
        color: white;
        border: none;
        cursor: pointer;
    }
    button:hover {
        background-color: #45a049;
    }
</style>
