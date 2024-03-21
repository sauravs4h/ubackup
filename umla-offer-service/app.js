// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Import routes and utilities
const indexRouter = require('./routes/index.routes');
const connectDB = require('./utils/db/connectdb.utils');
const { Outlet, OutletMenu, TimeSlot } = require('./models/index.models');

// Load environment variables
dotenv.config();

// Create an instance of the Express application
const app = express();

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
// const createMenuItems = async (outlet) => {
// 	const menuItems = Array.from({ length: 4 }, (_, i) => ({
// 		outletId: outlet._id,
// 		name: `Item ${i + 1} for ${outlet.name}`,
// 		price: (i + 1) * 10, // example price
// 		nonVeg: false,
// 		status: 'active',
// 		earlyBird: true,
// 		// other fields...
// 	}));

// 	return OutletMenu.create(menuItems);
// };

// const createTimeSlots = async (outlet) => {
// 	const dates = ['22/10/2023', '23/10/2023', '24/10/2023'];
// 	const times = ['12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];

// 	const slots = dates.map((date) => ({
// 		date,
// 		time: times.map((timing) => ({
// 			timing,
// 			timeSlots: [
// 				{
// 					slotTime: `${timing.split(' ')[0]} - ${
// 						parseInt(timing.split(':')[0], 10) + 1
// 					}:10`,
// 					slotsLeft: 2,
// 				},
// 			],
// 		})),
// 	}));

// 	return TimeSlot.create({
// 		outletId: outlet._id,
// 		slots,
// 	});
// };

// const populateData = async () => {
// 	const outletData = [
// 		{ pid: '1', name: 'Outlet 1', earlyBird: true },
// 		{ pid: '2', name: 'Outlet 2', earlyBird: true },
// 		{ pid: '3', name: 'Outlet 3', earlyBird: true },
// 		// other fields...
// 	];

// 	const outlets = await Outlet.create(outletData);

// 	const earlyBirdOutlets = outlets.filter((outlet) => outlet.earlyBird);

// 	await Promise.all(
// 		earlyBirdOutlets.map(async (outlet) => {
// 			await Promise.all([
// 				createMenuItems(outlet),
// 				createTimeSlots(outlet),
// 			]);
// 		})
// 	);
// };

// Start the server
const PORT = process.env.OFFER_PORT || 3007;
const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI);
		// await populateData();
		app.listen(PORT, () => console.log(`offer-service on port ${PORT} :)`));
	} catch (error) {
		console.log(':(', error);
	}
};
start();
