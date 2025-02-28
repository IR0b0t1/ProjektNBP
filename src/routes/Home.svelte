<script>
  import { push } from "svelte-spa-router";
  import { onMount } from "svelte";

  
</script>

<main>
  <h1>Hello world</h1>
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

  .game-preview {
    display: flex;
    justify-content: center;
  }

  .game-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
    padding: 10px;
    width: 90%;
    max-width: 1200px;
    margin: auto;
  }

  .game-card {
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    cursor: pointer;
    transition:
      transform 0.3s,
      box-shadow 0.3s;
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  }

  .game-card:hover {
    transform: scale(1.08);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6);
  }

  .game-card img {
    width: 100%;
    height: 250px;
    object-fit: cover;
    border-bottom: 2px solid #66c0f4;
  }

  .game-card h2 {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.8);
    padding: 10px;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    color: #66c0f4;
    border-radius: 0 0 10px 10px;
  }

  .pagination-buttons {
    margin-top: 30px;
    display: flex;
    justify-content: center;
    gap: 15px;
  }

  .pagination-buttons button {
    background: #66c0f4;
    color: #1b2838;
    font-weight: bold;
    border: none;
    padding: 12px 20px;
    cursor: pointer;
    border-radius: 5px;
    transition: background 0.3s ease-in-out;
  }

  .pagination-buttons button:hover {
    background: #88d5ff;
  }

  .pagination-buttons button:disabled {
    background: #444;
    color: #bbb;
    cursor: not-allowed;
  }
</style>
