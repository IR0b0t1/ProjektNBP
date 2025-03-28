<script>
  import { onMount } from "svelte";

  let tableB = [];
  let filters = [
    "grayscale(100%)",
    "sepia(100%)",
    "saturate(5)",
    "hue-rotate(90deg)",
    "invert(100%)",
    "brightness(0.5)",
    "contrast(200%)",
    "blur(5px)",
  ];

  onMount(async () => {
    try {
      const response = await fetch(
        "https://api.nbp.pl/api/exchangerates/tables/b/2016-03-30/?format=json",
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const tableBData = await response.json();
      if (tableBData.length > 0) {
        tableB = tableBData[0].rates.map((rate) => rate.mid);
      }
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
    }
  });

  function getRandomFilter() {
    const randomIndex = Math.floor(Math.random() * filters.length);
    return filters[randomIndex];
  }
</script>

<body>
  <main>
    <h1>Tu coś będzie</h1>
    <div style="display: flex; flex-wrap: wrap;">
      {#each Array(36) as _, index}
        <img
          src="rat-spinning.gif"
          alt="rat"
          style="filter: {getRandomFilter()}; height: 100%;"
        />
      {/each}
    </div>
  </main>
</body>

<style>
  body {
    margin-top: 64px;
  }
  main {
    text-align: center;
    padding: 20px;
    background: linear-gradient(to right, #1b2838, #0f1722);
    color: #dcdcdc;
    font-family: Arial, sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  h1 {
    font-size: 36px;
    color: #66c0f4;
    font-weight: bold;
    margin-bottom: 20px;
  }
  img {
    height: 100%;
  }
</style>
