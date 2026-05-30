import { Router } from "express";
import { db } from "@workspace/db";
import { projectsTable, customersTable, inquiriesTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";

const router = Router();

router.get("/stats/dashboard", async (_req, res) => {
  const [
    totalCustomersResult,
    hotResult,
    warmResult,
    coldResult,
    pastCustomersResult,
    totalProjectsResult,
    activeProjectsResult,
    totalInquiriesResult,
    newInquiriesResult,
  ] = await Promise.all([
    db.select({ count: count() }).from(customersTable),
    db.select({ count: count() }).from(customersTable).where(eq(customersTable.status, "hot")),
    db.select({ count: count() }).from(customersTable).where(eq(customersTable.status, "warm")),
    db.select({ count: count() }).from(customersTable).where(eq(customersTable.status, "cold")),
    db.select({ count: count() }).from(customersTable).where(eq(customersTable.status, "past")),
    db.select({ count: count() }).from(projectsTable),
    db.select({ count: count() }).from(projectsTable).where(eq(projectsTable.phase, "present")),
    db.select({ count: count() }).from(inquiriesTable),
    db.select({ count: count() }).from(inquiriesTable).where(eq(inquiriesTable.status, "new")),
  ]);

  res.json({
    totalCustomers: Number(totalCustomersResult[0]?.count ?? 0),
    hotCount: Number(hotResult[0]?.count ?? 0),
    warmCount: Number(warmResult[0]?.count ?? 0),
    coldCount: Number(coldResult[0]?.count ?? 0),
    pastCount: Number(pastCustomersResult[0]?.count ?? 0),
    totalProjects: Number(totalProjectsResult[0]?.count ?? 0),
    activeProjects: Number(activeProjectsResult[0]?.count ?? 0),
    totalInquiries: Number(totalInquiriesResult[0]?.count ?? 0),
    newInquiries: Number(newInquiriesResult[0]?.count ?? 0),
  });
});

export default router;
