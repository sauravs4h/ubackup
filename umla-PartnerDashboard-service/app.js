// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { createServer } = require('http');

// Import routes and utilities
const indexRouter = require('./routes/index.routes');
const connectDB = require('./utils/db/connectdb.utils');
const { handleEvent } = require('./controllers/index.controllers');

// Load environment variables
dotenv.config();

// Create an instance of the Express application
const app = express();
const httpServer = createServer(app);

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Parse incoming requests with JSON payloads
app.use(express.json());

// Parse incoming requests with JSON payloads and set a size limit
app.use(bodyParser.json({ limit: '30mb', extended: true }));

app.use((req, res, next) => {
	const originalJson = res.json;
	res.json = function (body) {
		res.locals.responseBody = body;
		originalJson.call(this, body);
	};
	next();
});

app.use((req, res, next) => {
	const originalSend = res.send;
	res.send = function (body) {
		res.locals.responseBody = body;
		originalSend.call(this, body);
	};
	next();
});

// logger
morgan.token('reqBody', (req, res) => {
	try {
		return JSON.parse(req.body);
	} catch (error) {
		return req.body;
	}
});

morgan.token('resBody', (req, res) => {
	try {
		return JSON.parse(res.locals.responseBody);
	} catch (error) {
		return res.locals.responseBody;
	}
});

morgan.token('request-headers', (req, res) => {
	try {
		return JSON.parse(req.headers);
	} catch (error) {
		return req.headers;
	}
});

const logFormat = (tokens, req, res) => {
	const statusValue = tokens.status(req, res);
	let statusString = `${statusValue} ❌`;
	if (statusValue === '200' || statusValue === '201') {
		statusString = `${statusValue} 🟢`;
	}
	return JSON.stringify(
		{
			date: new Date().toLocaleString('en-US', {
				timeZone: 'Asia/Kolkata',
			}),
			method: tokens.method(req, res),
			url: tokens.url(req, res),
			status: statusString,
			contentLength: tokens.res(req, res, 'content-length'),
			responseTime: `${tokens['response-time'](req, res)} ms`,
			requestHeaders: tokens['request-headers'](req, res),
			params: req.params,
			query: req.query,
			requestBody: tokens['reqBody'](req, res),
			responseBody: tokens['resBody'](req, res),
			_s: '——————————————————————————————————————————————————————————————————————————————————————————————————————————',
		},
		null,
		2
	).replace(/\\/g, '');
};

// Configure Morgan to use the custom formatting function
app.use(morgan(logFormat, { stream: process.stdout }));

//SET Global Variables
app.use(function (req, res, next) {
	res.locals.user = req.user || null;
	next();
});

// Define routes for the application
app.use('/api/v1/umla', indexRouter);

// SOCKET.io
const io = require('socket.io')(httpServer, { path: '/partnerSocket' });

const clients = {};

// Event listener for a new socket connection
io.on('connection', (socket) => {
	console.log('Connected:', socket.id);

	// Event listener for 'signin' event
	socket.on('signin', (id) => {
		if (typeof id === 'string') {
			console.log(`${id} has signed in`);
			// Store the socket associated with the user ID
			clients[id] = socket;
			console.log('Connected Clients:', Object.keys(clients));
		} else {
			console.error('Invalid signin request');
		}
	});

	socket.on('arrival', async (data) => {
		const { targetId, sourceId, couponId } = data;
		const response = await handleEvent(
			targetId,
			sourceId,
			couponId,
			'arrival'
		);
		console.log(response.pid);
		console.log(clients);

		clients[response.pid]?.emit('arrival', {
			refresh: true,
			arrival: response.latestArrival,
		});
		console.log(`Message forwarded to ${targetId}`);
	});
	socket.on('processOrder', async (data) => {
		const { targetId, sourceId, couponId } = data;
		const response = await handleEvent(
			targetId,
			sourceId,
			couponId,
			'process'
		);
		clients[response.pid]?.emit('process', {
			refresh: true,
			order: response.latestOrder,
		});
		console.log(`Message forwarded to ${targetId}`);
	});
	socket.on('alert', async (data) => {
		const { targetId, sourceId, couponId } = data;
		const response = await handleEvent(
			targetId,
			sourceId,
			couponId,
			'alert'
		);
		clients[response.pid]?.emit('alert', {
			refresh: true,
			alert: response.updatedArrival,
		});
		console.log(`Message forwarded to ${targetId}`);
	});

	// Event listener for 'disconnect' event
	socket.on('disconnect', () => {
		// Find the ID of the disconnected client
		const disconnectedClientId = Object.keys(clients).find(
			(id) => clients[id] === socket
		);

		if (disconnectedClientId) {
			console.log(`${disconnectedClientId} has disconnected`);
			// Remove the disconnected client from the clients object
			delete clients[disconnectedClientId];
			console.log('Connected Clients:', Object.keys(clients));
		}
	});
});

// Start the server
const PORT = process.env.PARTNER_DASHBOARD_SRV || 3010;
const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI);
		httpServer.listen(PORT, '0.0.0.0', () =>
			console.log(`partnerdashboard-service on port ${PORT} :)`)
		);
	} catch (error) {
		console.log(':(', error);
	}
};
start();
