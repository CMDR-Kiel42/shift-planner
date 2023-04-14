import { db } from "../db";
import { ScheduledShift } from "../models/scheduled-shift.model";
import { Shift } from "../models/shift.model";
import { Worker } from "../models/worker.model";

jest.mock("../db")

beforeAll(async () => {
  await db.none(`CREATE TYPE public.shiftnumber AS ENUM (
    'FIRST',
    'SECOND',
    'THIRD'
    );`
  );
    
  await db.none(`CREATE TABLE ${Worker._tableName} (
      id SERIAL PRIMARY KEY,
      name VARCHAR NOT NULL,
      surname VARCHAR NOT NULL )`
  );
      
  await db.none(`CREATE TABLE ${Shift._tableName} (
        id SERIAL PRIMARY KEY,
        day date NOT NULL,
        shift_number text DEFAULT 'FIRST'::text NOT NULL,
        UNIQUE(day, shift),
        CONSTRAINT shift_number_check CHECK ((shift_number = ANY (ARRAY['FIRST'::text, 'SECOND'::text, 'THIRD'::text])))
      )`
  );

  await db.none(`CREATE TABLE ${ScheduledShift._tableName} (
                  worker_id SERIAL NOT NULL,
                  shift_id SERIAL NOT NULL,
                  PRIMARY KEY(worker_id, shift_id),
                  CONSTRAINT fk_worker FOREIGN KEY (worker_id) REFERENCES worker(id),
                  CONSTRAINT fk_shift FOREIGN KEY (shift_id) REFERENCES shift(id)

  )`);
});
      
// close connection
// afterAll(async () => {
//     db.$pool.end();
// });
      