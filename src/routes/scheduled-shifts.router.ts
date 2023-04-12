import express, {Request, Response} from "express";
import * as scheduleService from "../services/scheduled-shifts.service"
import { IScheduleInput } from "../types/scheduled-shift.types";

const scheduleRouter = express.Router();

scheduleRouter.get("/", async (req: Request, res: Response) => {
    try {
        scheduleService.getFullSchedule()
        .then((scheduledShifts) => {
            res.json(scheduledShifts);
        });
        
    } catch (error) {
        console.error("Could not get full schedule", error);
        res.sendStatus(500);
    }
});


scheduleRouter.post("/", async (req: Request, res: Response) => {
    try {
        const scheduleInput: IScheduleInput = req.body;
        await scheduleService.scheduleShiftForWorker(scheduleInput);
        res.sendStatus(200);
    } catch (error) {
        if (error instanceof Error) {
            res.json(error.message);
        }
    }
});

export { scheduleRouter };