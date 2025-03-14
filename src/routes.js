import Home from "./routes/Home.svelte";
import NotFound from "./routes/NotFound.svelte";
import Tabela from "./routes/Table.svelte";
import ExchangeRate from "./routes/ExchangeRate.svelte";

export const routes = {
  "/": Home,
  "/Table": Tabela,
  "/ExchangeRate": ExchangeRate,
  "*": NotFound,
};
