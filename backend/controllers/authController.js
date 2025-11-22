import jwt from "jsonwebtoken";

export const register = (req, res) => {
    return res.json({ message: "User registered (stub)." });
};

export const login = (req, res) => {
    const token = jwt.sign({ id: "123" }, "secret", { expiresIn: "2h" });
    return res.json({ token });
};

export const requestReset = (req, res) => {
    return res.json({ message: "Reset link sent (stub)." });
};

export const resetPassword = (req, res) => {
    return res.json({ message: "Password updated (stub)." });
};
