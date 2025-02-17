import { Hono } from "hono";

const app = new Hono();

const animals = [
  { id: 1, name: "Aardvark" },
  { id: 2, name: "Bear" },
  { id: 3, name: "Cat" },
  { id: 4, name: "Dog" },
  { id: 5, name: "Elephant" },
  { id: 6, name: "Flamingo" },
];

app.get("/", (c) => {
  return c.json({
    message: "Hello World",
  });
});

app.get("/animals", (c) => {
  return c.json(animals);
});

export default app;
