import { db } from "../db";
import * as dbHelper from "../helpers/db.helpers";

export class Worker {
    static readonly _tableName = 'worker';
    id?: string;
    name: string;
    surname: string;

    constructor(name: string, surname: string, id?: string) {
        this.id = id;
        this.name = name;
        this.surname = surname;
    }

    static async findAll(): Promise<Array<Worker>> {
        return dbHelper.findAll(this._tableName)
        .then((rows) => {
            const allWorkers: Array<Worker> = new Array();
            rows.forEach((row: any) => {
                allWorkers.push(Worker.fromRow(row));
            });
            return allWorkers;
        });
    }

    static async findById(id: string): Promise<Worker> {
        return dbHelper.findById(this._tableName, id)
        .then((row) => {
            if (!row) {
                throw new Error(`Worker with id ${id} not found`);
            }
            else {
                return Worker.fromRow(row);
            }
        });
    }

    async insert() {
        try {
            const row = await db.one('INSERT INTO worker(name, surname) VALUES($1, $2) RETURNING id', [this.name, this.surname]);
            this.id = row.id;
        }
        catch(error) {
            console.error(`Failed to insert worker in db: ${error}`);
        }
    }

    async delete() {
        await db.none('DELETE FROM worker WHERE id = $1', this.id);
    }

    async update() {
        await db.none('UPDATE worker SET name = $1, surname = $2 WHERE id = $3', [this.name, this.surname, this.id]);
    }

    static fromRow(row: any): Worker {
        return new Worker(row.name, row.surname, row.id);
    }
}