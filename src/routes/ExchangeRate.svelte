<script>
  import { onMount } from "svelte";

  // Variables
  let tableA = [];
  let tableB = [];
  let amount = 0;
  let fromCurrency = "USD";
  let toCurrency = "EUR";
  let convertedAmount = 0;
  let allCurrencies = [];

  // Fetch data from API
  onMount(async () => {
    try {
      const [responseA, responseB] = await Promise.all([
        fetch("https://api.nbp.pl/api/exchangerates/tables/a/?format=json"),
        fetch("https://api.nbp.pl/api/exchangerates/tables/b/?format=json"),
      ]);

      if (!responseA.ok || !responseB.ok) {
        throw new Error("Network response was not ok");
      }

      // Get data from tables
      const [tableAData, tableBData] = await Promise.all([
        responseA.json(),
        responseB.json(),
      ]);

      if (tableAData.length > 0) {
        tableA = tableAData[0].rates.sort((a, b) =>
          a.code.localeCompare(b.code),
        );
      }

      if (tableBData.length > 0) {
        tableB = tableBData[0].rates.sort((a, b) =>
          a.code.localeCompare(b.code),
        );
      }

      // Merge and sort all currencies
      allCurrencies = [...tableA, ...tableB].sort((a, b) =>
        a.code.localeCompare(b.code),
      );

      console.log("All Currencies:", allCurrencies);
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
    }
  });

  // Currency conversion
  function convertCurrency() {
    const fromRate = getRate(fromCurrency);
    const toRate = getRate(toCurrency);

    if (fromRate && toRate) {
      convertedAmount = (amount * toRate) / fromRate;
    } else {
      convertedAmount = 0;
    }
  }

  // Get exchange rate
  function getRate(currencyCode) {
    return (
      tableA.find((rate) => rate.code === currencyCode)?.mid ||
      tableB.find((rate) => rate.code === currencyCode)?.mid
    );
  }

  function changeCurrencies() {
    let changer = fromCurrency;
    fromCurrency = toCurrency;
    toCurrency = changer;
    convertCurrency();
  }

  function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  }
</script>

<main>
  <h1>Kalkulator wymiany walut</h1>
  <div>
    <label for="amount">Ilość:</label>
    <input
      type="number"
      id="amount"
      bind:value={amount}
      on:input={convertCurrency}
    />
  </div>
  <div>
    <label for="fromCurrency">Z waulty:</label>
    <select
      id="fromCurrency"
      bind:value={fromCurrency}
      on:change={convertCurrency}
    >
      {#each allCurrencies as rate}
        <option value={rate.code}>{capitalizeFirstLetter(rate.currency)}</option
        >
      {/each}
    </select>
  </div>
  <div>
    <label for="toCurrency">Do waluty:</label>
    <select id="toCurrency" bind:value={toCurrency} on:change={convertCurrency}>
      {#each allCurrencies as rate}
        <option value={rate.code}>{capitalizeFirstLetter(rate.currency)}</option
        >
      {/each}
    </select>
  </div>
  <div>
    <button id="changeCurrencies" on:click={changeCurrencies}>
      <img src="swap.png" alt="swap" />
    </button>
  </div>
  <div>
    <h2>Kurs wymiany: {convertedAmount.toFixed(2)} {toCurrency}</h2>
  </div>
</main>

<style>
  main {
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

  div {
    margin-bottom: 15px;
    width: 100%;
    max-width: 400px;
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

  h2 {
    font-size: 24px;
    color: #66c0f4;
    margin-top: 20px;
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
  }

  button:hover {
    background-color: #4da6e6;
  }

  img {
    width: 128px;
    height: 128px;
  }

  #changeCurrencies {
    padding: 0;
    width: 100%;
    background: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
  }
</style>
