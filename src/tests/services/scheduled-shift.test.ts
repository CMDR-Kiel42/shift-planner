import { db } from '../../db';
import { Worker } from '../../models/worker.model';
import { Shift } from '../../models/shift.model';
import { SHIFT_NUMBER } from '../../types/shift.types';
import * as workerFixtures from "../fixtures/worker.fixtures";
import * as shiftFixtures from "../fixtures/shift.fixture";
import * as scheduleService from "../../services/scheduled-shifts.service";
import { IScheduleInput } from '../../types/scheduled-shift.types';
import { ScheduledShift } from '../../models/scheduled-shift.model';


beforeAll(() => {
    workerFixtures.initialWorkersList.forEach(async (worker) => {
        await db.none(`INSERT INTO ${Worker._tableName}(name, surname) VALUES ($1, $2)`, [worker.name, worker.surname]);
    });

    shiftFixtures.initialShifts.forEach(async (shift) => {
        await db.none(`INSERT INTO ${Shift._tableName}(day, shift_number) VALUES ($1, $2)`, [shift.day, shift.shiftNumber]);
    });
})

describe ("Test schedule services", () => {
    afterEach(async () => {
        await db.none(`DELETE FROM ${ScheduledShift._tableName}`);
    });

    it.skip("should schedule shift for a day", async () => {
        const worker = new Worker("Tess", "Ting");
        await worker.insert();

        const shift = new Shift(new Date(), SHIFT_NUMBER.FIRST);
        await shift.insert();

        const scheduleInput: IScheduleInput = {
            day: shift.day,
            shiftNumber: shift.shiftNumber,
            workerId: worker.id || "",
        }

        const scheduled = await scheduleService.scheduleShiftForWorker(scheduleInput);
        expect(scheduled.shift_id).toEqual(shift.id);
        expect(scheduled.worker_id).toEqual(worker.id);
    });

    it("should prevent you from scheduling two shifts in a day", async () => {
        const worker = new Worker("Tess", "Ting");
        await worker.insert();

        const shift = new Shift(new Date(), SHIFT_NUMBER.FIRST);
        await shift.insert();

        const validScheduleInput: IScheduleInput = {
            day: shift.day,
            shiftNumber: shift.shiftNumber,
            workerId: worker.id || "",
        };

        const failedScheduleInput: IScheduleInput = {
            day: shift.day,
            shiftNumber: SHIFT_NUMBER.SECOND,
            workerId: worker.id || "",
        }

        await scheduleService.scheduleShiftForWorker(validScheduleInput);

        const testAction = async () => {await scheduleService.scheduleShiftForWorker(failedScheduleInput)};

        await expect(testAction()).rejects.toThrow();
    });
});