// External imports
import express, { Request, Response } from "express";

// Internal imports
import { getYearlySummaryByIcao } from "../controllers/get-summary.js";
import { getMonthlySummaryByIcao } from "../controllers/get-summary.js";
import { getCountryTopAirport } from "../controllers/get-summary.js";

// Router instance
const router = express.Router();

// create end-points
router.get("/traffic/summary-yearly/:icao/:year", getYearlySummaryByIcao);
router.get("/traffic/summary-monthly/:icao/:year", getMonthlySummaryByIcao);
router.get("/traffic/summary-top/:country/:year", getCountryTopAirport);

// export end-points
export { router as summaryRouter };
