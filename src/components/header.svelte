<script>
  import { push } from "svelte-spa-router";
</script>

<nav class="horizontal-menu">
  <p>NBP PROJEKT</p>
  <div class="menu-div">
    <button on:click={() => push("/")}>Strona Główna</button>
    <button on:click={() => push("/zloto")}>Cena Złota</button>
    <button on:click={() => push("/ExchangeRate")}>Kursy wymiany walut</button>
    <button on:click={() => push("/Table")}>Tabela</button>
  </div>
</nav>

<style>
  body {
    margin: 0;
    font-family: "Arial", sans-serif;
  }

  .horizontal-menu {
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: #f9f3e8;
    padding: 10px 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 2;
  }

  .horizontal-menu p {
    font-size: 24px;
    font-weight: bold;
    color: #102c50;
    margin: 0;
  }

  .menu-div {
    display: flex;
    gap: 10px;
  }

  .menu-div button {
    padding: 10px 20px;
    color: white;
    background-color: #102c50;
    border: none;
    cursor: pointer;
    transition:
      background-color 0.2s ease,
      transform 0.2s ease;
    border-radius: 5px;
  }

  .menu-div button:hover {
    background-color: #444;
    transform: scale(1.05);
  }

  .menu-div button:active {
    transform: scale(0.95);
  }

  main {
    padding: 80px 20px 20px; /* Adjust top padding to accommodate the fixed menu */
  }

  @media (max-width: 768px) {
    .horizontal-menu {
      flex-direction: column;
      align-items: flex-start;
    }

    .menu-div {
      flex-direction: column;
      width: 100%;
    }

    .menu-div button {
      width: 100%;
      text-align: center;
    }
  }
</style>
