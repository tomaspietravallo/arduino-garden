import * as Functions from '@google-cloud/functions-framework';
import * as BigQuery from '@google-cloud/bigquery';

const PROJECT_ID = process.env.PROJECT_ID as string;
const DATASET = process.env.DATASET as string;
const TABLE = process.env.TABLE as string;

// assert(typeof PROJECT_ID === "string", "@ .env Assert: Project ID is not String");
// assert(typeof DATASET === "string", "@ .env Assert: DATASET is not String");
// assert(typeof TABLE === "string", "@ .env Assert: TABLE is not String");

const isJest = process.env.NODE_ENV === 'test';

const bigQuery = <BigQuery.BigQuery> new BigQuery.BigQuery({
  projectId: PROJECT_ID,
  keyFilename: (isJest ? `../../key.json` : undefined)
});

interface RequestData {
  arduino_data: {
    /** @description Temperature */
    t: number,
    /** @description Humidity */
    h: number,
    /** @description UTC Time */
    u: number,
  }[]
}

interface BigQueryDataSchema {
  date: number,
  soil_humidity: number,
  air_humidity?: number,	
  temperature?: number,
  voltage?: number,
  water_pressure?: number;
}

interface Request extends Functions.Request {
  body: RequestData;
};

export async function logData(req: Request) {
  if (req === undefined || req.body === undefined || req.body.arduino_data === undefined) {
    throw new Error(`req.body.arduino_data is undefined. ${JSON.stringify(req)}::${JSON.stringify(req.body)}::${req.body.arduino_data}`)
  }

  const rows = (Array.isArray(req.body.arduino_data) ? req.body.arduino_data : [req.body.arduino_data])
  .map((data) => ({ date: new Date(data.u * 1000), soil_humidity: data.h, temperature: data.t }));

  if ( !rows.every((e) => e.date.getFullYear() > 2020 && e.date.getFullYear() < 2100) ) {
    throw new Error(`Dates do not seem to be correct: ${JSON.stringify(rows)}`);
  }
  
  return await bigQuery.dataset(DATASET)
  .table(TABLE)
  .insert(rows, {
    skipInvalidRows: false,
    ignoreUnknownValues: false,
    createInsertId: false
  });
}

export async function pushNotificationToUser() {
  /** empty */
}

export const entry: Functions.HttpFunction = async (req: Request, res) => {
  const resolveRequest = await logData(req);
  // console.log(resolveRequest)

  res.status(200);
  res.end();
};

Functions.http('entry', entry);