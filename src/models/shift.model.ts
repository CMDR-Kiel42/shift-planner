import { db } from "../db";
import { SHIFT_NUMBER } from "../types/shift.types";
import * as dbHelper from "../helpers/db.helpers";
import { Worker } from "./worker.model";

export class Shift {
    static readonly _tableName = 'shift';
    id?: string;
    day: Date;
    shiftNumber: SHIFT_NUMBER;
    assignedWorkers?: Worker[];

    constructor(day: Date, shiftNumber: SHIFT_NUMBER, id?: string) {
        this.id = id;
        this.day = day;
        this.shiftNumber = shiftNumber;
    }

    static async findAll(): Promise<Array<Shift>> {
        return dbHelper.findAll(this._tableName)
        .then((allRows) => {
            return new Promise<Array<Shift>>((resolve) => {
                const allShifts: Array<Shift> = new Array();
                allRows.forEach((row: any) => {
                    allShifts.push(Shift.fromRow(row));
                });

                resolve(allShifts)
            });
        });
    }

    static async findById(id: string): Promise<Shift> {
        return dbHelper.findById(this._tableName, id)
        .then((row) => {
            if (!row) {
                throw new Error(`Shift with id ${id} not found`);
            }
            else {
                return this.fromRow(row);
            }
        });
    }

    static async findOrCreate(day: Date, shiftNumber: SHIFT_NUMBER): Promise<Shift> {
        return db.oneOrNone(`SELECT * FROM ${Shift._tableName} WHERE day = $1 AND shift_number = $2`, [day, shiftNumber])
        .then(async (row) => {
            if (!row) {
                let shift = new Shift(day, shiftNumber);
                await shift.insert();
                return shift;
            }
            else {
                return this.fromRow(row);
            }
        });
    }

    async insert() {
        try {
            const row = await db.one('INSERT INTO shift(day, shift_number) VALUES($1, $2) RETURNING id', [this.day, this.shiftNumber]);
            this.id = row.id;
        }
        catch(error) {
            console.error(`Failed to insert shift in db: ${error}`);
            throw error;
        }
    }

    async delete() {
        await db.none('DELETE FROM shift WHERE id = $1', this.id);
    }

    async update() {
        await db.none('UPDATE shift SET day = $1, shift_number = $2 WHERE id = $3', [this.day, this.shiftNumber, this.id]);
    }

    static fromRow(row: any): Shift {
        return new Shift(row.day, row.shift_number, row.id);
    }

    static fromJoinedRow() {}
}