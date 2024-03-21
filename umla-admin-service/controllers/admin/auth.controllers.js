const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Admin } = require('../../models/index.models');
//REGISTER USER
const register = async (req, res) => {
	try {
		const { name, email, password, role } = req.body;

		const salt = await bcrypt.genSalt();
		const passwordHash = await bcrypt.hash(password, salt);

		const newUser = new Admin({
			name,
			email,
			password: passwordHash,
			role,
		});
		const savedUser = await newUser.save();
		res.status(201).json({
			data: {
				name: savedUser.name,
				email: savedUser.email,
				role: savedUser.role,
			},
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};


const changeAdminPassword=async(req,res)=>{

	try {
		const {email,password}= req.body;
		const salt = await bcrypt.genSalt();
		const passwordHash = await bcrypt.hash(password, salt);

		let adminUser= await Admin.findOne({email:email});

		if(adminUser){
			adminUser.password=passwordHash;
			await adminUser.save();

			res.status(200).json({message:"password changed",status:"success"});
		}else{
			res.status(400).json({message:"Admin not found",status:"fail"});

		}

		
	} catch (error) {
		res.status(500).json({ error: error.message });
	}

}

//LOGGING IN
const login = async (req, res) => {
	try {
		const user = await Admin.findOne({ email: req.body.email });
		if (!user) return res.status(400).json({ msg: 'User does not exist' });

		const isMatch = await bcrypt.compare(req.body.password, user.password);
		if (!isMatch)
			return res.status(400).json({ msg: ' Invalid credentials.' });

		const token = jwt.sign(
			{ id: user._id, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: '1y' }
		);
		res.status(200).json({
			token,
			user: {
				name: user.name,
				email: user.email,
				role: user.role,
			},
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Logout
const logout = async (req, res) => {
	const authHeader = req.headers.authorization;
	try {
		jwt.sign(authHeader, '', { expiresIn: 1 }, (logout, err) => {
			if (logout) {
				res.send({ msg: 'You have been Logged Out' });
			} else {
				res.send({ msg: 'Error' });
			}
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

module.exports = { login, register, logout,changeAdminPassword };
