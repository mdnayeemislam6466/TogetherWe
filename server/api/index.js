import app from '../src/server.js';
import { connectDB } from '../src/config/db.js';
let ready;
export default async function handler(req,res){try{ready??=connectDB();await ready;return app(req,res);}catch(error){console.error(error);return res.status(500).json({message:'Database connection failed'});}}
