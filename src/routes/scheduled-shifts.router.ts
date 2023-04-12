import express, {Request, Response} from "express";
import * as scheduleService from "../services/scheduled-shifts.service"

const scheduleRouter = express.Router();

scheduleRouter.get("/", async (req: Request, res: Response) => {
    try {
        scheduleService.getFullSchedule()
        .then((scheduledShifts) => {
            res.json(scheduledShifts);
        });
        
    } catch (error) {
        res.sendStatus(500);
    }
});


export { scheduleRouter };