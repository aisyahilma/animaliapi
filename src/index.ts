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
    message: "Animali API",
  });
});

// GET /animals
app.get("/animals", (c) => {
  return c.json(animals);
});

// GET /animals/:id
app.get("/animals/:id", (c) => {
  const id = Number(c.req.param("id"));

  const animal = animals.find((animal) => animal.id === id);

  if (!animal) {
    return c.json({ message: "Animal not found" }, 404);
  }

  return c.json(animal);
});

// POST /animals

// DELETE /animals/:id

// PATCH /animals/:id

export default app;
