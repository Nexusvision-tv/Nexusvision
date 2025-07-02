const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // Token is expected to be in the format: "Bearer [TOKEN]"
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ message: 'No token provided. Access denied.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            // This will catch expired tokens or invalid signatures
            return res.status(403).json({ message: 'Token is not valid. Access denied.' });
        }
        
        // Attach user payload to the request object for use in protected routes
        req.user = user;
        next(); // If token is valid, proceed to the next middleware/route handler
    });
};

module.exports = authMiddleware;
