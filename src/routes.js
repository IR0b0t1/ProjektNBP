import Home from "./routes/Home.svelte";
import GameDetail from "./routes/GameDetail.svelte";
import NotFound from "./routes/NotFound.svelte";
import Search from "./routes/Search.svelte";

export const routes = {
  "/": Home,
  "/game/:id": GameDetail,
  "/search": Search,
  "*": NotFound,
};
