import * as Functions from '@google-cloud/functions-framework';
import * as BigQuery from '@google-cloud/bigquery';

const PROJECT_ID = process.env.PROJECT_ID as string;
const DATASET = process.env.DATASET as string;
const TABLE = process.env.TABLE as string;

const bigQuery = new BigQuery.BigQuery();

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

async function logData(req: Request) {
  console.log(JSON.stringify(req.body));
  console.log(JSON.stringify(req.body.arduino_data));
  console.log(req.body.arduino_data);
  const rows: BigQueryDataSchema[] = req.body.arduino_data
  .map((data) => ({ date: data.u, soil_humidity: data.h, temperature: data.t }));
  
  return await bigQuery
  .dataset(DATASET, { projectId: PROJECT_ID })
  .table(TABLE)
  .insert(rows)
}

async function pushNotificationToUser() {
  /** empty */
}

const entry: Functions.HttpFunction = async (req: Request, res) => {
  const resolveRequest = await logData(req);
  console.log(resolveRequest)

  res.status(200);
};

Functions.http('entry', entry);