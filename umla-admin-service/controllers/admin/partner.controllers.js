const { PartnerAdmin, Partner } = require('../../models/index.models');
const bcrypt = require('bcrypt');

const registerAdmin = async (req, res) => {
	const { name, email } = req.body;
	try {
		const password = `umla@${name}`;
		const salt = await bcrypt.genSalt();
		const passwordHash = await bcrypt.hash(password, salt);

		const newPartnerAdmin = new PartnerAdmin({
			name,
			email,
			password: passwordHash,
		});
		const savedPAdmin = await newPartnerAdmin.save();
		res.status(201).json({
			data: {
				name: savedPAdmin.name,
				email: savedPAdmin.email,
				password: password,
			},
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: err.message });
	}
};

module.exports = { registerAdmin };
