<script>
  import { push } from "svelte-spa-router";

</script>

<nav class="nav-top">
  <a href="/#/ExchangeCalculator">ExchangeRate</a>
</nav>

<style>
  a{
    color: white;
  }
  .nav-top {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px 20px;
    background-color: #181818;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
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
