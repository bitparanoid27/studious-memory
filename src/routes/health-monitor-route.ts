// External imports
import express, { Request, Response } from "express";

// Internal imports
import { healthMonitor } from "../controllers/health-monitor.js";

// router instance
const router = express.Router();

// create end-point
router.get("/health", healthMonitor);

// export
export { router as healthRouter };
