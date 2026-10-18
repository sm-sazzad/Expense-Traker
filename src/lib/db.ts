import { MongoClient, type Db } from "mongodb";

const rawUri =
  process.env.MONGODB_URI?.trim() ||
  // Common alias (e.g. Vercel/older templates); empty values are ignored.
  process.env.MONGODB_URL?.trim() ||
  undefined;
const dbName = process.env.MONGODB_DB?.trim() || "espensely";

// Falling back to a local server keeps `next build` / `next dev` bootable when
// the real Atlas string has not been supplied yet. Nothing connects until a
// query actually runs.
export const isMongoConfigured = Boolean(rawUri);

const uri = rawUri || "mongodb://127.0.0.1:27017/espensely";

const globalForMongo = globalThis as unknown as {
  __espenselyMongoClient?: MongoClient;
};

if (!isMongoConfigured) {
  console.warn(
    "[db] MONGODB_URI (or MONGODB_URL) is not set — falling back to mongodb://127.0.0.1:27017. " +
      "Sign-up, sign-in and all expense data will fail until you add your " +
      "MongoDB Atlas connection string to .env.local.",
  );
}

const client =
  globalForMongo.__espenselyMongoClient ??
  new MongoClient(uri, {
    // Fail fast when the cluster is unreachable instead of hanging for 30s.
    serverSelectionTimeoutMS: 10_000,
  });

// Reuse the connection across HMR reloads in development.
if (process.env.NODE_ENV !== "production") {
  globalForMongo.__espenselyMongoClient = client;
}

export const mongoClient = client;
export const db: Db = client.db(dbName);

export const EXPENSES_COLLECTION = "expenses";
export const BUDGETS_COLLECTION = "budgets";
