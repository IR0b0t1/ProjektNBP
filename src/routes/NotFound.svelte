<script>
  let message = "Oops! Page not found.";
</script>

<main
  class="min-h-screen flex flex-col items-center justify-center text-center bg-gray-900 text-white p-6"
>
  <h1 class="text-6xl font-extrabold glitch">{message}</h1>
  <p class="text-lg mt-4 text-gray-400">
    The page you are looking for doesn't exist or has been moved.
  </p>
  <a
    href="#/"
    class="mt-6 bg-blue-500 text-white py-3 px-6 rounded-lg shadow-lg transform transition-all hover:bg-blue-600 hover:scale-105"
    >Go Back Home</a
  >
</main>

<style>
  @keyframes glitch {
    0% {
      text-shadow:
        2px 2px 0px #ff0000,
        -2px -2px 0px #00ff00;
    }
    50% {
      text-shadow:
        -2px -2px 0px #ff0000,
        2px 2px 0px #00ff00;
    }
    100% {
      text-shadow:
        2px -2px 0px #ff0000,
        -2px 2px 0px #00ff00;
    }
  }

  .glitch {
    animation: glitch 0.5s infinite alternate;
  }
</style>
