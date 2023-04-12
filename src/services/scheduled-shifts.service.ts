import { db } from "../db";
import { ScheduledShift } from "../models/scheduled-shift.model";
import { Shift } from "../models/shift.model";
import { Worker } from "../models/worker.model";
import { IWorkersToShift } from "../types/scheduled-shift.types";


// TODO: paginate by week/month
export async function getFullSchedule(): Promise<IWorkersToShift[]> {
    return db.any(`SELECT shift.id as "shift_id", shift.day, shift.shift_number, worker.id as "worker_id", worker.name, worker.surname FROM shift 
        INNER JOIN scheduled_shift ON shift.Id = scheduled_shift.shift_id 
        INNER JOIN worker on scheduled_shift.worker_id = worker.id
        ORDER BY shift.day`)
    .then((allRows) => {
        const allShifts: Map<string, IWorkersToShift> = new Map();
        allRows.forEach((row) => {
            const worker: Worker = new Worker(row.name, row.surname, row.worker_id);
            if (allShifts.has(row.shift_id)) {
                allShifts.get(row.shift_id)?.assignedWorkers.push(worker);
            }
            else {
                const shift: Shift = new Shift(row.day, row.shift_number, row.shift_id);
                const scheduledShift: IWorkersToShift = { shift, assignedWorkers: new Array<Worker>(worker) };
                allShifts.set(row.shift_id, scheduledShift);
            }
        });

        return Array.from(allShifts.values());
    });
}