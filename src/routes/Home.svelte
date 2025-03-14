<script>
  import { onMount } from "svelte";

  let tableB = [];

  onMount(async () => {
    try {
      const response = await fetch('https://api.nbp.pl/api/exchangerates/tables/b/2016-03-30/?format=json');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const tableBData = await response.json();
      if (tableBData.length > 0) {
        tableB = tableBData[0].rates.map(rate => rate.mid);
      }
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
    }
  });
</script>

<main>
  <h1>Exchange Rates</h1>
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
</style>
