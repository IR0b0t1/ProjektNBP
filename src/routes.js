// @ts-ignore
import Home from "./routes/Home.svelte";
// @ts-ignore
import NotFound from "./routes/NotFound.svelte";
import Zloto from "./routes/Zloto.svelte";

export const routes = {
  "/": Home,
  "/zloto": Zloto,
  "*": NotFound,
};
