const express = require('express');
const cors = require('cors');
const path = require('path');
const stocksRoutes = require('./routes/stockRoutes');

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/stocks', stocksRoutes);

// //Default route
app.get('/test', (req, res) => {
  // res.send('Hello, World!');
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// app.get('/:page', (req, res) => {
//   const page = req.params.page;
//   const filePath = path.join(__dirname, 'public', `${page}.html`);

//   res.sendFile(filePath, (err) => {
//       if (err) {
//           // res.status(404).send('<h1>404 - Page Not Found</h1>');
//           res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
//       }
//   });
// });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});