import { Router } from "express";
import { db } from "@workspace/db";
import { projectsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  ListProjectsQueryParams,
  CreateProjectBody,
  UpdateProjectParams,
  UpdateProjectBody,
  DeleteProjectParams,
  GetProjectParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/projects", async (req, res) => {
  const parsed = ListProjectsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query params" });
    return;
  }
  const { phase } = parsed.data;
  const projects = phase
    ? await db.select().from(projectsTable).where(eq(projectsTable.phase, phase))
    : await db.select().from(projectsTable);
  res.json(projects);
});

router.post("/projects", async (req, res) => {
  const parsed = CreateProjectBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  const [project] = await db
    .insert(projectsTable)
    .values(parsed.data)
    .returning();
  res.status(201).json(project);
});

router.get("/projects/:id", async (req, res) => {
  const parsed = GetProjectParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [project] = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.id, parsed.data.id));
  if (!project) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(project);
});

router.patch("/projects/:id", async (req, res) => {
  const paramsParsed = UpdateProjectParams.safeParse({ id: Number(req.params.id) });
  if (!paramsParsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const bodyParsed = UpdateProjectBody.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  const [project] = await db
    .update(projectsTable)
    .set(bodyParsed.data)
    .where(eq(projectsTable.id, paramsParsed.data.id))
    .returning();
  if (!project) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(project);
});

router.delete("/projects/:id", async (req, res) => {
  const parsed = DeleteProjectParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(projectsTable).where(eq(projectsTable.id, parsed.data.id));
  res.status(204).send();
});

export default router;
