const jwt = require('jsonwebtoken');
const { User } = require('../../models/index.models');
/**
 * The function `verifyToken` is a middleware function in JavaScript that verifies the authenticity of
 * a token and checks if the user is logged in.
 * @param req - The `req` parameter is the request object that contains information about the incoming
 * HTTP request, such as headers, query parameters, and request body. It is an object that is passed to
 * the middleware function by the Express framework.
 * @param res - The `res` parameter is the response object that is used to send the response back to
 * the client. It contains methods and properties that allow you to control the response, such as
 * setting the status code, sending JSON data, or redirecting the client to another URL.
 * @param next - The `next` parameter is a callback function that is used to pass control to the next
 * middleware function in the request-response cycle. It is typically used to move to the next
 * middleware function or to the final route handler.
 * @returns The function `verifyToken` returns a middleware function that takes in three parameters:
 * `req`, `res`, and `next`.
 */
const verifyToken = async (req, res, next) => {
	try {
		let token = req.header('Authorization');

		if (!token)
			return res.status(403).json({ error: 'You must be logged In.' });

		if (token.startsWith('Bearer ')) {
			token = token.replace('Bearer ', '');
		} else {
			return res.status(401).json({ error: { message: 'Wrong Token' } });
		}

		const verified = jwt.verify(token, process.env.JWT_SECRET);
		const user = User.findOne({
			_id: verified.id,
			deviceId: verified.deviceId,
		});
		if (!user) {
			return res.status(403).json({ error: 'You must be logged In.' });
		}
		req.user = verified;
		next();
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

module.exports = { verifyToken };
