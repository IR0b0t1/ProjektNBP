<script>
  import { push } from "svelte-spa-router";
</script>

<nav class="nav-top">
  <p>NBP PROJECT</p>
  <div class="menu-div">
    <button class="dropbtn">Menu</button>
    <div class="dropdown-content">
      <button on:click={() => push("/")}>Strona Główna</button>
      <button on:click={() => push("/zloto")}>Cena Złota</button>
      <button on:click={() => push("/ExchangeRate")}>Kursy wymiany walut</button>
      <button on:click={() => push("/Table")}>Tabela</button>
    </div>
  </div>
</nav>

<style>
  .nav-top {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px 20px;
    background-color:#F9F3E8;
    box-shadow: 0px 4px 10px rgba(7, 7, 7, 0.3);
  }

  #search-bar {
    padding: 10px;
    font-size: 16px;
    border: 2px solid #444;
    border-radius: 20px;
    background-color: #222;
    color: white;
    outline: none;
    transition: 0.3s;
  }

  #search-bar:focus {
    border-color: #587AA5;
    background-color: #333;
  }

  .menu-div {
    left: 30%;
  }

  .dropbtn {
    background-color:#102C50;
    color: white;
    padding: 12px 18px;
    border: none;
    cursor: pointer;
    font-weight: bold;
    border-radius: 5px;
    transition: 0.3s ease;
    min-width: 160px;
    text-align: center;
  }

  .dropbtn:hover {
    background-color: #444;
    transform: scale(1.05);
  }

  .dropbtn:active {
    transform: scale(0.95);
  }

  .dropdown-content {
    display: none;
    position: absolute;
    background-color: #333;
    min-width: 160px;
    border-radius: 5px;
    box-shadow: 0px 6px 12px rgba(250, 218, 39, 0.44);
    z-index: 1;
    animation: fadeIn 0.3s ease-out;
  }

  .menu-div:hover .dropdown-content {
    display: block;
  }

  .dropdown-content button {
    padding: 10px;
    display: block;
    color: white;
    background: none;
    border: none;
    text-align: left;
    width: 100%;
    cursor: pointer;
    transition: 0.2s;
  }

  .dropdown-content button:hover {
    background-color: #444;
    padding-left: 15px;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
