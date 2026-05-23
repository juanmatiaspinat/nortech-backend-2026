const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                error: "Unauthorized",
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                error: "Unauthorized",
            });
        }

        const decoded = jwt.decode(token);

        if (!decoded) {
            return res.status(401).json({
                error: "Token inválido",
            });
        }

        req.user = {
            id: decoded.sub,
            email: decoded.email,
        };

        next();
    } catch (error) {
        console.log("ERROR AUTH:", error);

        return res.status(500).json({
            error: "Error interno del servidor",
        });
    }
};

module.exports = authenticate;
