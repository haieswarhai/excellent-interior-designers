import { pgTable, text, serial, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const projectsTable = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  phase: text("phase").notNull().default("present"), // past | present | future
  location: text("location").notNull(),
  style: text("style"),
  area: text("area"),
  imageUrl: text("image_url"),
  completionYear: integer("completion_year"),
  clientName: text("client_name"),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertProjectSchema = createInsertSchema(projectsTable).omit({ id: true, createdAt: true });
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projectsTable.$inferSelect;
