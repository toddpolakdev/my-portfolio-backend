import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

let cachedDb: Db;

export async function connectToDatabase(): Promise<Db> {
  if (cachedDb) {
    return cachedDb;
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI || "");
  const dbName = process.env.DB_NAME;

  cachedDb = client.db(dbName);

  return cachedDb;
}
