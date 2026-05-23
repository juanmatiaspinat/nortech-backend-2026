const supabase = require("../config/supabase");

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

        const { data, error } = await supabase.auth.getUser(token);

        if (error || !data.user) {
            console.log("ERROR AUTH:", error);

            return res.status(401).json({
                error: "Unauthorized",
            });
        }

        req.user = data.user;

        next();
    } catch (error) {
        console.log("ERROR MIDDLEWARE:", error);

        return res.status(500).json({
            error: "Error interno del servidor",
        });
    }
};

module.exports = authenticate;
