// External imports
import express, { Request, Response } from "express";

// Internal imports
import {
  getMonthlyOperationalSplit,
  getYearlyOperationalSplit,
  getBusiestDayAtAirport,
} from "../controllers/get-operation-info.js";

// Router instance
const router = express.Router();

// create end-points
router.get("/traffic/operations-yearly/:icao/:year", getYearlyOperationalSplit);
router.get(
  "/traffic/operations-monthly/:icao/:year",
  getMonthlyOperationalSplit,
);
router.get(
  "/traffic/operations-busiest-day/:icao/:year",
  getBusiestDayAtAirport,
);

// export end-points
export { router as operationRouter };
