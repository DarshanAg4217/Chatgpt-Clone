const userModel = require('../models/auth.model');
const jwt = require('jsonwebtoken');




const authUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

}

module.exports = {
    authUser
};