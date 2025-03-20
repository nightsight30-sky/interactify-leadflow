
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const leadRoutes = require('./routes/leadRoutes');
const emailRoutes = require('./routes/emailRoutes');
require('dotenv').config();

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/leads', leadRoutes);
app.use('/api/emails', emailRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// For development with Vite proxy
if (process.env.NODE_ENV === 'development') {
  const { createServer } = require('vite');
  
  async function startViteDevServer() {
    const vite = await createServer({
      server: {
        proxy: {
          '/api': {
            target: `http://localhost:${PORT}`,
            changeOrigin: true,
          },
        },
      },
    });
    
    await vite.listen();
    console.log(`Vite dev server started at ${vite.config.server.https ? 'https' : 'http'}://localhost:${vite.config.server.port}`);
  }
  
  startViteDevServer().catch(console.error);
}

module.exports = app;
