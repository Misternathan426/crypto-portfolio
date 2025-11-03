import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing in .env.local file");
}

// Extend global interface for TypeScript
declare global {
    var mongoose: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    };
}

let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
    // If we already have a connection, return it
    if (cached.conn) {
        return cached.conn;
    }

    // If we don't have a promise, create one
    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            console.log("MongoDB connected successfully");
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error: any) {
        cached.promise = null;
        console.error("MongoDB connection error:");
        
        if (error.code === 8000) {
            console.error("🔐 Authentication failed. Please check:");
            console.error("1. Username and password in MongoDB Atlas");
            console.error("2. Database user has proper permissions");
            console.error("3. Network access is configured (0.0.0.0/0 for development)");
        }
        
        console.error("Full error:", error);
        throw error;
    }

    return cached.conn;
};