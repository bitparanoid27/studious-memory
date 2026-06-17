// External imports
import {
  Request,
  Response,
  NextFunction,
  RequestHandler,
  RequestParamHandler,
} from "express";

// Internal imports
import prisma from "../services/prisma-client-service.js";

// Controllers

export const getYearlySummaryByIcao: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  /* 
    Retrieve icao and year from req.params. It's an object as there are multiple params. 
    ICAO should be present and valid.
    Year should be present and valid. between 2017 and 2026

    Sanitize year, and icao. 
    Fetch total flights for the request year and icao i.e. airport.
    Return result. 

    If found nothing, still return a result. 
  */
  try {
    // retrieve icao and year.
    const { icao, year } = req?.params;

    // Check for missing, invalid icao and year.
    if (
      (icao as string).trim() === undefined ||
      (icao as string).trim().length > 4
    ) {
      res.status(401).json({
        status: "Failure",
        message: "Incorrect ICAO received.",
      });
    }

    if (
      parseInt(year as string) === undefined ||
      parseInt(year as string) > 2026 ||
      parseInt(year as string) < 2017
    ) {
      res.status(401).json({
        status: "Failure",
        message:
          "Either year is missing or year provided is out of range.Valid year range from 2017 to 2026.",
      });
    }

    let cleanedIcao = (icao as string).trim().toUpperCase();
    let cleanedYear = year as string;

    // Retrieve result from database.

    const aggRes = await prisma.trafficLog.groupBy({
      by: ["aptName", "year"],
      where: {
        aptIcao: cleanedIcao,
        year: cleanedYear,
      },
      _sum: {
        fltTot1: true,
      },
    });

    // Create the data to be returned by the endpoint.

    const formattedData = aggRes.map((res) => {
      let data = {
        airport: res.aptName,
        year: res.year,
        totalFlights: res._sum.fltTot1,
      };
      return data;
    });

    if (aggRes.length > 0) {
      res.status(200).json({
        status: "Success",
        message: `Summary for ${formattedData[0].airport} airport for the year ${formattedData[0].year}. Total ${formattedData[0].totalFlights} flights found. `,
        rawData: formattedData[0],
      });
    }

    if (aggRes.length === 0) {
      res.status(200).json({
        status: "Failure",
        message: `No records were found for the ${cleanedIcao} airport for the ${cleanedYear} year in the database.`,
        rawData: "Data not found",
      });
    }

    //
  } catch (error) {
    throw error;
  }
};

export const getMonthlySummaryByIcao: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { icao, year } = req?.params;

    // Check for missing, invalid icao and year.
    if (
      (icao as string).trim() === undefined ||
      (icao as string).trim().length > 4
    ) {
      res.status(401).json({
        status: "Failure",
        message: "Incorrect ICAO received.",
      });
    }

    if (
      parseInt(year as string) === undefined ||
      parseInt(year as string) > 2026 ||
      parseInt(year as string) < 2017
    ) {
      res.status(401).json({
        status: "Failure",
        message:
          "Either year is missing or year provided is out of range.Valid year range from 2017 to 2026.",
      });
    }

    let cleanedIcao = (icao as string).trim().toUpperCase();
    let cleanedYear = year as string;

    // Retrieve result from database.

    const aggRes = await prisma.trafficLog.groupBy({
      by: ["aptName", "monthNum"],
      where: {
        aptIcao: cleanedIcao,
        year: cleanedYear,
      },
      _sum: {
        fltTot1: true,
      },
    });

    const formattedData = aggRes.map((res) => {
      let data = {
        airportName: res.aptName,
        month: res.monthNum,
        totalFlights: res._sum.fltTot1,
      };
      return data;
    });

    if (aggRes.length > 0) {
      res.status(200).json({
        status: "Success",
        message: `Data found for the ${formattedData[0].airportName} airport`,
        rawData: formattedData,
      });
    }

    if (aggRes.length === 0) {
      res.status(200).json({
        status: "Failure",
        message: `No records were found for the ${cleanedIcao} airport for the year ${cleanedYear} in the database.`,
        rawData: "Data not found",
      });
    }

    //
  } catch (error) {
    throw error;
  }
};

export const getCountryTopAirport: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    /* 
    Retrieve country name, airport name, and year from req.params. 
    check if country name, airport name and year is present. 
    Return immediately if any of the req.params is missing. 
    
    Sanitize input. 
    Retreive results from database. 
    
    Format the response and return the result. 
    */

    const { country, year } = req?.params;

    if (
      (country as string).trim() === undefined ||
      (year as string).trim() === undefined
    ) {
      res.status(401).json({
        status: "Failure",
        message: "Airport name or country or year not received.",
      });
    }

    let cleanedCountryName = (country as string).trim();
    let cleanedYear = year as string;

    // Retrieve data from the database.

    const aggRes = await prisma.trafficLog.groupBy({
      by: ["aptName"],
      where: {
        stateName: cleanedCountryName,
        year: cleanedYear,
      },
      _sum: {
        fltTot1: true,
      },
      orderBy: {
        _sum: { fltTot1: "desc" },
      },
      take: 5,
    });

    const formattedData = aggRes.map((result) => {
      let data = {
        airportName: result.aptName,
        totalFlights: result._sum.fltTot1,
      };
      return data;
    });

    // console.log(formattedData);

    if (formattedData.length > 0) {
      res.status(200).json({
        status: "Success",
        message: `Data for top 5 airports of ${cleanedCountryName}.`,
        rawData: formattedData,
      });
    }

    if (formattedData.length === 0) {
      res.status(200).json({
        status: "Failure",
        message: `Data doesn't exist or not found for the ${cleanedCountryName} country.`,
      });
    }

    //
  } catch (error) {
    throw error;
  }
};
