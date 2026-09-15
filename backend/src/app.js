const express = require('express');
const cors = require('cors'); // <-- Enables connection communication
const movieRoutes = require('./routes/movieRoutes'); // Adjust if your folder structure differs

const app = express();

// This middleware tells the backend it is safe to accept data requests from your Vite frontend
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// A base test route to ensure your backend can be hit directly
app.get('/', (req, res) => { res.send('Backend is running and accessible!');});

// Your movie endpoint routes hook
app.use('/api/movies', movieRoutes);

module.exports = app;