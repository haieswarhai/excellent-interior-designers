import { Router } from "express";
import { db } from "@workspace/db";
import { customersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  ListCustomersQueryParams,
  CreateCustomerBody,
  UpdateCustomerParams,
  UpdateCustomerBody,
  DeleteCustomerParams,
  GetCustomerParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/customers", async (req, res) => {
  const parsed = ListCustomersQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query params" });
    return;
  }
  const { status } = parsed.data;
  const customers = status
    ? await db.select().from(customersTable).where(eq(customersTable.status, status))
    : await db.select().from(customersTable);
  res.json(customers);
});

router.post("/customers", async (req, res) => {
  const parsed = CreateCustomerBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  const [customer] = await db
    .insert(customersTable)
    .values({ ...parsed.data, updatedAt: new Date() })
    .returning();
  res.status(201).json(customer);
});

router.get("/customers/:id", async (req, res) => {
  const parsed = GetCustomerParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [customer] = await db
    .select()
    .from(customersTable)
    .where(eq(customersTable.id, parsed.data.id));
  if (!customer) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(customer);
});

router.patch("/customers/:id", async (req, res) => {
  const paramsParsed = UpdateCustomerParams.safeParse({ id: Number(req.params.id) });
  if (!paramsParsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const bodyParsed = UpdateCustomerBody.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  const [customer] = await db
    .update(customersTable)
    .set({ ...bodyParsed.data, updatedAt: new Date() })
    .where(eq(customersTable.id, paramsParsed.data.id))
    .returning();
  if (!customer) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(customer);
});

router.delete("/customers/:id", async (req, res) => {
  const parsed = DeleteCustomerParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(customersTable).where(eq(customersTable.id, parsed.data.id));
  res.status(204).send();
});

export default router;
