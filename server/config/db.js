const mongoose = require('mongoose');

// Keeps a single cached connection alive across the app's lifetime and
// fails fast with a readable message if Mongo isn't reachable.
const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true);

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // useNewUrlParser / useUnifiedTopology are defaults in modern mongoose,
      // left out on purpose to avoid the deprecation warnings.
    });

    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect is handled by the driver.');
    });

    return conn;
  } catch (error) {
    console.error(`Failed to connect to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
