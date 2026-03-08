import Fastify from "fastify";
import { authRoutes } from "./routes/auth";
import { itemRoutes } from "./routes/item";

const app = Fastify();

app.get("/", async () => {
  return { ok: true };
});

app.register(authRoutes);
app.register(itemRoutes);

app.listen({ port: 3333 }).then(() => {
  console.log("Server running on port 3333");
});
