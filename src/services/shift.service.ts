import { Shift } from "../models/shift.model";
import { IShiftInput } from "../types/shift.types";

export async function postShift(input: IShiftInput) {
    try {
        const shift: Shift = new Shift(input.day, input.shiftNumber);
        await shift.insert();
        console.log(`Shift created with id ${shift.id}`);   
    } catch (error) {
        throw error;
    }
}

export async function getShift(id: string): Promise<Shift> {
    try {
        return await Shift.findById(id);
    } catch (error) {
        throw error;
    }
}
