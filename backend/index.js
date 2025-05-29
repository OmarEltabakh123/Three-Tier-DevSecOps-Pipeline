const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection parameters from environment variables or defaults
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || 'moora';
const DB_HOST = process.env.DB_HOST || 'mymongo';  // اسم الخدمة في الكلاستر
const DB_PORT = process.env.DB_PORT || '27017';
const DB_NAME = process.env.DB_NAME || 'manga';

// بناء رابط الاتصال مع MongoDB
const mongoURL = process.env.DATABASE_URL || `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Example API endpoint
app.get('/', (req, res) => {
  res.send('Hello from Node.js Backend!');
});

// Example data endpoint
app.get('/api/data', async (req, res) => {
  try {
    const data = await mongoose.connection.db.collection('items').find().toArray();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
