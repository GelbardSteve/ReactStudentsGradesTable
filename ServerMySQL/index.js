const fs = require('node:fs');
const path = require('node:path');
const mysql = require('mysql2');
const express = require('express');
const app = express();
const cors = require('cors');
const getFunc = require('./exportsFunctions');
const createRequireAdmin = require('./middleware/requireAdmin');
const mountAi = require('./ai');

// Load local env vars (DB credentials) from .env if present; see .env.example
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  process.loadEnvFile(envPath);
}

if (!process.env.DB_PASSWORD) {
  console.error('Missing DB_PASSWORD. Copy .env.example to .env and fill it in.');
  process.exit(1);
}

// A pool reconnects automatically if MySQL drops an idle connection
const mysqlConnection = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'stevegel_students',
  connectionLimit: 10,
});
const requireAdmin = createRequireAdmin(mysqlConnection);

app.use(cors());
// Before express.json(): the assistant parses its own, larger request bodies
mountAi(app, mysqlConnection, requireAdmin);
app.use(express.json());

mysqlConnection.query('SELECT 1', (err) => {
  if (err) {
    console.error('DB connect error:', err);
    return;
  }
  console.log('DB Connected');
});

const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => console.log(`Express server is running on port ${PORT}`));

getFunc.auth(app, mysqlConnection, requireAdmin);
getFunc.classes(app, mysqlConnection, requireAdmin);
getFunc.students(app, mysqlConnection, requireAdmin);
