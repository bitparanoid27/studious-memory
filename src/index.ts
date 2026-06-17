import express, { Request, Response, ErrorRequestHandler } from "express";
import * as dotenv from "dotenv";
dotenv.config();

// local imports
import { globalErrorHandler } from "./controllers/app-lvl-err-handler.js";
import { healthRouter } from "./routes/health-monitor-route.js";
import { searchRouter } from "./routes/search-by-routes.js";
import { summaryRouter } from "./routes/summary-routes.js";
import { operationRouter } from "./routes/operation-routes.js";

// express instance
const app = express();
app.use(express.json());

app.use("/api/v1", healthRouter);
app.use("/api/v1", searchRouter);
app.use("/api/v1", summaryRouter);
app.use("/api/v1", operationRouter);

// application level error handler.
app.use(globalErrorHandler);

const PORT = process.env.PORT || 3011;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
