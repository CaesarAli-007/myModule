import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        jwt.verify(token, "secret");
        next();
    }
    catch
    {
        res.status(401).json({ message: "Unauthorized" });
    }
};
