import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './app/config';

let server: Server;

main();

async function main() {
    try {
        await mongoose.connect(config.db_uri as string);
        server = app.listen(config.port, () => {
            console.log(`App is running on port ${config.port}`);
        });
    } catch (error) {
        console.log(error);
    }
}

// handle unhandled rejection
process.on('unhandledRejection', () => {
    console.log(
        '🥸 unhandledRejection is detected. Shutting down the server...',
    );

    if (server) {
        server.close(() => {
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
});

// handle uncaught exception
process.on('uncaughtException', () => {
    console.log(
        '🤬 uncaughtException is detected. Shutting down the server...',
    );

    process.exit(1);
});
