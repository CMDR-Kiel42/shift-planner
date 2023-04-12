export enum SHIFT_NUMBER {
    FIRST = 'FIRST', 
    SECOND = 'SECOND', 
    THIRD = 'THIRD'
}

export interface IShiftInput {
    day: Date;
    shiftNumber: SHIFT_NUMBER;
}