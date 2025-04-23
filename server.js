const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/dbConfig');
const morganMiddleware = require('./src/middlewares/morgan');
const rateLimitMiddleware = require('./src/middlewares/rateLimit');
const corsMiddleware = require('./src/middlewares/cors');
const securityHeaders = require('./src/middlewares/securityHeaders');
const authRoute = require('./src/routes/authRoute');
const taskRoute = require('./src/routes/taskRoute'); 
const cookieParser = require('cookie-parser');
const app = express();

dotenv.config();
connectDB();

app.set('trust proxy', 1);
app.use(express.json()); 
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(morganMiddleware);
app.use(corsMiddleware);

// Preflight CORS middleware for handling OPTIONS requests
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins or specify a domain
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).json({});
  }
  next();
});

app.use('/api', authRoute); 
app.use('/api', taskRoute); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
