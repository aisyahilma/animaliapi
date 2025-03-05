import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = new Hono();

app.get("/", (c) => {
  return c.json({
    message: "Animali API",
  });
});

// GET /animals
app.get("/animals", async (c) => {
  const animals = await prisma.animal.findMany();

  return c.json(animals);
});

// GET /animals/:id
app.get("/animals/:id", async (c) => {
  const id = Number(c.req.param("id"));

  const animal = await prisma.animal.findUnique({
    where: {
      id,
    },
  });

  if (!animal) {
    return c.json({ message: "Animal not found" }, 404);
  }

  return c.json(animal);
});

// POST /animals
app.post("/animals", async (c) => {
  const animalJSON = await c.req.json();

  // TODO: Use Prisma

  const newAnimal = await prisma.animal.create({
    data: animalJSON,
  });

  return c.json(newAnimal, 201);
});

// DELETE /animals/:id
app.delete("/animals/:id", async (c) => {
  const id = Number(c.req.param("id"));

  const deletedAnimal = await prisma.animal.delete({
    where: {
      id,
    },
  });

  return c.json({ message: "Animal deleted", deletedAnimal });
});

// PATCH /animals/:id
app.patch("/animals/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const animalUpdates = await c.req.json();

  const updatedAnimal = await prisma.animal.update({
    where: {
      id,
    },
    data: animalUpdates,
  });

  return c.json(updatedAnimal);
});

export default app;
