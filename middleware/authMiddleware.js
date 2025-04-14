import jwt from 'jsonwebtoken';

const authMiddleware = (requiredRoles) => {
    return (req, res, next) => {
        console.log('Authorization Header:', req.headers.authorization);
        try {
            // Get token from headers
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({
                    status: false,
                    message: 'Unauthorized. Token is missing.',
                });
            }

            // verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Decoded Token:', decoded);
            req.user = decoded;

            // Check role authorization
            if (!requiredRoles.includes(decoded.role)) {
                return res.status(403).json({
                    status: false,
                    message: 'Access denied. Insufficient permissions.',
                });
            }

            next();
        } catch (err) {
            console.error('Authentication error:', err.message);

            // Handle token verification failure
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({
                    status: false,
                    message: 'Session expired. Please log in again.',
                });
            } else if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    status: false,
                    message: 'Invalid token. Please log in again.',
                });
            } else {
                return res.status(500).json({
                    status: false,
                    message: 'Internal server error.',
                    error: err.message,
                });
            }
        }
    };
};

export default authMiddleware;
