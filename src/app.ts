import express, {Express} from 'express';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import {workerRouter} from './routes/worker.router';
import { shiftRouter } from './routes/shift.router';
import { scheduleRouter } from './routes/scheduled-shifts.router';

const app: Express = express();
dotenv.config();

app.use(bodyParser.json());

app.use('/workers', workerRouter);
app.use('/shifts', shiftRouter);
app.use('/schedule', scheduleRouter);

app.listen(process.env.PORT, () => {
    console.log(`Node server started running on port ${process.env.PORT}`);
});
