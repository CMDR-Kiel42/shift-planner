import { db } from "../db";
import * as dbHelper from "../helpers/db.helpers";

export class ScheduledShift {
    static readonly _tableName = "scheduled_shift";
    id?: string;
    shift_id: string;
    worker_id: string;

    constructor(shift_id: string, worker_id: string, id?: string) {
        this.id = id;
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

    async insert() {
        try {
            const query = `INSERT INTO ${ScheduledShift._tableName} (shift_id, worker_id) VALUES($1, $2) RETURNING id`;
            const row = await db.one(query, [this.shift_id, this.worker_id]);
            this.id = row.id;
        }
        catch(error) {
            console.error(`Failed to insert schedule in db: ${error}`);
            throw error;
        }
    }

    async delete() {
        try {
            await db.none(`DELETE FROM ${ScheduledShift._tableName} WHERE id = $1`, this.id);
        } catch (error) {
            console.error(`Failed to delete schedule ${this.id} in db: ${error}`);
            throw error;
        }
    }

    async update() {
        try {
            await db.none(`UPDATE ${ScheduledShift._tableName} SET shift_id = $1, worker_id = $2 WHERE id = $3`, [this.shift_id, this.worker_id, this.id]);
        } catch (error) {
            console.error(`Failed to update schedule ${this.id} in db: ${error}`);
            throw error;
        }
    }

    static fromRow(row: any): ScheduledShift {
        return new ScheduledShift(row.shift_id, row.worker_id);
    }
}