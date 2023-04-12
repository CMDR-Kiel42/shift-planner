import express, {Request, Response} from "express";
import { ScheduledShift } from "../models/scheduled-shift.model";
import * as scheduleService from "../services/scheduled-shifts.service"

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


export { scheduleRouter };