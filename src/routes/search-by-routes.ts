// External imports
import express, { Request, Response } from "express";

// Internal imports
import { searchByIcao } from "../controllers/search-by.js";
import { searchByAiportName } from "../controllers/search-by.js";
import { searchByCountryAndAirportName } from "../controllers/search-by.js";

// router instance
const router = express.Router();

// create end-point
router.get("/traffic/search-icao/:icao", searchByIcao);
router.get("/traffic/search-airport-name/:airport_name", searchByAiportName);
router.get(
  "/traffic/search-country-and-airport-name/:country_name/:airport_name",
  searchByCountryAndAirportName,
);

// export
export { router as searchRouter };
