import { Worker } from "../models/worker.model";
import { IWorkerInput } from "../types/worker.types";

export async function postWorker(input: IWorkerInput) {
    try {
        const worker: Worker = new Worker(input.name, input.surname);
        await worker.insert();
        console.log(`Worker created with id ${worker.id}`);   
    } catch (error) {
        throw error;
    }
}

export async function getWorker(id: string): Promise<Worker> {
    try {
        return await Worker.findById(id);
    } catch (error) {
        throw error;
    }
}
