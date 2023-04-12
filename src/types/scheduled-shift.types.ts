import { Shift } from "../models/shift.model";
import { Worker } from "../models/worker.model";


export interface IWorkersToShift {
    shift: Shift;
    assignedWorkers: Worker[];
}