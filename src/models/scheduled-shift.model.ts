import { Shift } from "./shift.model";
import { Worker } from "./worker.model";


export class ScheduledShift {
    shift: Shift;
    assignedWorkers: Worker[];

    constructor(shift: Shift, assignedWorkers: Worker[]) {
        this.shift = shift;
        this.assignedWorkers = assignedWorkers;
    }

    static fromRow(row: any): ScheduledShift {
        const shift: Shift = new Shift(new Date(row.day), row.shift_number, row.shift_id);
        const worker: Worker = new Worker(row.name, row.surname, row.worker_id);

        return new ScheduledShift(shift, new Array<Worker>(worker));
    }
}