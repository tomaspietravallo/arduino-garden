import * as Functions from '@google-cloud/functions-framework';
import * as BigQuery from '@google-cloud/bigquery';

const PROJECT_ID = process.env.PROJECT_ID as string;
const DATASET = process.env.DATASET as string;
const TABLE = process.env.TABLE as string;

// assert(typeof PROJECT_ID === "string", "@ .env Assert: Project ID is not String");
// assert(typeof DATASET === "string", "@ .env Assert: DATASET is not String");
// assert(typeof TABLE === "string", "@ .env Assert: TABLE is not String");

const isJest = process.env.NODE_ENV === 'test';

const bigQuery = <BigQueryTypes.BigQuery> new BigQuery.BigQuery({
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

interface Request extends FunctionsTypes.Request {
  body: RequestData;
};

export async function logData(req: Request) {
  const rows = req.body.arduino_data
  .map((data) => ({ date: new Date(data.u), soil_humidity: data.h, temperature: data.t }));
  
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

export const entry: FunctionsTypes.HttpFunction = async (req: Request, res) => {
  // const resolveRequest = await logData(req);
  // console.log(resolveRequest)

  res.status(200);
  res.end();
};

Functions.http('entry', entry);