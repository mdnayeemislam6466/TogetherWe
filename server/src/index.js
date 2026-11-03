import 'dotenv/config';
import app from './server.js';
import {connectDB} from './config/db.js';
const port=process.env.PORT||5000;
connectDB().then(()=>app.listen(port,()=>console.log(`TogetherWe API running at http://localhost:${port}`))).catch(err=>{console.error('Database connection failed:',err.message);process.exit(1)});
