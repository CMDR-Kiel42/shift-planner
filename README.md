# shift-planner
"Shift planner for TeamWay interview"

## Requirements
- PostgreSQL
- NodeJS

In Postgre, create a new database and run the following queries to initialize the project:
```
CREATE TYPE public.shiftnumber AS ENUM (
    'FIRST',
    'SECOND',
    'THIRD'
);
    
CREATE TABLE worker (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  surname VARCHAR NOT NULL )
);
      
CREATE TABLE shift (
  id SERIAL PRIMARY KEY,
  day date NOT NULL,
  shift_number text DEFAULT 'FIRST'::text NOT NULL,
  UNIQUE(day, shift),
  CONSTRAINT shift_number_check CHECK ((shift_number = ANY (ARRAY['FIRST'::text, 'SECOND'::text, 'THIRD'::text])))
);

CREATE TABLE scheduled_shift (
      worker_id SERIAL NOT NULL,
      shift_id SERIAL NOT NULL,
      PRIMARY KEY(worker_id, shift_id),
      CONSTRAINT fk_worker FOREIGN KEY (worker_id) REFERENCES worker(id),
      CONSTRAINT fk_shift FOREIGN KEY (shift_id) REFERENCES shift(id)
);
```

## Config
- Clone the project and run npm install
- Create a file called .env at the project root and add the following config values:
  - PORT = 3000 # Port on which the server will start running
  - DB_HOST = "localhost" # Postgre's address
  - DB_USER = "user" # User with which we'll connect to the 
  - DB_PWD = "abcd123" # User's password
  - DB_NAME = "shiftsPlanning" # Name of the database created in Postgre
  - DB_PORT = 5432 # Port used to connect to the db

## Unit tests
Open a terminal inside the project's root folder and run:
```
npm test
```

## Running the server
Open a terminal inside the project's root folder and run:
```
npm run dev
```

### Routes
#### Workers
- Get all workers: GET /workers
- Get a worker by id: GET /workers/:worker_id
- Create a worker: POST /workers

#### Shifts
- Get all shifts: GET /shifts
- Get a shift by id: GET /shifts/shift_id
- Create a shift: POST /shifts

#### Schedule (associated shift and worker)
- Get the full schedule: GET /schedule
- Create a schedule: POST /schedule
