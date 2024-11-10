import jwt from 'jsonwebtoken';

const authorizationRequired = "Authorization required";
const invalidCredentials = "Invalid credentials";

const auth = (req, res, next) => {
    if (!req.headers.authorization) {
        res.statusMessage = authorizationRequired;
        return res.status(401).json({ message: authorizationRequired });
    }

    try {
        const token = req.headers.authorization.split(' ')[1];
        console.log('Token:', token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log('Decoded:', decoded);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Error verifying token:', err);
        res.statusMessage = invalidCredentials;
        return res.status(403).json({ message: invalidCredentials });
    }
};

export { auth };
