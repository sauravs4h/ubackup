# Package.json File Overview

This is a `package.json` file for a Node.js project named "auth-service". It contains metadata about the project and its dependencies.

## Main Fields

-   `"name": "auth-service"`: The name of the project.
-   `"version": "1.0.0"`: The current version of the project.
-   `"main": "app.js"`: The entry point to the project.
-   `"scripts"`: Scripts that can be run from the command line using npm.

## Scripts

-   `"start": "node app.js"`: Starts the application using Node.js.
-   `"dev": "nodemon app.js"`: Starts the application in development mode with nodemon, which will automatically restart the server whenever changes are made to the code.

## Dependencies

These are the libraries that your project depends on:

-   `axios`: Promise based HTTP client for the browser and node.js.
-   `body-parser`: Parse incoming request bodies in a middleware before your handlers.
-   `cors`: Middleware that can be used to enable CORS with various options.
-   `dotenv`: Loads environment variables from a `.env` file into `process.env`.
-   `express`: Fast, unopinionated, minimalist web framework for node.
-   `googleapis`: Google's officially supported Node.js client library for accessing Google APIs.
-   `jsonwebtoken`: An implementation of JSON Web Tokens.
-   `mongoose`: MongoDB object modeling tool designed to work in an asynchronous environment.
-   `morgan`: HTTP request logger middleware for node.js.
-   `node-schedule`: A cron-like and not-cron-like job scheduler for Node.
-   `redis`: A complete and feature-rich Redis client for Node.js.

## Dev Dependencies

These are the libraries that are only needed during development:

-   `nodemon`: A utility that will monitor for any changes in your source and automatically restart your server.

# Code Flow Documentation

## Function: sendOtp

This function is an asynchronous function named `sendOtp` which is used to generate and send a One-Time Password (OTP) to a user's contact number.

### Parameters

-   `req`: The request object from the client.
-   `res`: The response object to be sent back to the client.

### Code Flow

1. **Extract Contact Number**: The function begins by extracting the `contactNumber` from the request body.

```javascript
const { contactNumber } = req.body;
```

2. **Check for Contact Number**: If no `contactNumber` is provided, the function will return a JSON response with a status of 200 and a message asking for the `contactNumber`.

```javascript
if (!contactNumber) {
	return res.status(200).json({ message: 'Please provide contactNumber' });
}
```

3. **Generate OTP**: If a `contactNumber` is provided, the function generates a random OTP between 1000 and 9999.

```javascript
const otp = Math.floor(Math.random() * 9000) + 1000;
```

4. **Store OTP in Redis**: The generated OTP is then stored in a Redis database with the `contactNumber` as the key and a default expiration time.

```javascript
redisClient.setEx(
	`${contactNumber}`,
	DEFAULT_EXPIRATION,
	JSON.stringify({ data })
);
```

5. **Prepare Message Options**: The function then prepares the options for the OTP message to be sent via MSG91 API. This includes method type, URL, headers, and data (template_id, sender, short_url, mobiles, var1).

```javascript
const options = {
	//...
};
```

6. **Send OTP**: The function sends the OTP using the MSG91 API and waits for the response.

```javascript
const msgCall = await axios.request(options);
```

7. **Check Response**: If the API call is successful (status 200), it returns a JSON response with a success message. If not, it returns an error message.

```javascript
if (msgCall.status === 200) {
	//...
} else {
	//...
}
```

8. **Error Handling**: If any error occurs during the process, it is caught and logged in the console. A JSON response with status 500 and the error message is returned.

```javascript
catch (err) {
 console.error(err);
 res.status(500).json({ success: false, message: err.message });
}
```

This function ensures that an OTP is generated and sent to the provided contact number, and appropriate responses are sent based on the success or failure of the operation.

## Function: verifyOtp

This function is an asynchronous function named `verifyOtp` which is used to verify the One-Time Password (OTP) sent to a user's contact number.

### Parameters

-   `req`: The request object from the client.
-   `res`: The response object to be sent back to the client.

### Code Flow

1. **Extract Contact Number, OTP and Device ID**: The function begins by extracting the `contactNumber`, `otp` and `deviceId` from the request body.

```javascript
const { contactNumber, otp, deviceId } = req.body;
```

2. **Get OTP from Redis**: The function retrieves the OTP stored in Redis using the `contactNumber` as the key.

```javascript
const redisCache = await redisClient.get(`${contactNumber}`);
```

3. **Check for OTP**: If no OTP is found in Redis, the function will return a JSON response with a status of 401 and a message asking the user to request OTP again.

```javascript
if (!redisCache) {
	return res
		.status(401)
		.json({ success: false, message: 'please request OTP again' });
}
```

4. **Verify OTP**: If an OTP is found, it checks if the provided OTP matches the one stored in Redis. If not, it returns a JSON response with a status of 401 and a message indicating that the OTP is invalid.

