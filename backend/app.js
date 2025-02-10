const cors = require('cors');

// Update CORS configuration to allow both ports
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Add OPTIONS handling for preflight requests
app.options('*', cors()); 