import mongoose from 'mongoose';

const mongoURI = process.env.MONGODB_URI as string;

const connectDB = async () => {
    // Database connection logic here
    try {
        const response = await mongoose.connect(mongoURI);
        console.log('MongoDB connected:', response.connection.host);
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }

}

export default connectDB;