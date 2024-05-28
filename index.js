const express = require("express");
const multer = require('multer');
var fs = require('fs');
const cors = require("cors");
require('./db/config');
const User = require('./model/user');

const jwt = require("jsonwebtoken");
const jwtKey = "growmart";

const app = express();
var upload = multer({ dest: 'profile/' });

app.use(express.json());
app.use(cors());
app.use('/profile', express.static('profile'));

app.post("/api/register", async (req, res) => {
	const user = new User(req.body);
	let result = await user.save();
	result = result.toObject();
	delete result.password;
	jwt.sign({ email: req.body.email }, jwtKey, { expiresIn: "2h" }, (error, token) => {
		if (error) {
			res.status(402).send({ message: "Something went wrong. Please try again after some time" });
		} else {
			result["token"] = token;
			res.status(200).send({ status: 200, message: "Register successfully", data: result });
		}
	});
});

app.post("/api/login", async (req, res) => {
	if (req.body.email && req.body.password) {
		let user = await User.findOne(req.body).select("-password");
		if (user) {
			jwt.sign({ email: req.body.email }, jwtKey, { expiresIn: "2h" }, (error, token) => {
				if (error) {
					res.status(402).send({ message: "Something went wrong. Please try again after some time" });
				} else {
					user = user.toObject();
					user.token = token;
					res.status(200).send({ status: 200, message: "Login successfully", data: user });
				}
			});

		} else {
			res.status(403).send({ message: "No record found" });
		}
	} else {
		res.status(422).send({ message: "Email or Password are missing" });
	}
});

function verifyToken(req, res, next) {
	let token = req.headers['authorization'];
	if (token) {
		token = token.split(' ')[1];
		jwt.verify(token, jwtKey, (error, success) => {
			if (error) {
				res.status(406).send({ message: "Provide valid token" });
			} else {
				next();
			}
		});
	} else {
		res.status(401).send({ message: "Authorize with token" });
	}
}

app.post("/api/changePassword", verifyToken, async (req, res) => {
	let user = await User.findOne({ "email": req.body.email, "password": req.body.old_password });
	if (user) {

		let result = await User.updateOne(
			{
				email: req.body.email
			},
			{
				$set: { password: req.body.new_password }
			}
		)
		if (result.acknowledged && result.modifiedCount == 1) {
			res.status(200).send({ status: 200, message: "Password changed successfully" });
		} else {
			res.status(403).send({ message: "Password not changed" });
		}

	} else {
		res.status(403).send({ message: "Incorrect current password" });
	}
});

app.post("/api/updateProfile", verifyToken, async (req, res) => {
	const result = await User.findOneAndUpdate(
		{ email: req.body.email },
		{ $set: { mobile: req.body.mobile, state: req.body.state, city: req.body.city, address: req.body.address, pin: req.body.pin } },
		{ new: true }
	);
	res.status(200).send({ status: 200, message: "Profile updated successfully", data: result });
});

app.post("/api/uploadPhoto", verifyToken, upload.single('file'), async (req, res) => {
	const baseUrl = req.protocol + '://' + req.get('host');
	var tmp_path = req.file.path;
	var target_path = 'profile/' + req.body.email + '_profile.png';

	var src = fs.createReadStream(tmp_path);
	var dest = fs.createWriteStream(target_path);
	src.pipe(dest);
	src.on('end', async () => {
		var photoUrl = baseUrl + '/' + target_path;
		const result = await User.findOneAndUpdate(
			{ email: req.body.email },
			{ $set: { profile: photoUrl } },
			{ new: true }
		);
		res.status(200).send({ status: 200, message: "Pic Upload successfully", data: result });
	});
	src.on('error', function (err) {
		res.status(403).send({ message: "Pic not upload" });
	});
});

app.listen(8000);