```javascript
const cache = JSON.parse(redisCache);
if (!(otp === cache.data.otp)) {
	return res.status(401).json({ success: false, message: 'Invalid OTP' });
}
```

5. **Find User**: The function then tries to find a user with the provided `contactNumber` in the database.

```javascript
const user = await User.findOne({ contactNumber: contactNumber });
```

6. **Check for User**: If no user is found, it generates a unique referral code and creates a new user with the provided `contactNumber` and `deviceId`, and the generated referral code.

```javascript
if (!user) {
	//...
	const newUser = new User({
		contactNumber: contactNumber,
		deviceId: deviceId,
		referralCode: newCode,
		earlyBird: userCount > 500 ? false : true,
	});
	//...
}
```

7. **Generate JWT Token**: The function then generates a JWT token using the user's `_id` and `deviceId`.

```javascript
const token = jwt.sign({ id: data._id, deviceId }, process.env.JWT_SECRET, {
	expiresIn: '1y',
});
```

8. **Delete OTP from Redis**: The OTP is then deleted from Redis.

```javascript
redisClient.del(`${contactNumber}`);
```

9. **Return Response**: Finally, the function returns a JSON response with a status of 200, a success message, and the generated token and user data.

```javascript
return res.status(200).json({
	success: true,
	message: 'OTP verification successful',
	data: {
		token,
		user: data,
		existingUser: false,
		profileDataCompleted: data.completed,
	},
});
```

10. **Error Handling**: If any error occurs during the process, it is caught and logged in the console. A JSON response with status 500 and the error message is returned.

```javascript
catch (err) {
 console.error(err);
 res.status(500).json({ success: false, message: err.message });
}
```

This function ensures that an OTP is verified and appropriate responses are sent based on the success or failure of the operation.

## Function: verifyToken

This function is an asynchronous function named `verifyToken` which is used to verify the JWT token sent in the request header.

### Parameters

-   `req`: The request object from the client.
-   `res`: The response object to be sent back to the client.
-   `next`: The next middleware function in the Express.js routing process.

### Code Flow

1. **Extract Token**: The function begins by extracting the JWT token from the 'Authorization' header of the request.

```javascript
let token = req.header('Authorization');
```

2. **Check for Token**: If no token is found, the function will return a JSON response with a status of 403 and a message indicating that the user must be logged in.

```javascript
if (!token) return res.status(403).json({ error: 'You must be logged In.' });
```

3. **Verify Bearer Token**: If a token is found, it checks if the token starts with 'Bearer '. If it does, it removes 'Bearer ' from the token. If not, it returns a JSON response with a status of 401 and a message indicating that the token is wrong.

```javascript
if (token.startsWith('Bearer ')) {
	token = token.replace('Bearer ', '');
} else {
	return res.status(401).json({ error: { message: 'Wrong Token' } });
}
```

4. **Verify JWT Token**: The function then verifies the JWT token using the secret key stored in environment variables.

```javascript
const verified = jwt.verify(token, process.env.JWT_SECRET);
```

5. **Find User**: The function tries to find a user with the `_id` and `deviceId` extracted from the verified token.

```javascript
const user = User.findOne({
	_id: verified.id,
	deviceId: verified.deviceId,
});
```

6. **Check for User**: If no user is found, it returns a JSON response with a status of 403 and a message indicating that the user must be logged in.

```javascript
if (!user) {
	return res.status(403).json({ error: 'You must be logged In.' });
}
```

7. **Set Request User**: If a user is found, it sets `req.user` to the verified token and calls the next middleware function.

```javascript
req.user = verified;
next();
```

8. **Error Handling**: If any error occurs during the process, it is caught and a JSON response with status 500 and the error message is returned.

```javascript
catch (error) {
 res.status(500).json({ error: error.message });
}
```

This function ensures that a JWT token is verified and appropriate responses are sent based on the success or failure of the operation.


The `validateRequest` function is an asynchronous function used to validate a user request. Here's an overview of its functionality:

- It expects `id` and `deviceId` parameters from the `req.user` object.
- It attempts to find a user in the database based on the provided `id` and `deviceId` using `User.findOne()` method.
- If no user is found, it returns a 403 status code with an error message indicating that the user must be logged in.
- If a user is found, it returns a 200 status code with a JSON response indicating successful verification and includes the user's ID.
- If any error occurs during the process, it logs the error and returns a 500 status code with an error message in the response.

However, there's a missing `await` keyword before the `User.findOne()` call. Without `await`, the function will not wait for the database query to complete before moving to the next line, potentially leading to incorrect behavior. The corrected version should include `await` as follows:

```javascript
const validateRequest = async (req, res) => {
    try {
        const { id, deviceId } = req.user;
        const user = await User.findOne({ _id: id, deviceId });
        if (!user) {
            return res.status(403).json({ error: 'You must be logged In.' });
        }
        res.status(200).json({ verification: 'Success', id });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};
```

With this correction, the function properly awaits the result of the `User.findOne()` call before proceeding, ensuring correct validation behavior.
