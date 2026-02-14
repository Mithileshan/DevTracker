import dotenv from 'dotenv';
import { createApp } from '@/app';
import { connectDB } from '@/config/database';
import { log } from '@/config/logger';

dotenv.config();

const start = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Create Express app
    const app = createApp();

    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      log.info(`Server running on port ${PORT}`);
      log.info(`Swagger docs available at http://localhost:${PORT}/api/docs`);
    });
  } catch (error) {
    log.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
