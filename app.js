const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const indexRouter = require('./routes/index');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use((req, res) => {
  res.status(404).render('index');
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ status: 'error', message: 'Internal server error.' });
});

const server = app.listen(PORT, () => {
  console.log(`Portfolio server is running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is in use. Retrying in 3 seconds...`);
    setTimeout(() => {
      server.close();
      app.listen(PORT, () => {
        console.log(`Portfolio server is running on http://localhost:${PORT}`);
      });
    }, 3000);
  } else {
    console.error('Server error:', err.message);
  }
});

process.on('uncaughtException', (err) => {
  if (err.code === 'EADDRINUSE') return;
  console.error('Uncaught exception:', err.message);
});

process.on('unhandledRejection', (err) => {
  if (err.code === 'EADDRINUSE') return;
  console.error('Unhandled rejection:', err.message);
});

module.exports = app;