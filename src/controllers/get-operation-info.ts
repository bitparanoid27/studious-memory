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

// controllers

export const getYearlyOperationalSplit: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    /* 
    Retrieve icao and year.
    Check if both and year are present. 
    If absent exit early. 
    If date out of range return early. 
    sanitize the input

    retrieve data from the database. 
    If data found send data to the endpoint. 
    If data not found send "data not found info" to the endpoint. 
    
    */

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
          "Either year is missing or year provided is out of range. Valid year range from 2017 to 2026.",
      });
    }

    let cleanedIcao = (icao as string).trim().toUpperCase();
    let cleanedYear = year as string;

    // Retrieve data from database.

    const aggRes = await prisma.trafficLog.groupBy({
      by: ["aptIcao", "year", "aptName"],
      where: {
        aptIcao: cleanedIcao,
        year: cleanedYear,
      },
      _sum: {
        fltArr1: true,
        fltDep1: true,
      },
    });

    const formattedData = aggRes.map((result) => {
      let data = {
        airport: result.aptName,
        year: result.year,
        totalArrivals: result._sum.fltArr1,
        totalDepartures: result._sum.fltDep1,
      };
      return data;
    });

    if (aggRes.length > 0) {
      res.status(200).json({
        status: "Success",
        message: `Summary for ${formattedData[0].airport} airport for the year ${formattedData[0].year}. Total ${formattedData[0].totalArrivals} flight arrivals. Total  ${formattedData[0].totalDepartures}  flight departures.`,
        rawData: formattedData[0],
      });
    }

    if (aggRes.length === 0) {
      res.status(200).json({
        status: "Failure",
        message: `No records found for the ${cleanedIcao} airport for the ${cleanedYear} year in the database.`,
        rawData: "NA",
      });
    }

    //
  } catch (error) {
    throw error;
  }
};

export const getMonthlyOperationalSplit: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    /* 
    Retrieve icao and year.
    Check if both and year are present. 
    If absent exit early. 
    If date out of range return early. 
    sanitize the input

    retrieve data from the database. 
    If data found send data to the endpoint. 
    If data not found send "data not found info" to the endpoint. 
    
    */

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

    // Retrieve data from database.

    const aggRes = await prisma.trafficLog.groupBy({
      by: ["aptIcao", "monthNum", "year", "aptName"],
      where: {
        aptIcao: cleanedIcao,
        year: cleanedYear,
      },
      _sum: {
        fltArr1: true,
        fltDep1: true,
      },
    });

    const formattedData = aggRes.map((result) => {
      let data = {
        airport: result.aptName,
        year: result.year,
        month: result.monthNum,
        totalArrivals: result._sum.fltArr1,
        totalDeparturs: result._sum.fltDep1,
      };
      return data;
    });

    if (aggRes.length > 0) {
      res.status(200).json({
        status: "Success",
        message: `Monthly flight summary for ${formattedData[0].airport} airport for the year ${formattedData[0].year}`,
        rawData: formattedData,
      });
    }

    if (aggRes.length === 0) {
      res.status(200).json({
        status: "Failure",
        message: `No records were found for the ${cleanedIcao} airport for the ${cleanedYear} year in the database.`,
        rawData: "NA",
      });
    }
  } catch (error) {
    throw error;
  }
};

export const getBusiestDayAtAirport: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    /* 
    
    Retrieve airport name and year. 
    If any of them are missing exit early with message indicating both of the params are required. 
    Sanitise incoming airport_name and year. 
    Retrieve data from database. 
    Send data to the frontend. 
    
    */

    const { icao, year } = req?.params;
    if (
      (icao as string).trim() === undefined ||
      (icao as string).trim().length > 4
    ) {
      res.send(401).json({
        status: "Failure",
        message:
          "Incorrect icao received. Either icao is missing or received icao is more than 4 characters long. ",
      });
    }

    if ((year as string).trim() === undefined) {
      res.send(401).json({
        status: "Failure",
        message:
          "Year is missing. Kindly provide year in between 2017 and 2026",
      });
    }

    if (
      (parseInt(year as string) as number) < 2017 ||
      (parseInt(year as string) as number) > 2026
    ) {
      res.send(401).json({
        status: "Failure",
        message:
          "Year provided is out of range. Please provide a year between 2017 and 2026.",
      });
    }

    const cleanedIcao = (icao as string).trim().toUpperCase();
    const cleanedYear = year as string;

    const aggRes = await prisma.trafficLog.findMany({
      select: { fltTot1: true, fltDate: true, aptName: true },
      where: { aptIcao: cleanedIcao, year: cleanedYear },
      orderBy: { fltTot1: "desc" },
      take: 1,
    });

    if (aggRes.length > 0) {
      res.status(200).json({
        status: "Success",
        message: `Data found for the ${aggRes[0]?.aptName} airport.`,
        rawData: aggRes,
      });
    }

    if (aggRes.length === 0) {
      res.status(404).json({
        status: "Failure",
        message: `Data not found for the ${cleanedIcao}.`,
        rawData: "NA",
      });
    }

    //
  } catch (error) {
    throw error;
  }
};
