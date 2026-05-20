import mongoose from 'mongoose';

let isConnected = false;
const connectOrderDB = async () => {
    if (isConnected) return;
    
    if (!process.env.MONGO_URL) {
        throw new Error('MONGO_URL environment variable is not set');
    }
    
    try {
        await mongoose.connect(process.env.MONGO_URL);
        isConnected = true;
        console.log('Connected to Order Database');
    } catch (error) {
        console.error('Error connecting to Order Database:', error);
        process.exit(1);
    }
}

export default connectOrderDB;