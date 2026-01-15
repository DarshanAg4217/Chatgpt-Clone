const userModel = require('../models/auth.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



const registerAuth = async (req, res) => {

    try {
        const { firstname, lastname, email, password } = req.body;
        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new userModel({
            fullname: { firstname, lastname },
            email,
            password: await bcrypt.hash(password, 10)
        });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.cookie('token', token)

        res.status(201).json({ message: 'User registered successfully', user, token });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }

}

const loginAuth = async (req, res) => {
    // Login logic here

    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: 'User does not exist' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

    res.cookie('token', token)


    res.status(200).json({ message: 'User logged in successfully', user, token });
}


module.exports = {
    registerAuth,
    loginAuth
};