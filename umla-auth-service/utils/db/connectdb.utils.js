const mongoose = require('mongoose');

mongoose.set('strictQuery', true);
const connectDB = async (url) => {
	mongoose
		.connect(url, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			retryWrites: false,
		})
		.then(() => console.log('Connection to CosmosDB successful'))
		.catch((err) => console.error(err));
};

module.exports = connectDB;
