import { db } from "../db";
import { ScheduledShift } from "../models/scheduled-shift.model";
import { Shift } from "../models/shift.model";
import { Worker } from "../models/worker.model";
import { IScheduleInput, IWorkersToShift } from "../types/scheduled-shift.types";
import { SHIFT_NUMBER } from "../types/shift.types";


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


export async function scheduleShiftForWorker(scheduleInput: IScheduleInput): Promise<ScheduledShift> {
    const scheduleForDay = await ScheduledShift.findWorkerScheduleForDay(scheduleInput.workerId, scheduleInput.day);

    if (scheduleForDay) {
        throw new Error("Cannot schedule more than one shift per day");
    }

    const shift = await Shift.findOrCreate(scheduleInput.day, scheduleInput.shiftNumber);
    if (!shift.id) {
        throw new Error("Could not create or find shift");
    }
    
    const scheduledShift = new ScheduledShift(shift.id, scheduleInput.workerId);
    await scheduledShift.insert();
    return scheduledShift;
}