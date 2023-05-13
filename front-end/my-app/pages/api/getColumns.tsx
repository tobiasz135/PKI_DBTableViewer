import { NextApiRequest, NextApiResponse } from "next";
import { cookies } from "next/dist/client/components/headers";
import { getCookie, hasCookie, setCookie } from "cookies-next";

import mysql from 'serverless-mysql';

const db = mysql({
  config: {
    host: process.env.DB_HOST,
    port: 3306,
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
  }
});

export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    let tableName = req.body.table;
    let databaseName = req.body.database;
    let query = `SHOW COLUMNS FROM ${databaseName}.${tableName}`;

    console.log(query);
    let results
    try{
        results = await db.query(query);
    } catch (error) {
        await db.end();
        return res.json(error);
    }
    await db.end();
    //console.log(results);
    //console.log(req.body)
    return res.json({results})  
  }