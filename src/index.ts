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
    const animals = await prisma.animal.findMany({
      include: {
        habitats: {
          include: {
            habitat: true,
          },
        },
      },
    });
    return c.json(animals);
  } catch (error) {
    console.error("Error fetching animals:", error);
    return c.json({ error: "Failed to fetch animals." }, 500);
  }
});

// GET /animals/:id - Retrieve animal details
app.get("/animals/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const animal = await prisma.animal.findUnique({
      where: { id },
      include: {
        habitats: {
          include: {
            habitat: true,
          },
        },
      },
    });
    if (!animal) return c.json({ error: "Animal not found" }, 404);
    return c.json(animal);
  } catch (error) {
    return c.json({ error: "Failed to retrieve animal." }, 500);
  }
});

// POST /animals - Add a new animal
app.post("/animals", async (c) => {
  const body = await c.req.json();
  if (!body.name) return c.json({ error: "Nam are required." }, 400);

  try {
    const newAnimal = await prisma.animal.create({ data: body });
    return c.json(newAnimal, 201);
  } catch (error) {
    console.error("Error adding animal:", error);
    return c.json({ error: "Failed to add animal." }, 500);
  }
});

// DELETE /animals/:id - Delete an animal
app.delete("/animals/:id", async (c) => {
  const id = c.req.param("id");
  try {
    await prisma.animal.delete({ where: { id } });
    return c.json({ message: "Animal deleted successfully." });
  } catch (error) {
    return c.json({ error: "Animal not found or could not be deleted." }, 404);
  }
});

// PATCH /animals/:id
app.patch("/animals/:id", async (c) => {
  const id = c.req.param("id");
  const animalUpdates = await c.req.json();

  try {
    // Validate required fields if necessary
    if (animalUpdates.name === undefined) {
      return c.json({ error: "At least one of name must be provided." }, 400);
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

/* ===========================
   CRUD - HABITATS
=========================== */
// GET /habitats - Retrieve all habitats
app.get("/habitats", async (c) => {
  try {
    const habitats = await prisma.habitat.findMany();
    return c.json(habitats);
  } catch (error) {
    return c.json({ error: "Failed to retrieve habitats." }, 500);
  }
});

// POST /habitats - Add a new habitat
app.post("/habitats", async (c) => {
  try {
    const body = await c.req.json();
    const newHabitat = await prisma.habitat.create({ data: body });
    return c.json(newHabitat, 201);
  } catch (error) {
    console.error("Error adding habitat:", error);
    return c.json({ error: "Failed to add habitat." }, 500);
  }
});

// DELETE /habitats/:id - Delete a habitat
app.delete("/habitats/:id", async (c) => {
  const id = c.req.param("id");

  try {
    await prisma.habitat.delete({ where: { id } });
    return c.json({ message: "Habitat deleted successfully." });
  } catch (error) {
    return c.json({ error: "Habitat not found or could not be deleted." }, 404);
  }
});

/* ===========================
   RELATIONSHIP: ANIMAL <-> HABITAT
=========================== */
// ✅ PATCH /animals/:id
app.patch("/animals/:animalId", async (c) => {
  const animalId = c.req.param("animalId");
  const body = await c.req.json();

  const habitatSlug = body.habitatSlug;
  const mode = body.mode; // "assign" or "remove"

  // TODO: Continue implementation
  if (mode === "assign") {
  } else if (mode === "remove") {
  } else {
    return c.json({ error: "Invalid mode. Use 'assign' or 'remove'." }, 400);
  }
});

// ❌ POST /animals/:animalId/habitats/:habitatId - Assign an animal to a habitat
app.post("/animals/:animalId/habitats/:habitatId", async (c) => {
  const animalId = c.req.param("animalId");
  const habitatId = c.req.param("habitatId");

  try {
    const relation = await prisma.animalHabitat.create({
      data: { animalId, habitatId },
    });
    return c.json(relation, 201);
  } catch (error) {
    console.error("Error assigning animal to habitat:", error);
    return c.json({ error: "Failed to assign animal to habitat." }, 500);
  }
});

// ❌ DELETE /animals/:animalId/habitats/:habitatId - Remove an animal from a habitat
app.delete("/animals/:animalId/habitats/:habitatId", async (c) => {
  const animalId = c.req.param("animalId");
  const habitatId = c.req.param("habitatId");

  try {
    await prisma.animalHabitat.delete({
      where: { animalId_habitatId: { animalId, habitatId } },
    });
    return c.json({ message: "Animal removed from habitat." });
  } catch (error) {
    console.error("Error removing animal from habitat:", error);
    return c.json({ error: "Animal not found in this habitat." }, 404);
  }
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default app;
