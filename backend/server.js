const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for configs
const configs = {
  development: {
    DATABASE_URL: 'localhost:5432',
    API_PORT: '3000',
    DEBUG: 'true'
  },
  testing: {
    DATABASE_URL: 'test-db:5432',
    API_PORT: '3001',
    DEBUG: 'false'
  },
  production: {
    DATABASE_URL: 'prod-db:5432',
    API_PORT: '5000',
    DEBUG: 'false'
  }
};

// GET configs for a specific environment
app.get('/configs/:environment', (req, res) => {
  const { environment } = req.params;
  
  if (!configs[environment]) {
    return res.status(404).json({ error: `Environment '${environment}' not found` });
  }
  
  res.json({
    environment,
    configs: configs[environment]
  });
});

// GET all environments
app.get('/environments', (req, res) => {
  res.json({
    environments: Object.keys(configs)
  });
});

// POST new config key/value
app.post('/configs/:environment', (req, res) => {
  const { environment } = req.params;
  const { key, value } = req.body;
  
  if (!configs[environment]) {
    return res.status(404).json({ error: `Environment '${environment}' not found` });
  }
  
  if (!key || !value) {
    return res.status(400).json({ error: 'Key and value are required' });
  }
  
  configs[environment][key] = value;
  
  res.status(201).json({
    message: 'Config added successfully',
    environment,
    configs: configs[environment]
  });
});

// DELETE config
app.delete('/configs/:environment/:key', (req, res) => {
  const { environment, key } = req.params;
  
  if (!configs[environment]) {
    return res.status(404).json({ error: `Environment '${environment}' not found` });
  }
  
  if (!configs[environment][key]) {
    return res.status(404).json({ error: `Key '${key}' not found in ${environment}` });
  }
  
  delete configs[environment][key];
  
  res.json({
    message: 'Config deleted successfully',
    environment,
    configs: configs[environment]
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});