const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const app = express();
app.use(morgan('dev'));
app.use(cors());

// Serve static files from the correct path
app.use('/umla/dashboard', express.static(path.join(__dirname, 'frontend', 'build')));

// Catch-all route for the SPA
app.get('/umla/dashboard/*', (req, res) =>
	res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
);

const port = 3200;
app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});
