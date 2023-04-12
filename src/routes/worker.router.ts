import express, {Request, Response} from "express";
import { Worker } from "../models/worker.model";
import * as workerService from "../services/worker.service";
import { IWorkerInput } from "../types/worker.types";

const workerRouter = express.Router();

workerRouter.get("/", async (req: Request, res: Response) => {
    Worker.findAll().then((workersList) => {
        res.json({"data": workersList});
    });
});

workerRouter.get("/:worker_id", async (req: Request, res: Response) => {
    try {
        const worker: Worker = await workerService.getWorker(req.params.worker_id);
        res.json(worker);
    } catch (error) {
        if (error instanceof Error) {
            res.json(error.message);
        }
    }
});

workerRouter.post("/", async (req: Request, res: Response) => {
    try {
        const workerInput: IWorkerInput = req.body;
        await workerService.postWorker(workerInput);
        res.sendStatus(200);
    } catch (error) {
        if (error instanceof Error) {
            res.json(error.message);
        }
    }
});

export { workerRouter };