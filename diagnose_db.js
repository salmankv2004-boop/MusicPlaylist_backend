
import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const logFile = "db_connection_test.log";

async function diagnose() {
    const uri = process.env.MONGO_URI;
    let log = `Timestamp: ${new Date().toISOString()}\n`;
    log += `URI Configured: ${uri ? "YES" : "NO"}\n`;

    if (!uri) {
        log += "ERROR: MONGO_URI is missing in .env file.\n";
        fs.writeFileSync(logFile, log);
        console.error("MONGO_URI missing");
        return;
    }

    // Mask password for safety in logs
    const maskedUri = uri.replace(/:([^:@]+)@/, ":****@");
    log += `Trying to connect to: ${maskedUri}\n`;

    try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        log += "SUCCESS: Connected to MongoDB successfully.\n";
        console.log("Connection successful");
    } catch (error) {
        log += "FAILURE: Could not connect to MongoDB.\n";
        log += `Error Name: ${error.name}\n`;
        log += `Error Code: ${error.code}\n`;
        log += `Error Message: ${error.message}\n`;

        if (error.reason) {
            log += `Reason: ${JSON.stringify(error.reason)}\n`;
        }

        if (error.code === 8000) {
            log += "\nDIAGNOSIS: Authentication Failed.\n";
            log += "Possible causes:\n";
            log += "1. Incorrect Username or Password in MONGO_URI.\n";
            log += "2. Your IP Address is not whitelisted in MongoDB Atlas Network Access.\n";
        } else if (error.name === 'MongooseServerSelectionError') {
            log += "\nDIAGNOSIS: Server Selection Error.\n";
            log += "Possible causes:\n";
            log += "1. No internet connection.\n";
            log += "2. IP Address not whitelisted.\n";
            log += "3. Firewall blocking port 27017.\n";
        }

        console.error("Connection failed. Check db_connection_test.log for details.");
    } finally {
        fs.writeFileSync(logFile, log);
        await mongoose.disconnect();
    }
}

diagnose();
