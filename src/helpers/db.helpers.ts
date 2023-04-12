import { db } from "../db";

export async function findAll(tableName: string): Promise<any> {
    return await db.any("SELECT * FROM " + tableName + ';');
}

export async function findById(tableName: string, id: string): Promise<any> {
    const query = `SELECT * FROM ${tableName} WHERE id = $1;`
    return db.oneOrNone(query, id)
}