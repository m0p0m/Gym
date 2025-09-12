import express, { Request, Response } from 'express';
import config from './config';
import connectDB from './database/connection';
import authRoutes from './api/routes/auth.routes';

const app = express();
const port = config.port;

// Connect to Database
connectDB();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);

// Basic Route for testing
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Gym Management API!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app; // Export for testing purposes
