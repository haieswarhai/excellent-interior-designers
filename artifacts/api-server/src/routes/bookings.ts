import { Router } from "express";
import { db } from "@workspace/db";
import { bookingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateBookingBody,
  UpdateBookingParams,
  UpdateBookingBody,
  DeleteBookingParams,
  ListBookingsQueryParams,
} from "@workspace/api-zod";
import { sendBookingNotification, sendBookingConfirmation } from "../lib/email";

const router = Router();

router.get("/bookings", async (req, res) => {
  const parsed = ListBookingsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query params" });
    return;
  }
  const { status } = parsed.data;
  const bookings = status
    ? await db.select().from(bookingsTable).where(eq(bookingsTable.status, status))
    : await db.select().from(bookingsTable);
  res.json(bookings);
});

router.post("/bookings", async (req, res) => {
  const parsed = CreateBookingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  const [booking] = await db.insert(bookingsTable).values(parsed.data).returning();
  res.status(201).json(booking);

  sendBookingNotification(booking);
  sendBookingConfirmation(booking);
});

router.patch("/bookings/:id", async (req, res) => {
  const paramsParsed = UpdateBookingParams.safeParse({ id: Number(req.params.id) });
  if (!paramsParsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const bodyParsed = UpdateBookingBody.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  const [booking] = await db
    .update(bookingsTable)
    .set(bodyParsed.data)
    .where(eq(bookingsTable.id, paramsParsed.data.id))
    .returning();
  if (!booking) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(booking);
});

router.delete("/bookings/:id", async (req, res) => {
  const parsed = DeleteBookingParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(bookingsTable).where(eq(bookingsTable.id, parsed.data.id));
  res.status(204).send();
});

export default router;
