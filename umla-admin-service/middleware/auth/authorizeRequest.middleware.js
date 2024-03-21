require('dotenv').config();
const jwt = require('jsonwebtoken');

const authorizeRequest = async (req, res, next) => {
	try {
		let token = req.header('Authorization');

		if (!token)
			return res.status(403).json({ error: 'You must be logged In.' });

		if (token.startsWith('Bearer ')) {
			token = token.replace('Bearer ', '');
		} else {
			return res.status(401).json({ error: { message: 'Wrong Token' } });
		}
		const roles = ['owner', 'admin', 'sub-admin'];
		const verified = jwt.verify(token, process.env.JWT_SECRET);

		const issuedAt = verified.iat * 1000; // Convert seconds to milliseconds
		const validIssuedAt = new Date("2024-02-15:00:00.000Z").getTime(); // Convert to milliseconds

		console.log("......issuedAt",issuedAt);
		console.log("......validIssuedAt",validIssuedAt);



		if (issuedAt < validIssuedAt) {
			return res
				.status(401)
				.json({
					error: "Token is no longer valid. Please log in again.",
				});
		}


		if (!roles.includes(verified.role)) {
			return res.status(401).json({ error: { message: 'Wrong Token' } });
		}
		req.user = verified;
		next();
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

module.exports = { authorizeRequest };
