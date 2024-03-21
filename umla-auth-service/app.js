/* The code is importing necessary modules and files for the application. */
// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Import routes and utilities
const indexRouter = require('./routes/index.routes');
const { connectDB } = require('./utils/index.utils');

// Load environment variables
/* `dotenv.config();` is a function call that loads environment variables from a `.env` file into the
application's process.env object. The `.env` file contains key-value pairs of environment variables
that the application needs to run. By calling `dotenv.config()`, the application reads the `.env`
file and sets the environment variables, making them accessible throughout the application. */
dotenv.config();

// Create an instance of the Express application
/* The code is setting up an Express application and configuring it to enable Cross-Origin Resource
Sharing (CORS) and parse incoming requests with JSON payloads. */
const app = express();

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Parse incoming requests with JSON payloads
app.use(express.json());

// Parse incoming requests with JSON payloads and set a size limit
app.use(bodyParser.json({ limit: '30mb', extended: true }));

/* The code `app.use((req, res, next) => { ... })` is defining a middleware function that intercepts
the response object's `json` method. */
app.use((req, res, next) => {
	const originalJson = res.json;
	res.json = function (body) {
		res.locals.responseBody = body;
		originalJson.call(this, body);
	};
	next();
});

/* The code `app.use((req, res, next) => { ... })` is defining a middleware function that intercepts
the response object's `send` method. */
app.use((req, res, next) => {
	const originalSend = res.send;
	res.send = function (body) {
		res.locals.responseBody = body;
		originalSend.call(this, body);
	};
	next();
});

// logger
/* The code `morgan.token('reqBody', (req, res) => { ... })` is defining a custom token for the Morgan
logger. */
morgan.token('reqBody', (req, res) => {
	try {
		return JSON.parse(req.body);
	} catch (error) {
		return req.body;
	}
});

/* The code `morgan.token('resBody', (req, res) => { ... })` is defining a custom token for the Morgan
logger. This token is used to log the response body in the log output. */
morgan.token('resBody', (req, res) => {
	try {
		return JSON.parse(res.locals.responseBody);
	} catch (error) {
		return res.locals.responseBody;
	}
});

/* The code `morgan.token('request-headers', (req, res) => { ... })` is defining a custom token for the
Morgan logger. This token is used to log the request headers in the log output. */
morgan.token('request-headers', (req, res) => {
	try {
		return JSON.parse(req.headers);
	} catch (error) {
		return req.headers;
	}
});

/**
 * The function `logFormat` formats log data for a JavaScript application, including the date, method,
 * URL, status, content length, response time, request headers, parameters, query, request body, and
 * response body.
 * @param tokens - The `tokens` parameter is an object that contains various functions for extracting
 * information from the request and response objects. These functions are used to generate the log
 * format.
 * @param req - The `req` parameter represents the HTTP request object. It contains information about
 * the incoming request such as the request method, URL, headers, parameters, and query parameters.
 * @param res - The `res` parameter is an object that represents the HTTP response. It contains
 * information about the response such as the status code, headers, and body.
 * @returns The function `logFormat` returns a formatted JSON string representing the log information.
 */
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
/* The code `app.use(morgan(logFormat, { stream: process.stdout }));` is configuring the Morgan logger
middleware for the Express application. */
app.use(morgan(logFormat, { stream: process.stdout }));

//SET Global Variables
/* The code `app.use(function (req, res, next) {
	res.locals.user = req.user || null;
	next();
});` is defining a middleware function that sets the `res.locals.user` variable to the value of
`req.user` or `null`. */
app.use(function (req, res, next) {
	res.locals.user = req.user || null;
	next();
});

// Define routes for the application
app.use('/api/v1/umla', indexRouter);

// Start the server
/* This code is starting the server for the application. */
const PORT = process.env.AUTH_PORT || 3000;
const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI);
		app.listen(PORT, () => console.log(`auth-service on port ${PORT} :)`));
	} catch (error) {
		console.log(':(', error);
	}
};
start();
