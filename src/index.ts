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
app.post("/animals", async (c) => {
  const newAnimal = await c.req.json();
  const newId = animals.length ? animals[animals.length - 1].id + 1 : 1; // Generate new ID
  const animalToAdd = { id: newId, name: newAnimal.name };

  animals.push(animalToAdd);
  return c.json(animalToAdd, 201);
});

// DELETE /animals/:id
app.delete("/animals/:id", (c) => {
  const id = Number(c.req.param("id"));
  const index = animals.findIndex((animal) => animal.id === id);

  if (index === -1) {
    return c.json({ message: "Animal not found" }, 404);
  }

  animals.splice(index, 1);
  return c.json({ message: "Animal deleted" });
});

// PATCH /animals/:id
app.patch("/animals/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const animal = animals.find((animal) => animal.id === id);

  if (!animal) {
    return c.json({ message: "Animal not found" }, 404);
  }

  const updatedData = await c.req.json();
  animal.name = updatedData.name || animal.name; // Update name if provided

  return c.json(animal);
});

export default app;
