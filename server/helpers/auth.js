import jwt from 'jsonwebtoken';

const authorizationRequired = "Authorization required";
const invalidCredentials = "Invalid credentials";

const auth = (req, res, next) => {
    if (!req.headers.authorization) {
        res.statusMessage = authorizationRequired;
        return res.status(401).json({ message: authorizationRequired });
    }

    try {
        const token = req.headers.authorization.split(' ')[1]; // Assuming 'Bearer <token>'
        jwt.verify(token, process.env.JWT_SECRET_KEY);
        next();
    } catch (err) {
        res.statusMessage = invalidCredentials;
        return res.status(403).json({ message: invalidCredentials });
    }
};

export { auth };
