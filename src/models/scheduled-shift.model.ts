import { db } from "../db";
import * as dbHelper from "../helpers/db.helpers";

export class ScheduledShift {
    static readonly _tableName = "scheduled_shift";
    shift_id: string;
    worker_id: string;

    constructor(shift_id: string, worker_id: string) {
        this.shift_id = shift_id;
        this.worker_id = worker_id;
    }

    static async findAll(): Promise<Array<ScheduledShift>> {
        return dbHelper.findAll(this._tableName)
        .then((rows) => {
            const allShifts: Array<ScheduledShift> = new Array();
            rows.forEach((row: any) => {
                allShifts.push(ScheduledShift.fromRow(row));
            });
            return allShifts;
        });
    }

    static async findById(id: string): Promise<ScheduledShift> {
        return dbHelper.findById(this._tableName, id)
        .then((row) => {
            if (!row) {
                throw new Error(`Worker with id ${id} not found`);
            }
            else {
                return this.fromRow(row);
            }
        });
    }

    static async findWorkerScheduleForDay(workerId: string, day: Date): Promise<ScheduledShift | null> {
        try {
            return db.oneOrNone(`SELECT shift.id as "shift_id", shift.day, shift.shift_number, worker.id as "worker_id", worker.name, worker.surname
                                FROM shift
                                INNER JOIN scheduled_shift ON shift.id = scheduled_shift.shift_id
                                INNER JOIN worker on scheduled_shift.worker_id = worker.id
                                WHERE shift.day = $1
                                AND worker.id = $2`, [day, workerId])
                .then((row) => {
                    if (row) {
                        const schedule: ScheduledShift = new ScheduledShift(row.shift_id, workerId)
                        return schedule;
                    }
                    else {
                        return null;
                    }
                });
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async insert() {
        try {
            const query = `INSERT INTO ${ScheduledShift._tableName} (shift_id, worker_id) VALUES($1, $2)`;
            await db.none(query, [this.shift_id, this.worker_id]);
        }
        catch(error) {
            console.error(`Failed to insert schedule in db: ${error}`);
            throw error;
        }
    }

    async delete() {
        try {
            await db.none(`DELETE FROM ${ScheduledShift._tableName} WHERE shift_id = $1 AND worker_id = 2`, [this.shift_id, this.worker_id]);
        } catch (error) {
            console.error(`Failed to delete schedule ${this.shift_id} + ${this.worker_id} in db: ${error}`);
            throw error;
        }
    }

    async update() {
        try {
            await db.none(`UPDATE ${ScheduledShift._tableName} SET shift_id = $1, worker_id = $2 WHERE shift_id = $3 AND worker_id = $4`, [this.shift_id, this.worker_id, this.shift_id, this.worker_id]);
        } catch (error) {
            console.error(`Failed to update schedule ${this.shift_id} + ${this.worker_id} in db: ${error}`);
            throw error;
        }
    }

    static fromRow(row: any): ScheduledShift {
        return new ScheduledShift(row.shift_id, row.worker_id);
    }
}