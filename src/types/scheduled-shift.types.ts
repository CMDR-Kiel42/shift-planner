import { Shift } from "../models/shift.model";
import { Worker } from "../models/worker.model";
import { SHIFT_NUMBER } from "./shift.types";


export interface IWorkersToShift {
    shift: Shift;
    assignedWorkers: Worker[];
}

export interface IScheduleInput {
    workerId: string;
    day: Date;
    shiftNumber: SHIFT_NUMBER;
}