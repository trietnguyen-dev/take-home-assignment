import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log("Connect to MongoDB successfully!");
    } catch (e) {
        console.error("MongoDB connection error:", e);
    }
};

export default connectDB;

