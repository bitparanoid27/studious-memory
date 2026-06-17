
## Airport Traffic Analytics API

A read-only REST API built to query, filter, and analyze over 1 million records of historical European aviation traffic data. 

Instead of just serving raw rows, this API utilizes PostgreSQL and Prisma aggregations to provide time-series trends, yearly summaries, and specific airport analytics directly to the frontend.

### Tech Stack
* **Node.js & Express** - Routing and server logic
* **TypeScript** - Strict typing and modern ES Modules
* **Prisma** - ORM for database querying and aggregations
* **PostgreSQL** - Relational database (initial data ingested via DuckDB)

### Features & Endpoints

The API is structured to handle everything from basic lookups to complex mathematical aggregations grouped by time.

* **Basic Search**
  * `GET /api/v1/traffic/search-icao/:icao` - Look up raw data by 4-letter ICAO code.
  * `GET /api/v1/traffic/search-airport-name/:airport_name` - Look up by standard name.
  * `GET /api/v1/traffic/search-country-and-airport-name/:country_name/:airport_name` - Strict filtering by both country and airport.

* **Traffic summary**
  * `GET /api/v1/traffic/summary-yearly/:icao/:year` - Calculates the total aggregated flights for a specific airport in a given year.
  * `GET /api/v1/traffic/summary-monthly/:icao/:year` - Returns a 12-monthly time-series array of flight totals.
  * `GET /api/v1/traffic/summary-top/:country/:year` - Returns top 5 busiest airports for the specific country.
 
* **Operational summary**
  * `GET /api/v1/traffic/operations-yearly/:icao/:year` 
  * `GET /api/v1/traffic/operations-monthly/:icao/:year`
  * `GET /api/v1/traffic/operations-busiest-day/:icao/:year` - Returns the busiest airport for the specific year from the specified country.

### Example Response

Hitting the trends endpoint (`/traffic/summary-monthly/EGLL/2019`) returns:

```json
{
  "status": "Success",
  "message": "Data found for London - Heathrow",
  "rawData": [
    { "airportName": "London - Heathrow", "month": "01", "totalFlights": 38902 },
    { "airportName": "London - Heathrow", "month": "02", "totalFlights": 35966 }
    // ... continues for 12 months
  ]
}
```

### Running Locally

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd <your-repo-name>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables:
   Create a `.env` file in the root directory and add your Postgres connection string:
   ```text
   DATABASE_URL="postgresql://user:password@localhost:5432/your_database"
   ```

4. Generate the Prisma Client:
   ```bash
   npx prisma generate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:3000`.
   
