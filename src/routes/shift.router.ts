import express, {Request, Response} from "express";
import { Shift } from "../models/shift.model";
import * as shiftService from "../services/shift.service";
import { IShiftInput } from "../types/shift.types";

const shiftRouter = express.Router();

shiftRouter.get("/", async (req: Request, res: Response) => {
    Shift.findAll().then((shiftsList) => {
        res.json({"data": shiftsList});
    });
});

shiftRouter.get("/:shift_id", async (req: Request, res: Response) => {
    try {
        const shift: Shift = await shiftService.getShift(req.params.shift_id);
        res.json(shift);
    } catch (error) {
        if (error instanceof Error) {
            res.json(error.message);
        }
    }
});

shiftRouter.post("/", async (req: Request, res: Response) => {
    try {
        const shiftInput: IShiftInput = req.body;
        await shiftService.postShift(shiftInput);
        res.sendStatus(200);
    } catch (error) {
        if (error instanceof Error) {
            res.json(error.message);
        }
    }
});

export { shiftRouter };