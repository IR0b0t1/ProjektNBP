// @ts-ignore
import Home from "./routes/Home.svelte";
// @ts-ignore
import NotFound from "./routes/NotFound.svelte";

export const routes = {
  "/": Home,
  "*": NotFound,
};
