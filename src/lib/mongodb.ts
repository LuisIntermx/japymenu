import { MongoClient } from "mongodb";
const { MONGODB_URI } = process.env;
const uri =
  MONGODB_URI ||
  "mongodb+srv://developer:bl68eCqMdQSSOfue@cluster0.xmvs3hh.mongodb.net/";
// const uri = "mongodb://localhost:27017/";
const options = {};

if (!uri) {
  throw new Error("Falta MONGODB_URI en .env.local");
}

const client = new MongoClient(uri, options);
const clientPromise: Promise<MongoClient> = client.connect();

export default clientPromise;
