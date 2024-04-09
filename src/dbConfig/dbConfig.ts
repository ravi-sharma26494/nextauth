import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        const connection = mongoose.connection;
        
        connection.on('connected', () => {
            console.log("Db Connection successfully established");
        });
        
        connection.on('error', (err) => {
            console.log("MongoDB connection Failure", err);
            process.exit();
        });
        
    } catch (err) {
        console.log("MongoDB connection Failure");
        console.log(err);
    }
}