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
  try {
    const animals = await prisma.animal.findMany();
    return c.json(animals);
  } catch (error) {
    console.error("Error fetching animals:", error);
    return c.json({ error: "Failed to fetch animals." }, 500);
  }
});

// GET /animals/:id
app.get("/animals/:id", async (c) => {
  const id = Number(c.req.param("id"));

  try {
    const animal = await prisma.animal.findUnique({
      where: {
        id,
      },
    });

    if (!animal) {
      return c.json({ message: "Animal not found" }, 404);
    }

    return c.json(animal);
  } catch (error) {
    console.error("Error fetching animal:", error);
    return c.json({ error: "Failed to fetch animal." }, 500);
  }
});

// POST /animals
app.post("/animals", async (c) => {
  try {
    const animalJSON = await c.req.json();

    // Validate required fields
    if (!animalJSON.name || !animalJSON.species) {
      return c.json({ error: "Name and species are required." }, 400);
    }

    const newAnimal = await prisma.animal.create({
      data: animalJSON,
    });

    return c.json(newAnimal, 201);
  } catch (error) {
    console.error("Error creating animal:", error);
    return c.json(
      { error: "An error occurred while creating the animal." },
      500
    );
  }
});

// DELETE /animals/:id
app.delete("/animals/:id", async (c) => {
  const id = Number(c.req.param("id"));

  try {
    const deletedAnimal = await prisma.animal.delete({
      where: {
        id,
      },
    });
    return c.json({ message: "Animal deleted", deletedAnimal });
  } catch (error) {
    console.error("Error deleting animal:", error);
    return c.json({ error: "Animal not found or could not be deleted." }, 404);
  }
});

// PATCH /animals/:id
app.patch("/animals/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const animalUpdates = await c.req.json();

  try {
    // Validate required fields if necessary
    if (
      animalUpdates.name === undefined &&
      animalUpdates.species === undefined
    ) {
      return c.json(
        { error: "At least one of name or species must be provided." },
        400
      );
    }

    const updatedAnimal = await prisma.animal.update({
      where: {
        id,
      },
      data: animalUpdates,
    });

    return c.json(updatedAnimal);
  } catch (error) {
    console.error("Error updating animal:", error);
    return c.json({ error: "Animal not found or could not be updated." }, 404);
  }
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default app;
