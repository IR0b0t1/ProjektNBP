<script>
  import { onMount } from "svelte";
</script>

<body>
  <main>
    <h1>Coindrop</h1>
    <div style="display: flex; flex-wrap: wrap;">
      <p>Strona do analizy cen walut, złota i wymiany</p>
    </div>
    <div style="display: flex;">
      <img src="/coinlogo.webp" alt="coinlogo" class="rotating-image" />
      <img src="/coinlogo.webp" alt="coinlogo" class="rotating-image-2" />
    </div>
  </main>
</body>

<style>
  body {
    margin-top: 64px;
    font-family: "Roboto", sans-serif;
  }

  main {
    text-align: center;
    background: linear-gradient(to right, #1b2838, #0f1722);
    color: #dcdcdc;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
  }

  h1 {
    font-size: 75px;
    color: #66c0f4;
    font-weight: bold;
    margin-bottom: 20px;
  }

  p {
    font-size: 54px;
    color: #8bc8ec;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .rotating-image {
    width: auto;
    height: auto;
    animation: rotate 5s linear infinite;
  }
  .rotating-image-2 {
    width: auto;
    height: auto;
    animation: -rotate 5s linear infinite;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg) scaleX(-1);
    }
    to {
      transform: rotate(360deg) scaleX(-1);
    }
  }

  @keyframes -rotate {
    from {
      transform: rotate(360deg) scaleX(1);
    }
    to {
      transform: rotate(0deg) scaleX(1);
    }
  }
</style>
