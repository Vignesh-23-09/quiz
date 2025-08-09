const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');

const app = express();
app.use(cors());
app.use(express.json());

// Dedicated health check route
app.get('/health', (req, res) => {
  res.send('Backend is healthy');
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);

// Serve frontend in production from repo root (parent of backend)
if (process.env.NODE_ENV === 'production') {
  const publicDir = path.join(__dirname, '..');
  app.use(express.static(publicDir));

  // Fallback to SPA entrypoint
  app.get('*', (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
  });
}

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected');
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log('Server running on port', port);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
