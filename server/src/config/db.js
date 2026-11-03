import { MongoClient } from 'mongodb';
let client; let database; let pending;
export async function connectDB(){
  if(database) return database;
  if(!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing. Copy server/.env.example to server/.env');
  pending ??= (async()=>{
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    database = client.db(process.env.DB_NAME || 'togetherwe');
    await Promise.all([
      database.collection('events').createIndex({eventDate:1}),
      database.collection('events').createIndex({creatorEmail:1}),
      database.collection('users').createIndex({email:1},{unique:true}),
      database.collection('joinedEvents').createIndex({eventId:1,userEmail:1},{unique:true})
    ]);
    console.log('MongoDB connected'); return database;
  })().catch(error=>{pending=null; throw error;});
  return pending;
}
export function getDB(){if(!database) throw new Error('Database is not connected'); return database;}
