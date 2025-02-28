<script>
  import Router from "svelte-spa-router";
  import { routes } from "./routes.js";
  import Header from "./components/header.svelte";
  import Footer from "./components/footer.svelte";
</script>

<Header />

<main class="min-h-screen bg-gray-700">
  <Router {routes} />
</main>

<Footer />
