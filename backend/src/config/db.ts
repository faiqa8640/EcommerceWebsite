// connecting to db

import mongoose from "mongoose";
// tool use to connect backend with db

const connectDB = async (): Promise<void> => { // creating a asyn connectdb function coz  connection take time
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI as string); // connect to the db

        console.log(`MongoDB connected: ${conn.connection.host}`);
        // displying mongodb is connected

    } catch (error) {

        // if error then
        if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
        }

        process.exit(1); //  if the db fails so we stop the app
    }
};

export default connectDB;