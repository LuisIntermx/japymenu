// src/types/global.d.ts
import type { MongoClient } from "mongodb";

declare global {
  let mongoClientPromise: Promise<MongoClient> | undefined;
}

export {};
