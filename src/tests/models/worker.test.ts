import {describe, expect, test} from '@jest/globals';
import { db } from '../../db';
import { Worker } from "../../models/worker.model";
import * as workerFixtures from "../fixtures/worker.fixtures";

beforeAll(() => {
    workerFixtures.initialWorkersList.forEach((worker) => {
        db.none(`INSERT INTO ${Worker._tableName}(name, surname) VALUES ($1, $2)`, [worker.name, worker.surname]);
    });
})

describe ("Test worker insert", () => {
    it("should return full list of workers", async () => {
        const workerList = await Worker.findAll();
        expect(workerList).toHaveLength(3);
        expect(workerList).toContainEqual({id: expect.any(Number), name: "John", surname: "Doe"});
    });

    it("should insert new worker in db and return their id", async () => {
        const worker = new Worker("John", "Smith");
        await worker.insert();

        expect(worker.id).toBeDefined();
    });

    it("should create a valid worker from a db row", async () => {
        const dbRows = await db.many(`SELECT * FROM ${Worker._tableName};`);
        const row = dbRows[0];

        const worker = Worker.fromRow(row);

        expect(worker.id).toEqual(row.id);
        expect(worker.name).toEqual(row.name);
        expect(worker.surname).toEqual(row.surname);
    })
});