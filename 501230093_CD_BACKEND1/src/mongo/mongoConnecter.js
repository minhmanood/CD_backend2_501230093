import mongoose from "mongoose";
const uri = "mongodb://127.0.0.1:27017/";
const dbName = "CD_BACKEND1";
export default async function mongoConnect() {
  try {
    mongoose.connect(`${uri}${dbName}`);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.log(error);
    console.log("error connecting to MongoDB");
  }
}
