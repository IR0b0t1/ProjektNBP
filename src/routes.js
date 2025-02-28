// @ts-ignore
import Home from "./routes/Home.svelte";
// @ts-ignore
import NotFound from "./routes/NotFound.svelte";
// @ts-ignore
import ExchangeRate from "./routes/ExchangeRate.svelte";

export const routes = {
  "/": Home,
  "/ExchangeRate": ExchangeRate,
  "*": NotFound,
};
