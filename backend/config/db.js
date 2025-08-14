import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const {
	PGHOST = 'localhost',
	PGPORT = '5432',
	PGUSER = 'postgres',
	PGPASSWORD = 'postgres',
	PGDATABASE = 'neurosync'
} = process.env;

export const pool = new pg.Pool({
	host: PGHOST,
	port: Number(PGPORT),
	user: PGUSER,
	password: PGPASSWORD,
	database: PGDATABASE
});


