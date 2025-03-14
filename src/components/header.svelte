<script>
  import { push } from "svelte-spa-router";
  let isMenuOpen = false;

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
</script>

<button class="menu-toggle" on:click={toggleMenu}>
  Menu
</button>

<nav class="sidebar" class:open={isMenuOpen}>
  <p>NBP PROJECT</p>
  <div class="menu-div">
    <button on:click={() => push("/")}>Strona Główna</button>
    <button on:click={() => push("/zloto")}>Cena Złota</button>
    <button on:click={() => push("/ExchangeRate")}>Kursy wymiany walut</button>
    <button on:click={() => push("/Table")}>Tabela</button>
  </div>
</nav>

<style>
  body {
    display: flex;
    margin: 0;
    font-family: 'Arial', sans-serif;
  }

  .menu-toggle {
    background-color: #102C50;
    color: white;
    padding: 12px 18px;
    border: none;
    cursor: pointer;
    font-weight: bold;
    border-radius: 5px;
    transition: background-color 0.3s ease, transform 0.3s ease;
    position: fixed;
    top: 60px;
    left: 20px;
    z-index: 2;
    width: 210px;
  }

  .menu-toggle:hover {
    background-color: #444;
    transform: scale(1.05);
  }

  .menu-toggle:active {
    transform: scale(0.95);
  }

  .sidebar {
    width: 250px;
    height: 100vh;
    background-color: #F9F3E8;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    padding: 20px;
    position: fixed;
    left: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .sidebar p {
    font-size: 24px;
    font-weight: bold;
    color: #102C50;
    margin-bottom: 60px;
  }

  .menu-div {
    width: 100%;
  }

  .menu-div button {
    padding: 10px;
    display: block;
    color: white;
    background-color: #102C50;
    border: none;
    text-align: left;
    width: 100%;
    cursor: pointer;
    transition: background-color 0.2s ease, padding-left 0.2s ease;
    border-radius: 5px;
    margin-bottom: 10px;
    text-align: center;
  }

  .menu-div button:hover {
    background-color: #444;
    padding-left: 15px;
  }

  main {
    margin-left: 20px;
    padding: 20px;
    width: calc(100% - 270px);
    transition: margin-left 0.3s ease;
  }

  .sidebar.open ~ main {
    margin-left: 270px;
  }

  @media (max-width: 768px) {
    .sidebar {
      width: 200px;
    }

    .sidebar.open ~ main {
      margin-left: 220px;
    }
  }
</style>
