import { db } from '../../db';
import { Shift } from "../../models/shift.model";
import { SHIFT_NUMBER } from '../../types/shift.types';
import * as shiftFixtures from "../fixtures/shift.fixture";

beforeAll(() => {
    shiftFixtures.initialShifts.forEach((shift) => {
        db.none(`INSERT INTO ${Shift._tableName}(day, shift_number) VALUES ($1, $2)`, [shift.day, shift.shiftNumber]);
    });
})

describe ("Test shift model", () => {
    it("should return full list of workers", async () => {
        const shiftList = await Shift.findAll();
        expect(shiftList).toHaveLength(5);
        expect(shiftList).toContainEqual({id: expect.any(Number), day: new Date('2023-01-16'), shiftNumber: SHIFT_NUMBER.FIRST});
    });

    it("should insert new shift in db and return their id", async () => {
        const shift = new Shift(new Date('2023-05-24'), SHIFT_NUMBER.THIRD);
        await shift.insert();

        expect(shift.id).toBeDefined();
        const shiftList = await Shift.findAll();
        expect(shiftList).toHaveLength(6);
    });

    it("should create a valid shift from a db row", async () => {
        const dbRows = await db.many(`SELECT * FROM ${Shift._tableName};`);
        const row = dbRows[0];

        const shift = Shift.fromRow(row);

        expect(shift.id).toEqual(row.id);
        expect(shift.day).toEqual(new Date(row.day));
        expect(shift.shiftNumber).toEqual(row.shift_number);
    });
});