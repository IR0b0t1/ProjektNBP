<!-- src/CurrencyTable.svelte -->
<script>
    import { onMount } from "svelte";
    import axios from "axios";

    let currencies = []; // Waluty wyświetlane w tabeli
    let availableCurrencies = []; // Lista dostępnych walut w API
    let selectedCurrencyCode = ""; // Wybrana waluta do dodania
    let customCurrencies = []; // Waluty dodane przez użytkownika

    // Lista domyślnych walut
    const defaultCurrencyCodes = [
        // "USD",
        // "EUR",
        // "CHF",
        // "GBP",
        // "AUD",
        // "CAD",
        // "JPY",
        // "NOK",
        // "SEK",
        // "DKK",
    ];

    // Funkcja do pobierania kursów walut z API
    const fetchRates = async () => {
        try {
            const response = await axios.get(
                "https://api.nbp.pl/api/exchangerates/tables/A?format=json"
            );
            const rates = response.data[0].rates;
            availableCurrencies = rates.map(rate => rate.code); // Kody walut
            currencies = rates.filter(rate =>
                defaultCurrencyCodes.includes(rate.code) ||
                customCurrencies.includes(rate.code)
            );
        } catch (error) {
            console.error("Błąd podczas pobierania kursów walut:", error);
        }
    };

    // Funkcja do dodawania waluty do tabeli
    const addCustomCurrency = () => {
        if (selectedCurrencyCode && !customCurrencies.includes(selectedCurrencyCode)) {
            customCurrencies.push(selectedCurrencyCode);
            selectedCurrencyCode = ""; // Resetowanie wyboru
            fetchRates(); // Ponowne pobranie danych po dodaniu waluty
        }
    };

    // Funkcja do usuwania waluty z tabeli
    const removeCurrency = (code) => {
        customCurrencies = customCurrencies.filter(currency => currency !== code);
        fetchRates(); // Ponowne pobranie danych po usunięciu waluty
    };

    // Ładowanie danych po zamontowaniu komponentu
    onMount(() => {
        fetchRates();
        const interval = setInterval(fetchRates, 3600000); // Co godzinę odświeżamy kursy
        return () => clearInterval(interval);
    });
</script>

<div>
    <h1>Kursy walut NBP</h1>
    <button on:click={fetchRates}>Odśwież kursy</button>

    <!-- Sekcja dodawania niestandardowej waluty -->
    <div>
        <select bind:value={selectedCurrencyCode}>
            <option value="" disabled selected>Wybierz walutę</option>
            {#each availableCurrencies as code}
                <option value={code}>{code}</option>
            {/each}
        </select>
        <button on:click={addCustomCurrency}>Dodaj walutę</button>
    </div>

    <!-- Wyświetlanie tabeli po dodaniu walut -->
    {#if currencies.length > 0}
        <table>
            <thead>
                <tr>
                    <th>Waluta</th>
                    <th>Kurs średni</th>
                    <th>Akcje</th>
                </tr>
            </thead>
            <tbody>
                {#each currencies as { code, currency, mid }}
                    <tr>
                        <td>{currency} ({code})</td>
                        <td>{mid}</td>
                        <td>
                            <!-- Przycisk do usuwania waluty -->
                            <button on:click={() => removeCurrency(code)} style="color: red; background: none; border: none; cursor: pointer;">✖</button>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    {:else}
        <p>Brak dodanych walut. Wybierz walutę z listy i kliknij "Dodaj walutę".</p>
    {/if}
</div>

<style>
    table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
        color: white;
    }
    th,
    td {
        padding: 8px;
        text-align: left;
        border: 1px solid #ddd;
    }
    th {
        background-color: #444;
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
    select {
        padding: 8px;
        margin-right: 10px;
        font-size: 14px;
    }
    td button {
        font-size: 18px;
        cursor: pointer;
    }
</style>
