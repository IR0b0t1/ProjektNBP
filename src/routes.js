import Home from "./routes/Home.svelte"
import NotFound from "./routes/NotFound.svelte"
import ExchangeCalculator from "./routes/ExchangeCalculator.svelte"

export const routes = {
  "/": Home,
  "/ExchangeCalculator": ExchangeCalculator,
  "/NotFound": NotFound,
  "*": NotFound,
};