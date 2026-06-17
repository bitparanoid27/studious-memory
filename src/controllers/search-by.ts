// External modules
import {
  Request,
  Response,
  NextFunction,
  RequestHandler,
  RequestParamHandler,
} from "express";

// Internal modules
import prisma from "../services/prisma-client-service.js";
import PascalCase from "../services/pascal-case-service.js";

// search by airport icao GET /api/v1/traffic/search/:icao

export const searchByIcao: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  /* Retrieve user provided ICAO id from the request params */
  /* Sanitize the input param 
  
  Check if the icao provided is valid icao either by hitting the database or if possible check before making a db query. There are 1 million distinct icaos for now check using hitting the database if nothing found return incorrect or invalid icao. 

  Going forward need to think how to check this without hitting the database. 

  If icao is valid retrieve all results and return latest 20 results first. 

  */

  try {
    // TS is forcing me to prove that incoming ICAO is a string.
    let receivedIcao: string = Array.isArray(req.params.icao)
      ? req.params.icao[0].trim()
      : req.params.icao.trim();

    // check if the received icao is empty.

    if (receivedIcao.length === 0) {
      res.status(401).json({
        status: "Failure",
        message: "icao cannot be empty",
      });
    }

    let cleanedIcao: string = receivedIcao.toUpperCase();

    // retrieve flights for the airport requested.

    const retrievedFlightData = await prisma.trafficLog.findMany({
      where: { aptIcao: cleanedIcao },
      orderBy: { fltDate: "desc" },
      take: 20,
    });

    if (retrievedFlightData.length > 0) {
      res.status(200).json({
        status: "Success",
        message: `Flight data for the icao ${cleanedIcao}`,
        rawData: retrievedFlightData,
      });
    }

    if (retrievedFlightData.length === 0) {
      res.status(200).json({
        status: "Failure",
        message: `The icao ${cleanedIcao} is not tracked. Only European Union data available.`,
        rawData: "NA",
      });
    }
  } catch (error) {
    throw error;
  }
};

// search by airport name GET /api/v1/traffic/search/:airport_name

export const searchByAiportName: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    /* 
    
    Retrieve airport_name from the user
    
    Check if airport_name is empty exit early. 
    
    Sanitize the airport_name. 

    Retrieve data from the database. 

    */

    let receivedAiportName: string = Array.isArray(req.params.airport_name)
      ? req?.params?.airport_name[0].trim()
      : req?.params?.airport_name.trim();

    // if empty airport name received exit early.

    if (receivedAiportName.length === 0) {
      res.status(401).json({
        status: "Failure",
        message: "icao cannot be empty",
      });
    }

    // Sanitize the airport_name

    const cleanedAirportName: string = PascalCase(receivedAiportName as string);

    // retrieve airports and respond.

    const airportData = await prisma.trafficLog.findMany({
      where: { aptName: cleanedAirportName },
      orderBy: { fltDate: "desc" },
      take: 20,
    });

    if (airportData.length > 0) {
      res.status(200).json({
        status: "Success",
        message: `Flight data found for the airport name ${cleanedAirportName}`,
        rawData: airportData,
      });
    }

    // didn't find anything and respond.

    if (airportData.length === 0) {
      res.status(200).json({
        status: "Failure",
        message: `The aiport ${cleanedAirportName} is not tracked. Only European Union data available.`,
        rawData: "NA",
      });
    }

    //
  } catch (error) {
    throw error;
  }
};

// search by country name and airport name. Multi param search.
// Use if a user wants to search data from United kingdom and Birmingham airport.
// Endpoint should satisfy that requirement.

export const searchByCountryAndAirportName: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Retrieve parameters from the API.
    // Ensure both country and city names are present.
    // if any one of them or both of them are missing return immediately.
    // If present, sanitize the input.
    // Retrieve results from the database.
    // Send the results to the client.

    const { country_name, airport_name } = req.params;

    if (country_name === undefined || airport_name === undefined) {
      res.status(401).json({
        status: "Failure",
        message:
          "Country name or airport name missing. Both inputs are needed to retrieve results.",
      });
    }

    let cleanedCountryname: string = PascalCase(country_name as string).trim();
    let cleanedAirportname: string = PascalCase(airport_name as string).trim();

    // Retrieve results from the database.
    const retrievedCandAdata = await prisma.trafficLog.findMany({
      where: {
        AND: [
          {
            stateName: cleanedCountryname,
          },
          {
            aptName: cleanedAirportname,
          },
        ],
      },

      orderBy: { fltDate: "desc" },
      take: 20,
    });

    if (retrievedCandAdata.length > 0) {
      res.status(200).json({
        status: "Success",
        message: `Data found for country ${cleanedCountryname} and airport name ${cleanedAirportname}.`,
        rawData: retrievedCandAdata,
      });
    }

    if (retrievedCandAdata.length === 0) {
      res.status(500).json({
        status: "Failure",
        message: `Data not found for the ${cleanedCountryname} and ${cleanedAirportname} combination.`,
        rawData: "NA",
      });
    }
  } catch (error) {
    throw error;
  }
};
