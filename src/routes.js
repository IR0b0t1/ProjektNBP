import NotFound from "./routes/NotFound.svelte";
import Tabela from "./routes/CurrencyTable.svelte";
import ExchangeRate from "./routes/ExchangeRate.svelte";
import Zloto from "./routes/GoldPrices.svelte";

export const routes = {
  "/": ExchangeRate,
  "/Table": Tabela,
  "/ExchangeRate": ExchangeRate,
  "/zloto": Zloto,
  "*": NotFound,
};
