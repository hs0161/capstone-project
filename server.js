const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3001;
   
const pool = new Pool({
  connectionString: 'postgresql://hs0161:v2_426fh_HC2FGcLXcfhKQN2CXJmGiqG@db.bit.io:5432/hs0161/timely-app',
  ssl: true,
});

// Add headers before the routes are defined
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:3001');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/events', async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query(`
    SELECT * FROM "events"
    WHERE title IS NOT NULL
    AND date_from IS NOT NULL
    AND date_to IS NOT NULL`);
    const events = result.rows;
    res.json(events);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  } finally {
    client.release();
  }
});

app.post('/events', async (req, res) => {
  console.log('WE ARE IN /EVENTS!!!!')
  const eventData = req.body;
  // console.log(`request: `, req)
  console.log(req.body);
  const client = await pool.connect();

  try {
    const result = await client.query(
      'INSERT INTO events (title, date_from, date_to) VALUES ($1, $2, $3) RETURNING *',
      [eventData.title, eventData.dateFrom, eventData.dateTo]
    );

    const newEvent = result.rows[0];
    res.json(newEvent);
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  } finally {
    client?.release();
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});