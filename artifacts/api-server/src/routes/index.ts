import { Router, type IRouter } from "express";
import healthRouter from "./health";
import projectsRouter from "./projects";
import customersRouter from "./customers";
import inquiriesRouter from "./inquiries";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(projectsRouter);
router.use(customersRouter);
router.use(inquiriesRouter);
router.use(statsRouter);

export default router;
