import { newDb } from "pg-mem";

const mem = newDb();

export const db = mem.adapters.createPgPromise();