import { Router } from "express";
import { db } from "@workspace/db";
import { inquiriesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateInquiryBody,
  UpdateInquiryParams,
  UpdateInquiryBody,
  DeleteInquiryParams,
} from "@workspace/api-zod";
import { sendInquiryNotification } from "../lib/email";

const router = Router();

router.get("/inquiries", async (_req, res) => {
  const inquiries = await db.select().from(inquiriesTable);
  res.json(inquiries);
});

router.post("/inquiries", async (req, res) => {
  const parsed = CreateInquiryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  const [inquiry] = await db
    .insert(inquiriesTable)
    .values(parsed.data)
    .returning();
  res.status(201).json(inquiry);

  sendInquiryNotification({
    name: inquiry.name,
    email: inquiry.email,
    phone: inquiry.phone,
    message: inquiry.message,
    projectType: inquiry.projectType,
    budget: inquiry.budget,
  });
});

router.patch("/inquiries/:id", async (req, res) => {
  const paramsParsed = UpdateInquiryParams.safeParse({ id: Number(req.params.id) });
  if (!paramsParsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const bodyParsed = UpdateInquiryBody.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  const [inquiry] = await db
    .update(inquiriesTable)
    .set(bodyParsed.data)
    .where(eq(inquiriesTable.id, paramsParsed.data.id))
    .returning();
  if (!inquiry) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(inquiry);
});

router.delete("/inquiries/:id", async (req, res) => {
  const parsed = DeleteInquiryParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(inquiriesTable).where(eq(inquiriesTable.id, parsed.data.id));
  res.status(204).send();
});

export default router;
