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
        for(let i=0;i<tableBData[0].rates.length;i++){
          console.log(tableBData[0].rates[i].mid)
        }
      }
    } catch (error) {
      console.error('Error fetching gold prices:', error);
    }
  });
</script>

<main>
  <div>
    <h1>Strona NBP</h1>
  </div>
</main>

<style>
  h1{
    font-size: 100px;
    color: white;
  }
</style>