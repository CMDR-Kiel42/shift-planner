import { db } from "../db";
import { Shift } from "./shift.model";
import { Worker } from "./worker.model";
import * as dbHelper from "../helpers/db.helpers";

export class ScheduledShift {
    static readonly _tableName = "scheduled_shift";
    shift: Shift;
    assignedWorkers: Worker[];

    constructor(shift: Shift, assignedWorkers: Worker[]) {
        this.shift = shift;
        this.assignedWorkers = assignedWorkers;
    }

    // TODO: paginate by week/month
    static async findAll(): Promise<ScheduledShift[]> {
        return db.any(`SELECT shift.id as "shift_id", shift.day, shift.shift_number, worker.id as "worker_id", worker.name, worker.surname FROM shift 
            INNER JOIN scheduled_shift ON shift.Id = scheduled_shift.shift_id 
            INNER JOIN worker on scheduled_shift.worker_id = worker.id
            ORDER BY shift.day`)
        .then((allRows) => {
            const allShifts: Map<string, ScheduledShift> = new Map();
            allRows.forEach((row) => {
                const worker: Worker = new Worker(row.name, row.surname, row.worker_id);
                if (allShifts.has(row.shift_id)) {
                    allShifts.get(row.shift_id)?.assignedWorkers.push(worker);
                }
                else {
                    const shift: Shift = new Shift(row.day, row.shift_number, row.shift_id);
                    const scheduledShift: ScheduledShift = new ScheduledShift(shift, new Array<Worker>(worker));
                    allShifts.set(row.shift_id, scheduledShift);
                }
            });

            return Array.from(allShifts.values());
        });
    }

    static async findById(id: string): Promise<ScheduledShift> {
        return dbHelper.findById(this._tableName, id)
        .then(async (row) => {
            if (!row) {
                throw new Error(`Scheduled shift with id ${id} not found`);
            }
            else {
                const worker: Worker = await Worker.findById(row.worker_id);
                const shift: Shift = await Shift.findById(row.shift_id);
                return new ScheduledShift(shift, new Array(worker));
            }
        });
    }
}