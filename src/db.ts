import pgPromise from "pg-promise";
import * as dotenv from "dotenv";

dotenv.config();
const pg = pgPromise({});

export const db = pg(`postgres://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
