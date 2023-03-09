const express = require('express');
const app = express();
const port = 3000;



// app.get('/api/holidays', (req, res) => {
//     const holidays = [
//         {
//             id: 1,
//             name: 'New Year Day'
//         },
//         {
//             id: 2,
//             name: 'Martin Luther King Jr. Day'
//         }
//     ];
//     res.json(holidays);
// });
// app.listen(3000, () => console.log('Server is running on port 3000'));


// app.post('/events', (req, res) => {
//     const { title, date, time } = req.body;
  
//     // TODO: Save the event to the database
  
//     res.status(201).send('Event created successfully');
//   });

app.use(express.json());

app.get('/events', (req, res) => {
  res.send(eventsArr);
});

app.post('/events', (req, res) => {
  const event = req.body;
  eventsArr.push(event);
  res.status(201).send('Event added');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});