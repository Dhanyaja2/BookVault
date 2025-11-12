import mongoose from "mongoose";

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    console.error("MONGO_URI not found in environment variables");
    process.exit(1);
  }
  mongoose.set("strictQuery", true);

  if (process.env.NODE_ENV === "development") {
    mongoose.set("debug", true);
  }

  const options = {
    autoIndex: true, // build indexes automatically
    maxPoolSize: 20, // max number of connections in pool
    minPoolSize: 5, // keep some ready connections
    socketTimeoutMS: 45000, // close idle sockets after 45s
    connectTimeoutMS: 10000, // initial connection timeout
    family: 4, // use IPv4 (helps on some networks)
  };

  const connectWithRetry = async (retries = 5, delay = 5000) => {
    try {
      await mongoose.connect(MONGO_URI, options);
      console.log("✅ MongoDB connected successfully");
    } catch (error) {
      console.error(`❌ MongoDB connection failed: ${error.message}`);
      if (retries > 0) {
        console.log(
          `🔄 Retrying in ${delay / 1000}s... (${retries - 1} retries left)`
        );
        await new Promise((res) => setTimeout(res, delay));
        return connectWithRetry(retries - 1, delay);
      } else {
        console.error("🚫 Could not connect to MongoDB after multiple retries");
        process.exit(1);
      }
    }
  };

  await connectWithRetry();

  // Mongoose connection events
  mongoose.connection.on("connected", () => {
    console.log("🟢 MongoDB connection established");
  });

  mongoose.connection.on("error", (err) => {
    console.error(`🔴 MongoDB error: ${err.message}`);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("🟡 MongoDB disconnected. Retrying...");
  });

  // Graceful shutdown on app termination
  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("🔴 MongoDB connection closed due to app termination");
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    await mongoose.connection.close();
    console.log("🔴 MongoDB connection closed due to app stop (SIGTERM)");
    process.exit(0);
  });
};

export default connectDB;
