import express, { Application } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';

dotenv.config();

connectDB();

const app: Application = express();
const cors = require('cors');

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
}));
app.use('/api/auth', require('./routes/authRoutes').default);
app.use('/api/admin', require('./routes/adminRoutes').default);
app.use('/api/user', require('./routes/userRoutes').default);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
